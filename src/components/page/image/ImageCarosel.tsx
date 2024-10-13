'use client'

import React, { useState } from "react"
import { UserData } from "@/Site"
import { ImageContent } from "../../../../supabase/functions/createSite/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ImageCarouselProps extends UserData {
  borderStyle: string
  hoverEffect: string
  filterEffect: string
  imageContent: ImageContent
}

const NonEmptyImage: React.FC<{ src: string; className: string }> = ({ src, className }) => {
  const [visible, setVisible] = useState(false)

  const handleLoad = () => setVisible(true)
  const handleError = () => setVisible(false)

  return (
    <img
      src={src}
      onLoad={handleLoad}
      onError={handleError}
      className={className}
      style={{ display: visible ? 'initial' : 'none' }}
    />
  )
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  borderStyle,
  hoverEffect,
  filterEffect,
  imageContent,
}) => {
  const images = [imageContent.baseImageUrl, ...(imageContent.similarImages?.filter(Boolean) || [])]
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  const prevImage = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)

  return (
    <div className="container mx-auto p-4">
      <div className="relative max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="aspect-w-16 aspect-h-9"
          >
            <NonEmptyImage
              src={images[currentIndex] ?? ''}
              className={`rounded-lg object-cover w-full h-full ${borderStyle} ${hoverEffect}`}
            />
          </motion.div>
        </AnimatePresence>
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="mt-4 flex space-x-2 overflow-x-auto justify-center">
        {images.map((src, index) => (
          <div
            key={index}
            className={`flex-shrink-0 cursor-pointer ${index === currentIndex ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setCurrentIndex(index)}
          >
            <NonEmptyImage
              src={src ?? ''}
              className={`w-12 h-12 object-cover rounded-lg ${borderStyle}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
