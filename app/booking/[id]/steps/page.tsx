"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Users, CreditCard, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import mockActivities from "@/data/mockActivities"
import PersonalInfoForm, { type PersonalInfo } from "@/components/personal-info-form"
import { sendBookingConfirmationEmail, generateConfirmationCode, generateBookingId } from "@/lib/email-service"
import { useTranslation } from "react-i18next"
import "../../../../i18n-client"
export default function BookingStepsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation("pages")
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  // Add paymentInfo state
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "4111 1111 1111 1111",
    expiry: "12/25",
    cvv: "123",
    cardName: "",
  })

  // Obtener parámetros de la URL
  const dateParam = searchParams.get("date")
  const participantsParam = searchParams.get("participants")
  const participants = participantsParam ? Number.parseInt(participantsParam) : 1
  // Buscar la actividad
  const activity = mockActivities.find((act) => act.id === params.id)

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Actividad no encontrada</p>
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
    : "Fecha no seleccionada"

  const handlePersonalInfoSubmit = async (data: PersonalInfo) => {
    setPersonalInfo(data)
    // Set cardName from personal info
    setPaymentInfo((prev) => ({ ...prev, cardName: `${data.firstName} ${data.lastName}` }))
    setCurrentStep(2)
  }

  const handlePaymentSubmit = async () => {
    if (!personalInfo) return

    setIsLoading(true)

    try {
      console.log("🎯 Iniciando proceso de pago...")
      console.log("personalInfo", personalInfo)
      console.log("💳 Payment Info:", paymentInfo)
      const confirmationCode = generateConfirmationCode()
      const bookingId = generateBookingId()

      console.log("📧 Enviando email de confirmación...")
      console.log("📧 Datos del email:", {
        email: personalInfo.email,
        activity: activity.title,
        code: confirmationCode,
      })

      // Enviar email de confirmación (do NOT send paymentInfo)
      const emailResult = await sendBookingConfirmationEmail({
        personalInfo,
        activity,
        bookingDetails: {
          date: formattedDate,
          participants,
          totalPrice,
          confirmationCode,
          bookingId,
        },
      })

      console.log("✅ Email enviado exitosamente:", emailResult)
      // Only store last 4 digits for reference
      const safePaymentInfo = {
        cardNumber: paymentInfo.cardNumber,
        cardName: paymentInfo.cardName,
        expiry: paymentInfo.expiry,
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
      // Redirigir a la página de confirmación
      router.push(
        `/booking/confirmation?activityId=${activity.id}&bookingId=${bookingId}&confirmationCode=${confirmationCode}&bookingData=${(JSON.stringify(bookingData))}`,
      )
    } catch (error) {
      console.error("❌ Error procesando reserva:", error)

      // Mostrar error más específico
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <Link href={`/activity-detail?id=${activity.id}`} className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <span className="font-medium">{t("back")}</span>
        </Link>
        <h1 className="text-lg font-semibold">{t("book")}</h1>
        <div className="w-16"></div>
      </header>

      <div className="container max-w-md mx-auto p-4">
        {/* Progress Steps */}
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

        {/* Activity Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={activity.image || "/placeholder.svg"} alt={activity.title} fill className="object-cover" />
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

        {/* Step Content */}
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
                  <strong>{t("demoMode")}:</strong> {t("demoModeDescription")}
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
    </div>
  )
}
