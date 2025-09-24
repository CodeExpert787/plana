'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Award, Calendar, MapPin, Clock, Shield, ThumbsUp } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../i18n-client";
import { useRouter, useSearchParams } from "next/navigation";
export default function GuideProfilePage() {
  const { t } = useTranslation("pages");
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get("name") || t("guideName")
  const emoji = searchParams.get("emoji") || "🏔️"
  const color = searchParams.get("color") || "bg-blue-500"
  const location = searchParams.get("location") || t("location")
  const experience = searchParams.get("experience") || t("experienceValue")
  const rating = searchParams.get("rating") || "4.8"
  const reviews = searchParams.get("reviews") || t("reviews")
  const description = searchParams.get("description") || t("about_Value")
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <div className="relative h-48 bg-emerald-600">
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

      <div className="relative px-4 pb-4">
        <div className="flex justify-between -mt-16">
          <div className={`h-32 w-32 rounded-full ${color} border-4 border-white flex items-center justify-center text-white text-5xl shadow-lg`}>
            {emoji}
          </div>
          <Button className="mt-20 bg-emerald-600 hover:bg-emerald-700">{t("contact")}</Button>
        </div>

        <div className="mt-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{name}</h1>
            <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">{t("verified")}</Badge>
          </div>


          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">{rating}</span>
              <span className="mx-1 text-gray-400">•</span>
              <span className="text-gray-600">{reviews} {t("reviews")}</span>
            </div>
          </div>


          <div className="mt-4">
            <h2 className="text-lg font-semibold">{t("about")}</h2>
            <p className="mt-2 text-gray-600">{description}</p>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-emerald-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">{t("experience")}</p>
                <p className="font-medium">{experience}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-emerald-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">{t("memberSince")}</p>
                <p className="font-medium">{t("memberSinceValue")}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-emerald-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">{t("responseTime")}</p>
                <p className="font-medium">{t("responseTimeValue")}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">{t("guideVerified")}</p>
              <p className="text-sm text-blue-600">{t("guideVerifiedValue")}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="activities" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activities">{t("activities")}</TabsTrigger>
            <TabsTrigger value="reviews">{t("reviews")}</TabsTrigger>
            <TabsTrigger value="certifications">{t("certifications")}</TabsTrigger>
          </TabsList>
          <TabsContent value="activities" className="mt-4">
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <div className="flex items-start p-4">
                      <div className="w-20 h-20 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-4xl mr-3">
                        {["🥾", "🧗", "🏔️"][i % 3]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{t("activityTitle")}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{t("durationValue")}</span>
                          <span className="mx-2">•</span>
                          <span>{t("difficultyValue")}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1">{t("ratingValue")}</span>
                            <span className="ml-1 text-gray-500">({t("reviewsCount")})</span>
                          </div>
                          {/* <p className="font-semibold">{t("priceValue")}</p> */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                      {["👨", "👩", "🧔"][i % 3]}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{t("user")} {i}</h3>
                        <span className="text-sm text-gray-500">{t("days")} {i}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`w-4 h-4 ${j < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-gray-600">
                        {t("reviewValue")}
                      </p>
                      <div className="flex items-center mt-3 text-gray-500 text-sm">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span>{t("useful")} (3)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="certifications" className="mt-4">
            <div className="grid gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-emerald-700 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  {t("guideMountainAAGM")}
                </h3>
                <p className="mt-1 text-gray-600 text-sm">{t("associationArgentinaGuides")}</p>
                <p className="mt-2 text-gray-500 text-sm">{t("certificationValue")}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-emerald-700 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  {t("instructorClimbingFASA")}
                </h3>
                <p className="mt-1 text-gray-600 text-sm">{t("federationArgentinaSkiAndinism")}</p>
                <p className="mt-2 text-gray-500 text-sm">{t("certificationValue")}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-emerald-700 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  {t("remoteAreasFirstAid")}
                </h3>
                <p className="mt-1 text-gray-600 text-sm">{t("wildernessFirstResponder")}</p>
                <p className="mt-2 text-gray-500 text-sm">{t("certificationValue")}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}