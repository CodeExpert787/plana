"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Users, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Activity } from "@/types"

interface BookingFormProps {
  activity: Activity
  onSubmit?: (data: BookingFormData) => void
}

export interface BookingFormData {
  date: Date | undefined
  participants: number
  activityId: string
}

const BookingForm = ({ activity, onSubmit }: BookingFormProps ) => {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [participants, setParticipants] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      alert("Por favor selecciona una fecha")
      return
    }

    const formData: BookingFormData = {
      date,
      participants,
      activityId: activity.id,
    }

    if (onSubmit) {
      onSubmit(formData)
    } else {
      // Si no hay onSubmit, redirigir a la página de pasos de reserva
      router.push(`/booking/${activity.id}/steps?date=${date.toISOString()}&participants=${participants}`)
    }
  }

  // Calcular el precio total
  const totalPrice = activity.price * participants

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Fecha</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={es}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Participantes</label>
        <div className="flex items-center border rounded-md">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setParticipants(Math.max(1, participants - 1))}
            disabled={participants <= 1}
            className="h-9"
          >
            -
          </Button>
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              <span>{participants}</span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setParticipants(Math.min(10, participants + 1))}
            disabled={participants >= 10}
            className="h-9"
          >
            +
          </Button>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">Precio total:</span>
          <span className="text-lg font-bold">${totalPrice.toLocaleString()}</span>
        </div>

        <Button type="submit" className="w-full">
          Reservar ahora
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

export default BookingForm