"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Clock, BarChart, Users, Calendar, MessageCircle } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../i18n-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocalizedActivities } from "@/hooks/useLocalizedActivities";
import { ReviewSection } from "@/components/review-section"
import { ReviewTroubleshooting } from "@/components/review-troubleshooting";
export default function ActivityDetailPage() {
  const { t } = useTranslation("pages");
  const router = useRouter()
  const searchParams = useSearchParams()
  const activityId = searchParams.get("id") || ""
  const activities = useLocalizedActivities()
  const activity = activities.find((a) => String(a.id) === String(activityId))

  const handleBookNow = () => {
    if (!activityId) return
    router.push(`/booking/${activityId}/steps`)
  }

  const handleWhatsAppContact = () => {
    const activityTitle = activity?.title || t("trekkingTitle")
    const activityLocation = activity?.location || t("location")
    const activityPrice = activity?.price || t("price")
    
    // WhatsApp message with activity details
    const message = encodeURIComponent(
      `¡Hola! Me interesa saber más sobre la actividad "${activityTitle}" en ${activityLocation}. Precio: $${activityPrice}. ¿Podrías darme más información?`
    )
    
    // Replace with your actual WhatsApp number (with country code, no + sign)
    const whatsappNumber = "54294433050" // Example: Argentina number
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      {/* Back Button */}
      <button 
        type="button" 
        onClick={() => router.back()} 
        className="absolute z-50 top-4 left-4 p-2 rounded-full bg-black/20 text-white"
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
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Main Content - 2 Column Layout */}
      <div className="flex min-h-screen">
        {/* Left Column - Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Row 1: Category and Location */}
          <div className="space-y-2">
            <Badge className="bg-emerald-500 hover:bg-emerald-600">{activity?.category || t("trekking")}</Badge>
            <h1 className="text-3xl font-bold text-gray-900">{activity?.title || t("trekkingTitle")}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">{activity?.location || t("location")}</span>
            </div>
          </div>

          {/* Row 2: Review, Duration, Difficulty */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-2 font-medium text-lg">4.8</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-600">{t("reviews")}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-emerald-600 mr-2" />
              <span className="font-medium">{activity?.duration || t("durationValue")}</span>
            </div>
            <div className="flex items-center">
              <BarChart className="w-5 h-5 text-emerald-600 mr-2" />
              <span className="font-medium">{activity?.difficulty || t("difficultyValue")}</span>
            </div>
          </div>

          {/* Row 3: Description and Includes - 2 columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Description Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{t("description")}</h3>
              <div className="space-y-3">
                <p className="text-gray-600">{activity?.description || t("descriptionValue")}</p>
                <p className="text-gray-600">{t("descriptionValue2")}</p>
                <div>
                  <h4 className="font-semibold mb-2">{t("itinerary")}</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>{t("itineraryItem1")}</li>
                    <li>{t("itineraryItem2")}</li>
                    <li>{t("itineraryItem3")}</li>
                    <li>{t("itineraryItem4")}</li>
                    <li>{t("itineraryItem5")}</li>
                    <li>{t("itineraryItem6")}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Includes Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{t("includes")}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">{t("includes")}</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>{t("includesItem1")}</li>
                    <li>{t("includesItem2")}</li>
                    <li>{t("includesItem3")}</li>
                    <li>{t("includesItem4")}</li>
                    <li>{t("includesItem5")}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-red-700 mb-2">{t("notIncludes")}</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>{t("notIncludesItem1")}</li>
                    <li>{t("notIncludesItem2")}</li>
                    <li>{t("notIncludesItem3")}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">{t("whatToBring")}</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>{t("whatToBringItem1")}</li>
                    <li>{t("whatToBringItem2")}</li>
                    <li>{t("whatToBringItem3")}</li>
                    <li>{t("whatToBringItem4")}</li>
                    <li>{t("whatToBringItem5")}</li>
                    <li>{t("whatToBringItem6")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Reviews */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">{t("reviews")}</h3>
            <ReviewSection 
              guideId="1"
              activityId={activityId}
              showReviewForm={true}
              maxReviews={5}
            />
          </div>

          {/* Troubleshooting Section - Only show if there are issues */}
          {/* <div className="mt-6">
            <ReviewTroubleshooting />
          </div> */}

          {/* Row 5: Price, Contact, Book Now */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-gray-500">{t("pricePerPerson")}</span>
                <div className="text-3xl font-bold text-emerald-600">{activity ? `$${activity.price}` : t("price")}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-center h-12 text-lg" 
                onClick={handleWhatsAppContact}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t("contact")}
              </Button>
              <Button 
                onClick={handleBookNow} 
                className="bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
              >
                {t("bookNow")}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="w-1/2 relative">
          <div
            className="h-full bg-cover bg-center sticky top-0"
            style={{ backgroundImage: `url(${activity?.images?.[0] || activity?.image || "/placeholder.svg?height=800&width=600"})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  )
}