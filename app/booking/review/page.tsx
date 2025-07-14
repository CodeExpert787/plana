"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, AlertCircle } from "lucide-react"
import mockActivities from "@/data/mockActivities"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useTranslation } from "react-i18next";
import "../../../i18n-client";
export default function BookingReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation("pages");
  const activityId = searchParams.get("activityId")
  const dateParam = searchParams.get("date")
  const participantsParam = searchParams.get("participants")

  const [activity, setActivity] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  // Datos del formulario
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
  })

  // Cargar datos de la actividad
  useEffect(() => {
    if (activityId) {
      const foundActivity = mockActivities.find((act) => act.id === activityId)
      if (foundActivity) {
        setActivity(foundActivity)
      }
      setIsLoading(false)
    }
  }, [activityId])

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario escribe
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Validar formulario según el paso actual
  const validateCurrentStep = () => {
    const newErrors: { [key: string]: string } = {}
    const { t } = useTranslation("pages");
    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = t("fullNameError")
      if (!formData.email.trim()) newErrors.email = t("emailError")
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t("emailError")
      if (!formData.phone.trim()) newErrors.phone = t("phoneError")
    }

    if (currentStep === 2 && !acceptedTerms) {
      newErrors.terms = t("termsAndConditionsError")
    }

    if (currentStep === 3 && paymentMethod === "credit-card") {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = t("cardNumberError")
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
        newErrors.cardNumber = t("cardNumberError")

      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = t("cardExpiryError")
      if (!formData.cardCvc.trim()) newErrors.cardCvc = t("cardCvcError")
      if (!formData.cardName.trim()) newErrors.cardName = t("cardNameError")
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Avanzar al siguiente paso
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  // Retroceder al paso anterior
  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  // Procesar el pago y finalizar la reserva
  const handleCompleteBooking = () => {
    if (validateCurrentStep()) {
      setIsProcessing(true)

      // Simulamos el procesamiento del pago
      setTimeout(() => {
        router.push(`/booking/${activityId}?date=${dateParam}&participants=${participantsParam}`)
      }, 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loadingBookingDetails")}</p>
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t("activityNotFound")}</h2>
          <p className="text-gray-600 mb-4">{t("activityNotFoundDescription")}</p>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700">{t("backToHome")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const participants = participantsParam ? Number.parseInt(participantsParam) : 1
  const totalPrice = activity.price * participants
  const taxAmount = Math.round(totalPrice * 0.21)
  const finalPrice = totalPrice + taxAmount

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("dateNotSelected")
    try {
      return format(new Date(dateString), "PPP", { locale: es })
    } catch (e) {
      return t("invalidDate")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <header className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <span className="font-medium">{t("cancelReservation")}</span>
        </Link>
        <div className="text-sm font-medium">{t("step")} {currentStep} {t("of")} 3</div>
      </header>

      <div className="container max-w-2xl mx-auto p-4">
        {/* Progreso de pasos */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <div className={`h-2 ${currentStep >= 1 ? "bg-emerald-500" : "bg-gray-200"} rounded-l-full`}></div>
            </div>
            <div className="flex-1">
              <div className={`h-2 ${currentStep >= 2 ? "bg-emerald-500" : "bg-gray-200"}`}></div>
            </div>
            <div className="flex-1">
              <div className={`h-2 ${currentStep >= 3 ? "bg-emerald-500" : "bg-gray-200"} rounded-r-full`}></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span className={currentStep >= 1 ? "text-emerald-600 font-medium" : ""}>{t("personalInfo")}</span>
            <span className={currentStep >= 2 ? "text-emerald-600 font-medium" : ""}>{t("termsAndConditions")}</span>
            <span className={currentStep >= 3 ? "text-emerald-600 font-medium" : ""}>{t("paymentMethod")}</span>
          </div>
        </div>

        {/* Resumen de la reserva (siempre visible) */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("bookingSummary")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                  src={activity.image || "/images/placeholder.png"}
                  alt={activity.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{activity.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(dateParam)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{activity.duration}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{activity.location}</span>
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t("pricePerPerson")}</span>
                <span>${activity.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("participants")}</span>
                <span>x {participants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("subtotal")}</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("taxes")} (21%)</span>
                <span>${taxAmount}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>{t("total")}</span>
                <span>${finalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paso 1: Datos personales */}
        {currentStep === 1 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t("personalInfo")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="fullName">{t("fullName")}</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={t("fullNamePlaceholder")}
                    className={formErrors.fullName ? "border-red-500" : ""}
                  />
                  {formErrors.fullName && <p className="text-sm text-red-500">{formErrors.fullName}</p>}
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t("emailPlaceholder")}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t("phonePlaceholder")}
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Paso 2: Términos y condiciones */}
        {currentStep === 2 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t("termsAndConditions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md border text-sm mb-4 max-h-60 overflow-y-auto">
                  <h3 className="font-medium mb-2">{t("termsAndConditionsDescription")}</h3>
                  <p className="mb-2">
                    {t("termsAndConditionsDescription1")}
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Las reservas están sujetas a disponibilidad y confirmación.</li>
                    <li>Se requiere un pago completo para confirmar la reserva.</li>
                    <li>
                      Las cancelaciones realizadas con más de 48 horas de anticipación recibirán un reembolso del 80%.
                    </li>
                    <li>Las cancelaciones realizadas con menos de 48 horas de anticipación no son reembolsables.</li>
                    <li>
                      PLAN A se reserva el derecho de cancelar actividades debido a condiciones climáticas adversas u
                      otros factores de seguridad.
                    </li>
                    <li>Los participantes deben seguir las instrucciones de los guías en todo momento.</li>
                    <li>
                      Los participantes son responsables de asegurarse de que cumplen con los requisitos físicos
                      necesarios para la actividad.
                    </li>
                    <li>
                      PLAN A no se hace responsable por objetos personales perdidos o dañados durante las actividades.
                    </li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                      className={formErrors.terms ? "border-red-500" : ""}
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor="terms" className="text-sm font-normal">
                        {t("termsAndConditionsDescription2")}
                      </Label>
                      {formErrors.terms && <p className="text-sm text-red-500">{formErrors.terms}</p>}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="newsletter" />
                    <Label htmlFor="newsletter" className="text-sm font-normal">
                      {t("newsletterDescription")}
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Paso 3: Método de pago */}
        {currentStep === 3 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t("paymentMethod")}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-4">
                <div className="flex items-center space-x-2 border rounded-md p-3 mb-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
                      {t("creditCard")}
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 mb-2">
                  <RadioGroupItem value="debit-card" id="debit-card" />
                  <Label htmlFor="debit-card" className="flex-1 cursor-pointer">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-green-500" />
                      {t("debitCard")}
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="mercado-pago" id="mercado-pago" />
                  <Label htmlFor="mercado-pago" className="flex-1 cursor-pointer">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#009ee3">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.93 8.535c-.708 0-1.304.206-1.643.62-.339.413-.339.95-.339 1.56v.826h3.823v1.032h-3.823v4.887H9.635v-4.887H8.07v-1.032h1.565v-.723c0-.826 0-1.858.678-2.58.678-.723 1.565-1.032 2.617-1.032.678 0 1.148.103 1.356.103l-.339 1.135c-.209-.103-.678-.103-1.017-.103v.103z" />
                      </svg>
                      {t("mercadoPago")}
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "credit-card" && (
                <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                  <div className="grid gap-1.5">
                    <Label htmlFor="cardNumber">{t("cardNumber")}</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder={t("cardNumberPlaceholder")}
                      className={formErrors.cardNumber ? "border-red-500" : ""}
                    />
                    {formErrors.cardNumber && <p className="text-sm text-red-500">{formErrors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="cardExpiry">{t("cardExpiry")}</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder={t("cardExpiryPlaceholder")}
                        className={formErrors.cardExpiry ? "border-red-500" : ""}
                      />
                      {formErrors.cardExpiry && <p className="text-sm text-red-500">{formErrors.cardExpiry}</p>}
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="cardCvc">{t("cardCvc")}</Label>
                      <Input
                        id="cardCvc"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder={t("cardCvcPlaceholder")}
                        className={formErrors.cardCvc ? "border-red-500" : ""}
                      />
                      {formErrors.cardCvc && <p className="text-sm text-red-500">{formErrors.cardCvc}</p>}
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="cardName">{t("cardName")}</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder={t("cardNamePlaceholder")}
                      className={formErrors.cardName ? "border-red-500" : ""}
                    />
                    {formErrors.cardName && <p className="text-sm text-red-500">{formErrors.cardName}</p>}
                  </div>
                </div>
              )}

              {paymentMethod === "mercado-pago" && (
                <div className="p-4 bg-blue-50 rounded-md border border-blue-200 text-sm">
                  {t("mercadoPagoDescription")}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handlePreviousStep}>
              {t("previous")}
            </Button>
          ) : (
            <Link href="/">
              <Button variant="outline">{t("cancel")}</Button>
            </Link>
          )}

          {currentStep < 3 ? (
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleNextStep}>
              {t("continue")}
            </Button>
          ) : (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleCompleteBooking}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("processingPayment")}
                </>
              ) : (
                t("confirmAndPay")
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
