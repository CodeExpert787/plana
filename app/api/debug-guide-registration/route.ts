import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData } = body

    console.log('Debug: Starting guide registration debug...')
    console.log('Debug: Form data received:', formData)

    // Step 1: Test Supabase connection
    console.log('Debug: Step 1 - Testing Supabase connection...')
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Supabase client not initialized',
        step: 'connection'
      }, { status: 500 })
    }

    // Step 2: Test if guides table exists and is accessible
    console.log('Debug: Step 2 - Testing guides table access...')
    const { data: guidesTest, error: guidesError } = await supabase
      .from('guides')
      .select('count')
      .limit(1)

    console.log('Debug: Guides table test result:', { guidesTest, guidesError })

    if (guidesError) {
      return NextResponse.json({ 
        error: 'Guides table access failed',
        details: guidesError,
        step: 'guides_table'
      }, { status: 500 })
    }

    // Step 3: Test if activities table exists and is accessible
    console.log('Debug: Step 3 - Testing activities table access...')
    const { data: activitiesTest, error: activitiesError } = await supabase
      .from('activities')
      .select('count')
      .limit(1)

    console.log('Debug: Activities table test result:', { activitiesTest, activitiesError })

    if (activitiesError) {
      return NextResponse.json({ 
        error: 'Activities table access failed',
        details: activitiesError,
        step: 'activities_table'
      }, { status: 500 })
    }

    // Step 4: Test guide creation with minimal data
    console.log('Debug: Step 4 - Testing guide creation...')
    const testGuideData = {
      user_id: `test-guide-${Date.now()}`,
      name: 'Test Guide',
      email: 'test@example.com',
      phone: '+1234567890',
      avatar: '/placeholder.svg',
      location: 'Test Location',
      member_since: new Date().toISOString(),
      description: 'Test description',
      specialties: ['Test'],
      languages: ['English'],
      experience_years: 1,
      certifications: ['Test Cert'],
      rating: 0,
      total_reviews: 0,
      completed_activities: 0,
      is_verified: false,
      is_active: true
    }

    const { data: testGuide, error: testGuideError } = await supabase
      .from('guides')
      .insert(testGuideData)
      .select()
      .single()

    console.log('Debug: Test guide creation result:', { testGuide, testGuideError })

    if (testGuideError) {
      return NextResponse.json({ 
        error: 'Test guide creation failed',
        details: testGuideError,
        step: 'guide_creation'
      }, { status: 500 })
    }

    // Step 5: Test activity creation with minimal data
    console.log('Debug: Step 5 - Testing activity creation...')
    const testActivityData = {
      id: crypto.randomUUID(),
      title: 'Test Activity',
      description: 'Test description',
      image: '/placeholder.svg',
      price: 100.00,
      duration: '2 hours',
      location: 'Test Location',
      rating: 0,
      category: 'Test',
      season: 'summer',
      difficulty: 'Easy',
      included: ['Test item'],
      not_included: ['Not included'],
      requirements: ['Test requirement'],
      start_times: ['09:00'],
      guide_name: 'Test Guide',
      guide_image: '/placeholder.svg',
      guide_experience: '1 year',
      guide_languages: ['English'],
      guide_bio: 'Test bio',
      guide_phone: '+1234567890',
      images: ['/placeholder.svg']
    }

    const { data: testActivity, error: testActivityError } = await supabase
      .from('activities')
      .insert(testActivityData)
      .select()
      .single()

    console.log('Debug: Test activity creation result:', { testActivity, testActivityError })

    if (testActivityError) {
      return NextResponse.json({ 
        error: 'Test activity creation failed',
        details: testActivityError,
        step: 'activity_creation'
      }, { status: 500 })
    }

    // Clean up test data
    await supabase.from('activities').delete().eq('id', testActivity.id)
    await supabase.from('guides').delete().eq('id', testGuide.id)

    return NextResponse.json({ 
      success: true, 
      message: 'All tests passed! Database is ready for guide registration.',
      steps: [
        'Supabase connection: ✅',
        'Guides table access: ✅',
        'Activities table access: ✅',
        'Guide creation: ✅',
        'Activity creation: ✅'
      ]
    })

  } catch (error) {
    console.error('Debug: Error during debugging:', error)
    return NextResponse.json(
      { 
        error: 'Debug failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        step: 'debug_error'
      },
      { status: 500 }
    )
  }
}

