import type { PersonalInfo } from "@/components/personal-info-form"
import type { Activity } from "@/types"

export interface BookingConfirmationData {
  personalInfo: PersonalInfo
  activity: Activity
  bookingDetails: {
    date: string
    participants: number
    totalPrice: number
    confirmationCode: string
    bookingId: string
  }
  paymentInfo?: {
    cardNumber: string
    cardName: string
    expiry: string
    cvv: string
  }
}

export async function sendBookingConfirmationEmail(data: BookingConfirmationData) {
  try {
    console.log("📧 Servicio: Iniciando envío de email...")
    console.log("📧 Servicio: Datos a enviar:", {
      email: data.personalInfo.email,
      activity: data.activity.title,
      code: data.bookingDetails.confirmationCode,
    })

    const response = await fetch("/api/send-confirmation-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    console.log("📧 Servicio: Respuesta recibida, status:", response.status)

    const result = await response.json()
    console.log("📧 Servicio: Resultado:", result)

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`)
    }

    return result
  } catch (error) {
    console.error("❌ Servicio: Error enviando email:", error)
    throw error
  }
}

export function generateConfirmationCode(): string {
  return "PLAN-" + Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateBookingId(): string {
  return "BRL-" + Date.now().toString() + "-" + Math.floor(Math.random() * 1000).toString()
}
