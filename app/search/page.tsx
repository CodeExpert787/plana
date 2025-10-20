"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, MapPin, Filter, Search, Clock, Heart, ArrowLeft, ArrowRight, Calendar, X, XCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import Image from "next/image"
import { ActivityDetailModal } from "@/components/activity-detail-modal"

import { ActivitiesService } from "@/lib/activities-service"
import { UserPreferencesService } from "@/lib/user-preferences-service"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next";
import "../../i18n-client";
import { ReviewService } from "@/lib/review-service"
// Mapear las actividades desde mockActivities

// Remove activities mapping from here

// Componente para la vista de swipe
function ActivitySwipeView({
  activities,
  likedActivities,
  setLikedActivities,
  userId,
  onDisliked,
}: {
  activities: any[] // Changed from typeof activities to any[] to avoid type error
  likedActivities: string[]
  setLikedActivities: (ids: string[]) => void
  userId?: string
  onDisliked?: (id: string) => void
}) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [exitX, setExitX] = useState<number>(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [dislikedActivityIds, setDislikedActivityIds] = useState<string[]>([])
  const [remainingActivities, setRemainingActivities] = useState(activities)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageIndex, setImageIndex] = useState(0)
  // Load disliked (discarded) activities from Supabase if logged in, else localStorage
  useEffect(() => {
    let cancelled = false
    const loadDisliked = async () => {
      try {
        if (userId) {
          const prefs = await UserPreferencesService.getPreferences(userId)
          if (!cancelled) setDislikedActivityIds(prefs.dislikedIds)
          return
        }
      } catch (e) {
        console.warn('Failed to load disliked from Supabase, falling back to localStorage')
      }
      try {
        const saved = localStorage.getItem('dislikedActivities')
        if (saved) {
          const ids = JSON.parse(saved)
          if (!cancelled && Array.isArray(ids)) setDislikedActivityIds(ids)
        }
      } catch (e) {
        console.warn('Failed to parse dislikedActivities from localStorage')
      }
    }
    loadDisliked()
    return () => { cancelled = true }
  }, [userId])

  // Reset and filter swipe deck whenever inputs change
  useEffect(() => {
    const filtered = activities.filter((a: any) => !likedActivities.includes(a.id) && !dislikedActivityIds.includes(a.id))
    setRemainingActivities(filtered)
    setCurrentIndex(0)
  }, [activities, likedActivities, dislikedActivityIds])

  // Ocultar las instrucciones después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Always register this effect before any early returns to keep hook order stable
  useEffect(() => {
    setImageIndex(0)
  }, [currentIndex, remainingActivities])

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      if (!remainingActivities[currentIndex]) return

      setDirection(dir)
      setExitX(dir === "left" ? -300 : 300)

      // Actualizar likes/dislikes
      const activityId = remainingActivities[currentIndex].id
      if (dir === "right") {
        const newLikedActivities = [...likedActivities]
        if (!newLikedActivities.includes(activityId)) {
          newLikedActivities.push(activityId)
        }
        setLikedActivities(newLikedActivities)
        // Persist like if logged-in
        if (userId) {
          UserPreferencesService.setPreference(userId, activityId, 'liked').catch(() => {})
        }
      } else if (dir === "left") {
        setDislikedActivityIds(prev => {
          const next = prev.includes(activityId) ? prev : [...prev, activityId]
          if (!userId) {
            localStorage.setItem('dislikedActivities', JSON.stringify(next))
          } else {
            UserPreferencesService.setPreference(userId, activityId, 'disliked').catch(() => {})
          }
          if (onDisliked) {
            try { onDisliked(activityId) } catch {}
          }
          return next
        })
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
    [currentIndex, remainingActivities, likedActivities, setLikedActivities],
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
    (e: React.MouseEvent, activityId: string) => {
      e.stopPropagation() // Evitar que el evento se propague al contenedor y active el swipe
      router.push(`/activity-detail?id=${activityId}`)
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
    <div className="relative h-[700px] w-full max-w-md mx-auto">
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
                  <>
                    <Image
                      src={currentActivity.images[imageIndex] || "/placeholder.svg"}
                      alt={currentActivity.title}
                      fill
                      className="object-cover"
                    />
                    {/* Match modal: use chevrons and dot style; remove numeric counter */}
                    {currentActivity.images.length > 1 && (
                      <>
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            const len = currentActivity.images.length
                            setImageIndex((prev) => (prev - 1 + len) % len)
                          }}
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            const len = currentActivity.images.length
                            setImageIndex((prev) => (prev + 1) % len)
                          }}
                        >
                          <ChevronRight className="w-6 h-6 z-30" />
                        </button>
                        <div className="absolute top-2 left-0 right-0 flex justify-center gap-1 z-20">
                          {currentActivity.images.map((_: string, idx: number) => (
                            <div
                              key={idx}
                              className={`h-[10px] rounded-full ${idx === imageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setImageIndex(idx)
                              }}
                              role="button"
                              aria-label={`Go to image ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-9xl opacity-30">
                    {currentActivity.emoji}
                  </div>
                )}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
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
                <h2 className="text-2xl font-bold mb-2">{currentActivity.title}</h2>

                {/* Location and duration row to match modal */}

                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1 text-emerald-300" />
                    <span>{currentActivity.location}</span>
                  </div>
                  <div className="flex items-center mb-7">
                    <Clock size={16} className="mr-1 text-emerald-300" />
                    <span>{currentActivity.duration}</span>
                  </div>


                {/* Botón */}
                <Button
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg"
                  onClick={(e) => handleBookNow(e, currentActivity.id)}
                >
                  {t("moreInformation", "Mas información")}
                </Button>
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
  likedActivities: string[]
  setLikedActivities: (ids: string[]) => void
  onActivityClick: (activity: any) => void
}) {
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "matches">("all")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState<"any" | "lt10000" | "10to20" | "20to30" | "gt30000">("any")
  const [durationFilter, setDurationFilter] = useState<"any" | "lt2" | "2to4" | "4to6" | "gt6">("any")
  const { t } = useTranslation("pages");
  // Filtrar actividades según búsqueda y pestaña activa
  const filteredActivities = useMemo(() => {
    const getDurationHours = (d: string): number => {
      const match = typeof d === 'string' ? d.match(/(\d+(?:\.\d+)?)/) : null
      return match ? parseFloat(match[1]) : 0
    }

    return activities.filter((activity: any) => {
      // Tab filter
      if (activeTab === "matches" && !likedActivities.includes(activity.id)) {
        return false
      }

      // Text search filter
      const q = searchTerm.toLowerCase()
      const matchesText =
        activity.title.toLowerCase().includes(q) ||
        activity.description.toLowerCase().includes(q) ||
        (Array.isArray(activity.tags) && activity.tags.some((tag: string) => tag.toLowerCase().includes(q)))
      if (!matchesText) return false

      // Category filter (uses internal categoryKey from activity mapping)
      if (selectedCategories.length > 0 && !selectedCategories.includes(activity.categoryKey)) {
        return false
      }

      // Price filter
      const price: number = Number(activity.price) || 0
      let priceOk = true
      if (priceFilter === "lt10000") priceOk = price < 10000
      else if (priceFilter === "10to20") priceOk = price >= 10000 && price <= 20000
      else if (priceFilter === "20to30") priceOk = price > 20000 && price <= 30000
      else if (priceFilter === "gt30000") priceOk = price > 30000
      if (!priceOk) return false

      // Duration filter (parse hours from string like "6 hours")
      const hours = getDurationHours(activity.duration)
      let durationOk = true
      if (durationFilter === "lt2") durationOk = hours < 2
      else if (durationFilter === "2to4") durationOk = hours >= 2 && hours <= 4
      else if (durationFilter === "4to6") durationOk = hours > 4 && hours <= 6
      else if (durationFilter === "gt6") durationOk = hours > 6
      if (!durationOk) return false

      return true
    })
  }, [activities, activeTab, likedActivities, searchTerm, selectedCategories, priceFilter, durationFilter])

  // Función para manejar el like/unlike de una actividad
  const toggleLike = useCallback(
    (activityId: string) => {
      if (likedActivities.includes(activityId)) {
        setLikedActivities(likedActivities.filter((id) => id !== activityId))
      } else {
        setLikedActivities([...likedActivities, activityId])
      }
    },
    [likedActivities, setLikedActivities],
  )

  const toggleCategory = useCallback((categoryKey: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryKey) ? prev.filter((k) => k !== categoryKey) : [...prev, categoryKey],
    )
  }, [])

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
            <Badge
              className={`cursor-pointer ${
                selectedCategories.includes('trekking')
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
              onClick={() => toggleCategory('trekking')}
            >
              {t("trekking")}
            </Badge>
            <Badge
              className={`cursor-pointer ${
                selectedCategories.includes('kayak')
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
              onClick={() => toggleCategory('kayak')}
            >
              {t("kayak")}
            </Badge>
            <Badge
              className={`cursor-pointer ${
                selectedCategories.includes('climbing')
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
              onClick={() => toggleCategory('climbing')}
            >
              {t("climbing")}
            </Badge>
            <Badge
              className={`cursor-pointer ${
                selectedCategories.includes('skiing')
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
              onClick={() => toggleCategory('skiing')}
            >
              {t("skiing")}
            </Badge>
            <Badge
              className={`cursor-pointer ${
                selectedCategories.includes('fishing')
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
              onClick={() => toggleCategory('fishing')}
            >
              {t("fishing")}
            </Badge>
            <Badge
              className={`cursor-pointer ${
                selectedCategories.includes('horseback')
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
              onClick={() => toggleCategory('cycling')}
            >
              {t("cycling")}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1">{t("price")}</label>
              <select
                className="w-full p-2 border rounded-md text-sm"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
              >
                <option value="any">{t("anyPrice")}</option>
                <option value="lt10000">{t("lessThan10000")}</option>
                <option value="10to20">{t("between10000And20000")}</option>
                <option value="20to30">{t("between20000And30000")}</option>
                <option value="gt30000">{t("moreThan30000")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">{t("duration")}</label>
              <select
                className="w-full p-2 border rounded-md text-sm"
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value as any)}
              >
                <option value="any">{t("anyDuration")}</option>
                <option value="lt2">{t("lessThan2Hours")}</option>
                <option value="2to4">{t("between2And4Hours")}</option>
                <option value="4to6">{t("between4And6Hours")}</option>
                <option value="gt6">{t("moreThan6Hours")}</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Button
              size="sm"
              variant="outline"
              className="mr-2"
              onClick={() => {
                setSelectedCategories([])
                setPriceFilter("any")
                setDurationFilter("any")
              }}
            >
              {t("clear")}
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setShowFilters(false)}
            >
              {t("apply")}
            </Button>
          </div>
        </div>
      )}

      {/* Mostrar mensaje cuando no hay matches */}
      {activeTab === "matches" && filteredActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center ">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filteredActivities.map((activity: any) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onActivityClick(activity)}
            >
              <div className={`aspect-[3/4] ${activity.color} relative`}>
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
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "swipe">("grid")
  const [likedActivities, setLikedActivities] = useState<string[]>([])
  const [dislikedActivities, setDislikedActivities] = useState<string[]>([])
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [seasonFilter, setSeasonFilter] = useState<"all" | "invierno" | "verano">("all")
  const [categoryFilters, setCategoryFilters] = useState<string[]>([])
  const [people, setPeople] = useState<number>(1)
  const [locationId, setLocationId] = useState<number | null>(null)
  const [locationName, setLocationName] = useState<string>("")
  const [ratingsByActivity, setRatingsByActivity] = useState<Record<string, { averageRating: number; totalReviews: number }>>({})

  const searchParams = useSearchParams()
  const [activitiesData, setActivitiesData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // Define Activity type
  type Activity = {
    id: string;
    title: string;
    description: string;
    color: string;
    emoji: string;
    price: number;
    duration: string;
    difficulty: string;
    location: string;
    category: string;
    categoryKey: string; // Internal category key for consistent filtering
    season: string;
    seasonKey: string; // Internal season key for consistent filtering
    images: string[];
    included: string[];
    notIncluded: string[];  
    locationId?: number; // Optional location ID for filtering
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

  // Category mapping for consistent filtering across languages
  const categoryMapping: Record<string, string> = {
    // Spanish categories -> internal keys
    "Trekking": "trekking",
    "Trekking Invernal": "trekking", 
    "Escalada": "climbing",
    "Esquí": "skiing",
    "Esquí Invernal": "skiing",
    "Kayak": "kayak",
    "Acuático": "kayak",
    "Pesca": "fishing",
    "Bicicleta": "cycling",
    "Parapente": "paragliding",
    "Aventura Aérea": "paragliding",
    "Cabalgata": "horseback",
    "Fotografía": "photography",
    "Camping": "camping",
    "Navegación": "navigation",
    "Observación de aves": "birdwatching",
    
    // English categories -> internal keys
    "Winter Trekking": "trekking",
    "Climbing": "climbing", 
    "Skiing": "skiing",
    "Fishing": "fishing",
    "Cycling": "cycling",
    "Paragliding": "paragliding",
    "Aerial Adventure": "paragliding",
    "Horseback riding": "horseback",
    "Photography": "photography",
    "Navigation": "navigation",
    "Birdwatching": "birdwatching",
  };

  // Season mapping for consistent filtering across languages
  const seasonMapping: Record<string, string> = {
    // Spanish seasons -> internal keys
    "invierno": "winter",
    "verano": "summer",
    "otoño": "autumn",
    "primavera": "spring",
    
    // English seasons -> internal keys
    "winter": "winter",
    "summer": "summer", 
    "autumn": "autumn",
    "spring": "spring",
  };

const activities: Activity[] = useMemo(() =>
  activitiesData.map((activity: any): Activity => {
    // Get the internal category key for consistent filtering
    const categoryKey = categoryMapping[activity.category] || "other";
    // Get the internal season key for consistent filtering
    const seasonKey = seasonMapping[activity.season] || "other";
    const ratingInfo = ratingsByActivity[activity.id] || { averageRating: 0, totalReviews: 0 }

    return {
      id: activity.id, // Keep as string since database uses TEXT
      title: activity.title,
      description: activity.description,
      location: activity.location,
      color:
        categoryKey === "skiing"
          ? "bg-sky-500"
          : categoryKey === "trekking"
          ? "bg-emerald-500"
          : categoryKey === "kayak"
          ? "bg-blue-500"
          : categoryKey === "climbing"
          ? "bg-amber-500"
          : categoryKey === "fishing"
          ? "bg-cyan-600"
          : categoryKey === "cycling"
          ? "bg-green-500"
          : categoryKey === "paragliding"
          ? "bg-purple-500"
          : "bg-gray-500",
      emoji:
        categoryKey === "skiing"
          ? "⛷️"
          : categoryKey === "trekking"
          ? "🥾"
          : categoryKey === "kayak"
          ? "🚣"
          : categoryKey === "climbing"
          ? "🧗"
          : categoryKey === "fishing"
          ? "🎣"
          : categoryKey === "cycling"
          ? "🚵"
          : categoryKey === "paragliding"
          ? "🪂"
          : "🏔️",
      price: typeof activity.price === "number" ? activity.price : Number.parseFloat(activity.price),
      duration: activity.duration,
      difficulty: activity.difficulty,
      category: activity.category,
      categoryKey: categoryKey,
      season: activity.season,
      seasonKey: seasonKey,
      images: activity.images || [activity.image],
      included: activity.included || [],
      notIncluded: activity.not_included || [],
      guide: {
        name: activity.guide_name,
        initials: activity.guide_name
          .split(" ")
          .map((n: string) => n[0])
          .join(""),
        emoji:
          categoryKey === "skiing"
            ? "⛷️"
            : categoryKey === "trekking"
            ? "🥾"
            : categoryKey === "kayak"
            ? "🚣"
            : categoryKey === "climbing"
            ? "🧗"
            : categoryKey === "fishing"
            ? "🎣"
            : categoryKey === "cycling"
            ? "🚵"
            : categoryKey === "paragliding"
            ? "🪂"
            : "🏔️",
        color:
          categoryKey === "skiing"
            ? "bg-sky-500"
            : categoryKey === "trekking"
            ? "bg-emerald-500"
            : categoryKey === "kayak"
            ? "bg-blue-500"
            : categoryKey === "climbing"
            ? "bg-amber-500"
            : categoryKey === "fishing"
            ? "bg-cyan-600"
            : categoryKey === "cycling"
            ? "bg-green-500"
            : categoryKey === "paragliding"
            ? "bg-purple-500"
            : "bg-gray-500",
        rating:  ratingInfo.averageRating,
        reviews: ratingInfo.totalReviews, 
        verified: true,
      },
      tags: [activity.category, ...(activity.requirements ? activity.requirements.slice(0, 2) : [])],
    };
  }),
[activitiesData, ratingsByActivity]);

  // Fetch ratings for all activities once activitiesData is loaded
  useEffect(() => {
    if (!activitiesData || activitiesData.length === 0) return
    let isCancelled = false

    const fetchAllRatings = async () => {
      try {
        const entries = await Promise.all(
          activitiesData.map(async (activity: any) => {
            const { averageRating, totalReviews } = await ReviewService.getActivityAverageRating(activity.id)
            return [activity.id, { averageRating, totalReviews }] as const
          })
        )

        if (isCancelled) return

        const map: Record<string, { averageRating: number; totalReviews: number }> = {}
        for (const [id, info] of entries) {
          map[id] = info
        }
        setRatingsByActivity(map)
      } catch (err) {
        console.error('Failed to load activity ratings', err)
        setRatingsByActivity({})
      }
    }

    fetchAllRatings()
    return () => { isCancelled = true }
  }, [activitiesData])

  // Filtrar actividades según temporada y categoría (no excluye likes/dislikes)
  const baseFilteredActivities = useMemo(() => {
    return activities.filter((activity: Activity) => {
      // Filtro de temporada - use seasonKey for consistent filtering
      if (seasonFilter !== "all") {
        const seasonKey = seasonMapping[seasonFilter] || seasonFilter
        if (activity.seasonKey !== seasonKey) {
          return false
        }
      }

      // Filtro de categoría - use categoryKey for consistent filtering
      if (categoryFilters.length > 0 && !categoryFilters.includes(activity.categoryKey)) {
        return false
      }

      // Filtro de ubicación (si tienes locationId en las actividades)
      if (locationId && activity.locationId && activity.locationId !== locationId) {
        return false
      }
      return true
    })
  }, [activities, seasonFilter, categoryFilters, locationId])

  // Para swipe: excluir actividades ya likeadas o descartadas
  const swipeCandidateActivities = useMemo(() => {
    return baseFilteredActivities.filter((activity: Activity) => {
      if (likedActivities.includes(activity.id) || dislikedActivities.includes(activity.id)) {
        return false
      }
      return true
    })
  }, [baseFilteredActivities, likedActivities, dislikedActivities])

  // Detectar el parámetro de URL para establecer la vista inicial y obtener la fecha
  useEffect(() => {
    const viewParam = searchParams.get("view")
    const dateParam = searchParams.get("date")
    const seasonParam = searchParams.get("season")
    const peopleParam = searchParams.get("people")
    const categoriesParam = searchParams.get("categories")
    console.log("searchParams", viewParam, dateParam, seasonParam, peopleParam, categoriesParam)
    // Handle view mode
    if (viewParam === "swipe") {
      setViewMode("swipe")
    }

    // Handle date
    if (dateParam) {
      setSelectedDate(new Date(dateParam))
    }

    // Handle season - map to internal keys for consistent filtering
    if (seasonParam) {
      const seasonKey = seasonMapping[seasonParam] || seasonParam
      // Map internal key back to display value for state
      const displaySeason = Object.keys(seasonMapping).find(key => seasonMapping[key] === seasonKey) || seasonParam
      console.log("displaySeason", displaySeason)
      // Map English season names to Spanish for state consistency
      if (displaySeason === "winter") {
        setSeasonFilter("invierno")
      } else if (displaySeason === "summer") {
        setSeasonFilter("verano")
      } else if (displaySeason === "invierno" || displaySeason === "verano") {
        setSeasonFilter(displaySeason as "all" | "invierno" | "verano")
      }
    }

    // Handle people count
    if (peopleParam) {
      const peopleCount = parseInt(peopleParam, 10)
      if (!isNaN(peopleCount) && peopleCount > 0) {
        setPeople(peopleCount)
      }
    }

    // Handle categories (parse comma-separated values and map to internal keys)
    if (categoriesParam) {
      const categories = decodeURIComponent(categoriesParam).split(',').map(cat => cat.trim())
      // Map translated category names to internal keys
      const mappedCategories = categories.map(cat => {
        // First try direct mapping
        if (categoryMapping[cat]) {
          return categoryMapping[cat]
        }
        // Then try reverse mapping (internal key -> internal key)
        const reverseMapping = Object.entries(categoryMapping).find(([_, key]) => key === cat)
        return reverseMapping ? reverseMapping[1] : cat
      }).filter(Boolean)
      setCategoryFilters(mappedCategories)
    }

  }, [searchParams]) // Add searchParams as dependency

  // Load activities from database
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true)
        const activities = await ActivitiesService.getAllActivities()
        console.log('Loaded activities from database:', activities)
        setActivitiesData(activities)
      } catch (error) {
        console.error('Error loading activities:', error)
        setActivitiesData([])
      } finally {
        setLoading(false)
      }
    }
    
    loadActivities()
  }, [])

  // Load likes/dislikes from Supabase if logged-in, otherwise localStorage
  useEffect(() => {
    let cancelled = false
    const loadPrefs = async () => {
      try {
        if (user?.id) {
          const prefs = await UserPreferencesService.getPreferences(user.id)
          if (!cancelled) {
            setLikedActivities(prefs.likedIds)
            setDislikedActivities(prefs.dislikedIds)
          }
        } else {
          const savedLikes = localStorage.getItem("likedActivities")
          if (!cancelled && savedLikes) setLikedActivities(JSON.parse(savedLikes))
          const savedDislikes = localStorage.getItem('dislikedActivities')
          if (!cancelled && savedDislikes) setDislikedActivities(JSON.parse(savedDislikes))
        }
      } catch (e) {
        console.warn('Failed to load preferences, falling back to localStorage', e)
        const savedLikes = localStorage.getItem("likedActivities")
        if (!cancelled && savedLikes) setLikedActivities(JSON.parse(savedLikes))
        const savedDislikes = localStorage.getItem('dislikedActivities')
        if (!cancelled && savedDislikes) setDislikedActivities(JSON.parse(savedDislikes))
      }
    }
    loadPrefs()
    return () => { cancelled = true }
  }, [user?.id])

  // Persist likes/dislikes to Supabase when logged-in; else localStorage
  useEffect(() => {
    let cancelled = false
    const persist = async () => {
      if (user?.id) {
        try {
          // No bulk endpoint; we upsert on interaction instead in swipe. This effect is a noop for Supabase
        } catch (e) {
          console.warn('Failed to persist likes to Supabase', e)
        }
      } else {
        localStorage.setItem("likedActivities", JSON.stringify(likedActivities))
        localStorage.setItem('dislikedActivities', JSON.stringify(dislikedActivities))
      }
    }
    persist()
    return () => { cancelled = true }
  }, [likedActivities, dislikedActivities, user?.id])

  // Alternar entre vistas
  const toggleViewMode = useCallback(() => {
    setViewMode(viewMode === "grid" ? "swipe" : "grid")
  }, [viewMode])

  // Manejar clic en una actividad
  const handleActivityClick = useCallback((activity: any) => {
    console.log("Activity clicked:", activity)
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }, [])

  // Manejar cambio de filtro de temporada
  const handleSeasonFilterChange = useCallback((season: "all" | "invierno" | "verano") => {
    setSeasonFilter(season)
  }, [])

  // Manejar cambio de filtro de categoría
  const handleCategoryFilterChange = useCallback((category: string) => {
    // Convert display category to internal key
    const categoryKey = categoryMapping[category] || category
    setCategoryFilters((prev) => {
      if (prev.includes(categoryKey)) {
        return prev.filter((cat) => cat !== categoryKey)
      } else {
        return [...prev, categoryKey]
      }
    })
  }, [])

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setSeasonFilter("all")
    setCategoryFilters([])
    setPeople(1)
    setLocationId(null)
    setLocationName("")
    setSelectedDate(undefined)
  }, [])

  // Obtener categorías únicas para los filtros usando useMemo
  const uniqueCategories = useMemo(() => {
    // Get unique category keys and map them to display names
    const categoryKeys = Array.from(new Set(activities.map((activity: Activity) => activity.categoryKey)))
    return categoryKeys.map(key => {
      // Find the first activity with this categoryKey to get the display name
      const activity = activities.find(a => a.categoryKey === key)
      return activity ? activity.category : key
    })
  }, [activities])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <Link href="/" className="flex items-center gap-2">
        <img src="/images/plan-a-logo-binoculars.png" alt="PLAN A Logo" className="h-8 w-auto" />
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
          {/* <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            <Button
              variant={seasonFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSeasonFilterChange("all")}
              className={seasonFilter === "all" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {t("All Seasons")}
            </Button>
            <Button
              variant={seasonFilter === "invierno" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSeasonFilterChange("invierno")}
              className={seasonFilter === "invierno" ? "bg-sky-600 hover:bg-sky-700" : ""}
            >
              {t("Winter")}
            </Button>
            <Button
              variant={seasonFilter === "verano" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSeasonFilterChange("verano")}
              className={seasonFilter === "verano" ? "bg-amber-600 hover:bg-amber-700" : ""}
            >
              {t("Summer")}
            </Button>
          </div> */}

          {/* Filtros de categoría */}
          {/* <div className="flex justify-center flex-wrap gap-2 mt-2">
            {uniqueCategories.map((category: string) => {
              // Get the category key for this display name
              const categoryKey = categoryMapping[category] || category
              return (
                <Badge
                  key={category}
                  className={`cursor-pointer ${
                    categoryFilters.includes(categoryKey)
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleCategoryFilterChange(category)}
                >
                  {category}
                </Badge>
              )
            })}
          </div> */}

          {/* Mostrar filtros activos */}
          {/* {(seasonFilter !== "all" || categoryFilters.length > 0) && (
            <div className="flex items-center mt-3">
              <span className="text-sm text-gray-500 mr-2">Filtros activos:</span>
              <div className="flex flex-wrap gap-1">
                {seasonFilter !== "all" && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                    {seasonFilter === "invierno" ? t("Winter") : seasonFilter === "verano" ? t("Summer") : seasonFilter}
                    <X size={14} className="cursor-pointer" onClick={() => setSeasonFilter("all")} />
                  </Badge>
                )}
                {categoryFilters.map((categoryKey: string) => {
                  // Find the display name for this category key
                  const activity = activities.find(a => a.categoryKey === categoryKey)
                  const displayName = activity ? activity.category : categoryKey
                  return (
                    <Badge key={categoryKey} variant="outline" className="flex items-center gap-1 bg-gray-100">
                      {displayName}
                      <X size={14} className="cursor-pointer" onClick={() => handleCategoryFilterChange(displayName)} />
                    </Badge>
                  )
                })}
                <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500" onClick={clearAllFilters}>
                  Limpiar todos
                </Button>
              </div>
            </div>
          )} */}

          {/* Mostrar parámetros de URL aplicados */}
          {/* {(people > 1 || locationName || selectedDate) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Parámetros de búsqueda:
              </h3>
              <div className="flex flex-wrap gap-2">
                {people > 1 && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    👥 {people} personas
                  </Badge>
                )}
                {locationName && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    📍 {locationName}
                  </Badge>
                )}
                {selectedDate && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    📅 {selectedDate.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Badge>
                )}
              </div>
            </div>
          )} */}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando actividades...</p>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <ActivityGridView
            activities={baseFilteredActivities}
            likedActivities={likedActivities}
            setLikedActivities={setLikedActivities}
            onActivityClick={handleActivityClick}
          />
        ) : (
          <ActivitySwipeView
            activities={swipeCandidateActivities}
            likedActivities={likedActivities}
            setLikedActivities={setLikedActivities}
            userId={user?.id}
            onDisliked={(id) => setDislikedActivities(prev => prev.includes(id) ? prev : [...prev, id])}
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
        <Link href="/filters" className="flex flex-col items-center text-emerald-600">
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
