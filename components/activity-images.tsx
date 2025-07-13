"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ImageFullscreenView } from "./image-fullscreen-view"

interface ActivityImagesProps {
  images: string[]
  title: string
}

export function ActivityImages({ images, title }: ActivityImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    const isFirstImage = currentIndex === 0
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    const isLastImage = currentIndex === images.length - 1
    const newIndex = isLastImage ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const openFullscreen = () => {
    setIsFullscreenOpen(true)
  }

  if (!images || images.length === 0) {
    return (
      <div className="relative h-64 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-4xl">{title[0]}</span>
      </div>
    )
  }

  return (
    <>
      <div className="relative h-64 bg-cover bg-center overflow-hidden">
        <div className="relative h-full w-full cursor-pointer" onClick={openFullscreen}>
          {images.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src || "/placeholder.svg"}
                alt={`${title} - imagen ${index + 1}`}
                fill
                className={index === 0 ? "object-cover" : "object-contain"}
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(index)
                  }}
                  className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Vista a pantalla completa */}
      {isFullscreenOpen && (
        <ImageFullscreenView images={images} initialIndex={currentIndex} onClose={() => setIsFullscreenOpen(false)} />
      )}
    </>
  )
}