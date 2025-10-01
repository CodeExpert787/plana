import { supabase } from './supabase'

export interface Review {
  id?: string
  guide_id: string
  user_id: string
  activity_id: string
  rating: number
  comment: string
  user_name: string
  user_avatar?: string
  created_at?: string
  updated_at?: string
}

export class ReviewService {
  // Get reviews for a specific guide
  static async getGuideReviews(guideId: string): Promise<Review[]> {
    try {
      console.log('ReviewService: Fetching reviews for guide ID:', guideId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('guide_id', guideId)
        .order('created_at', { ascending: false })

      console.log('ReviewService: Supabase response:', { data, error })

      if (error) {
        console.error('ReviewService: Supabase error:', error)
        throw error
      }

      console.log('ReviewService: Reviews found:', data)
      return data || []
    } catch (error) {
      console.error('ReviewService: Error fetching guide reviews:', error)
      throw error
    }
  }

  // Get reviews for a specific activity
  static async getActivityReviews(activityId: string): Promise<Review[]> {
    try {
      console.log('ReviewService: Fetching reviews for activity ID:', activityId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('activity_id', activityId)
        .order('created_at', { ascending: false })

      console.log('ReviewService: Supabase response:', { data, error })

      if (error) {
        console.error('ReviewService: Supabase error:', error)
        throw error
      }

      console.log('ReviewService: Reviews found:', data)
      return data || []
    } catch (error) {
      console.error('ReviewService: Error fetching activity reviews:', error)
      throw error
    }
  }

  // Create a new review
  static async createReview(reviewData: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
    try {
      console.log('ReviewService: Creating review with data:', reviewData)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      // Use the create_review function to bypass RLS
      const { data, error } = await supabase
        .rpc('create_review', {
          p_guide_id: reviewData.guide_id,
          p_user_id: reviewData.user_id,
          p_activity_id: reviewData.activity_id,
          p_rating: reviewData.rating,
          p_comment: reviewData.comment,
          p_user_name: reviewData.user_name,
          p_user_avatar: reviewData.user_avatar || '/placeholder-user.jpg'
        })

      console.log('ReviewService: Create review response:', { data, error })

      if (error) {
        console.error('ReviewService: Error creating review:', error)
        throw error
      }

      // The function returns an array, so we need to get the first element
      const review = data && data.length > 0 ? data[0] : null
      if (!review) {
        throw new Error('No review data returned from function')
      }

      console.log('ReviewService: Review created successfully:', review)
      return review
    } catch (error) {
      console.error('ReviewService: Error creating review:', error)
      throw error
    }
  }

  // Update a review
  static async updateReview(reviewId: string, updateData: Partial<Omit<Review, 'id' | 'guide_id' | 'user_id' | 'created_at'>>): Promise<Review> {
    try {
      console.log('ReviewService: Updating review ID:', reviewId)
      console.log('ReviewService: Update data:', updateData)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const updatePayload = {
        ...updateData,
        updated_at: new Date().toISOString()
      }
      
      console.log('ReviewService: Update payload:', updatePayload)

      const { data, error } = await supabase
        .from('reviews')
        .update(updatePayload)
        .eq('id', reviewId)
        .select()
        .single()

      console.log('ReviewService: Update response:', { data, error })

      if (error) {
        console.error('ReviewService: Error updating review:', error)
        throw error
      }

      console.log('ReviewService: Review updated successfully:', data)
      return data
    } catch (error) {
      console.error('ReviewService: Error updating review:', error)
      throw error
    }
  }

  // Delete a review
  static async deleteReview(reviewId: string): Promise<void> {
    try {
      console.log('ReviewService: Deleting review ID:', reviewId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)

      console.log('ReviewService: Delete response:', { error })

      if (error) {
        console.error('ReviewService: Error deleting review:', error)
        throw error
      }

      console.log('ReviewService: Review deleted successfully')
    } catch (error) {
      console.error('ReviewService: Error deleting review:', error)
      throw error
    }
  }

  // Get average rating for a activity
  static async getActivityAverageRating(activityId: string): Promise<{ averageRating: number; totalReviews: number }> {
    try {
      console.log('ReviewService: Getting average rating for activity ID:', activityId)
      
      // Guard against empty/invalid activityId to avoid Supabase UUID casting errors
      if (!activityId) {
        return { averageRating: 0, totalReviews: 0 }
      }

      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('activity_id', activityId)

      console.log('ReviewService: Supabase response:', { data, error })

      if (error) {
        console.error('ReviewService: Supabase error:', error)
        throw error
      }

      if (!data || data.length === 0) {
        return { averageRating: 0, totalReviews: 0 }
      }

      const totalRating = data.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / data.length
      const totalReviews = data.length

      console.log('ReviewService: Average rating calculated:', { averageRating, totalReviews })
      return { averageRating, totalReviews }
    } catch (error) {
      console.error('ReviewService: Error calculating average rating:', error)
      throw error
    }
  }

  // Check if user has already reviewed a guide for a specific activity
  static async hasUserReviewedGuide(userId: string, guideId: string, activityId: string): Promise<boolean> {
    try {
      console.log('ReviewService: Checking if user has reviewed guide:', { userId, guideId, activityId })
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', userId)
        .eq('guide_id', guideId)
        .eq('activity_id', activityId)
        .single()

      console.log('ReviewService: Check review response:', { data, error })

      if (error && error.code !== 'PGRST116') {
        console.error('ReviewService: Supabase error:', error)
        throw error
      }

      const hasReviewed = !!data
      console.log('ReviewService: User has reviewed:', hasReviewed)
      return hasReviewed
    } catch (error) {
      console.error('ReviewService: Error checking if user reviewed:', error)
      throw error
    }
  }

  // Update guide rating and total reviews after review submission
  static async updateGuideAfterReview(guideId: string): Promise<void> {
    try {
      console.log('ReviewService: Updating guide after review submission:', guideId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      // Get all reviews for this guide to calculate new average
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('guide_id', guideId)

      if (reviewsError) {
        console.error('ReviewService: Error fetching reviews for guide update:', reviewsError)
        throw reviewsError
      }

      if (!reviews || reviews.length === 0) {
        console.log('ReviewService: No reviews found for guide')
        return
      }

      // Calculate new average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length
      const totalReviews = reviews.length

      console.log('ReviewService: Calculated new rating:', { averageRating, totalReviews })

      // Update the guide with new rating and total reviews
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          rating: averageRating,
          total_reviews: totalReviews,
          updated_at: new Date().toISOString()
        })
        .eq('id', guideId)

      if (updateError) {
        console.error('ReviewService: Error updating guide:', updateError)
        throw updateError
      }

      console.log('ReviewService: Guide updated successfully with new rating and review count')
    } catch (error) {
      console.error('ReviewService: Error updating guide after review:', error)
      throw error
    }
  }
}
