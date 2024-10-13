"use client"

import { motion } from "framer-motion"

interface VotingProps {
  question: string // New prop for the question
  categories: string[]
  votes: Record<string, number>
  setVotes: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

export default function VotingPlayful({ question, categories, votes, setVotes }: VotingProps) {
  const handleVote = (option: string) => {
    setVotes(prev => ({ ...prev, [option]: prev[option] + 1 }))
  }

  const colors = ["bg-pink-400", "bg-blue-400", "bg-green-400", "bg-purple-400"]

  return (
    <div className="max-w-md mx-auto p-6 bg-yellow-100 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">{question}</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((option, index) => (
          <motion.button
            key={option}
            className={`${colors[index % colors.length]} p-4 rounded-xl shadow-md text-white font-semibold`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote(option)}
          >
            <div className="text-lg mb-2">{option}</div>
            <div className="text-3xl">{votes[option]}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
