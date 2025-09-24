import { supabase } from './supabase'

export interface UserProfile {
  id?: string
  user_id: string
  name: string
  email: string
  phone: string
  avatar: string
  location: string
  member_since: string
  description: string
  completed_activities: number
  reviews: number
  rating: number
  created_at?: string
  updated_at?: string
}

export class UserProfileService {
  // Fetch user profile by user ID
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('UserProfileService: Fetching profile for user ID:', userId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      console.log('UserProfileService: Supabase response:', { data, error })

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          console.log('UserProfileService: No profile found for user')
          return null
        }
        console.error('UserProfileService: Supabase error:', error)
        throw error
      }

      console.log('UserProfileService: Profile found:', data)
      return data
    } catch (error) {
      console.error('UserProfileService: Error fetching user profile:', error)
      throw error
    }
  }

  // Create new user profile
  static async createUserProfile(profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    try {
      console.log('UserProfileService: Creating profile with data:', profileData)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single()

      console.log('UserProfileService: Create profile response:', { data, error })

      if (error) {
        console.error('UserProfileService: Error creating profile:', error)
        throw error
      }

      console.log('UserProfileService: Profile created successfully:', data)
      return data
    } catch (error) {
      console.error('UserProfileService: Error creating user profile:', error)
      throw error
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updateData: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>): Promise<UserProfile> {
    try {
      console.log('UserProfileService: Updating profile for user ID:', userId)
      console.log('UserProfileService: Update data:', updateData)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const updatePayload = {
        ...updateData,
        updated_at: new Date().toISOString()
      }
      
      console.log('UserProfileService: Update payload:', updatePayload)

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updatePayload)
        .eq('user_id', userId)
        .select()
        .single()

      console.log('UserProfileService: Update response:', { data, error })

      if (error) {
        console.error('UserProfileService: Error updating profile:', error)
        throw error
      }

      console.log('UserProfileService: Profile updated successfully:', data)
      return data
    } catch (error) {
      console.error('UserProfileService: Error updating user profile:', error)
      throw error
    }
  }

  // Upsert user profile (create or update)
  static async upsertUserProfile(profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error upserting user profile:', error)
      throw error
    }
  }

  // Upload avatar image to Supabase Storage
  static async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      console.log('UserProfileService: Starting avatar upload for user:', userId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `${userId}/${fileName}` // Store in user-specific folder

      console.log('UserProfileService: Uploading file:', {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type
      })

      const { data, error } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Allow overwriting existing files
        })

      console.log('UserProfileService: Upload response:', { data, error })

      if (error) {
        console.error('UserProfileService: Upload error:', error)
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath)

      console.log('UserProfileService: Public URL generated:', publicUrl)
      return publicUrl
    } catch (error) {
      console.error('UserProfileService: Error uploading avatar:', error)
      throw error
    }
  }
}
