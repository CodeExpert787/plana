export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server'
import { GuideService } from '@/lib/guide-service'
import { ActivitiesService } from '@/lib/activities-service'
import { randomUUID } from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Validate critical environment
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error('API: Missing Supabase envs. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.')
      return NextResponse.json(
        {
          success: false,
          error: 'Server misconfigured: Supabase URL or Service Role Key missing',
          hints: {
            SUPABASE_URL: !!process.env.SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          }
        },
        { status: 500 }
      )
    }
    const body = await request.json()
    const { formData } = body

    // console.log('API: Register guide request received:', formData)

    // Validate required fields
    if (!formData.name || !formData.email || !formData.activityTitle) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: name, email, and activity title are required'
        },
        { status: 400 }
      )
    }

    // Validate activity-specific required fields
    if (!formData.activityDescription || !formData.activityLocation || !formData.activityCategory) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required activity fields: description, location, and category are required'
        },
        { status: 400 }
      )
    }

    // Create guide profile first
    const guideData = {
      id: randomUUID(),
      user_id: `guide-${Date.now()}`, // Generate a unique user ID
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: formData.profilePhoto || '/placeholder.svg',
      location: formData.location,
      member_since: new Date().toISOString(),
      description: formData.bio,
      specialties: formData.specialties,
      languages: ['Español', 'Inglés'], // Default languages
      experience_years: parseInt(formData.experience) || 0,
      certifications: formData.certifications,
      certification_files: formData.certificationFiles || [],
      rating: 0,
      total_reviews: 0,
      completed_activities: 0,
      is_verified: false, // New guides start as unverified
      is_active: true
    }

    // Create the guide using SERVICE ROLE to bypass RLS
    console.log('API: Creating guide with data (service role):', guideData)
    let newGuide
    try {
      const supabaseServer = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

      const { data, error } = await supabaseServer
        .from('guides')
        .insert(guideData)
        .select()
        .single()

      if (error) {
        throw error
      }

      newGuide = data
      console.log('API: Guide created successfully with service role:', newGuide)
    } catch (guideError) {
      console.error('API: Detailed error creating guide (service role):', {
        error: guideError,
        message: guideError instanceof Error ? guideError.message : 'Unknown error',
        stack: guideError instanceof Error ? guideError.stack : undefined,
        guideData,
        errorString: String(guideError),
        errorType: typeof guideError,
        errorConstructor: guideError?.constructor?.name
      })
      const errorMessage = guideError instanceof Error ? guideError.message : 
                          typeof guideError === 'string' ? guideError : 
                          JSON.stringify(guideError) || 'Unknown error'
      throw new Error(`Guide creation failed: ${errorMessage}`)
    }

    // Normalize and validate price (numeric(10,2) max: 99,999,999.99)
    const normalizedPrice = (() => {
      const raw = String(formData.activityPrice ?? '')
        .replace(/[^0-9.,]/g, '')
        .replace(/,/g, '.')
      const num = parseFloat(raw)
      if (!isFinite(num) || isNaN(num) || num < 0) return 0
      const rounded = Math.round(num * 100) / 100
      const MAX = 99999999.99
      return Math.min(rounded, MAX)
    })()

    // Helper to normalize a possible photo input (string URL or object with url)
    const toUrlString = (val: any): string | null => {
      if (!val) return null
      if (typeof val === 'string') return val
      if (typeof val === 'object') {
        if (typeof val.url === 'string') return val.url
        if (typeof val.path === 'string') return val.path
      }
      return null
    }

    // Create the activity
    const activityData = {
       id: randomUUID(), // Generate a UUID for activity ID
      title: formData.activityTitle,
      description: formData.activityDescription,
      image: (() => {
        const first = Array.isArray(formData.activityPhotos) ? formData.activityPhotos[0] : formData.activityPhotos
        return toUrlString(first) || '/placeholder.svg'
      })(),
      price: normalizedPrice,
      duration: `${formData.activityDuration} hours`,
      location: formData.activityLocation,
      rating: 0,
      category: formData.activityCategory,
      season: ((formData.activitySeason || 'summer') as string).toLowerCase(),
      difficulty: formData.activityDifficulty,
      included: ['Guía especializado', 'Equipo básico', 'Seguro de actividad'],
      not_included: ['Almuerzo', 'Transporte personal'],
      requirements: ['Condición física básica', 'Ropa cómoda'],
      start_times: ['09:00', '14:00'],
      guide_name: formData.name,
      guide_image: formData.profilePhoto || '/placeholder.svg',
      guide_experience: `${formData.experience} años`,
      guide_languages: ['Español', 'Inglés'],
      guide_bio: formData.bio,
      guide_phone: formData.phone,
      images: (() => {
        const arr = Array.isArray(formData.activityPhotos) ? formData.activityPhotos : []
        const urls = arr.map(toUrlString).filter(Boolean) as string[]
        return urls.length > 0 ? urls : []
      })()
    }

    // Validate activity data before sending to database
    console.log('API: Validating activity data...')
    const requiredFields = ['id', 'title', 'description', 'image', 'price', 'duration', 'location', 'category', 'season', 'difficulty', 'guide_name', 'guide_image', 'guide_experience', 'guide_bio', 'guide_phone']
    const missingFields = requiredFields.filter(field => !(activityData as any)[field])
    
    if (missingFields.length > 0) {
      console.error('API: Missing required activity fields:', missingFields)
      throw new Error(`Missing required activity fields: ${missingFields.join(', ')}`)
    }

    // Save the activity to the database using a SERVICE ROLE client to bypass RLS
    console.log('API: Creating activity with data (service role):', JSON.stringify(activityData, null, 2))
    let newActivity
    try {
      const supabaseServer = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

      const { data, error } = await supabaseServer
        .from('activities')
        .insert(activityData)
        .select()
        .single()

      if (error) {
        throw error
      }

      newActivity = data
      console.log('API: Activity created successfully with service role:', newActivity)
    } catch (activityError) {
      console.error('API: Detailed error creating activity (service role):', {
        error: activityError,
        message: activityError instanceof Error ? activityError.message : 'Unknown error',
        stack: activityError instanceof Error ? activityError.stack : undefined,
        activityData: activityData,
        errorString: String(activityError),
        errorType: typeof activityError,
        errorConstructor: activityError?.constructor?.name
      })
      const errorMessage = activityError instanceof Error ? activityError.message : 
                          typeof activityError === 'string' ? activityError : 
                          JSON.stringify(activityError) || 'Unknown error'
      throw new Error(`Guide created successfully but activity creation failed: ${errorMessage}`)
    }

    // Notify admin (best-effort)
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
      if (appUrl) {
        await fetch(`${appUrl}/api/notify-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          formData,
          guideId: newGuide.id,
          activityId: newActivity.id
        }),
      })
      } else {
        console.warn("API: Skipping admin notification, app URL not configured")
      }
    } catch (error) {
      console.error("API: Error notifying admin:", error)
    }

    return NextResponse.json({ 
      success: true, 
      guide: newGuide, 
      activity: newActivity 
    })

  } catch (error) {
    console.error('API: Error creating guide or activity:', error)
    
    // More detailed error information
    let errorMessage = 'Error creating guide or activity'
    let errorDetails = error instanceof Error ? error.message : 'Unknown error'
    
    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || error.message
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    )
  }
}
