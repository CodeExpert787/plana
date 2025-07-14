"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, MapPin, Filter, Search, Clock, Heart, ArrowLeft, ArrowRight, Calendar, X } from "lucide-react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import Image from "next/image"
import { ActivityDetailModal } from "@/components/activity-detail-modal"

import { useLocalizedActivities } from "@/hooks/useLocalizedActivities"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next";
import "../../i18n-client";
// Mapear las actividades desde mockActivities

// Remove activities mapping from here

// Componente para la vista de swipe
function ActivitySwipeView({
  activities,
  likedActivities,
  setLikedActivities,
}: {
  activities: any[] // Changed from typeof activities to any[] to avoid type error
  likedActivities: number[]
  setLikedActivities: (ids: number[]) => void
}) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [exitX, setExitX] = useState<number>(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [dislikedActivities, setDislikedActivities] = useState<number[]>([])
  const [remainingActivities, setRemainingActivities] = useState(activities)

  // Reset activities when the activities prop changes
  useEffect(() => {
    setRemainingActivities(activities)
    setCurrentIndex(0)
  }, [activities]) // Only depend on length to avoid infinite loops

  // Ocultar las instrucciones después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      if (!remainingActivities[currentIndex]) return

      setDirection(dir)
      setExitX(dir === "left" ? -300 : 300)

      // Actualizar likes/dislikes
      if (dir === "right") {
        const newLikedActivities = [...likedActivities]
        if (!newLikedActivities.includes(remainingActivities[currentIndex].id)) {
          newLikedActivities.push(remainingActivities[currentIndex].id)
        }
        setLikedActivities(newLikedActivities)
      } else if (dir === "left") {
        setDislikedActivities([...dislikedActivities, remainingActivities[currentIndex].id])
      }

      // Simular un pequeño retraso para la animación
      setTimeout(() => {
        if (currentIndex < remainingActivities.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          // No hay más actividades para mostrar
          setRemainingActivities([])
        }
        setDirection(null)
      }, 300)
    },
    [currentIndex, remainingActivities, likedActivities, setLikedActivities, dislikedActivities],
  )

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x > 100) {
        handleSwipe("right")
      } else if (info.offset.x < -100) {
        handleSwipe("left")
      }
      setSwipeDirection(null)
    },
    [handleSwipe],
  )

  const handleDrag = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 20) {
      setSwipeDirection("right")
    } else if (info.offset.x < -20) {
      setSwipeDirection("left")
    } else {
      setSwipeDirection(null)
    }
  }, [])

  const handleBookNow = useCallback(
    (e: React.MouseEvent, activityId: number) => {
      e.stopPropagation() // Evitar que el evento se propague al contenedor y active el swipe
      router.push(`/booking/${activityId}/steps`)
    },
    [router],
  )
  const { t } = useTranslation("pages");
  console.log(t)
  if (remainingActivities.length === 0 || currentIndex >= remainingActivities.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <Heart className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">{t("noMoreActivities1")}</h2>
        <p className="text-gray-600 mb-6 max-w-xs">
          {t("noMoreActivities")}
        </p>
        <Button
          onClick={() => {
            setRemainingActivities([...activities])
            setCurrentIndex(0)
          }}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {t("seeMoreActivities")}
        </Button>
      </div>
    )
  }

  const currentActivity = remainingActivities[currentIndex]

  return (
    <div className="relative h-[70vh] w-full max-w-md mx-auto">
      <AnimatePresence>
        {direction === null && currentActivity && (
          <motion.div
            key={currentActivity.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              x: exitX,
              opacity: 0,
              scale: 0.8,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl">
              <div className={`absolute inset-0 ${currentActivity.color}`}>
                {currentActivity.images && currentActivity.images.length > 0 ? (
                  <Image
                    src={currentActivity.images[0] || "/placeholder.svg"}
                    alt={currentActivity.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-9xl opacity-30">
                    {currentActivity.emoji}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Instrucciones en la parte superior */}
              <AnimatePresence>
                {showInstructions && (
                  <motion.div
                    className="absolute top-4 left-0 right-0 flex justify-center z-20"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white shadow-lg">
                      <span className="flex items-center">
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
                          className="mr-1"
                        >
                          <path d="M14 9l6 6-6 6" />
                          <path d="M10 21l-6-6 6-6" />
                        </svg>
                        Desliza para explorar actividades
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Indicadores de swipe */}
              {swipeDirection === "right" && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="bg-emerald-500/70 rounded-full p-8">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                </div>
              )}

              {swipeDirection === "left" && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="bg-red-500/70 rounded-full p-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <line x1="12" y1="5" x2="12" y2="19" />
                    </svg>
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">{currentActivity.title}</h2>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">
                    ${currentActivity.price.toLocaleString()}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {currentActivity.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-white border-white/50">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center mb-3 text-white/90">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Bariloche, Argentina</span>
                </div>

                <p className="mb-3 text-white/90">{currentActivity.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="mr-4">
                      <span className="font-semibold">Duración:</span> {currentActivity.duration}
                    </span>
                    <span>
                      <span className="font-semibold">Dificultad:</span> {currentActivity.difficulty}
                    </span>
                  </div>
                </div>

                {/* Botón de Reserva */}
                <Button
                  className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2"
                  onClick={(e) => handleBookNow(e, currentActivity.id)}
                >
                  <Calendar className="w-4 h-4" />
                  Reservar ahora
                </Button>

                <div className="flex items-center mt-4 pt-4 border-t border-white/20">
                  <div
                    className={`h-10 w-10 rounded-full ${currentActivity.guide.color} flex items-center justify-center text-white text-xl border-2 border-white`}
                  >
                    {currentActivity.guide.emoji}
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <p className="font-medium">{currentActivity.guide.name}</p>
                      {currentActivity.guide.verified && (
                        <Badge className="ml-2 bg-blue-500 hover:bg-blue-600 text-xs">Verificado</Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{currentActivity.guide.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{currentActivity.guide.reviews} reseñas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botones de acción */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => handleSwipe("left")}
          className="w-16 h-16 rounded-full bg-white border border-red-400 flex items-center justify-center shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <path d="M18 6 6 18" />
            <path d="M6 6 18 18" />
          </svg>
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="w-16 h-16 rounded-full bg-white border border-emerald-400 flex items-center justify-center shadow-md"
        >
          <Heart className="w-8 h-8 text-emerald-500" />
        </button>
      </div>
    </div>
  )
}

// Componente para la vista de cuadrícula
function ActivityGridView({
  activities,
  likedActivities,
  setLikedActivities,
  onActivityClick,
}: {
  activities: any[] // Changed from typeof activities to any[] to avoid type error
  likedActivities: number[]
  setLikedActivities: (ids: number[]) => void
  onActivityClick: (activity: any) => void
}) {
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "matches">("all")
  const { t } = useTranslation("pages");
  // Filtrar actividades según búsqueda y pestaña activa
  const filteredActivities = useMemo(() => {
    return activities.filter(
      (activity: any) =>
        (activeTab === "all" || (activeTab === "matches" && likedActivities.includes(activity.id))) &&
        (activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
    )
  }, [activities, activeTab, likedActivities, searchTerm])

  // Función para manejar el like/unlike de una actividad
  const toggleLike = useCallback(
    (activityId: number) => {
      if (likedActivities.includes(activityId)) {
        setLikedActivities(likedActivities.filter((id) => id !== activityId))
      } else {
        setLikedActivities([...likedActivities, activityId])
      }
    },
    [likedActivities, setLikedActivities],
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex p-1 bg-gray-100 rounded-full">
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-full ${
              activeTab === "all" ? "bg-emerald-600 text-white" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("all")}
          >
            {t("all")}
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-full ${
              activeTab === "matches" ? "bg-emerald-600 text-white" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("matches")}
          >
            {t("myMatches")}
          </button>
        </div>
        <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setShowFilters(!showFilters)}>
          <Filter size={18} />
        </Button>
      </div>

      <div className="relative flex-1 mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Buscar actividades, lugares..."
          className="pl-10 pr-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium mb-3">{t("filters")}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer">{t("trekking")}</Badge>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer">{t("kayak")}</Badge>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer">{t("climbing")}</Badge>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer">{t("skiing")}</Badge>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer">{t("fishing")}</Badge>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer">{t("horseback")}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1">{t("price")}</label>
              <select className="w-full p-2 border rounded-md text-sm">
                <option>{t("anyPrice")}</option>
                <option>{t("lessThan10000")}</option>
                <option>{t("between10000And20000")}</option>
                <option>{t("between20000And30000")}</option>
                <option>{t("moreThan30000")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">{t("duration")}</label>
              <select className="w-full p-2 border rounded-md text-sm">
                <option>{t("anyDuration")}</option>
                <option>{t("lessThan2Hours")}</option>
                <option>{t("between2And4Hours")}</option>
                <option>{t("between4And6Hours")}</option>
                <option>{t("moreThan6Hours")}</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Button size="sm" variant="outline" className="mr-2">
              {t("clear")}
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              {t("apply")}
            </Button>
          </div>
        </div>
      )}

      {/* Mostrar mensaje cuando no hay matches */}
      {activeTab === "matches" && filteredActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">{t("noMatches")}</h3>
          <p className="text-gray-600 max-w-xs">
            {t("exploreActivities")}
          </p>
          <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => setActiveTab("all")}>
            {t("discoverActivities")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredActivities.map((activity: any) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onActivityClick(activity)}
            >
              <div className={`h-40 ${activity.color} relative`}>
                {activity.images && activity.images.length > 0 ? (
                  <Image
                    src={activity.images[0] || "/placeholder.svg"}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-7xl">{activity.emoji}</span>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 m-2">
                  <Badge className="bg-white text-emerald-700">${activity.price.toLocaleString()}</Badge>
                </div>
                <button
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/20 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike(activity.id)
                  }}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      likedActivities.includes(activity.id) ? "fill-red-500 text-red-500" : "text-white"
                    }`}
                  />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{activity.title}</h3>

                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <MapPin size={14} className="mr-1" />
                  <span className="truncate">{t("location")}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock size={14} className="mr-1" />
                  <span>{activity.duration}</span>
                  <span className="mx-1">•</span>
                  <span>{activity.difficulty}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`h-6 w-6 rounded-full ${activity.guide.color} flex items-center justify-center text-white text-xs mr-1`}
                    >
                      {activity.guide.emoji}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-xs font-medium">{activity.guide.rating}</span>
                      <span className="ml-1 text-xs text-gray-500">({activity.guide.reviews})</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activity.tags.slice(0, 1).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Página principal que alterna entre las dos vistas
export default function SearchPage() {
  const { t } = useTranslation("pages");
  const [viewMode, setViewMode] = useState<"grid" | "swipe">("grid")
  const [likedActivities, setLikedActivities] = useState<number[]>([])
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [seasonFilter, setSeasonFilter] = useState<"all" | "invierno" | "verano">("all")
  const [categoryFilters, setCategoryFilters] = useState<string[]>([])

  const searchParams = useSearchParams()
  const activitiesData = useLocalizedActivities();
  // Define Activity type
  type Activity = {
    id: number;
    title: string;
    description: string;
    color: string;
    emoji: string;
    price: number;
    duration: string;
    difficulty: string;
    category: string;
    season: string;
    images: string[];
    guide: {
      name: string;
      initials: string;
      emoji: string;
      color: string;
      rating: number;
      reviews: number;
      verified: boolean;
    };
    tags: string[];
  };

  // Map activities with t inside useMemo
// Example inside your SearchPage component:
const activities: Activity[] = useMemo(() =>
  activitiesData.map((activity: any): Activity => ({
    id: Number.parseInt(activity.id),
    title: activity.title,
    description: activity.description,
    color:
      activity.category === t("skiing") || activity.category === t("skiingInvernal")
        ? "bg-sky-500"
        : activity.category === t("trekking") || activity.category === t("trekkingInvernal")
        ? "bg-emerald-500"
        : activity.category === t("acuatic") || activity.category === t("kayak")
        ? "bg-blue-500"
        : activity.category === t("climbing")
        ? "bg-amber-500"
        : activity.category === t("fishing")
        ? "bg-cyan-600"
        : activity.category === t("cycling")
        ? "bg-green-500"
        : activity.category === t("paragliding")
        ? "bg-purple-500"
        : "bg-gray-500",
    emoji:
      activity.category === t("skiing") || activity.category === t("skiingInvernal")
        ? "⛷️"
        : activity.category === t("trekking") || activity.category === t("trekkingInvernal")
        ? "🥾"
        : activity.category === t("acuatic") || activity.category === t("kayak")
        ? "🚣"
        : activity.category === t("climbing")
        ? "🧗"
        : activity.category === t("fishing")
        ? "🎣"
        : activity.category === t("cycling")
        ? "🚵"
        : activity.category === t("paragliding")
        ? "🪂"
        : "🏔️",
    price: typeof activity.price === "number" ? activity.price : Number.parseInt(activity.price),
    duration: activity.duration,
    difficulty: activity.difficulty,
    category: activity.category,
    season: activity.season,
    images: activity.images || [activity.image],
    guide: {
      name: activity.guide.name,
      initials: activity.guide.name
        .split(" ")
        .map((n: string) => n[0])
        .join(""),
      emoji:
        activity.category === t("skiing")
          ? "⛷️"
          : activity.category === t("trekking") || activity.category === t("trekkingInvernal")
          ? "🥾"
          : activity.category === t("acuatic") || activity.category === t("kayak")
          ? "🚣"
          : activity.category === t("climbing")
          ? "🧗"
          : activity.category === t("fishing")
          ? "🎣"
          : activity.category === t("cycling")
          ? "🚵"
          : activity.category === t("paragliding")
          ? "🪂"
          : "🏔️",
      color:
        activity.category === t("skiing") || activity.category === t("skiingInvernal")
          ? "bg-sky-500"
          : activity.category === t("trekking") || activity.category === t("trekkingInvernal")
          ? "bg-emerald-500"
          : activity.category === t("acuatic") || activity.category === t("kayak")
          ? "bg-blue-500"
          : activity.category === t("climbing")
          ? "bg-amber-500"
          : activity.category === t("fishing")
          ? "bg-cyan-600"
          : activity.category === t("cycling")
          ? "bg-green-500"
          : activity.category === t("paragliding")
          ? "bg-purple-500"
          : "bg-gray-500",
      rating: activity.rating,
      reviews: Math.floor(Math.random() * 100) + 20,
      verified: true,
    },
    tags: [activity.category, ...(activity.requirements ? activity.requirements.slice(0, 2) : [])],
  })),
[t, activitiesData]);

  // Filtrar actividades según temporada y categoría usando useMemo
  const filteredActivities = useMemo(() => {
    return activities.filter((activity: Activity) => {
      // Filtro de temporada
      if (seasonFilter !== "all" && activity.season !== seasonFilter) {
        return false
      }

      // Filtro de categoría
      if (categoryFilters.length > 0 && !categoryFilters.includes(activity.category)) {
        return false
      }

      return true
    })
  }, [activities, seasonFilter, categoryFilters])

  // Detectar el parámetro de URL para establecer la vista inicial y obtener la fecha
  useEffect(() => {
    const viewParam = searchParams.get("view")
    const dateParam = searchParams.get("date")
    const seasonParam = searchParams.get("season")

    if (viewParam === "swipe") {
      setViewMode("swipe")
    }

    if (dateParam) {
      setSelectedDate(new Date(dateParam))
    }

    if (seasonParam === t("winter") || seasonParam === t("summer")) {
      setSeasonFilter(seasonParam as "all" | "invierno" | "verano")
    }
  }, []) // Remove searchParams dependency to avoid infinite loop

  // Cargar actividades likeadas desde localStorage al iniciar
  useEffect(() => {
    const savedLikes = localStorage.getItem("likedActivities")
    if (savedLikes) {
      setLikedActivities(JSON.parse(savedLikes))
    }
  }, [])

  // Guardar actividades likeadas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("likedActivities", JSON.stringify(likedActivities))
  }, [likedActivities])

  // Alternar entre vistas
  const toggleViewMode = useCallback(() => {
    setViewMode(viewMode === "grid" ? "swipe" : "grid")
  }, [viewMode])

  // Manejar clic en una actividad
  const handleActivityClick = useCallback((activity: any) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }, [])

  // Manejar cambio de filtro de temporada
  const handleSeasonFilterChange = useCallback((season: "all" | "invierno" | "verano") => {
    setSeasonFilter(season)
  }, [])

  // Manejar cambio de filtro de categoría
  const handleCategoryFilterChange = useCallback((category: string) => {
    setCategoryFilters((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category)
      } else {
        return [...prev, category]
      }
    })
  }, [])

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setSeasonFilter("all")
    setCategoryFilters([])
  }, [])

  // Obtener categorías únicas para los filtros usando useMemo
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(activities.map((activity: Activity) => activity.category)))
  }, [activities])

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
          <Button onClick={toggleViewMode} variant="outline" className="flex items-center gap-1">
            {viewMode === "grid" ? (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>Swipe</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                <span>{t("grid")}</span>
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="p-4 flex-1">
        {/* Filtros de temporada */}
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={seasonFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSeasonFilterChange("all")}
              className={seasonFilter === "all" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {t("All Seasons")}
            </Button>
            <Button
              variant={seasonFilter === t("winter") ? "default" : "outline"}
              size="sm"
              onClick={() => handleSeasonFilterChange("invierno")}
              className={seasonFilter === t("winter") ? "bg-sky-600 hover:bg-sky-700" : ""}
            >
              {t("Winter")}
            </Button>
            <Button
              variant={seasonFilter === t("summer") ? "default" : "outline"}
              size="sm"
              onClick={() => handleSeasonFilterChange("verano")}
              className={seasonFilter === t("summer") ? "bg-amber-600 hover:bg-amber-700" : ""}
            >
              {t("Summer")}
            </Button>
          </div>

          {/* Filtros de categoría */}
          <div className="flex flex-wrap gap-2 mt-2">
            {uniqueCategories.map((category: string) => (
              <Badge
                key={category}
                className={`cursor-pointer ${
                  categoryFilters.includes(category)
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleCategoryFilterChange(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Mostrar filtros activos */}
          {(seasonFilter !== "all" || categoryFilters.length > 0) && (
            <div className="flex items-center mt-3">
              <span className="text-sm text-gray-500 mr-2">Filtros activos:</span>
              <div className="flex flex-wrap gap-1">
                {seasonFilter !== "all" && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                    {seasonFilter === "invierno" ? "Invierno" : "Verano"}
                    <X size={14} className="cursor-pointer" onClick={() => setSeasonFilter("all")} />
                  </Badge>
                )}
                {categoryFilters.map((category: string) => (
                  <Badge key={category} variant="outline" className="flex items-center gap-1 bg-gray-100">
                    {category}
                    <X size={14} className="cursor-pointer" onClick={() => handleCategoryFilterChange(category)} />
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500" onClick={clearAllFilters}>
                  Limpiar todos
                </Button>
              </div>
            </div>
          )}
        </div>

        {viewMode === "grid" ? (
          <ActivityGridView
            activities={filteredActivities}
            likedActivities={likedActivities}
            setLikedActivities={setLikedActivities}
            onActivityClick={handleActivityClick}
          />
        ) : (
          <ActivitySwipeView
            activities={filteredActivities}
            likedActivities={likedActivities}
            setLikedActivities={setLikedActivities}
          />
        )}
      </div>

      <nav className="flex items-center justify-around p-4 bg-white border-t mt-auto">
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
            <path d="M22 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          <span className="text-xs mt-1">{t("home")}</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center text-emerald-600">
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
            <path d="M21 21L16.65 16.65" />
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
          <span className="text-xs mt-1">{t("profile")}</span>
        </Link>
      </nav>

      {/* Modal de detalles de actividad */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  )
}
