import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Clock, BarChart, Users, Calendar, MessageCircle } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../i18n-client";
export default function ActivityDetailPage() {
  const { t } = useTranslation("pages");
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <div
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(/placeholder.svg?height=400&width=800)` }}
      >
        <button className="absolute top-4 left-4 p-2 rounded-full bg-black/20 text-white">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <Badge className="mb-2 bg-emerald-500 hover:bg-emerald-600">{t("trekking")}</Badge>
          <h1 className="text-2xl font-bold">{t("trekkingTitle")}</h1>
          <div className="flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{t("location")}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-medium">4.8</span>
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-gray-600">{t("reviews")}</span>
          </div>
          <div className="text-xl font-bold">{t("price")}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
            <Clock className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-xs text-gray-500">{t("duration")}</span>
            <span className="font-medium">{t("durationValue")}</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
            <BarChart className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-xs text-gray-500">{t("difficulty")}</span>
            <span className="font-medium">{t("difficultyValue")}</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
            <Users className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-xs text-gray-500">{t("group")}</span>
            <span className="font-medium">{t("groupValue")}</span>
          </div>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>CM</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <h2 className="font-medium">{t("guideName")}</h2>
                  <Badge className="ml-2 bg-blue-500 hover:bg-blue-600 text-xs">{t("verified")}</Badge>
                </div>
                <p className="text-sm text-gray-600">{t("guideDescription")}</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                {t("viewProfile")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="description" className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">{t("description")}</TabsTrigger>
            <TabsTrigger value="includes">{t("includes")}</TabsTrigger>
            <TabsTrigger value="reviews">{t("reviews")}</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="space-y-4">
              <p className="text-gray-600">
                {t("descriptionValue")}
              </p>
              <p className="text-gray-600">
                {t("descriptionValue2")}
              </p>
              <h3 className="font-semibold mt-4">{t("itinerary")}</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>{t("itineraryItem1")}</li>
                <li>{t("itineraryItem2")}</li>
                <li>{t("itineraryItem3")}</li>
                <li>{t("itineraryItem4")}</li>
                <li>{t("itineraryItem5")}</li>
                <li>{t("itineraryItem6")}</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="includes" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{t("includes")}</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-2">
                  <li>{t("includesItem1")}</li>
                  <li>{t("includesItem2")}</li>
                  <li>{t("includesItem3")}</li>
                  <li>{t("includesItem4")}</li>
                  <li>{t("includesItem5")}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">{t("notIncludes")}</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-2">
                  <li>{t("notIncludesItem1")}</li>
                  <li>{t("notIncludesItem2")}</li>
                  <li>{t("notIncludesItem3")}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">{t("whatToBring")}</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-2">
                  <li>{t("whatToBringItem1")}</li>
                  <li>{t("whatToBringItem2")}</li>
                  <li>{t("whatToBringItem3")}</li>
                  <li>{t("whatToBringItem4")}</li>
                  <li>{t("whatToBringItem5")}</li>
                  <li>{t("whatToBringItem6")}</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-3xl font-bold mr-2">4.8</div>
                  <div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">{t("reviews")}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {[1, 2, 3].map((i) => (
                <div key={i} className="py-3">
                  <div className="flex items-start">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
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
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>
              ))}

              <Button variant="outline" className="w-full">
                {t("viewAllReviews")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm text-gray-500">{t("pricePerPerson")}</span>
              <div className="text-xl font-bold">{t("price")}</div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-emerald-600 mr-1" />
              <span className="text-sm">{t("datesAvailable")}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex items-center justify-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              {t("contact")}
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">{t("bookNow")}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}