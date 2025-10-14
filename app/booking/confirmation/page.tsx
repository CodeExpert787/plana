"use client"

import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { ActivitiesService } from "@/lib/activities-service"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next";
import "../../../i18n-client";
export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingData = searchParams.get("bookingData")
  const [parsedBookingData, setParsedBookingData] = useState<any | null>(null)
  const [activity, setActivity] = useState<any | null>(null)
  const { t } = useTranslation("pages");
  const [emailStatus, setEmailStatus] = useState<{
    sent: boolean
    loading: boolean
    error?: string
    simulated?: boolean
  }>({ sent: false, loading: true })

  const [retryCount, setRetryCount] = useState(0)
  const emailSentRef = useRef(false)
  // Build booking data from URL params (minimal) and fetch activity
  useEffect(() => {
    const activityId = searchParams.get("activityId")
    const bookingId = searchParams.get("bookingId") || ""
    const confirmationCode = searchParams.get("confirmationCode") || ""
    const date = searchParams.get("date") || ""
    const participantsStr = searchParams.get("participants") || "1"
    const participants = Number.parseInt(participantsStr)
    const firstName = searchParams.get("firstName") || ""
    const lastName = searchParams.get("lastName") || ""
    const email = searchParams.get("email") || ""
    const phone = searchParams.get("phone") || ""

    const built = {
      personalInfo: { firstName, lastName, email, phone },
      paymentInfo: undefined,
      confirmationCode,
      bookingDetails: {
        date,
        participants,
        totalPrice: 0, // will compute after activity loads
        confirmationCode,
        bookingId,
      },
    }
    setParsedBookingData(built)

    if (!activityId) {
      setActivity(null)
      return
    }
    let cancelled = false
    const load = async () => {
      try {
        const data = await ActivitiesService.getActivityById(activityId)
        if (!cancelled) setActivity(data)
      } catch {
        if (!cancelled) setActivity(null)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [searchParams])

  const sendConfirmationEmail = async () => {
    if (!parsedBookingData || !activity || emailSentRef.current) return

    // Ensure required fields are present
    if (!parsedBookingData.personalInfo?.email || !activity?.title || !parsedBookingData.bookingDetails?.confirmationCode) {
      setEmailStatus({ sent: false, loading: false, error: "Datos incompletos para enviar el email" })
      return
    }
    emailSentRef.current = true
    try {
      console.log("Enviando email de confirmación...")
      const response = await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsedBookingData,
          bookingDetails: {
            ...parsedBookingData.bookingDetails,
            totalPrice: activity && parsedBookingData?.bookingDetails?.participants
              ? activity.price * parsedBookingData.bookingDetails.participants
              : 0,
          },
          activity,
        }),
      })
      const result = await response.json()
      console.log("Resultado:", result)
      if (response.ok) {
        setEmailStatus({
          sent: true,
          loading: false,
          simulated: result.simulated,
        })
        // Send admin notification
        await fetch("/api/booking-notify-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...parsedBookingData,
            bookingDetails: {
              ...parsedBookingData.bookingDetails,
              totalPrice: activity && parsedBookingData?.bookingDetails?.participants
                ? activity.price * parsedBookingData.bookingDetails.participants
                : 0,
            },
            activity,
          }),
        })
      } else {
        setEmailStatus({
          sent: false,
          loading: false,
          error: result.error || "Error enviando email",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      setEmailStatus({
        sent: false,
        loading: false,
        error: "Error de conexión",
      })
    }
  }
  useEffect(() => {
    if (parsedBookingData && activity) {
      sendConfirmationEmail()
    }
  }, [parsedBookingData, activity, retryCount])

  const handleRetry = () => {
    setEmailStatus({ sent: false, loading: true })
    setRetryCount((prev) => prev + 1)
  }

  if (!parsedBookingData || !activity) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h1 className="text-xl font-bold text-yellow-800">{t("noBookingData")}</h1>
          <p className="text-yellow-700">{t("noBookingDataDescription")}</p>
        </div>
      </div>
    )
  }
  console.log("parsedBookingData", parsedBookingData)
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">{t("bookingConfirmed")}</h1>
          <p className="text-gray-600 mt-2">{t("bookingConfirmedDescription")}</p>
        </div>

        <div className="border-t border-b border-gray-200 py-4 my-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">{t("confirmationCode")}:</span>
            <span className="font-mono font-bold text-lg">
              {parsedBookingData.confirmationCode || parsedBookingData.bookingDetails?.confirmationCode}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t("activity")}:</span>
            <span className="font-semibold">{parsedBookingData.activity?.title}</span>
          </div>
        </div>

        {/* Estado del email */}
        <div
          className={`rounded-lg p-4 mt-4 ${
            emailStatus.loading
              ? "bg-blue-50 border border-blue-200"
              : emailStatus.sent
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {emailStatus.loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-blue-700">{t("sendingConfirmationEmail")}</span>
              </>
            ) : emailStatus.sent ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700">
                  {emailStatus.simulated
                    ? t("simulatedConfirmationEmail")
                    : t("sentConfirmationEmail")}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{t("errorSendingEmail")}: {emailStatus.error}</span>
              </>
            )}
          </div>

          {emailStatus.sent && (
            <p className="text-sm text-blue-600 mt-2">
              {t("checkYourEmail")}
            </p>
          )}

          {!emailStatus.loading && !emailStatus.sent && (
            <div className="mt-3">
              <Button onClick={handleRetry} size="sm" variant="outline">
                {t("retrySendingEmail")}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">{t("emailSentDescription")}</p>
          <Button onClick={() => (window.location.href = "/")}>{t("backToHome")}</Button>
        </div>
      </div>
    </div>
  )
}
