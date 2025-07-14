"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ActivityDetailModal from "@/components/ActivityDetailModal"
import mockActivities from "@/data/mockActivities"
import Image from "next/image"
import { useTranslation } from "react-i18next";
import "../../i18n-client";

export default function SwipePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation("pages");
  const [activities] = useState(mockActivities)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Obtener la fecha de los parámetros de URL
  const dateParam = searchParams.get("date")
  const selectedDate = dateParam ? new Date(dateParam) : undefined

  const currentActivity = activities[currentIndex]

  // Función para manejar el swipe a la izquierda (siguiente)
  const handleNext = () => {
    if (currentIndex < activities.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // Función para manejar el swipe a la derecha (anterior)
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  // Función para abrir el modal de detalles
  const handleOpenDetails = () => {
    setIsModalOpen(true)
  }

  // Función para manejar la reserva directa
  const handleDirectBooking = () => {
    // Primero abrimos el modal
    setIsModalOpen(true)

    // Luego simulamos un clic en el botón "Reservar ahora" dentro del modal
    setTimeout(() => {
      const bookNowButton = document.querySelector(".bg-emerald-600.hover\\:bg-emerald-700") as HTMLButtonElement
      if (bookNowButton) {
        bookNowButton.click()
      }
    }, 300)
  }

  // Detectar eventos de teclado para navegación
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious()
      if (e.key === "ArrowRight") handleNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Encabezado */}
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">{t("discoverActivities")}</h1>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Tarjeta de actividad */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="relative h-64 w-full">
            <Image
              src={currentActivity.image || "/images/placeholder.png"}
              alt={currentActivity.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-800">
              ${currentActivity.price}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800">{currentActivity.title}</h3>

            <div className="flex items-center mt-1">
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-sm text-gray-600 ml-1">{currentActivity.rating}</span>
            </div>

            <div className="mt-2 flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {currentActivity.location}
            </div>

            <div className="mt-1 flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {currentActivity.duration}
            </div>

            <div className="mt-2 flex justify-between">
              <button onClick={handleOpenDetails} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                {t("viewDetails")}
              </button>

              {/* Botón de categoría */}
              <span className="inline-block bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                {currentActivity.category}
              </span>
            </div>
          </div>
        </div>

        {/* Controles de navegación y botón de reserva */}
        <div className="w-full max-w-md flex justify-between mb-6">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {t("previous")}
          </button>

          {/* Botón de reserva */}
          <button
            onClick={handleDirectBooking}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            {t("bookNow")}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === activities.length - 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {t("next")}
          </button>
        </div>

        {/* Indicador de posición */}
        <div className="flex space-x-1">
          {activities.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full ${i === currentIndex ? "w-6 bg-emerald-600" : "w-2 bg-gray-300"}`}
            />
          ))}
        </div>
      </main>

      {/* Modal de detalles */}
      <ActivityDetailModal
        activity={currentActivity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  )
}