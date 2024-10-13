"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface VotingProps {
  question: string // New prop for the question
  categories: string[]
  votes: Record<string, number>
  setVotes: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

export default function VotingCyberpunk({ question, categories, votes, setVotes }: VotingProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)

  const handleVote = (option: string) => {
    setVotes(prev => ({ ...prev, [option]: prev[option] + 1 }))
  }

  const neonColors = ["#ff66ff", "#66ffff", "#ffff66", "#ff66ff"]

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg shadow-lg border border-cyan-500">
      <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400 glitch" data-text={question}>
        {question}
      </h2>
      <div className="space-y-4">
        {categories.map((option, index) => (
          <motion.button
            key={option}
            className="w-full p-4 rounded bg-gray-800 border border-cyan-500 text-left relative overflow-hidden"
            style={{ boxShadow: `0 0 10px ${neonColors[index % neonColors.length]}` }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleVote(option)}
            onMouseEnter={() => setHoveredOption(option)}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <div className="text-lg text-cyan-400">{option}</div>
            <div className="text-3xl text-white">{votes[option]}</div>
            {hoveredOption === option && (
              <motion.div
                className="absolute inset-0 bg-cyan-500 opacity-20"
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
