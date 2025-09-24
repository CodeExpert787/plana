import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js"

// Create a server-side Supabase client
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found, return null
        return NextResponse.json({ data: null })
      }
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

// POST - Create user profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, name, email, phone, avatar, location, member_since, description } = body

    if (!user_id || !name || !email) {
      return NextResponse.json(
        { error: 'user_id, name, and email are required' },
        { status: 400 }
      )
    }

    const profileData = {
      user_id,
      name,
      email,
      phone: phone || '',
      avatar: avatar || '/placeholder.svg',
      location: location || '',
      member_since: member_since || new Date().toISOString(),
      description: description || '',
      completed_activities: 0,
      reviews: 0,
      rating: 0
    }

    const { data, error } = await supabaseServer
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error creating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to create user profile' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, ...updateData } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabaseServer
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', user_id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}
