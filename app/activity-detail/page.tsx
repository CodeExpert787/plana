"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, MapPin, Clock, CheckCircle2 } from "lucide-react"
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
          style={{ backgroundImage: `url(${activity?.images?.[0] || activity?.image || "/placeholder.svg?height=900&width=1200"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
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
              {[t("includesItem1"), t("includesItem2"), t("includesItem3"), t("includesItem4")]
                .filter(Boolean)
                .map((text, idx) => (
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
                  <div className="text-sm text-gray-600"> Guía local con más de {(activity as any)?.guide_experience} de experiencia</div>
                </div>
              </div>
            </div>

            
          </Card>
        </div>

        {/* Price + Reviews row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="p-6 md:p-8 border rounded-lg h-full flex flex-col">
            <div className="text-gray-500 text-sm">USD</div>
            <div className="text-3xl font-bold text-gray-900">{activity?.price ? `USD ${activity.price}` : t("price")}</div>
            <div className="text-sm text-gray-500">{t("pricePerPerson") || "por persona"}</div>
            <Button onClick={handleBookNow} className="mt-auto bg-emerald-600 hover:bg-emerald-700 h-11 text-base w-full">
              {t("bookNow")}
            </Button>
          </div>
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
      
    </div>
    
  )
}