'use client'

import React, { useState } from "react"
import { UserData } from "@/Site"
import { ImageContent } from "../../../../supabase/functions/createSite/types"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion } from "framer-motion"

interface ImageMasonryProps extends UserData {
  borderStyle: string
  hoverEffect: string
  filterEffect: string
  imageContent: ImageContent
}

const NonEmptyImage: React.FC<{ src: string; className: string; onClick?: () => void }> = ({
  src,
  className,
  onClick,
}) => {
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
      onClick={onClick}
    />
  )
}

export const ImageMasonry: React.FC<ImageMasonryProps> = ({
  borderStyle,
  hoverEffect,
  imageContent,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const images = [imageContent.baseImageUrl, ...(imageContent.similarImages?.filter(Boolean) || [])]

  return (
    <div className="container mx-auto p-4">
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
        {images.map((src, index) => (
          src && (
            <motion.div
              key={index}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NonEmptyImage
                src={src}
                className={`rounded-lg object-cover w-full ${borderStyle} ${hoverEffect} cursor-pointer transition-transform duration-300 hover:scale-105`}
                onClick={() => setSelectedImage(src)}
              />
            </motion.div>
          )
        ))}
      </div>
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          {selectedImage && (
            <img src={selectedImage} alt="Selected" className="w-full h-auto" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}