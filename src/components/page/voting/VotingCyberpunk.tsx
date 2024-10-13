"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserData } from "@/Site"

interface VotingProps {
  question: string // New prop for the question
  categories: string[]
  votes: Record<string, number>
  setVotes: React.Dispatch<React.SetStateAction<Record<string, number>>>
  userData: UserData
}

export default function VotingCyberpunk({ question, categories, votes, setVotes, userData }: VotingProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)

  const handleVote = (option: string) => {
    setVotes(prev => ({ ...prev, [option]: prev[option] + 1 }))
  }

  const neonColors = ["#ff66ff", "#66ffff", "#ffff66", "#ff66ff"]

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg border"
    style={{borderColor: userData.secondary_color, backgroundColor: userData.primary_color}}>
      <h2 className="text-2xl font-bold mb-6 text-center glitch" 
          style={{ color: userData.secondary_color }} 
          data-text={question}>
        {question}
      </h2>
      <div className="space-y-4">
        {categories.map((option, index) => (
          <motion.button
            key={option}
            className="w-full p-4 rounded bg-gray-800 border text-left relative overflow-hidden"
            style={{ 
              boxShadow: `0 0 10px ${neonColors[index % neonColors.length]}`,
              borderColor: userData.secondary_color
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleVote(option)}
            onMouseEnter={() => setHoveredOption(option)}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <div className="text-lg" style={{ color: userData.secondary_color }}>{option}</div>
            <div className="text-3xl text-white">{votes[option]}</div>
            {hoveredOption === option && (
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{ backgroundColor: userData.secondary_color }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
