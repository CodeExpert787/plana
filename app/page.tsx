"use client"

import { useState } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Mountain, Heart, MapPin, Users, Star, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/lib/auth-context"
import "../i18n-client"
// Lista expandida de ubicaciones disponibles
const locations = [
  { id: 1, name: "Centro Cívico, Bariloche", region: "Centro" },
  { id: 2, name: "Cerro Catedral, Bariloche", region: "Oeste" },
  { id: 3, name: "Llao Llao, Bariloche", region: "Oeste" },
  { id: 4, name: "Colonia Suiza, Bariloche", region: "Oeste" },
  { id: 5, name: "Lago Gutiérrez, Bariloche", region: "Sur" },
  { id: 6, name: "Lago Moreno, Bariloche", region: "Oeste" },
  { id: 7, name: "Cerro Otto, Bariloche", region: "Este" },
  { id: 8, name: "Cerro López, Bariloche", region: "Oeste" },
  { id: 9, name: "Villa Catedral, Bariloche", region: "Este" },
  { id: 10, name: "Circuito Chico, Bariloche", region: "Oeste" },
  { id: 11, name: "Aeropuerto, Bariloche", region: "Este" },
  { id: 12, name: "Terminal de Ómnibus, Bariloche", region: "Centro" },
  { id: 13, name: "Bahía López, Bariloche", region: "Oeste" },
  { id: 14, name: "Playa Bonita, Bariloche", region: "Este" },
  { id: 15, name: "Puerto San Carlos, Bariloche", region: "Centro" },
  { id: 16, name: "Península San Pedro, Bariloche", region: "Este" },
  { id: 17, name: "Valle Encantado, Bariloche", region: "Este" },
  { id: 18, name: "Lago Nahuel Huapi, Bariloche", region: "Centro" },
  { id: 19, name: "Cerro Campanario, Bariloche", region: "Oeste" },
  { id: 20, name: "Villa La Angostura", region: "Norte" },
  { id: 21, name: "Río Limay, Bariloche", region: "Este" },
  { id: 22, name: "Lago Mascardi, Bariloche", region: "Sur" },
  { id: 23, name: "Cerro Tronador, Bariloche", region: "Oeste" },
  { id: 24, name: "El Bolsón", region: "Sur" },
]

export default function HomePage() {
  const { t } = useTranslation("pages")
  const { user, loading } = useAuth()
  // Estados para los filtros
  const [season, setSeason] = useState<"winter" | "summer">("winter")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 4, 15)) // 15 de mayo de 2025
  const [people, setPeople] = useState(2)
  const [distance, setDistance] = useState(30)
  const [duration, setDuration] = useState(4)
  const [location, setLocation] = useState(locations[0])
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [searchLocation, setSearchLocation] = useState("")
  const [showMoreActivities, setShowMoreActivities] = useState(false)

  // Actividades básicas (siempre visibles)
  const [trekking, setTrekking] = useState(true)
  const [escalada, setEscalada] = useState(true)
  const [esqui, setEsqui] = useState(true)
  const [bicicleta, setBicicleta] = useState(false)
  const [kayak, setKayak] = useState(false)
  const [pesca, setPesca] = useState(false)

  // Actividades adicionales (mostradas al expandir)
  const [parapente, setParapente] = useState(false)
  const [cabalgata, setCabalgata] = useState(false)
  const [fotografia, setFotografia] = useState(false)
  const [camping, setCamping] = useState(false)
  const [navegacion, setNavegacion] = useState(false)
  const [observacionAves, setObservacionAves] = useState(false)

  // Filtrar ubicaciones según la búsqueda
  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      loc.region.toLowerCase().includes(searchLocation.toLowerCase()),
  )

  // Función para incrementar o decrementar el número de personas
  const changePeople = (increment: boolean) => {
    setPeople((prev) => {
      if (increment) {
        return prev < 10 ? prev + 1 : prev
      } else {
        return prev > 1 ? prev - 1 : prev
      }
    })
  }

  // Función para seleccionar una ubicación
  const selectLocation = (loc: (typeof locations)[0]) => {
    setLocation(loc)
    setIsLocationDialogOpen(false)
    setSearchLocation("") // Limpiar búsqueda al seleccionar
  }

  // Función para abrir el diálogo de ubicación
  const openLocationDialog = () => {
    setIsLocationDialogOpen(true)
  }

  // Función para alternar la visualización de más actividades
  const toggleMoreActivities = () => {
    setShowMoreActivities(!showMoreActivities)
  }

  // Construir la URL de búsqueda con los filtros seleccionados
  const buildSearchUrl = (viewMode = "grid") => {
    const params = new URLSearchParams()
    // Añadir parámetros básicos
    params.append("view", viewMode)
    return `/search?${params.toString()}`
  }
  const navHomebuildSearchUrl = (viewMode = "grid") => {
    const params = new URLSearchParams()
    // Añadir parámetros básicos
    params.append("view", viewMode)
    return `/search?${params.toString()}`
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section - moved to top */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FondoNativia-zvvwJ0XjOmN6geDkfPNjjNlFsTrGze.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        <header className="absolute top-0 left-0 right-0 bg-black/60 backdrop-blur-md z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            

          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col justify-center items-center text-center text-white px-4 max-w-4xl min-h-screen">
          <div className="flex items-center justify-center xl:mb-24 mb-12">
            <img src="/images/plan-a-logo-binoculars.png" alt="PLAN A Logo" className="h-12 xl:h-32" />
          </div>
          <h2 className="text-3xl xl:text-6xl font-bold mb-6 leading-tight">
            {t("findYourNext")}
            <span className="block text-emerald-400">{t("patagonianAdventure")}</span>
          </h2>
          <p className="text-xl sm:text-2xl mb-8 text-white/90 leading-relaxed">
            {t("likeTinder")}
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8 text-white/80">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium">{t("500Adventurers")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium">{t("50Experiences")}</span>
            </div>
          </div>

          <Link href={buildSearchUrl("swipe")} className="inline-block">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 sm:px-12 py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {t("startAdventure")}
              <ArrowRight className="ml-2 h-5 sm:h-6 w-5 sm:w-6" />
            </Button>
          </Link>

          <p className="text-sm text-white/70 mt-4">✨ {t("newExperiencesAddedEachWeek")}</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 bg-white">
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{t("howDoesPlanAWork")}</h3>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            {t("discoverPatagonianExperiences")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow mx-4 md:mx-0">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">{t("swipeAndDiscover")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm sm:text-base">
                {t("swipeThroughUniqueExperiences")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow mx-4 md:mx-0">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">{t("explore")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm sm:text-base">
                {t("fromCerroCatedralToNahuelHuapi")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow mx-4 md:mx-0">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">{t("directReservation")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm sm:text-base">
                {t("contactLocalsViaWhatsApp")}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Experience Preview */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{t("experiencesThatAwaitYou")}</h3>
            <p className="text-base sm:text-lg text-slate-600 px-4">
              {t("someOfTheMostPopularActivitiesInPatagonia")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-emerald-400 to-blue-500 relative">
                <img
                  src="./images/trekking-blue-lake.jpeg"
                  alt="Trekking Cerro Catedral"
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-white/90 text-slate-800 text-xs">{t("moderate")}</Badge>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">{t("trekkingCerroCatedral")}</CardTitle>
                <CardDescription className="text-sm">{t("ascentWithPanoramicViewsOfNahuelHuapi")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-600">{t("6-8Hours")}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-cyan-500 relative">
                <img
                  src="./images/sq_rafting_frontera_12.jpg"
                  alt="Rafting Río Manso"
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-white/90 text-slate-800 text-xs">{t("easy")}</Badge>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">{t("raftingRioManso")}</CardTitle>
                <CardDescription className="text-sm">{t("descentByCrystalClearWaterSurroundedByForests")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-600">{t("4-5Hours")}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium">4.9</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-500 relative">
                <img
                  src="./images/frey.jpg"
                  alt="Escalada en Roca Frey"
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-white/90 text-slate-800 text-xs">{t("difficult")}</Badge>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">{t("rockClimbingInRocaFrey")}</CardTitle>
                <CardDescription className="text-sm">
                  {t("sportClimbingInPatagonianGraniteArches")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-600">{t("8-10Hours")}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium">4.7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 px-4">
            {t("yourPatagonianAdventureIsWaitingForYou")}
          </h3>
          <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8 px-4">
            {t("joinHundredsOfAdventurersWhoHaveAlreadyDiscoveredTheirNextExperienceWithPlanA")}
          </p>

          <Link href={buildSearchUrl("grid")} className="inline-block w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 sm:px-12 py-4 text-base sm:text-lg"
            >
              {t("startNow")}
              <ArrowRight className="ml-2 h-5 sm:h-6 w-5 sm:w-6" />
            </Button>
          </Link>

          <p className="text-xs text-slate-500 mt-4">{t("noRegistrationCost • CancelWhenYouWant • 24/7Support")}</p>
        </div>
      </section>

      <nav className="flex items-center justify-around p-4 bg-white border-t">
        <Link href={navHomebuildSearchUrl("swipe")} className="flex flex-col items-center text-gray-400">
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
