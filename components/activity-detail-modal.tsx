"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, CheckCircle, ChevronLeft, ChevronRight, XCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import "../i18n-client"
export function ActivityDetailModal({
  activity,
  isOpen,
  onClose,
  selectedDate,
}: {
  activity: any
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()
  const { t } = useTranslation("pages")

  if (!activity) return null

  const fullActivity = activity

  const images = fullActivity.images || activity.images || [activity.image || "/placeholder.svg"]

  // Normalize not included items from different data sources/keys
  const notIncludedItems: string[] =
    (Array.isArray((fullActivity as any)?.not_included) && (fullActivity as any).not_included.length > 0)
      ? (fullActivity as any).not_included
      : (Array.isArray((fullActivity as any)?.notIncluded) && (fullActivity as any).notIncluded.length > 0)
        ? (fullActivity as any).notIncluded
        : (Array.isArray((activity as any)?.not_included) && (activity as any).not_included.length > 0)
          ? (activity as any).not_included
          : (Array.isArray((activity as any)?.notIncluded) && (activity as any).notIncluded.length > 0)
            ? (activity as any).notIncluded
            : []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleBookNow = () => {
    router.push(`/activity-detail?id=${activity.id}`)
    onClose()
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="relative h-64 sm:h-80">
          <Image
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={activity.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/40" />
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-white text-2xl font-extrabold drop-shadow">{activity.title}</h2>
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-1 rounded-full text-white"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-1 rounded-full text-white"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {images.map((_: string, index: number) => (
                  <div
                    key={index}
                    className={`h-[10px] rounded-full ${
                      index === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content matching screenshot layout */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Location and duration row */}
          <div className="flex items-center justify-between text-sm text-gray-700">
            <div className="flex items-center">
              <MapPin size={16} className="mr-1 text-emerald-600" />
              <span>{fullActivity.location || `${t("bariloche")}, ${t("argentina")}`}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1 text-emerald-600" />
              <span>{activity.duration}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-gray-700 leading-relaxed">{activity.description}</p>
          </div>

          {/* Incluye box */}
          <div>
            <h3 className="font-semibold mb-2">{t("included")}</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {(fullActivity.included && fullActivity.included.length > 0
                  ? fullActivity.included
                  : [
                      t("specializedGuide"),
                      t("trekkingPoles", "Bastones"),
                      t("snowshoes", "Raquetas de nieve"),
                      t("safetyEquipment", "Equipo de seguridad"),
                    ]
                ).slice(0, 6).map((item: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mr-2 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Not included box */}
          {notIncludedItems.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">{t("notIncluded")}</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {notIncludedItems.slice(0, 6).map((item: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
                </div>
              </div>
            </div>
          )}

          {/* Guide row */}
          <div className="pt-1 border-t">
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center text-gray-700">
                <span className="mr-2">{t("guide", "Guía")}:</span>
                <span className="font-medium">{activity?.guide?.name || fullActivity?.guide?.name || t("guideName", "Guía certificado")}</span>
              </div>
            </div>
          </div>

          {/* Rating row */}
          <div className="flex items-center text-gray-700">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-semibold">{activity?.guide?.rating ?? fullActivity?.guide?.rating ?? 0}</span>
            <span className="ml-2 text-sm">({activity?.guide?.total_reviews ?? fullActivity?.guide?.total_reviews ?? 0} {t("reviews")})</span>
          </div>
        </div>

        {/* Footer with booking button */}
        <div className="p-4 border-t flex items-center justify-between bg-white">

          <Button onClick={handleBookNow} className="w-full mt-2 bg-green-600 hover:bg-green-70">
             {t("moreInformation", "Mas información")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}