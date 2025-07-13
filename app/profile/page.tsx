"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Calendar, Clock, Heart, Settings, LogOut, ChevronRight, Edit, Camera } from "lucide-react"
import { useRef } from "react"
import { useTranslation } from "react-i18next";
import "../../i18n-client";
// Actualizar los datos de ejemplo para el perfil con el nombre y la foto de Sofia
const userData = {
  name: "Sofia Aliaga",
  email: "sofia@example.com",
  phone: "+54 9 294 123 4567",
  avatar: "/images/sofia-profile.jpeg",
  location: "Bariloche, Argentina",
  memberSince: "Marzo 2023",
  description:
    "Amante de la naturaleza y los deportes al aire libre. Siempre buscando nuevas aventuras en la Patagonia.",
  completedActivities: 8,
  reviews: 6,
  rating: 4.8,
}

// Datos de ejemplo para actividades likeadas
const likedActivities = [
  {
    id: 1,
    title: "Trekking al Cerro Catedral",
    image: "/images/trekking-catedral.png",
    price: 15000,
    duration: "4 horas",
    guide: {
      name: "Carlos Montaña",
      rating: 4.8,
    },
    tags: ["Trekking", "Naturaleza"],
  },
  {
    id: 2,
    title: "Kayak en Lago Gutiérrez",
    image: "/images/kayak-gutierrez.png",
    price: 12000,
    duration: "3 horas",
    guide: {
      name: "Laura Ríos",
      rating: 4.9,
    },
    tags: ["Kayak", "Lago"],
  },
  {
    id: 5,
    title: "Esquí en Cerro Catedral",
    image: "/images/ski-catedral.png",
    price: 22000,
    duration: "4 horas",
    guide: {
      name: "Javier Nieves",
      rating: 4.9,
    },
    tags: ["Esquí", "Nieve"],
  },
]

// Datos de ejemplo para reservas
const bookings = [
  {
    id: 101,
    title: "Trekking al Cerro Catedral",
    image: "/images/trekking-catedral.png",
    date: "15 de junio, 2025",
    time: "09:00 AM",
    price: 15000,
    status: "confirmed", // confirmed, pending, cancelled
    participants: 2,
    guide: {
      name: "Carlos Montaña",
      rating: 4.8,
    },
  },
  {
    id: 102,
    title: "Kayak en Lago Gutiérrez",
    image: "/images/kayak-gutierrez.png",
    date: "20 de junio, 2025",
    time: "10:30 AM",
    price: 24000, // precio por 2 personas
    status: "pending",
    participants: 2,
    guide: {
      name: "Laura Ríos",
      rating: 4.9,
    },
  },
]

// Datos de ejemplo para actividades completadas
const completedActivities = [
  {
    id: 201,
    title: "Escalada en Piedras Blancas",
    image: "/images/escalada-piedras-blancas.png",
    date: "10 de mayo, 2025",
    price: 18000,
    rating: 5,
    reviewed: true,
    guide: {
      name: "Martín Escalante",
      rating: 4.7,
    },
  },
  {
    id: 202,
    title: "Trekking al Cerro Llao Llao",
    image: "/images/trekking-llao-llao.png",
    date: "5 de mayo, 2025",
    price: 12000,
    rating: 4,
    reviewed: true,
    guide: {
      name: "Carlos Montaña",
      rating: 4.8,
    },
  },
  {
    id: 203,
    title: "Bike Circuito Chico",
    image: "/images/bike-circuito-chico.png",
    date: "28 de abril, 2025",
    price: 9000,
    rating: 5,
    reviewed: true,
    guide: {
      name: "Pedro Rodríguez",
      rating: 4.7,
    },
  },
]

export default function ProfilePage() {
  const { t } = useTranslation("pages");
  const [activeTab, setActiveTab] = useState("info")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Función para obtener el color de estado de la reserva
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700"
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // Función para obtener el texto de estado de la reserva
  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return t("confirmed")
      case "pending":
        return t("pending")
      case "cancelled":
        return t("cancelled")
      default:
        return t("unknown")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/plan-a-logo-binoculars.png"
            alt="PLAN A"
            width={32}
            height={32}
            className="object-contain"
          />
          <h1 className="text-xl font-bold text-cyan-900">PLAN A</h1>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/profile/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          {/* Perfil del usuario */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="relative h-32 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-t-xl">
              <div className="absolute -bottom-12 left-4">
                <div className="relative">
                  {/* Reemplazamos el Avatar por un div con Image para mejor control */}
                  <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden relative">
                    <Image
                      src={avatarPreview || userData.avatar || "/placeholder.svg"}
                      alt={userData.name}
                      fill
                      className="object-cover object-center"
                      sizes="96px"
                      priority
                    />
                  </div>
                  <button
                    className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (ev) => {
                          setAvatarPreview(ev.target?.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Link href="/profile/create">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {t("editProfile")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="pt-14 pb-4 px-4">
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{userData.location}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {userData.description || "No hay descripción disponible."}
              </p>
              <div className="flex items-center mt-4 text-sm text-gray-600">
                <div className="flex items-center mr-4">
                  <Calendar className="h-4 w-4 mr-1 text-emerald-600" />
                  <span>Miembro desde {userData.memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pestañas */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="info">{t("info")}</TabsTrigger>
              <TabsTrigger value="bookings">{t("bookings")}</TabsTrigger>
              <TabsTrigger value="favorites">{t("favorites")}</TabsTrigger>
            </TabsList>

            {/* Contenido de la pestaña de información */}
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">{t("contactInfo")}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">{t("email")}</span>
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">{t("phone")}</span>
                      <span>{userData.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">{t("completedActivities")}</h3>
                  {completedActivities.length > 0 ? (
                    <div className="space-y-3">
                      {completedActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
                          <div className="h-16 w-16 rounded-lg overflow-hidden relative flex-shrink-0">
                            <Image
                              src={activity.image || "/placeholder.svg"}
                              alt={activity.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium">{activity.title}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{activity.date}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < activity.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              {activity.reviewed ? (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">{t("reviewed")}</Badge>
                              ) : (
                                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                                  {t("leaveReview")}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p>{t("noCompletedActivities")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("logout")}
                </Button>
              </div>
            </TabsContent>

            {/* Contenido de la pestaña de reservas */}
            <TabsContent value="bookings" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{t("nextActivities")}</h3>
                <Link href="/search">
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                    {t("exploreMore")}
                  </Button>
                </Link>
              </div>

              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="h-32 w-32 relative flex-shrink-0">
                            <Image
                              src={booking.image || "/placeholder.svg"}
                              alt={booking.title}
                              fill
                              className="object-cover rounded-l-lg"
                            />
                          </div>
                          <div className="p-3 flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{booking.title}</h4>
                              <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{booking.date}</span>
                              <span className="mx-1">•</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <span>Guía: {booking.guide.name}</span>
                              <span className="mx-1">•</span>
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1">{booking.guide.rating}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div>
                                <span className="text-xs text-gray-500">{t("totalPrice")}</span>
                                <p className="font-bold">${booking.price.toLocaleString()}</p>
                              </div>
                              <Link href={`/booking/${booking.id}`}>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                  {t("viewDetails")}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mb-3">
                      <Calendar className="h-12 w-12 mx-auto text-gray-300" />
                    </div>
                    <h3 className="font-medium text-gray-700 mb-1">{t("noBookings")}</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {t("exploreActivities")}
                    </p>
                    <Link href="/search">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">{t("exploreActivities")}</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              <div className="mt-6">
                <h3 className="font-semibold mb-3">{t("activityHistory")}</h3>
                {completedActivities.length > 0 ? (
                  <div className="space-y-2">
                    {completedActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-lg overflow-hidden relative flex-shrink-0">
                            <Image
                              src={activity.image || "/placeholder.svg"}
                              alt={activity.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-sm">{activity.title}</h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{activity.date}</span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/activity/${activity.id}`}>
                          <Button variant="ghost" size="sm" className="p-1">
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 bg-white rounded-lg">
                    <p>{t("noCompletedActivities")}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Contenido de la pestaña de favoritos */}
            <TabsContent value="favorites" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{t("savedActivities")}</h3>
                <Link href="/search">
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                    {t("exploreMore")}
                  </Button>
                </Link>
              </div>

              {likedActivities.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {likedActivities.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="h-32 w-32 relative flex-shrink-0">
                            <Image
                              src={activity.image || "/placeholder.svg"}
                              alt={activity.title}
                              fill
                              className="object-cover rounded-l-lg"
                            />
                          </div>
                          <div className="p-3 flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{activity.title}</h4>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activity.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{activity.duration}</span>
                              <span className="mx-1">•</span>
                              <span>Guía: {activity.guide.name}</span>
                              <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                              <span>{activity.guide.rating}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <p className="font-bold">${activity.price.toLocaleString()}</p>
                              <Link href={`/activity/${activity.id}`}>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                  {t("viewDetails")}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mb-3">
                      <Heart className="h-12 w-12 mx-auto text-gray-300" />
                    </div>
                    <h3 className="font-medium text-gray-700 mb-1">{t("noFavorites")}</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {t("saveActivities")}
                    </p>
                    <Link href="/search">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">{t("exploreActivities")}</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <nav className="flex items-center justify-around p-4 bg-white border-t">
        <Link href="/" className="flex flex-col items-center text-gray-400">
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
          <span className="text-xs mt-1">{t("home")}</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center text-gray-400">
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
          <span className="text-xs mt-1">{t("search")}</span>
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
        <Link href="/profile" className="flex flex-col items-center text-emerald-600">
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
          <span className="text-xs mt-1">{t("profile")}</span>
        </Link>
      </nav>
    </div>
  )
}