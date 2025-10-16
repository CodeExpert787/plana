"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, MapPin, Clock, CheckCircle2, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../i18n-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActivitiesService, Activity as DBActivity } from "@/lib/activities-service";
import { ReviewSection } from "@/components/review-section"
import { ReviewService } from "@/lib/review-service"
export default function ActivityDetailPage() {
  const { t } = useTranslation("pages");
  const router = useRouter()
  const searchParams = useSearchParams()
  const activityId = searchParams.get("id") || ""
  const [activity, setActivity] = useState<DBActivity | null>(null)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: ''
  })
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  
  useEffect(() => {
    const loadActivity = async () => {
      if (!activityId) return
      try {
        const data = await ActivitiesService.getActivityById(activityId)
        setActivity(data)
      } catch (err) {
        console.error('Failed to load activity', err)
        setActivity(null)
      }
    }
    loadActivity()
  }, [activityId])

  // Open modal when bookNow=true is present in URL
  useEffect(() => {
    const bn = searchParams.get("bookNow")
    if (bn === "true") {
      setIsBookingOpen(true)
    }
  }, [searchParams])

  const refreshActivity = async () => {
    try {
      if (!activityId) return
      const data = await ActivitiesService.getActivityById(activityId)
      setActivity(data)
    } catch (err) {
      console.error('Failed to refresh activity', err)
    }
  }
  // Fetch reviews and rating data
  useEffect(() => {
    const fetchReviews = async () => {
      try {

        // Fetch average rating
        const { averageRating, totalReviews } = await ReviewService.getActivityAverageRating(activityId)
        setAverageRating(averageRating)
        setTotalReviews(totalReviews)
        
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError('Error loading reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [activityId])
  const handleBookNow = () => {
    if (!activityId) return
    router.push(`/activity-detail?id=${activityId}&bookNow=true`)
    setIsBookingOpen(true)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleWhatsAppContact = () => {
    const activityTitle = activity?.title || t("trekkingTitle")
    const activityLocation = activity?.location || t("location")
    const activityPrice = activity?.price || t("price")
    const message = encodeURIComponent(
      `¡Hola! Me interesa la actividad "${activityTitle}" en ${activityLocation}. Precio: $${activityPrice}.`
    )
    const whatsappUrl = `https://wa.me/542944330500?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSendReservation = () => {
    // Include form data in the navigation URL as query parameters
    const params = new URLSearchParams({
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      contactNumber: formData.contactNumber || '',
      email: formData.email || ''
    })

    router.push(`/booking/${activityId}/steps?${params.toString()}`)
  }
  
  const images = (activity?.images && activity.images.length > 0)
    ? activity.images
    : [(activity?.image as any) || "/placeholder.svg?height=900&width=1200"]

  const nextImage = () => {
    const len = images.length
    setCurrentImageIndex((prev) => (prev + 1) % len)
  }

  const prevImage = () => {
    const len = images.length
    setCurrentImageIndex((prev) => (prev - 1 + len) % len)
  }
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      {/* Hero Image */}
      <div className="relative">
        <button type="button" onClick={() => router.back()} className="absolute top-4 left-4 p-2 rounded-full bg-black/20 text-white">
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
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>
      <div className="relative max-w-5xl mx-auto h-[380px]">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[currentImageIndex] || "/placeholder.svg?height=900&width=1200"})` }}
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full z-20"
              onClick={(e) => { e.stopPropagation(); prevImage() }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full z-20"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute top-2 left-0 right-0 flex justify-center gap-1 z-20">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-[10px] rounded-full ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx) }}
                  role="button"
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-4 h-full flex items-start pt-8 pl-8">
          <div>
            <h1 className="text-white text-2xl xl:text-5xl font-extrabold drop-shadow">
              {activity?.title || t("trekkingTitle")}
            </h1>
            <div className="mt-3 flex flex-col xl:flex-row items-start xl:items-center text-white/90 xl:space-x-4">
              <div className="flex items-start xl:items-center py-2 xl:py-0">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-sm xl:text-lg">{activity?.location || t("location")}</span>
              </div>
              <span className="hidden xl:block xl:inline">•</span>
              <div className="flex items-start xl:items-center py-2 xl:py-0">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm xl:text-lg">{activity?.duration || t("durationValue")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: description + includes */}
          <Card className="md:col-span-2 p-6 md:p-8">

            <h3 className="mt-4 text-xl font-semibold">{t("description")}</h3>
            <p className="mt-2 text-gray-700 leading-relaxed">
              {activity?.description || t("descriptionValue")}
            </p>

            <h3 className="mt-6 text-xl font-semibold">{t("includes")}</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activity?.included?.map((text, idx) => (
                  <div key={idx} className="flex items-start text-gray-700">
                    <CheckCircle2 className="mt-0.5 mr-2 w-5 h-5 text-emerald-600" />
                    <span>{text as string}</span>
                  </div>
              ))}
            </div>
          </Card>

          {/* Right: guide + price */}
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h4 className="text-sm uppercase tracking-wide text-gray-500">{t("guide") || "Guía"}</h4>
              <div className="mt-3 flex items-center">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={(activity as any)?.guide_avatar || "/placeholder-user.jpg"} alt="guide" />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <div className="font-semibold">{(activity as any)?.guide_name || "Guía profesional"}</div>
                  <div className="text-sm text-gray-600"> {(activity as any)?.description} </div>
                </div>
              </div>
            </div>

            
          </Card>
        </div>

        {/* Price + Reviews row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Price + CTA Card (opens modal) */}
          <Card className="p-6 md:p-8 h-full flex flex-col justify-between">
            <div>
              <div className="text-start mb-6">
                <div className="text-gray-500 text-sm">USD</div>
                <div className="text-3xl font-bold text-gray-900">{activity?.price ? `${activity.price}` : "123"}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <Button 
                onClick={handleWhatsAppContact} 
                className="bg-green-600 hover:bg-green-700 text-white h-11 text-base w-full"
              >
                <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
              </Button>
              <Button 
                onClick={handleSendReservation}
                className="bg-blue-900 hover:bg-blue-800 text-white h-11 text-base w-full"
              >
                {t("bookNow", "Reservar ahora")}
              </Button>
            </div>
          </Card>

          {/* Reviews Card */}
          <Card className="p-6 md:p-8 h-full">
            <h3 className="text-xl font-semibold mb-4">{t("reviews")}</h3>
            <ReviewSection 
              guideId="1"
              activityId={activityId}
              showReviewForm={true}
              maxReviews={5}
              onSubmitted={refreshActivity}
            />
          </Card>
        </div>
      </div>
      
      {/* Booking Modal */}
      {/* <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>{t("book", "Reservar")}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <img src="/images/plan-a-logo-binoculars.png" alt="PLAN A Logo" className="h-10 w-auto" />
          </div>

          <div className="text-center mb-4">
            <div className="text-gray-500 text-sm">USD</div>
            <div className="text-3xl font-bold text-gray-900">{activity?.price ? `${activity.price}` : "123"}</div>
            <div className="text-sm text-gray-500">Precio por persona</div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">Nombre:</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1" placeholder="Ingresa tu nombre" />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Apellido:</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1" placeholder="Ingresa tu apellido" />
            </div>
            <div>
              <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">Número de contacto:</Label>
              <Input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="mt-1" placeholder="Ingresa tu número" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email:</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="mt-1" placeholder="Ingresa tu email" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button onClick={handleWhatsAppContact} className="bg-green-600 hover:bg-green-700 text-white h-11 text-base w-full">
              <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
            </Button>
            <Button onClick={handleSendReservation} className="bg-blue-900 hover:bg-blue-800 text-white h-11 text-base w-full">
            {t("bookNow", "Reservar ahora")}
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}

    </div>
  
  )
}