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
        user_profiles: {
          Row: {
            id: string
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
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            name: string
            email: string
            phone: string
            avatar: string
            location: string
            member_since: string
            description: string
            completed_activities?: number
            reviews?: number
            rating?: number
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            name?: string
            email?: string
            phone?: string
            avatar?: string
            location?: string
            member_since?: string
            description?: string
            completed_activities?: number
            reviews?: number
            rating?: number
            updated_at?: string
          }
        }
  reviews: {
    Row: {
      id: string
      guide_id: string
      user_id: string
      activity_id: string
      rating: number
      comment: string
      user_name: string
      user_avatar: string
      created_at: string
      updated_at: string
    }
    Insert: {
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
    Update: {
      id?: string
      guide_id?: string
      user_id?: string
      activity_id?: string
      rating?: number
      comment?: string
      user_name?: string
      user_avatar?: string
      updated_at?: string
    }
  }
  bookings: {
    Row: {
      id: string
      user_id: string
      activity_id: string
      guide_id: string
      status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      participants: number
      total_price: number
      booking_date: string
      activity_date: string
      activity_time: string
      special_requests?: string
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      activity_id: string
      guide_id: string
      status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      participants: number
      total_price: number
      booking_date: string
      activity_date: string
      activity_time: string
      special_requests?: string
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      activity_id?: string
      guide_id?: string
      status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      participants?: number
      total_price?: number
      booking_date?: string
      activity_date?: string
      activity_time?: string
      special_requests?: string
      updated_at?: string
    }
  }
  guides: {
    Row: {
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
    }
    Insert: {
      id?: string
      user_id: string
      name: string
      email: string
      phone: string
      avatar?: string
      location: string
      member_since: string
      description: string
      specialties?: string[]
      languages?: string[]
      experience_years?: number
      certifications?: string[]
      rating?: number
      total_reviews?: number
      completed_activities?: number
      is_verified?: boolean
      is_active?: boolean
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      name?: string
      email?: string
      phone?: string
      avatar?: string
      location?: string
      member_since?: string
      description?: string
      specialties?: string[]
      languages?: string[]
      experience_years?: number
      certifications?: string[]
      rating?: number
      total_reviews?: number
      completed_activities?: number
      is_verified?: boolean
      is_active?: boolean
      updated_at?: string
    }
  }
  guide_activities: {
    Row: {
      id: string
      guide_id: string
      activity_id: string
      price: number
      max_participants: number
      is_available: boolean
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      guide_id: string
      activity_id: string
      price: number
      max_participants: number
      is_available?: boolean
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      guide_id?: string
      activity_id?: string
      price?: number
      max_participants?: number
      is_available?: boolean
      updated_at?: string
    }
  }
      }
    }
  }