import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('API: Received review data:', body)
    const { reviewData } = body

    // Validate required fields
    if (!reviewData.guide_id || !reviewData.user_name || !reviewData.comment || !reviewData.rating) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: guide_id, user_name, comment, and rating are required'
        },
        { status: 400 }
      )
    }

    // Validate rating range
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rating must be between 1 and 5'
        },
        { status: 400 }
      )
    }

    // Create a server-side Supabase client (service role bypasses RLS)
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Generate a unique user ID for anonymous users
    const userId = reviewData.user_id || `anonymous-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const insertPayload = {
      guide_id: reviewData.guide_id,
      user_id: userId,
      activity_id: reviewData.activity_id || 'general-activity',
      rating: reviewData.rating,
      comment: reviewData.comment,
      user_name: reviewData.user_name,
      user_avatar: reviewData.user_avatar || '/placeholder-user.jpg'
    }

    // Insert review directly
    const { data: createdReview, error: insertError } = await supabaseServer
      .from('reviews')
      .insert(insertPayload)
      .select()
      .single()

    if (insertError) {
      console.error('API: Error inserting review:', insertError)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create review',
          details: insertError.message
        },
        { status: 500 }
      )
    }

    // Recompute and update guide rating and total reviews
    const { data: ratings, error: fetchRatingsError } = await supabaseServer
      .from('reviews')
      .select('rating')
      .eq('guide_id', reviewData.guide_id)

    if (!fetchRatingsError && ratings && ratings.length > 0) {
      const total = ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0)
      const average = total / ratings.length
      const { error: updateGuideError } = await supabaseServer
        .from('guides')
        .update({
          rating: average,
          total_reviews: ratings.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewData.guide_id)

      if (updateGuideError) {
        console.warn('API: Failed to update guide stats after review:', updateGuideError)
      }
    } else if (fetchRatingsError) {
      console.warn('API: Failed to fetch ratings for guide update:', fetchRatingsError)
    }

    // Recompute and update activity rating and total_reviews if activity_id is valid
    if (reviewData.activity_id && reviewData.activity_id !== 'general-activity') {
      const { data: activityRatings, error: fetchActivityRatingsError } = await supabaseServer
        .from('reviews')
        .select('rating')
        .eq('activity_id', reviewData.activity_id)

      if (!fetchActivityRatingsError && activityRatings && activityRatings.length > 0) {
        const activityTotal = activityRatings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0)
        const activityAverage = activityTotal / activityRatings.length

        const { error: updateActivityError } = await supabaseServer
          .from('activities')
          .update({
            rating: activityAverage,
            total_reviews: activityRatings.length,
            updated_at: new Date().toISOString()
          })
          .eq('id', reviewData.activity_id)

        if (updateActivityError) {
          console.warn('API: Failed to update activity stats after review:', updateActivityError)
        }
      } else if (fetchActivityRatingsError) {
        console.warn('API: Failed to fetch ratings for activity update:', fetchActivityRatingsError)
      }
    }

    return NextResponse.json({ success: true, review: createdReview })

  } catch (error) {
    console.error('API: Error creating review:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create review',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
