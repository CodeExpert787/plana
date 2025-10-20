"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Calendar as CalendarIcon, Clock, Heart, Settings, LogOut, ChevronRight, Edit, Camera } from "lucide-react"
import { useRef } from "react"
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/protected-route";
import { UserProfileService, UserProfile } from "@/lib/user-profile-service";
import { BookingService, Booking } from "@/lib/booking-service";
import { ActivitiesService } from "@/lib/activities-service";
import "../../i18n-client";


import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SupabaseStatus } from "@/components/supabase-status"
import { EnvDiagnostics } from "@/components/env-diagnostics"

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
// Actualizar los datos de ejemplo para el perfil con el nombre y la foto de Sofia

// Eliminated mock completedActivities; will derive from completedBookings

export default function ProfilePage() {
  const { t } = useTranslation("pages");
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([])
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [favoriteActivities, setFavoriteActivities] = useState<any[]>([])
  // Load favorite activities from localStorage and fetch from DB
  useEffect(() => {
    try {
      const saved = localStorage.getItem('likedActivities')
      if (!saved) {
        setFavoriteActivities([])
        setLikedIds([])
        return
      }
      const ids = JSON.parse(saved) as string[]
      if (Array.isArray(ids) && ids.length > 0) {
        setLikedIds(ids)
        ActivitiesService.getActivitiesByIds(ids).then(setFavoriteActivities).catch(err => {
          console.error('Failed to load favorite activities:', err)
          setFavoriteActivities([])
        })
      } else {
        setFavoriteActivities([])
        setLikedIds([])
      }
    } catch (e) {
      console.error('Error parsing likedActivities:', e)
      setFavoriteActivities([])
      setLikedIds([])
    }
  }, [])
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navHomebuildSearchUrl = (viewMode = "grid") => {
    const params = new URLSearchParams()
    // Añadir parámetros básicos
    params.append("view", viewMode)
    return `/search?${params.toString()}`
  }
  // Handle hash navigation to scroll to search section
  useEffect(() => {
    const handleHashNavigation = () => {
      if (window.location.hash === '#search-section') {
        const element = document.getElementById('search-section')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    // Check hash on mount
    handleHashNavigation()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation)
    
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation)
    }
  }, [])

  // Load user bookings
  const loadUserBookings = async () => {
    if (!user?.id) return

    try {
      setBookingsLoading(true)
      console.log('Loading bookings for user:', user.id)
      
      const [allBookings, completed, upcoming] = await Promise.all([
        BookingService.getUserBookings(user.id),
        BookingService.getCompletedBookings(user.id),
        BookingService.getUpcomingBookings(user.id)
      ])
      
      setBookings(allBookings)
      setCompletedBookings(completed)
      setUpcomingBookings(upcoming)
      
      console.log('Bookings loaded:', { all: allBookings.length, completed: completed.length, upcoming: upcoming.length })
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setBookingsLoading(false)
    }
  }

  // Load user profile data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) {
        console.log('No user ID available, skipping profile load')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log('Loading user profile for user ID:', user.id)
        console.log('User object:', user)
        
        // Test Supabase connection first
        const { supabase } = await import('@/lib/supabase')
        console.log('Supabase client:', supabase)
        
        let profile = await UserProfileService.getUserProfile(user.id)
        console.log('Profile fetched:', profile)
        
        if (!profile) {
          console.log('No profile found, creating new one')
          // Create initial profile if none exists
          profile = await UserProfileService.createUserProfile({
            user_id: user.id,
            name: user.user_metadata?.full_name || user.email || 'Usuario',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
            avatar: '/placeholder.svg',
            location: 'Bariloche, Argentina',
            member_since: new Date().toISOString(),
            description: 'Amante de la naturaleza y los deportes al aire libre.',
            completed_activities: 0,
            reviews: 0,
            rating: 0
          })
          console.log('New profile created:', profile)
        }
        
        setUserData(profile)
        console.log('Profile set successfully')
      } catch (error) {
        console.error('Error loading user profile:', error)
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          user: user ? { id: user.id, email: user.email } : 'No user'
        })
        
        // Fallback to initial data if there's an error
        const fallbackProfile = {
          user_id: user.id,
          name: user.user_metadata?.full_name || user.email || 'Usuario',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          avatar: '/placeholder.svg',
          location: 'Bariloche, Argentina',
          member_since: new Date().toISOString(),
          description: 'Amante de la naturaleza y los deportes al aire libre.',
          completed_activities: 0,
          reviews: 0,
          rating: 0
        }
        
        console.log('Using fallback profile:', fallbackProfile)
        setUserData(fallbackProfile)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [user?.id])

  // Load bookings when user changes
  useEffect(() => {
    if (user?.id) {
      loadUserBookings()
    }
  }, [user?.id])

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

  // Toggle favorite
  const toggleFavorite = async (activityId: string) => {
    setLikedIds(prev => {
      const exists = prev.includes(activityId)
      const next = exists ? prev.filter(id => id !== activityId) : [...prev, activityId]
      localStorage.setItem('likedActivities', JSON.stringify(next))
      if (exists) {
        // Remove from current favorites list
        setFavoriteActivities(curr => curr.filter(a => a.id !== activityId))
      } else {
        // Fetch and append newly liked activity if not present
        ActivitiesService.getActivitiesByIds([activityId])
          .then(res => {
            if (res && res.length > 0) {
              setFavoriteActivities(curr => {
                const already = curr.some(a => a.id === activityId)
                return already ? curr : [...curr, res[0]]
              })
            }
          })
          .catch(err => console.error('Failed to fetch liked activity:', err))
      }
      return next
    })
  }

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
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!userData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Error al cargar el perfil</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <Link href="/" className="flex items-center gap-2">
        <img src="/images/plan-a-logo-binoculars.png" alt="PLAN A Logo" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/profile/setting">
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
                    className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full disabled:opacity-50"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file && user?.id) {
                        try {
                          setSaving(true)
                          console.log('Starting avatar upload for user:', user.id)
                          
                          // Upload to Supabase Storage
                          console.log('Uploading file to Supabase Storage...')
                          const avatarUrl = await UserProfileService.uploadAvatar(user.id, file)
                          console.log('Avatar uploaded successfully:', avatarUrl)
                          
                          // Update user profile in database
                          console.log('Updating user profile in database...')
                          const updatedProfile = await UserProfileService.updateUserProfile(user.id, {
                            avatar: avatarUrl
                          })
                          console.log('Database updated successfully:', updatedProfile)
                          
                          // Update local state
                          setUserData(updatedProfile)
                          setAvatarPreview(avatarUrl)
                          
                          // Show success message
                          alert('Avatar updated successfully!')
                          
                          // Reload the page to ensure all data is fresh
                          console.log('Reloading page...')
                          window.location.reload()
                        } catch (error) {
                          console.error('Error uploading avatar:', error)
                          alert('Error uploading avatar. Please try again.')
                          
                          // Fallback to local preview
                          const reader = new FileReader()
                          reader.onload = (ev) => {
                            const result = ev.target?.result as string
                            setAvatarPreview(result)
                          }
                          reader.readAsDataURL(file)
                        } finally {
                          setSaving(false)
                        }
                      } else {
                        console.log('No file selected or user not authenticated')
                      }
                    }}
                  />
                </div>
              </div>
              {/* <div className="absolute top-4 right-4">
                <Link href="/profile/setting">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {t("editProfile")}
                  </Button>
                </Link>
              </div> */}
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
                  <CalendarIcon className="h-4 w-4 mr-1 text-emerald-600" />
                  <span>Miembro desde {new Date(userData.member_since).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
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
                      <span>{user?.email || userData.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">{t("phone")}</span>
                      <span>{userData.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Stats */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Estadísticas</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{userData.completed_activities}</div>
                      <div className="text-sm text-gray-500">Actividades completadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{userData.reviews}</div>
                      <div className="text-sm text-gray-500">Reseñas escritas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{userData.rating.toFixed(1)}</div>
                      <div className="text-sm text-gray-500">Calificación promedio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">{t("completedActivities")}</h3>
                  {completedBookings.length > 0 ? (
                    <div className="space-y-3">
                      {completedBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
                          <div className="h-16 w-16 rounded-lg overflow-hidden relative flex-shrink-0">
                            <Image
                              src={booking.activity?.image || "/placeholder.svg"}
                              alt={booking.activity?.title || "Actividad"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium">{booking.activity?.title || "Actividad"}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              <span>{new Date(booking.activity_date).toLocaleDateString('es-ES')}</span>
                            </div>
                          </div>
                          <Link href={`/activity-detail?id=${booking.activity_id}`}>
                            <Button variant="ghost" size="sm">{t("viewDetails")}</Button>
                          </Link>
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
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={async () => {
                    try {
                      await signOut()
                    } finally {
                      router.push("/login")
                    }
                  }}
                >
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

              {bookingsLoading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando reservas...</p>
                </div>
              ) : upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="h-32 w-32 relative flex-shrink-0">
                            <Image
                              src={booking.activity?.image || "/placeholder.svg"}
                              alt={booking.activity?.title || "Actividad"}
                              fill
                              className="object-cover rounded-l-lg"
                            />
                          </div>
                          <div className="p-3 flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{booking.activity?.title || "Actividad"}</h4>
                              <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              <span>{new Date(booking.activity_date).toLocaleDateString('es-ES')}</span>
                              <span className="mx-1">•</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{booking.activity_time}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <span>Guía: {booking.guide?.name || "No disponible"}</span>
                              {booking.guide?.rating && (
                                <>
                                  <span className="mx-1">•</span>
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="ml-1">{booking.guide.rating}</span>
                                </>
                              )}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div>
                                <span className="text-xs text-gray-500">{t("totalPrice")}</span>
                                <p className="font-bold">${booking.total_price.toLocaleString()}</p>
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
                      <CalendarIcon className="h-12 w-12 mx-auto text-gray-300" />
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
                {completedBookings.length > 0 ? (
                  <div className="space-y-2">
                    {completedBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-lg overflow-hidden relative flex-shrink-0">
                            <Image
                              src={booking.activity?.image || "/placeholder.svg"}
                              alt={booking.activity?.title || "Actividad"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-sm">{booking.activity?.title || "Actividad"}</h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              <span>{new Date(booking.activity_date).toLocaleDateString('es-ES')}</span>
                              <span className="mx-1">•</span>
                              <span>Guía: {booking.guide?.name || "No disponible"}</span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/activity-detail?id=${booking.activity_id}`}>
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

              {favoriteActivities.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {favoriteActivities.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="h-32 w-32 relative flex-shrink-0">
                            <Image
                              src={(activity.images && activity.images[0]) || activity.image || "/placeholder.svg"}
                              alt={activity.title}
                              fill
                              className="object-cover rounded-l-lg"
                            />
                          </div>
                          <div className="p-3 flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{activity.title}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => toggleFavorite(activity.id)}
                                aria-pressed={likedIds.includes(activity.id)}
                                title={likedIds.includes(activity.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                              >
                                <Heart className={`h-5 w-5 ${likedIds.includes(activity.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">{activity.category}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{activity.duration}</span>
                              <span className="mx-1">•</span>
                              <span>Guía: {activity.guide_name}</span>
                              <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                              <span>{(activity.rating ?? 0).toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <p className="font-bold">${activity.price.toLocaleString()}</p>
                              <Link href={`/activity-detail?id=${activity.id}`}>
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
    </ProtectedRoute>
  )
}