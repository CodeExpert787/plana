import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...')
    
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 })
    }

    // Test basic connection
    const { data, error } = await supabase
      .from('guides')
      .select('count')
      .limit(1)

    console.log('Database test result:', { data, error })

    if (error) {
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data 
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        error: 'Database test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

