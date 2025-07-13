"use client"

import type React from "react"
import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Activity } from "@/types"
import { Badge } from "./ui/badge"
import { format } from "date-fns"
import { CalendarDays, Clock, MapPin, MessageCircle, Users } from "lucide-react"
import { Button } from "./ui/button"
import BookingForm from "./BookingForm"

interface ActivityDetailModalProps {
  activity: Activity
  children: React.ReactNode
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ activity, children }) => {
  const [showBookingForm, setShowBookingForm] = useState(false)

  // Mensaje predefinido para WhatsApp
  const whatsappMessage = encodeURIComponent(
    `Hola, estoy interesado/a en la actividad "${activity.title}". ¿Podría darme más información?`,
  )

  // URL de WhatsApp
  const whatsappUrl = `https://wa.me/5492944123456?text=${whatsappMessage}`

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{activity.title}</SheetTitle>
          <SheetDescription>{activity.location}</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <img
            src={activity.imageUrl || "/placeholder.svg"}
            alt={activity.title}
            className="w-full rounded-md aspect-video object-cover"
          />
          <div className="mt-4 flex items-center gap-2">
            <Badge>{activity.category}</Badge>
            {activity.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {activity.startTime && format(new Date(activity.startTime), "dd/MM/yyyy")}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {activity.startTime && format(new Date(activity.startTime), "HH:mm")} -
              {activity.endTime && format(new Date(activity.endTime), "HH:mm")}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {activity.location}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {activity.participants} Participantes
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Descripción</h3>
            <p>{activity.description}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{activity.price === 0 ? "Gratis" : `$${activity.price}`}</p>
              <p className="text-sm text-gray-500">por persona</p>
            </div>
            <div className="flex justify-center">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" className="flex items-center justify-center w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contactar por WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

        {showBookingForm && <BookingForm activity={activity} onClose={() => setShowBookingForm(false)} />}
      </SheetContent>
    </Sheet>
  )
}

export default ActivityDetailModal