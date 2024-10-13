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

export default function VotingElegant({ question, categories, votes, setVotes }: VotingProps) {
  const [selected, setSelected] = useState<string>("")

  const handleVote = () => {
    if (selected) {
      setVotes(prev => ({ ...prev, [selected]: prev[selected] + 1 }))
      setSelected("")
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-gray-50 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-serif mb-6 text-center text-gray-800">
        {question}
      </h2>
      <div className="space-y-4">
        {categories.map((option) => (
          <motion.button
            key={option}
            className={`w-full p-4 rounded-md text-left relative overflow-hidden ${
              selected === option ? "bg-gray-200" : "bg-white"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(option)}
          >
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-800 font-serif">{option}</span>
              <span className="text-sm text-gray-500">{votes[option]} votes</span>
            </div>
            {selected === option && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gray-800"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      <motion.button
        className="mt-6 w-full py-2 px-4 bg-gray-800 text-white rounded-md font-serif"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleVote}
        disabled={!selected}
      >
        Cast Your Vote
      </motion.button>
    </div>
  )
}
