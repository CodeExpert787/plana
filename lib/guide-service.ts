import { supabase } from './supabase'

export interface Guide {
  id: string
  user_id: string
  name: string
  email: string
  phone: string
  avatar: string
  location: string
  member_since: string
  description: string
  specialties: string[]
  languages: string[]
  experience_years: number
  certifications: string[]
  rating: number
  total_reviews: number
  completed_activities: number
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  // Display properties for UI
  emoji?: string
  color?: string
  experience?: string
  reviews?: number
}

export interface GuideActivity {
  id: string
  guide_id: string
  activity_id: string
  price: number
  max_participants: number
  is_available: boolean
  created_at: string
  updated_at: string
  // Joined data
  activity?: {
    id: string
    title: string
    description: string
    image: string
    duration: string
    location: string
    category: string
    difficulty: string
  }
}

export class GuideService {
  // Get all active guides
  static async getAllGuides(): Promise<Guide[]> {
    try {
      console.log('GuideService: Fetching all guides')
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false })

      console.log('GuideService: Supabase response:', { data, error })

      if (error) {
        console.error('GuideService: Supabase error:', error)
        throw error
      }

      // Add display properties for UI
      const guidesWithDisplayProps = (data || []).map(guide => ({
        ...guide,
        emoji: "🧑‍🦰", // Default emoji, can be customized
        color: "bg-emerald-500", // Default color
        experience: `${guide.experience_years} años`,
        reviews: guide.total_reviews
      }))

      console.log('GuideService: Guides found:', guidesWithDisplayProps)
      return guidesWithDisplayProps
    } catch (error) {
      console.error('GuideService: Error fetching guides:', error)
      throw error
    }
  }

  // Get guide by ID
  static async getGuideById(guideId: string): Promise<Guide | null> {
    try {
      console.log('GuideService: Fetching guide by ID:', guideId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('id', guideId)
        .single()

      console.log('GuideService: Get guide response:', { data, error })

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('GuideService: Guide not found')
          return null
        }
        console.error('GuideService: Supabase error:', error)
        throw error
      }

      console.log('GuideService: Guide found:', data)
      return data
    } catch (error) {
      console.error('GuideService: Error fetching guide by ID:', error)
      throw error
    }
  }

  // Get guide by user ID
  static async getGuideByUserId(userId: string): Promise<Guide | null> {
    try {
      console.log('GuideService: Fetching guide by user ID:', userId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('user_id', userId)
        .single()

      console.log('GuideService: Get guide by user ID response:', { data, error })

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('GuideService: Guide not found for user')
          return null
        }
        console.error('GuideService: Supabase error:', error)
        throw error
      }

      console.log('GuideService: Guide found for user:', data)
      return data
    } catch (error) {
      console.error('GuideService: Error fetching guide by user ID:', error)
      throw error
    }
  }

  // Create a new guide
  static async createGuide(guideData: Omit<Guide, 'id' | 'created_at' | 'updated_at'>): Promise<Guide> {
    try {
      console.log('GuideService: Creating guide with data:', guideData)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('guides')
        .insert(guideData)
        .select()
        .single()

      console.log('GuideService: Create guide response:', { data, error })

      if (error) {
        console.error('GuideService: Error creating guide:', error)
        throw error
      }

      console.log('GuideService: Guide created successfully:', data)
      return data
    } catch (error) {
      console.error('GuideService: Error creating guide:', error)
      throw error
    }
  }

  // Update guide
  static async updateGuide(guideId: string, updates: Partial<Guide>): Promise<Guide> {
    try {
      console.log('GuideService: Updating guide:', { guideId, updates })
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('guides')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', guideId)
        .select()
        .single()

      console.log('GuideService: Update guide response:', { data, error })

      if (error) {
        console.error('GuideService: Error updating guide:', error)
        throw error
      }

      console.log('GuideService: Guide updated successfully:', data)
      return data
    } catch (error) {
      console.error('GuideService: Error updating guide:', error)
      throw error
    }
  }

  // Get guide's activities
  static async getGuideActivities(guideId: string): Promise<GuideActivity[]> {
    try {
      console.log('GuideService: Fetching activities for guide:', guideId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('guide_activities')
        .select(`
          *,
          activity:activities(
            id,
            title,
            description,
            image,
            duration,
            location,
            category,
            difficulty
          )
        `)
        .eq('guide_id', guideId)
        .eq('is_available', true)
        .order('created_at', { ascending: false })

      console.log('GuideService: Guide activities response:', { data, error })

      if (error) {
        console.error('GuideService: Supabase error:', error)
        throw error
      }

      console.log('GuideService: Guide activities found:', data)
      return data || []
    } catch (error) {
      console.error('GuideService: Error fetching guide activities:', error)
      throw error
    }
  }

  // Add activity to guide
  static async addGuideActivity(guideActivityData: Omit<GuideActivity, 'id' | 'created_at' | 'updated_at'>): Promise<GuideActivity> {
    try {
      console.log('GuideService: Adding activity to guide:', guideActivityData)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('guide_activities')
        .insert(guideActivityData)
        .select(`
          *,
          activity:activities(
            id,
            title,
            description,
            image,
            duration,
            location,
            category,
            difficulty
          )
        `)
        .single()

      console.log('GuideService: Add guide activity response:', { data, error })

      if (error) {
        console.error('GuideService: Error adding guide activity:', error)
        throw error
      }

      console.log('GuideService: Guide activity added successfully:', data)
      return data
    } catch (error) {
      console.error('GuideService: Error adding guide activity:', error)
      throw error
    }
  }

  // Search guides by criteria
  static async searchGuides(criteria: {
    location?: string
    specialties?: string[]
    minRating?: number
    languages?: string[]
  }): Promise<Guide[]> {
    try {
      console.log('GuideService: Searching guides with criteria:', criteria)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      let query = supabase
        .from('guides')
        .select('*')
        .eq('is_active', true)

      if (criteria.location) {
        query = query.ilike('location', `%${criteria.location}%`)
      }

      if (criteria.minRating) {
        query = query.gte('rating', criteria.minRating)
      }

      if (criteria.specialties && criteria.specialties.length > 0) {
        query = query.overlaps('specialties', criteria.specialties)
      }

      if (criteria.languages && criteria.languages.length > 0) {
        query = query.overlaps('languages', criteria.languages)
      }

      const { data, error } = await query.order('rating', { ascending: false })

      console.log('GuideService: Search guides response:', { data, error })

      if (error) {
        console.error('GuideService: Supabase error:', error)
        throw error
      }

      console.log('GuideService: Search results found:', data)
      return data || []
    } catch (error) {
      console.error('GuideService: Error searching guides:', error)
      throw error
    }
  }
}
