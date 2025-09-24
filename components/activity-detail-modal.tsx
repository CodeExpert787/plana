"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Calendar, Users, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import mockActivities from "@/data/mockActivities"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useLocalizedActivities } from "@/hooks/useLocalizedActivities"
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

  const localizedActivities = useLocalizedActivities()

  if (!activity) return null

  const fullActivity = localizedActivities.find((a) => Number.parseInt(a.id) === activity.id) || activity

  const images = fullActivity.images || activity.images || [activity.image || "/placeholder.svg"]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleBookNow = () => {
    router.push(`/booking/${activity.id}/steps?date=${selectedDate?.toISOString() || ""}&step=1`)
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
            className="object-auto bg-black"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 p-1 rounded-full text-white"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 p-1 rounded-full text-white"
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

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="details" className="w-full">
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-xl font-bold mb-2">{activity.title}</h2>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <MapPin size={16} className="mr-1" />
                <span>{fullActivity.location || t("bariloche") + ", " + t("argentina")}</span>
                <span className="mx-2">•</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1">{activity.guide.rating}</span>
                <span className="ml-1">({activity.guide.reviews} {t("reviews")})</span>
              </div>

              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">{t("details")}</TabsTrigger>
                <TabsTrigger value="included">{t("included")}</TabsTrigger>
                <TabsTrigger value="guide">{t("guide")}</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="details" className="px-6 py-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2">{t("description")}</h3>
                <p className="text-gray-600">{activity.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-emerald-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">{t("duration")}</p>
                    <p className="font-medium">{activity.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
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
                    className="text-emerald-600 mr-2"
                  >
                    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">{t("difficulty")}</p>
                    <p className="font-medium">{activity.difficulty}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-emerald-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">{t("schedules")}</p>
                    <p className="font-medium">
                      {fullActivity.startTimes ? fullActivity.startTimes.join(", ") : "Flexible"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-emerald-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">{t("group")}</p>
                    <p className="font-medium">{t("maxPersons")}</p>  
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("requirements")}</h3>
                <ul className="space-y-1">
                  {fullActivity.requirements ? (
                    fullActivity.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mr-2 mt-0.5" />
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mr-2 mt-0.5" />
                      <span className="text-gray-600">{t("suitableClothing")}</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {activity.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="included" className="px-6 py-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2">{t("included")}</h3>
                <ul className="space-y-1">
                  {fullActivity.included ? (
                    fullActivity.included.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mr-2 mt-0.5" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mr-2 mt-0.5" />
                      <span className="text-gray-600">{t("specializedGuide")}</span>
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("notIncluded")}</h3>
                <ul className="space-y-1">
                  {fullActivity.notIncluded ? (
                    fullActivity.notIncluded.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start">
                      <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-600">{t("additionalFoodAndDrinks")}</span>
                    </li>
                  )}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="guide" className="px-6 py-4">
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  {fullActivity.guide.image ? (
                    <AvatarImage src={fullActivity.guide.image || "/placeholder.svg"} alt={activity.guide.name} />
                  ) : null}
                  <AvatarFallback className={`${activity.guide.color}`}>{activity.guide.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{activity.guide.name}</h3>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{activity.guide.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{activity.guide.reviews} {t("reviews")}</span>
                  </div>
                  <Badge className="mt-1 bg-blue-500 hover:bg-blue-600">{t("verified")}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("experience")}</h4>
                  <p>{fullActivity.guide.experience || "10+ " + t("years")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("languages")}</h4>
                  <p>{fullActivity.guide.languages ? fullActivity.guide.languages.join(", ") : t("spanish") + ", " + t("english")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("aboutMe")}</h4>
                  <p className="text-gray-600">
                    {fullActivity.guide.bio ||
                      t("professionalGuide")}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer con precio y botón de reserva */}
        <div className="p-4 border-t flex items-center justify-between bg-white">
          <div>
            <p className="text-sm text-gray-500">{t("pricePerPerson")}</p>
            <p className="text-2xl font-bold">${activity.price.toLocaleString()}</p>
          </div>
          <Button onClick={handleBookNow} className="bg-emerald-600 hover:bg-emerald-700">
            {t("bookNow")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}