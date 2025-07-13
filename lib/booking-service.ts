import { supabase, isSupabaseConfigured } from "./supabase"

export interface BookingData {
  activityId: string
  userName: string
  userEmail: string
  userPhone: string
  date: string
  participants: number
  totalPrice: number
}

export interface Booking extends BookingData {
  id: string
  status: string
  createdAt: string
  updatedAt: string
}

// Función para crear una reserva
export async function createBooking(
  bookingData: BookingData,
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  if (!isSupabaseConfigured()) {
    // Simular creación de reserva
    const mockBooking: Booking = {
      id: `mock_${Date.now()}`,
      ...bookingData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("📦 Reserva simulada creada:", mockBooking)
    return { success: true, booking: mockBooking }
  }

  try {
    const { data, error } = await supabase!
      .from("bookings")
      .insert({
        activity_id: bookingData.activityId,
        user_name: bookingData.userName,
        user_email: bookingData.userEmail,
        user_phone: bookingData.userPhone,
        date: bookingData.date,
        participants: bookingData.participants,
        total_price: bookingData.totalPrice,
        status: "confirmed",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creando reserva:", error)
      return { success: false, error: error.message }
    }

    const booking: Booking = {
      id: data.id,
      activityId: data.activity_id,
      userName: data.user_name,
      userEmail: data.user_email,
      userPhone: data.user_phone,
      date: data.date,
      participants: data.participants,
      totalPrice: data.total_price,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    console.log("✅ Reserva creada en Supabase:", booking)
    return { success: true, booking }
  } catch (error) {
    console.error("Error conectando con Supabase:", error)
    return { success: false, error: "Error de conexión" }
  }
}

// Función para obtener reservas por email
export async function getBookingsByEmail(email: string): Promise<Booking[]> {
  if (!isSupabaseConfigured()) {
    console.log("📦 Modo mock - no hay reservas guardadas")
    return []
  }

  try {
    const { data, error } = await supabase!
      .from("bookings")
      .select("*")
      .eq("user_email", email)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error obteniendo reservas:", error)
      return []
    }

    return data.map((booking) => ({
      id: booking.id,
      activityId: booking.activity_id,
      userName: booking.user_name,
      userEmail: booking.user_email,
      userPhone: booking.user_phone,
      date: booking.date,
      participants: booking.participants,
      totalPrice: booking.total_price,
      status: booking.status,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
    }))
  } catch (error) {
    console.error("Error conectando con Supabase:", error)
    return []
  }
}