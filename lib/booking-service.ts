import { supabase } from './supabase'

export interface Booking {
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
  // Joined data
  activity?: {
    id: string
    title: string
    description: string
    image: string
    price: number
    duration: string
    location: string
    category: string
  }
  guide?: {
    id: string
    name: string
    avatar: string
    rating: number
  }
}

export class BookingService {
  // Get all bookings for a user
  static async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      console.log('BookingService: Fetching bookings for user:', userId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          activity:activities(
            id,
            title,
            description,
            image,
            price,
            duration,
            location,
            category
          ),
          guide:user_profiles(
            id,
            name,
            avatar,
            rating
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      console.log('BookingService: Supabase response:', { data, error })

      if (error) {
        console.error('BookingService: Supabase error:', error)
        throw error
      }

      console.log('BookingService: Bookings found:', data)
      return data || []
    } catch (error) {
      console.error('BookingService: Error fetching user bookings:', error)
      throw error
    }
  }

  // Get completed bookings for a user
  static async getCompletedBookings(userId: string): Promise<Booking[]> {
    try {
      const bookings = await this.getUserBookings(userId)
      return bookings.filter(booking => booking.status === 'completed')
    } catch (error) {
      console.error('BookingService: Error fetching completed bookings:', error)
      throw error
    }
  }

  // Get upcoming bookings for a user
  static async getUpcomingBookings(userId: string): Promise<Booking[]> {
    try {
      const bookings = await this.getUserBookings(userId)
      return bookings.filter(booking => 
        booking.status === 'confirmed' || booking.status === 'pending'
      )
    } catch (error) {
      console.error('BookingService: Error fetching upcoming bookings:', error)
      throw error
    }
  }

  // Create a new booking
  static async createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    try {
      console.log('BookingService: Creating booking with data:', bookingData)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select(`
          *,
          activity:activities(
            id,
            title,
            description,
            image,
            price,
            duration,
            location,
            category
          ),
          guide:user_profiles(
            id,
            name,
            avatar,
            rating
          )
        `)
        .single()

      console.log('BookingService: Create booking response:', { data, error })

      if (error) {
        console.error('BookingService: Error creating booking:', error)
        throw error
      }

      console.log('BookingService: Booking created successfully:', data)
      return data
    } catch (error) {
      console.error('BookingService: Error creating booking:', error)
      throw error
    }
  }

  // Update booking status
  static async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    try {
      console.log('BookingService: Updating booking status:', { bookingId, status })
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select(`
          *,
          activity:activities(
            id,
            title,
            description,
            image,
            price,
            duration,
            location,
            category
          ),
          guide:user_profiles(
            id,
            name,
            avatar,
            rating
          )
        `)
        .single()

      console.log('BookingService: Update booking response:', { data, error })

      if (error) {
        console.error('BookingService: Error updating booking:', error)
        throw error
      }

      console.log('BookingService: Booking updated successfully:', data)
      return data
    } catch (error) {
      console.error('BookingService: Error updating booking:', error)
      throw error
    }
  }

  // Get booking by ID
  static async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      console.log('BookingService: Fetching booking by ID:', bookingId)
      
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          activity:activities(
            id,
            title,
            description,
            image,
            price,
            duration,
            location,
            category
          ),
          guide:user_profiles(
            id,
            name,
            avatar,
            rating
          )
        `)
        .eq('id', bookingId)
        .single()

      console.log('BookingService: Get booking response:', { data, error })

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('BookingService: Booking not found')
          return null
        }
        console.error('BookingService: Supabase error:', error)
        throw error
      }

      console.log('BookingService: Booking found:', data)
      return data
    } catch (error) {
      console.error('BookingService: Error fetching booking by ID:', error)
      throw error
    }
  }
}