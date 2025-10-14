'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Award, Calendar, MapPin, Clock, Shield, ThumbsUp } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../../i18n-client";
import { useRouter, useParams } from "next/navigation";
import { GuideService, Guide } from "@/lib/guide-service";
import { useEffect, useState } from "react";
import { ActivitiesService, Activity } from "@/lib/activities-service";
import { ReviewService, Review } from "@/lib/review-service";

export default function GuideProfilePage() {
  const { t } = useTranslation("pages");
  const router = useRouter()
  const params = useParams()
  const guideId = params.id as string
  
  const [guide, setGuide] = useState<Guide | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    userName: '',
    userEmail: ''
  })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchGuideData = async () => {
      if (!guideId) return
      
      try {
        setLoading(true)
        
        // Fetch guide, activities, and reviews in parallel
        const [guideData, activitiesData, reviewsData] = await Promise.all([
          GuideService.getGuideById(guideId),
          ActivitiesService.getActivitiesByGuideId(guideId),
          ReviewService.getGuideReviews(guideId)
        ])
        
        if (guideData) {
          setGuide(guideData)
          setActivities(activitiesData)
          setReviews(reviewsData)
        } else {
          setError('Guide not found')
        }
      } catch (err) {
        console.error('Error fetching guide data:', err)
        setError('Failed to load guide')
      } finally {
        setLoading(false)
      }
    }

    fetchGuideData()
  }, [guideId])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guide || !reviewForm.comment.trim() || !reviewForm.userName.trim()) return

    setSubmittingReview(true)
    try {
      const reviewData = {
        guide_id: guide.id,
        user_id: 'anonymous-user', // In a real app, this would come from authentication
        activity_id: activities[0]?.id || 'general-activity', // This could be selected by user
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        user_name: reviewForm.userName,
        user_avatar: '/placeholder-user.jpg'
      }

      const response = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewData })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review')
      }
      
      // Refresh both reviews and guide data to get updated rating and review count
      const [updatedReviews, updatedGuide] = await Promise.all([
        ReviewService.getGuideReviews(guideId),
        GuideService.getGuideById(guideId)
      ])
      setReviews(updatedReviews)
      
      // Update guide with fresh data from database
      if (updatedGuide) {
        setGuide(updatedGuide)
      }
      
      // Reset form
      setReviewForm({
        rating: 5,
        comment: '',
        userName: '',
        userEmail: ''
      })
      setShowReviewForm(false)
      
      alert('Review submitted successfully!')
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading guide...</p>
        </div>
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Guide Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The guide you are looking for does not exist.'}</p>
          <Button onClick={() => router.back()} className="bg-emerald-600 hover:bg-emerald-700">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Use guide data from database
  const name = guide.name || t("guideName")
  const emoji = guide.emoji || "🏔️"
  const color = guide.color || "bg-blue-500"
  const avatar = guide.avatar || ""
  const location = guide.location || t("location")
  const experience = guide.experience || `${guide.experience_years} años` || t("experienceValue")
  const rating = guide.rating?.toString() || "4.8"
  const reviewsCount = guide.total_reviews?.toString() || t("reviews")
  const description = guide.description || t("about_Value")
  const formatMemberSince = (isoString: string | undefined) => {
    if (!isoString) return ''
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return isoString
    const day = d.getUTCDate()
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']
    const mon = months[d.getUTCMonth()]
    const year = d.getUTCFullYear()
    return `${day} ${mon} ${year}`
  }
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
          {avatar && avatar !== '' && avatar !== '/placeholder.svg' ? (
            <img
              src={avatar}
              alt={name}
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
            />
          ) : (
            <div className={`h-32 w-32 rounded-full ${color} border-4 border-white flex items-center justify-center text-white text-5xl shadow-lg`}>
              {emoji}
            </div>
          )}
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
              <span className="text-gray-600">{reviewsCount} {t("reviews")}</span>
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
                <p className="font-medium">{formatMemberSince(guide.member_since)}</p>
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
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="p-0">
                      <div className="flex items-start p-4">
                        <div className="w-20 h-20 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-4xl mr-3">
                          {activity.image && activity.image !== '/placeholder.svg' ? (
                            <img
                              src={activity.image}
                              alt={activity.title}
                              className="w-full h-full rounded-lg object-cover"
                            />
                          ) : (
                            "🏔️"
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{activity.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{activity.duration}</span>
                            <span className="mx-2">•</span>
                            <span>{activity.difficulty}</span>
                            <span className="mx-2">•</span>
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{activity.location}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1">{activity.rating || 0}</span>
                              <span className="ml-1 text-gray-500">(0)</span>
                            </div>
                            <p className="font-semibold text-emerald-600">${activity.price}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No activities available for this guide yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-6">
              {/* Review Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Leave a Review</h3>
                  {!showReviewForm && (
                    <Button 
                      onClick={() => setShowReviewForm(true)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Write Review
                    </Button>
                  )}
                </div>
                
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={reviewForm.userName}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, userName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewForm.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        rows={4}
                        placeholder="Share your experience with this guide..."
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Reviews ({reviews.length})</h3>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                          {review.user_avatar && review.user_avatar !== '/placeholder-user.jpg' ? (
                            <img
                              src={review.user_avatar}
                              alt={review.user_name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            "👤"
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{review.user_name}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at || '').toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                className={`w-4 h-4 ${
                                  j < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="mt-2 text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No reviews yet. Be the first to review this guide!</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="certifications" className="mt-4">
            <div className="grid gap-4">
              
              {Array.isArray((guide as any).certification_files) && (guide as any).certification_files.length > 0 && (
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-emerald-700 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    {t("certificationDocuments")}
                  </h3>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                    {(guide as any).certification_files.map((url: string, idx: number) => (
                      <li key={idx}>
                        <a href={url} target="_blank" rel="noreferrer" className="text-emerald-700 underline break-all">
                          {url.split('/').pop() || url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}