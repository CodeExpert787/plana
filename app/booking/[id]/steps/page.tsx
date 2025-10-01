"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Users, CreditCard, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import PersonalInfoForm, { type PersonalInfo } from "@/components/personal-info-form"
import { generateConfirmationCode, generateBookingId } from "@/lib/email-service"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { ActivitiesService, type Activity as DBActivity } from "@/lib/activities-service"
import "../../../../i18n-client"

export default function BookingStepsPage() {
  const routeParams = useParams()
  const idParam = (routeParams?.id ?? "") as string | string[]
  const id = Array.isArray(idParam) ? idParam[0] : idParam
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation("pages")
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "4111 1111 1111 1111",
    expiry: "12/25",
    cvv: "123",
    cardName: "",
  })
  const [activity, setActivity] = useState<DBActivity | null>(null)

  // URL params
  const dateParam = searchParams.get("date")
  const participantsParam = searchParams.get("participants")
  const participants = participantsParam ? Number.parseInt(participantsParam) : 1

  // Load activity from DB
  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const data = await ActivitiesService.getActivityById(id)
        setActivity(data)
      } catch (e) {
        console.error('Failed to load activity', e)
        setActivity(null)
      }
    }
    load()
  }, [id])

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("activityNotFound", "Actividad no encontrada")}</p>
      </div>
    )
  }

  const totalPrice = activity.price * participants
  const formattedDate = dateParam
    ? new Date(dateParam).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : t("noDateSelected")

  const handlePersonalInfoSubmit = async (data: PersonalInfo) => {
    setPersonalInfo(data)
    setPaymentInfo((prev) => ({ ...prev, cardName: `${data.firstName} ${data.lastName}` }))
    setCurrentStep(2)
  }

  const handlePaymentSubmit = async () => {
    if (!personalInfo) return

    setIsLoading(true)

    try {
      const confirmationCode = generateConfirmationCode()
      const bookingId = generateBookingId()

      const safePaymentInfo = {
        cardNumber: paymentInfo.cardNumber,
        cardName: paymentInfo.cardName,
        expiry: paymentInfo.expiry,
        cvv: paymentInfo.cvv,
      }
      const bookingData = {
        personalInfo,
        paymentInfo: safePaymentInfo,
        confirmationCode,
        bookingDetails: {
          date: formattedDate,
          participants,
          totalPrice,
          confirmationCode,
          bookingId,
        },
        activity
      };

      router.push(
        `/booking/confirmation?activityId=${activity.id}&bookingId=${bookingId}&confirmationCode=${confirmationCode}&bookingData=${(JSON.stringify(bookingData))}`,
      )
    } catch (error) {
      console.error("❌ Error procesando reserva:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      alert(`Hubo un error al procesar tu reserva: ${errorMessage}. Por favor intenta nuevamente.`)
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { number: 1, title: "Información Personal", completed: currentStep > 1 },
    { number: 2, title: "Pago", completed: false },
    { number: 3, title: "Confirmación", completed: false },
  ]

  return (
    <ProtectedRoute>
      <div className="">
      <header className="flex items-center justify-center p-4 bg-white border-b">
        <h1 className="text-lg font-semibold">{t("book")}</h1>
        <div className="w-16"></div>
      </header>

      <div className="container max-w-md mx-auto p-4 pb-28">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.completed
                    ? "bg-emerald-600 text-white"
                    : currentStep === step.number
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.completed ? <Check className="w-4 h-4" /> : step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${step.completed ? "bg-emerald-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={(activity.images && activity.images[0]) || activity.image || "/placeholder.svg"} alt={activity.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{activity.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{participants} {t("participant")}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${totalPrice.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentStep === 1 && <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {t("paymentInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  {t("demoModeDescription")}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("cardNumber")}</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border rounded-lg"
                    value={paymentInfo.cardNumber}
                    onChange={e => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("expirationDate")}</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full p-3 border rounded-lg"
                      value={paymentInfo.expiry}
                      onChange={e => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input type="text" placeholder="123" className="w-full p-3 border rounded-lg" value={paymentInfo.cvv} onChange={e => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t("cardName")}</label>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full p-3 border rounded-lg"
                    value={paymentInfo.cardName}
                    onChange={e => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos (21%)</span>
                  <span>${Math.round(totalPrice * 0.21).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${Math.round(totalPrice * 1.21).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                  Volver
                </Button>
                <Button onClick={handlePaymentSubmit} disabled={isLoading} className="flex-1">
                  {isLoading ? t("processing") : t("confirmPayment")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t">
        <div className=" mx-auto flex items-center justify-around p-4">
        <Link href="/" className="flex flex-col items-center text-emerald-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-xs mt-1">{t("home", "Home")}</span>
        </Link>
        <Link href="/filters" className="flex flex-col items-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="text-xs mt-1">{t("search", "Search")}</span>
        </Link>
        <Link href="/guides" className="flex flex-col items-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="text-xs mt-1">{t("guides")}</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-xs mt-1">{t("profile", "Profile")}</span>
        </Link>
        </div>
      </nav>
      </div>
    </ProtectedRoute>
  )
}

