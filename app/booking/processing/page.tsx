"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"
import mockActivities from "@/data/mockActivities"
import { useTranslation } from "react-i18next";
import "../../../i18n-client";
export default function ProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activityId = searchParams.get("activityId")
  const [isProcessing, setIsProcessing] = useState(true)
  const { t } = useTranslation("pages");
  // Obtener la actividad seleccionada
  const activity = mockActivities.find((a) => a.id === activityId) || null

  // Simular el procesamiento de la reserva
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Si la reserva se ha procesado, redirigir a la página de confirmación
  useEffect(() => {
    if (!isProcessing) {
      const timer = setTimeout(() => {
        router.push(`/booking/confirmation?activityId=${activityId}`)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isProcessing, router, activityId])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-sky-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {isProcessing ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">{t("processingBooking")}</h1>
            <p className="text-gray-600">
              {t("processingBookingDescription", { activity: activity?.title })}
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">{t("bookingConfirmed")}</h1>
            <p className="text-gray-600 mb-6">
              {t("bookingConfirmedDescription1", { activity: activity?.title })}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
