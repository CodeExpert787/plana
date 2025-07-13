"use client"

import type React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ActivityCardProps {
  id: number
  title: string
  image: string
  price: number
  rating: number
  location: string
  category: string
  onClick?: () => void
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  id,
  title,
  image,
  price,
  rating,
  location,
  category,
  onClick,
}) => {
  // Verificar si la imagen es una URL externa
  const isExternalImage = image.startsWith("http")

  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <Link href={`/activity-detail?id=${id}`} onClick={onClick}>
        <div className="relative h-48 w-full">
          {isExternalImage ? (
            <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          ) : (
            <Image src={image || "/images/placeholder.png"} alt={title} fill className="object-cover" unoptimized />
          )}
          <div className="absolute top-2 left-2">
            <Badge className="bg-emerald-600 hover:bg-emerald-700">{category}</Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
            <div className="text-lg font-bold text-emerald-600">${price}</div>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
          <div className="flex items-center text-sm">
            <span className="text-yellow-500">★</span>
            <span className="ml-1">{rating}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default ActivityCard