"use client"

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, MessageCircle, Send } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/lib/auth-context"
import { ReviewService, Review } from "@/lib/review-service"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface ReviewSectionProps {
  guideId: string
  activityId?: string
  showReviewForm?: boolean
  maxReviews?: number
  onSubmitted?: () => void
}

export function ReviewSection({ 
  guideId, 
  activityId, 
  showReviewForm = true, 
  maxReviews = 10,
  onSubmitted
}: ReviewSectionProps) {
  const { t } = useTranslation("pages")
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [hasReviewed, setHasReviewed] = useState(false)
  
  // Review form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [showForm, setShowForm] = useState(false)

  // Fetch reviews and rating data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch reviews (prefer activity-specific when activityId is provided)
        const reviewsData = activityId
          ? await ReviewService.getActivityReviews(activityId)
          : await ReviewService.getGuideReviews(guideId)
        setReviews(reviewsData.slice(0, maxReviews))

        // Fetch average rating
        const { averageRating, totalReviews } = await ReviewService.getActivityAverageRating(activityId ?? "")
        setAverageRating(averageRating)
        setTotalReviews(totalReviews)

        // Check if current user has reviewed (only when authenticated)
        if (user && activityId) {
          const userHasReviewed = await ReviewService.hasUserReviewedGuide(user.id, guideId, activityId)
          setHasReviewed(userHasReviewed)
        } else {
          setHasReviewed(false)
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError('Error loading reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [guideId, activityId, user, maxReviews])

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) return

    try {
      setIsSubmitting(true)
      setError(null)

      const reviewData = {
        guide_id: guideId,
        user_id: user?.id,
        activity_id: activityId || 'general-activity',
        rating,
        comment: comment.trim(),
        user_name: (user?.user_metadata?.full_name || user?.email || 'Anonymous') as string,
        user_avatar: (user?.user_metadata?.avatar_url || '/placeholder-user.jpg') as string,
      }

      const response = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewData })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to submit review')
      }
      
      // Refresh reviews (respect activity filter when provided)
      const refreshed = activityId
        ? await ReviewService.getActivityReviews(activityId)
        : await ReviewService.getGuideReviews(guideId)
      setReviews(refreshed.slice(0, maxReviews))
      
      // Refresh average rating
      const { averageRating, totalReviews } = await ReviewService.getActivityAverageRating(activityId || "")
      setAverageRating(averageRating)
      setTotalReviews(totalReviews)
      
      // Reset form
      setRating(0)
      setComment("")
      setShowForm(false)
      if (user) setHasReviewed(true)
      if (onSubmitted) onSubmitted()
      
    } catch (err) {
      console.error('Error submitting review:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error submitting review'
      setError(`Error submitting review: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Debug Info - Only show in development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
          <strong>Debug:</strong> guideId={guideId}, activityId={activityId}, user={user?.id ? 'authenticated' : 'not authenticated'}
        </div>
      )} */}

      {/* Rating Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-3xl font-bold mr-2">{averageRating.toFixed(1)}</div>
          <div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">{totalReviews} {t("reviews")}</div>
          </div>
        </div>
        {/* {activityId && (
          <div className="text-xs text-gray-500">Activity ID: {activityId}</div>
        )} */}
      </div>

      {/* Already reviewed notice */}
      {hasReviewed && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded text-sm">
          {t("youAlreadyReviewed")}
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && !hasReviewed && !!activityId && (
        <Card>
          <CardContent className="p-4">
            {!showForm ? (
              <Button 
                onClick={() => setShowForm(true)}
                className="w-full"
                variant="outline"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t("writeReview")}
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>{t("rating")}</Label>
                  <div className="flex space-x-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setRating(i + 1)}
                        className={`p-1 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        <Star className={`w-6 h-6 ${i < rating ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="comment">{t("comment")}</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t("writeYourReview")}
                    className="mt-2"
                    rows={4}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting || !rating || !comment.trim()}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? t("submitting") : t("submitReview")}
                  </Button>
                  <Button
                    onClick={() => setShowForm(false)}
                    variant="outline"
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t("noReviewsYet")}</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="py-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-start">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user_avatar || ""} />
                  <AvatarFallback>{getInitials(review.user_name)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{review.user_name}</h3>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.created_at!), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
