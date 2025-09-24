import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This is a development-only endpoint to manually confirm user emails
// In production, you should use proper email confirmation flow

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // First, find the user by email
    const { data: users, error: searchError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (searchError) {
      return NextResponse.json({ error: searchError.message }, { status: 500 })
    }

    const user = users.users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Now update the user by their ID
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        email_confirm: true
      }
    )

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `User ${email} has been confirmed and can now sign in.`,
      user: updateData.user
    })

  } catch (error) {
    console.error('Error confirming user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
