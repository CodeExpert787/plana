"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Heart, X, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Activity {
  id: string
  name: string
  description: string
  price: number
  duration: string
  difficulty: string
  location: string
  image: string
  guide: {
    name: string
    image: string
  }
}

interface ActivitySwiperProps {
  activities: Activity[]
}

export default function ActivitySwiper({ activities }: ActivitySwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedActivities, setLikedActivities] = useState<string[]>([])
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  useEffect(() => {
    // Load liked activities from localStorage
    const savedLikes = localStorage.getItem("likedActivities")
    if (savedLikes) {
      setLikedActivities(JSON.parse(savedLikes))
    }
  }, [])

  const saveToLocalStorage = (likes: string[]) => {
    localStorage.setItem("likedActivities", JSON.stringify(likes))
  }

  const handleLike = () => {
    const activityId = activities[currentIndex].id
    const updatedLikes = [...likedActivities, activityId]
    setLikedActivities(updatedLikes)
    saveToLocalStorage(updatedLikes)
    goToNext()
  }

  const handleDislike = () => {
    goToNext()
  }

  const goToNext = () => {
    if (currentIndex < activities.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      handleDislike()
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right
      handleLike()
    }
  }

  if (activities.length === 0) {
    return <div className="text-center p-8">No activities available</div>
  }

  if (currentIndex >= activities.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] p-4">
        <h2 className="text-2xl font-bold mb-4">No more activities</h2>
        <p className="text-gray-500 mb-6">You've seen all available activities</p>
        <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
      </div>
    )
  }

  const activity = activities[currentIndex]

  return (
    <div
      className="relative h-[70vh] w-full overflow-hidden rounded-xl shadow-lg"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0">
        <Image src={activity.image || "/placeholder.svg"} alt={activity.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-90" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">{activity.name}</h2>
        <p className="text-sm mb-2">{activity.location}</p>
        <p className="text-sm mb-2">
          {activity.duration} • {activity.difficulty}
        </p>
        <p className="text-lg font-semibold mb-4">${activity.price} USD</p>

        {/* Booking button */}
        <Link href={`/booking/${activity.id}`} className="block mb-4">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            Reservar ahora
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden relative">
            <Image
              src={activity.guide.image || "/placeholder.svg"}
              alt={activity.guide.name}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-sm">Guía: {activity.guide.name}</p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-4">
        <button
          onClick={handleDislike}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg"
        >
          <X className="h-8 w-8 text-red-500" />
        </button>
        <button
          onClick={handleLike}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg"
        >
          <Heart className="h-8 w-8 text-green-500" />
        </button>
      </div>
    </div>
  )
}