"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Calendar, Clock, MapPin, Share2, Download, ChevronRight, ArrowLeft } from "lucide-react"
import mockActivities from "@/data/mockActivities"

export default function BookingDetailPage({
  params,
  searchParams,
}: { params: { id: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [bookingData, setBookingData] = useState<any>(null)

  // Obtener parámetros de la URL
  const dateParam = searchParams.date as string
  const participantsParam = searchParams.participants as string
  const participants = participantsParam ? Number.parseInt(participantsParam) : 2

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      // Buscar la actividad en los datos simulados
      const activity = mockActivities.find((act) => act.id === params.id)

      if (activity) {
        // Datos de ejemplo para la reserva
        setBookingData({
          id: params.id,
          status: "confirmed",
          date: dateParam
            ? new Date(dateParam).toLocaleDateString()
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          time: activity.startTimes ? activity.startTimes[0] : "09:00",
          activity: {
            title: activity.title,
            image: activity.image,
            price: activity.price,
            duration: activity.duration,
            location: activity.location,
            meetingPoint: `Punto de encuentro en ${activity.location}`,
          },
          guide: {
            name: activity.guide.name,
            phone: "+54 9 294 123-4567",
            email: `${activity.guide.name.toLowerCase().replace(" ", ".")}@plana.com`,
          },
          participants: participants,
          totalPrice: activity.price * participants,
          bookingDate: new Date().toLocaleDateString(),
          paymentMethod: "Tarjeta de crédito",
          confirmationCode:
            "PLAN-" +
            Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0"),
        })
      } else {
        // Datos genéricos si no se encuentra la actividad
        setBookingData({
          id: params.id,
          status: "confirmed",
          date: dateParam
            ? new Date(dateParam).toLocaleDateString()
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          time: "09:00",
          activity: {
            title: "Actividad en Bariloche",
            image: "/images/bariloche-vista-panoramica.jpeg",
            price: 12000,
            duration: "3 horas",
            location: "Bariloche, Río Negro",
            meetingPoint: "Centro de visitantes, Bariloche",
          },
          guide: {
            name: "Guía Local",
            phone: "+54 9 294 123-4567",
            email: "guia@plana.com",
          },
          participants: participants,
          totalPrice: 12000 * participants,
          bookingDate: new Date().toLocaleDateString(),
          paymentMethod: "Tarjeta de crédito",
          confirmationCode:
            "PLAN-" +
            Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0"),
        })
      }

      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [params.id, dateParam, participantsParam, participants])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de la reserva...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Volver</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </header>

      <div className="container max-w-md mx-auto p-4">
        <div className="bg-white rounded-xl overflow-hidden shadow-md mb-6">
          <div className="p-6 text-center border-b border-gray-100">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">¡Reserva confirmada!</h1>
            <p className="text-gray-600">Tu reserva para {bookingData.activity.title} ha sido confirmada.</p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Confirmado</Badge>
              <p className="text-sm text-gray-500">Reservado el {bookingData.bookingDate}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-emerald-600 mr-3" />
                <div>
                  <p className="font-medium">{bookingData.date}</p>
                  <p className="text-sm text-gray-600">{bookingData.time} hs</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 text-emerald-600 mr-3" />
                <div>
                  <p className="font-medium">Duración: {bookingData.activity.duration}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-emerald-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">{bookingData.activity.location}</p>
                  <p className="text-sm text-gray-600">Punto de encuentro: {bookingData.activity.meetingPoint}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="font-semibold mb-3">Detalles de la reserva</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Actividad</span>
                  <span>{bookingData.activity.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participantes</span>
                  <span>{bookingData.participants} personas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guía</span>
                  <span>{bookingData.guide.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Código de confirmación</span>
                  <span className="font-medium">{bookingData.confirmationCode}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="font-semibold mb-3">Resumen de pago</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio por persona</span>
                  <span>${bookingData.activity.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participantes</span>
                  <span>x {bookingData.participants}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${bookingData.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Método de pago</span>
                  <span>{bookingData.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Contacto del guía</CardTitle>
            <CardDescription>Ponte en contacto si tienes alguna pregunta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre</span>
              <span>{bookingData.guide.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Teléfono</span>
              <span>{bookingData.guide.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span>{bookingData.guide.email}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Contactar al guía
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-between">
            Política de cancelación <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            Términos y condiciones <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
