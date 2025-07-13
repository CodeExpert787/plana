"use client"

import type React from "react"
import { useState, useCallback } from "react"
import Image from "next/image"
import { XMarkIcon } from "@heroicons/react/24/outline"

interface ImageFullscreenViewProps {
  images: string[]
  startIndex: number
  onClose: () => void
}

const ImageFullscreenView: React.FC<ImageFullscreenViewProps> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex)

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }, [images.length])

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300">
        <XMarkIcon className="h-8 w-8" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`Imagen ${currentIndex + 1}`}
          fill
          className="object-contain"
        />
      </div>

      <div className="absolute bottom-4 left-0 w-full flex justify-between items-center px-4 text-white">
        <button onClick={handlePrev} className="hover:text-gray-300">
          Anterior
        </button>
        <span>
          {currentIndex + 1} / {images.length}
        </span>
        <button onClick={handleNext} className="hover:text-gray-300">
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default ImageFullscreenView