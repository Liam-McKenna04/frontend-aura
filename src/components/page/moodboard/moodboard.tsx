import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { hs } from '@/lib/utils'

interface MoodboardProps {
  colors: string[]
  variant: string
}

const shapes = [
  'circle',
  'square',
  'triangle',
  'rectangle',
  'oval',
  'parallelogram',
  'trapezoid',
  'pentagon',
  'hexagon',
  'octagon',
]

export const Moodboard: React.FC<MoodboardProps> = ({ colors, variant }) => {
  const moodboardItems = useMemo(() => {
    return colors.flatMap((color, index) =>
      Array(3).fill(null).map((_, i) => ({
        color,
        shape: shapes[hs(`${color}-${index}-${i}-shape`, shapes.length)],
        key: `${color}-${index}-${i}`,
        scale: 1 + hs(`${color}-${index}-${i}-scale`, 20) / 100, // Scale between 1.00 and 1.20
        stiffness: 200 + hs(`${color}-${index}-${i}-stiffness`, 300), // Stiffness between 200 and 500
      }))
    )
  }, [colors])

  return (
    <div className="p-8 bg-gray-100/20 rounded-md min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">{variant} moodboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {moodboardItems.map(({ color, shape, key, scale, stiffness }) => (
          <motion.div
            key={key}
            className="aspect-square relative"
            whileHover={{ scale }}
            transition={{ type: 'spring', stiffness }}
          >
            <div
              className={`w-full h-full ${getShapeClass(shape)}`}
              style={{ backgroundColor: color }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <span className="bg-white px-2 py-1 rounded text-sm font-mono">{color}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const getShapeClass = (shape: string): string => {
  switch (shape) {
    case 'circle':
      return 'rounded-full'
    case 'square':
      return ''
    case 'triangle':
      return 'clip-path-triangle'
    case 'rectangle':
      return 'aspect-video'
    case 'oval':
      return 'rounded-full aspect-video'
    case 'parallelogram':
      return 'clip-path-parallelogram'
    case 'trapezoid':
      return 'clip-path-trapezoid'
    case 'pentagon':
      return 'clip-path-pentagon'
    case 'hexagon':
      return 'clip-path-hexagon'
    case 'octagon':
      return 'clip-path-octagon'
    default:
      return ''
  }
}
