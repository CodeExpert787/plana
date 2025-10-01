import { supabase } from './supabase'

export class UploadService {
  static async uploadPublicFile(folder: string, file: File): Promise<string> {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const fileExt = file.name.split('.').pop() || 'bin'
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const fileName = `${Date.now()}-${safeName}`
    const filePath = `${folder}/${fileName}`

    const { error } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || `application/octet-stream`
      })

    if (error) {
      throw error
    }

    const { data: { publicUrl } } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath)

    return publicUrl
  }
}


