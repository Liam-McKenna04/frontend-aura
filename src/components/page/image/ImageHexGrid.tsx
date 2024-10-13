'use client'

import React, { useState } from "react"
import { UserData } from "@/Site"
import { ImageContent } from "../../../../supabase/functions/createSite/types"
import { motion } from "framer-motion"

interface ImageHexGridProps extends UserData {
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

const HexagonImage: React.FC<{ 
  src: string; 
  delay: number;
  style: React.CSSProperties;
  hoverStyle: React.CSSProperties;
}> = ({ src, delay, style, hoverStyle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative w-full pb-[115%] overflow-hidden"
      style={{...style, ...(isHovered ? hoverStyle : {})}}
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NonEmptyImage 
        src={src} 
        className="absolute inset-0 w-full h-full object-cover" 
      />
    </motion.div>
  )
}

export const ImageHexGrid: React.FC<ImageHexGridProps> = ({
  borderStyle,
  hoverEffect,
  imageContent,
}) => {
  const images = [imageContent.baseImageUrl, ...(imageContent.similarImages?.filter(Boolean) || [])]

  if (images.length === 0) {
    return <div className="text-center p-4">No images available</div>
  }

  const hexagonStyle = {
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    transition: 'transform 0.3s, filter 0.3s',
    border: borderStyle,
  }

  const hexagonHoverStyle = {
    transform: hoverEffect === 'scale' ? 'scale(1.05)' : 'none',
  }

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1">
        {images.map((src, index) => (
          src && (
            <div key={index} className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
              <HexagonImage 
                src={src} 
                delay={index * 0.1} 
                style={hexagonStyle}
                hoverStyle={hexagonHoverStyle}
              />
            </div>
          )
        ))}
      </div>
    </div>
  )
}
