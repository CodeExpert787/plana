import { supabase } from './supabase'
import { Database } from '@/types/database'

export type Activity = Database['public']['Tables']['activities']['Row']
export type InsertActivity = Database['public']['Tables']['activities']['Insert']
export type UpdateActivity = Database['public']['Tables']['activities']['Update']

export class ActivitiesService {
  static async getAllActivities(): Promise<Activity[]> {
    try {
      console.log('ActivitiesService: Fetching all activities')
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('ActivitiesService: Supabase response:', { data, error })

      if (error) {
        console.error('ActivitiesService: Error fetching activities:', error)
        throw error
      }

      console.log('ActivitiesService: Activities fetched successfully:', data?.length || 0, 'activities')
      return data || []
    } catch (error) {
      console.error('ActivitiesService: Error fetching activities:', error)
      throw error
    }
  }

  static async getActivityById(id: string): Promise<Activity | null> {
    try {
      console.log('ActivitiesService: Fetching activity by id:', id)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', id)
        .single()

      console.log('ActivitiesService: Supabase response:', { data, error })

      if (error) {
        console.error('ActivitiesService: Error fetching activity:', error)
        throw error
      }

      console.log('ActivitiesService: Activity fetched successfully:', data)
      return data
    } catch (error) {
      console.error('ActivitiesService: Error fetching activity:', error)
      throw error
    }
  }

  static async getActivitiesByGuideId(guideId: string): Promise<Activity[]> {
    try {
      console.log('ActivitiesService: Fetching activities for guide:', guideId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      // First, get the guide to find the guide's name
      const { data: guideData, error: guideError } = await supabase
        .from('guides')
        .select('name')
        .eq('id', guideId)
        .single()

      if (guideError) {
        console.error('ActivitiesService: Error fetching guide name:', guideError)
        throw guideError
      }

      if (!guideData) {
        console.log('ActivitiesService: Guide not found')
        return []
      }

      // Now find activities by guide name
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('guide_name', guideData.name)
        .order('created_at', { ascending: false })

      console.log('ActivitiesService: Get activities by guide response:', { data, error })

      if (error) {
        console.error('ActivitiesService: Error fetching activities by guide:', error)
        throw error
      }

      console.log('ActivitiesService: Activities found for guide:', data?.length || 0)
      return data || []
    } catch (error) {
      console.error('ActivitiesService: Error fetching activities by guide:', error)
      throw error
    }
  }

  static async getActivitiesByCategory(category: string): Promise<Activity[]> {
    try {
      console.log('ActivitiesService: Fetching activities by category:', category)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      console.log('ActivitiesService: Supabase response:', { data, error })

      if (error) {
        console.error('ActivitiesService: Error fetching activities by category:', error)
        throw error
      }

      console.log('ActivitiesService: Activities by category fetched successfully:', data?.length || 0, 'activities')
      return data || []
    } catch (error) {
      console.error('ActivitiesService: Error fetching activities by category:', error)
      throw error
    }
  }

  static async getActivitiesBySeason(season: string): Promise<Activity[]> {
    try {
      console.log('ActivitiesService: Fetching activities by season:', season)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('season', season)
        .order('created_at', { ascending: false })

      console.log('ActivitiesService: Supabase response:', { data, error })

      if (error) {
        console.error('ActivitiesService: Error fetching activities by season:', error)
        throw error
      }

      console.log('ActivitiesService: Activities by season fetched successfully:', data?.length || 0, 'activities')
      return data || []
    } catch (error) {
      console.error('ActivitiesService: Error fetching activities by season:', error)
      throw error
    }
  }

  static async getActivitiesByIds(ids: string[]): Promise<Activity[]> {
    try {
      if (!ids || ids.length === 0) return []

      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .in('id', ids)

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('ActivitiesService: Error fetching activities by IDs:', error)
      throw error
    }
  }

  static async searchActivities(searchTerm: string): Promise<Activity[]> {
    try {
      console.log('ActivitiesService: Searching activities with term:', searchTerm)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      console.log('ActivitiesService: Supabase response:', { data, error })

      if (error) {
        console.error('ActivitiesService: Error searching activities:', error)
        throw error
      }

      console.log('ActivitiesService: Activities search completed:', data?.length || 0, 'activities')
      return data || []
    } catch (error) {
      console.error('ActivitiesService: Error searching activities:', error)
      throw error
    }
  }

  static async createActivity(activityData: InsertActivity): Promise<Activity> {
    try {
      console.log('ActivitiesService: Creating activity with data:', activityData)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('activities')
        .insert(activityData)
        .select()
        .single()

      console.log('ActivitiesService: Create activity response:', { data, error })

      if (error) {
        console.error('ActivitiesService: Error creating activity:', error)
        throw error
      }

      console.log('ActivitiesService: Activity created successfully:', data)
      return data
    } catch (error) {
      console.error('ActivitiesService: Error creating activity:', error)
      throw error
    }
  }

  static async updateActivity(id: string, activityData: UpdateActivity): Promise<Activity> {
    try {
      console.log('ActivitiesService: Updating activity with id:', id, 'data:', activityData)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('activities')
        .update(activityData)
        .eq('id', id)
        .select()
        .single()

      console.log('ActivitiesService: Update activity response:', { data, error })

      if (error) {
        console.error('ActivitiesService: Error updating activity:', error)
        throw error
      }

      console.log('ActivitiesService: Activity updated successfully:', data)
      return data
    } catch (error) {
      console.error('ActivitiesService: Error updating activity:', error)
      throw error
    }
  }

  static async deleteActivity(id: string): Promise<void> {
    try {
      console.log('ActivitiesService: Deleting activity with id:', id)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id)

      console.log('ActivitiesService: Delete activity response:', { error })

      if (error) {
        console.error('ActivitiesService: Error deleting activity:', error)
        throw error
      }

      console.log('ActivitiesService: Activity deleted successfully')
    } catch (error) {
      console.error('ActivitiesService: Error deleting activity:', error)
      throw error
    }
  }
}