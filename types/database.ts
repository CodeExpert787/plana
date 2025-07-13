export interface Database {
    public: {
      Tables: {
        activities: {
          Row: {
            id: string
            title: string
            description: string
            price: number
            duration: string
            location: string
            rating: number
            category: string
            difficulty: string
            included: string[]
            not_included: string[]
            requirements: string[]
            start_times: string[]
            images: string[]
            guide_id: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            title: string
            description: string
            price: number
            duration: string
            location: string
            rating?: number
            category: string
            difficulty: string
            included: string[]
            not_included: string[]
            requirements: string[]
            start_times: string[]
            images: string[]
            guide_id: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            title?: string
            description?: string
            price?: number
            duration?: string
            location?: string
            rating?: number
            category?: string
            difficulty?: string
            included?: string[]
            not_included?: string[]
            requirements?: string[]
            start_times?: string[]
            images?: string[]
            guide_id?: string
            updated_at?: string
          }
        }
        guides: {
          Row: {
            id: string
            name: string
            image: string
            experience: string
            languages: string[]
            bio: string
            phone: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            name: string
            image: string
            experience: string
            languages: string[]
            bio: string
            phone: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            name?: string
            image?: string
            experience?: string
            languages?: string[]
            bio?: string
            phone?: string
            updated_at?: string
          }
        }
        bookings: {
          Row: {
            id: string
            activity_id: string
            user_name: string
            user_email: string
            user_phone: string
            date: string
            participants: number
            total_price: number
            status: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            activity_id: string
            user_name: string
            user_email: string
            user_phone: string
            date: string
            participants: number
            total_price: number
            status?: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            activity_id?: string
            user_name?: string
            user_email?: string
            user_phone?: string
            date?: string
            participants?: number
            total_price?: number
            status?: string
            updated_at?: string
          }
        }
      }
    }
  }