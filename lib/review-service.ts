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

      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single()

      console.log('ReviewService: Create review response:', { data, error })

      if (error) {
        console.error('ReviewService: Error creating review:', error)
        throw error
      }

      console.log('ReviewService: Review created successfully:', data)
      return data
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

  // Get average rating for a guide
  static async getGuideAverageRating(guideId: string): Promise<{ averageRating: number; totalReviews: number }> {
    try {
      console.log('ReviewService: Getting average rating for guide ID:', guideId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('guide_id', guideId)

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
}
