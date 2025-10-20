import { supabase } from './supabase'

export type PreferenceStatus = 'liked' | 'disliked'

export interface UserPreferences {
  likedIds: string[]
  dislikedIds: string[]
}

export class UserPreferencesService {
  static async getPreferences(userId: string): Promise<UserPreferences> {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase
      .from('user_activity_preferences')
      .select('activity_id,status')
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    const likedIds: string[] = []
    const dislikedIds: string[] = []
    for (const row of data || []) {
      if (row.status === 'liked') likedIds.push(row.activity_id as string)
      else if (row.status === 'disliked') dislikedIds.push(row.activity_id as string)
    }

    return { likedIds, dislikedIds }
  }

  static async setPreference(userId: string, activityId: string, status: PreferenceStatus): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { error } = await supabase
      .from('user_activity_preferences')
      .upsert({ user_id: userId, activity_id: activityId, status }, { onConflict: 'user_id,activity_id' })

    if (error) throw error
  }

  static async removePreference(userId: string, activityId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { error } = await supabase
      .from('user_activity_preferences')
      .delete()
      .eq('user_id', userId)
      .eq('activity_id', activityId)

    if (error) throw error
  }
}


