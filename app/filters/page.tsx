"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, MapPin, Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SupabaseStatus } from "@/components/supabase-status"
import { EnvDiagnostics } from "@/components/env-diagnostics"
import { useTranslation } from "react-i18next"
import "../../i18n-client"

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

export default function FiltersPage() {
  const { t } = useTranslation("pages")
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

  // Función para formatear fechas
  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "dd/MM/yyyy", { locale: es })
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
    if (selectedDate) {
      params.append("date", selectedDate.toISOString())
    }
    params.append("people", people.toString())

    // Añadir temporada
    params.append("season", season === "winter" ? t("winter") : t("summer"))

    // Añadir categorías seleccionadas
    const selectedCategories = []
    if (trekking) selectedCategories.push(t("trekking"))
    if (escalada) selectedCategories.push(t("climbing"))
    if (esqui) selectedCategories.push(t("skiing"))
    if (bicicleta) selectedCategories.push(t("cycling"))
    if (kayak) selectedCategories.push(t("kayak"))
    if (pesca) selectedCategories.push(t("fishing"))
    if (parapente) selectedCategories.push(t("paragliding"))

    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","))
    }

    // Añadir ubicación seleccionada
    params.append("location", location.id.toString())
    params.append("locationName", location.name)

    return `/search?${params.toString()}`
  }

  return (
    <main className="flex flex-col min-h-screen">

      <header className="flex items-center justify-between p-4 border-b bg-white">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/plan-a-logo-binoculars.png" alt="PLAN A Logo" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <button className="p-2 rounded-full hover:bg-gray-100">
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
                className="text-gray-600"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </Link>
          <button className="p-2 rounded-full hover:bg-gray-100">
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
              className="text-gray-600"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
        </div>
      </header>
      <div className="flex-1 p-4 bg-gradient-to-b from-emerald-50 to-sky-50">
        <div className="max-w-md mx-auto">
          {/* <SupabaseStatus />
          <EnvDiagnostics /> */}
          {/* El resto del contenido existente... */}
          <Card className="p-5 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
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
                className="mr-2 text-emerald-600"
              >
                <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.9 4.9 1.4 1.4" />
                <path d="m17.7 17.7 1.4 1.4" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.3 17.7-1.4 1.4" />
                <path d="m19.1 4.9-1.4 1.4" />
              </svg>
              {t("season", "Season")}
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                className={`p-3 rounded-lg border-2 ${
                  season === "winter"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-600"
                } font-medium flex flex-col items-center`}
                onClick={() => setSeason("winter")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-1"
                >
                  <path d="M2 12h20" />
                  <path d="M12 2v20" />
                  <path d="m4.93 4.93 14.14 14.14" />
                  <path d="m19.07 4.93-14.14 14.14" />
                </svg>
                {t("winter", "Winter")}
              </button>
              <button
                className={`p-3 rounded-lg border-2 ${
                  season === "summer"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-600"
                } font-medium flex flex-col items-center`}
                onClick={() => setSeason("summer")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-1"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
                {t("summer", "Summer")}
              </button>
            </div>

            <div className="mb-2 text-sm text-gray-500">{t("date", "Date")}</div>
            <div className="mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5">
                      {formatDate(selectedDate)}
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </Card>

          <Card className="p-5 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
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
                className="mr-2 text-emerald-600"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {t("people", "People")}
            </h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-2">{t("numberOfPeople", "Number of people")}</label>
              <div className="flex items-center justify-between">
                <button
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  onClick={() => changePeople(false)}
                  disabled={people <= 1}
                >
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
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <span className="text-xl font-bold">{people}</span>
                <button
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  onClick={() => changePeople(true)}
                  disabled={people >= 10}
                >
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
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </button>
              </div>
            </div>
          </Card>

          {/* <Card className="p-5 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
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
                className="mr-2 text-emerald-600"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              {t("location", "Location")}
            </h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-2">{t("maxDistance", "Maximum distance from my location")}</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-3">0km</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={distance}
                  onChange={(e) => setDistance(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-gray-500 ml-3">100km</span>
              </div>
              <div className="text-center mt-1 text-sm font-medium">{distance} km</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-2">{t("myLocation", "My location")}</label>

             
              <button
                onClick={openLocationDialog}
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg pl-10 p-2.5 flex justify-between items-center hover:bg-gray-50 transition-colors relative"
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                <span className="truncate text-left">{location.name}</span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full ml-2 flex-shrink-0">
                  {location.region}
                </span>
              </button>

              <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("selectReference", "Select reference point")}</DialogTitle>
                  </DialogHeader>
                  <div className="relative mb-4">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      placeholder={t("searchLocation", "Search location or region...")}
                      className="pl-8 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                    {searchLocation && (
                      <button
                        onClick={() => setSearchLocation("")}
                        className="absolute right-2 top-2.5 h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div className="h-[300px] overflow-y-auto">
                    {filteredLocations.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">{t("noLocations", "No locations found")}</div>
                    ) : (
                      <div className="space-y-1">
                        {filteredLocations.map((loc) => (
                          <button
                            key={loc.id}
                            className={`w-full flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
                              location.id === loc.id ? "bg-emerald-50 border border-emerald-200" : ""
                            }`}
                            onClick={() => selectLocation(loc)}
                          >
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-emerald-600 flex-shrink-0" />
                              <span className="text-left">{loc.name}</span>
                            </div>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full ml-2 flex-shrink-0">
                              {loc.region}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card> */}

          <Card className="p-5 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
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
                className="mr-2 text-emerald-600"
              >
                <path d="M12 22a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
                <path d="M12 2v7" />
                <path d="m4.9 4.9 3.53 3.53" />
                <path d="M2 13h1.4" />
                <path d="M20.6 13H22" />
                <path d="m15.57 8.43 3.53-3.53" />
              </svg>
              {t("activity", "Activity")}
            </h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-2">{t("duration", "Duration")}</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-3">1h</span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={duration}
                  onChange={(e) => setDuration(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-gray-500 ml-3">12h+</span>
              </div>
              <div className="text-center mt-1 text-sm font-medium">{duration} {t("hours", "hours")}</div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">{t("activityType", "Activity type")}</label>
              <div className="grid grid-cols-2 gap-2">
                {/* Opciones siempre visibles */}
                <div className="flex items-center">
                  <input
                    id="trekking"
                    type="checkbox"
                    checked={trekking}
                    onChange={() => setTrekking(!trekking)}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="trekking" className="ml-2 text-sm font-medium text-gray-700">{t("trekking", "Trekking")}</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="escalada"
                    type="checkbox"
                    checked={escalada}
                    onChange={() => setEscalada(!escalada)}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="escalada" className="ml-2 text-sm font-medium text-gray-700">{t("climbing", "Climbing")}</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="esqui"
                    type="checkbox"
                    checked={esqui}
                    onChange={() => setEsqui(!esqui)}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="esqui" className="ml-2 text-sm font-medium text-gray-700">{t("skiing", "Skiing")}</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="bicicleta"
                    type="checkbox"
                    checked={bicicleta}
                    onChange={() => setBicicleta(!bicicleta)}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="bicicleta" className="ml-2 text-sm font-medium text-gray-700">{t("cycling", "Cycling")}</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="kayak"
                    type="checkbox"
                    checked={kayak}
                    onChange={() => setKayak(!kayak)}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="kayak" className="ml-2 text-sm font-medium text-gray-700">{t("kayak", "Kayak")}</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="pesca"
                    type="checkbox"
                    checked={pesca}
                    onChange={() => setPesca(!pesca)}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="pesca" className="ml-2 text-sm font-medium text-gray-700">{t("fishing", "Fishing")}</label>
                </div>

                {/* Opciones adicionales que se muestran/ocultan */}
                {showMoreActivities && (
                  <>
                    <div className="flex items-center">
                      <input
                        id="parapente"
                        type="checkbox"
                        checked={parapente}
                        onChange={() => setParapente(!parapente)}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="parapente" className="ml-2 text-sm font-medium text-gray-700">{t("paragliding", "Paragliding")}</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="cabalgata"
                        type="checkbox"
                        checked={cabalgata}
                        onChange={() => setCabalgata(!cabalgata)}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="cabalgata" className="ml-2 text-sm font-medium text-gray-700">{t("horseback", "Horseback riding")}</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="fotografia"
                        type="checkbox"
                        checked={fotografia}
                        onChange={() => setFotografia(!fotografia)}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="fotografia" className="ml-2 text-sm font-medium text-gray-700">{t("photography", "Photography")}</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="camping"
                        type="checkbox"
                        checked={camping}
                        onChange={() => setCamping(!camping)}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="camping" className="ml-2 text-sm font-medium text-gray-700">{t("camping", "Camping")}</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="navegacion"
                        type="checkbox"
                        checked={navegacion}
                        onChange={() => setNavegacion(!navegacion)}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="navegacion" className="ml-2 text-sm font-medium text-gray-700">{t("navigation", "Navigation")}</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="observacionAves"
                        type="checkbox"
                        checked={observacionAves}
                        onChange={() => setObservacionAves(!observacionAves)}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="observacionAves" className="ml-2 text-sm font-medium text-gray-700">{t("birdwatching", "Birdwatching")}</label>
                    </div>
                  </>
                )}
              </div>

              {/* Botón para mostrar/ocultar más opciones */}
              <button
                className="w-full text-sm text-emerald-600 mt-2 flex items-center justify-center hover:underline"
                onClick={toggleMoreActivities}
              >
                {showMoreActivities ? t("seeLess", "See fewer options") : t("seeMore", "See more options")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  {showMoreActivities ? <path d="m18 15-6-6-6 6" /> : <path d="m6 9 6 6 6-6" />}
                </svg>
              </button>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Link href={buildSearchUrl("swipe")}>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 py-6">
                {t("searchActivities", "Search Activities")}
              </Button>
            </Link>
            <Link
              href={`/map?date=${selectedDate?.toISOString()}&people=${people}&season=${season === "winter" ? t("winter") : t("summer")}&location=${location.id}&locationName=${encodeURIComponent(location.name)}`}
            >
              <Button className="w-full bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-6 flex items-center justify-center">
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
                  className="mr-2"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {t("viewMap", "View Map")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <nav className="flex items-center justify-around p-4 bg-white border-t">
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
        {/* Modificado: Ahora el botón de perfil en la navegación inferior enlaza a la página de perfil/create */}
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
      </nav>
    </main>
  )
}
