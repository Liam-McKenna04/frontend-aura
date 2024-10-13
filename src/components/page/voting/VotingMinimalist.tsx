"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface VotingProps {
  question: string // New prop for the question
  categories: string[]
  votes: Record<string, number>
  setVotes: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

export default function VotingMinimalist({ question, categories, votes, setVotes }: VotingProps) {
  const [selected, setSelected] = useState<string>("")

  const handleVote = () => {
    if (selected) {
      setVotes(prev => ({ ...prev, [selected]: prev[selected] + 1 }))
      setSelected("")
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{question}</h2>
      <RadioGroup value={selected} onValueChange={setSelected} className="space-y-2">
        {categories.map((option) => (
          <div key={option} className="flex items-center justify-between">
            <div className="flex items-center">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="ml-2">
                {option}
              </Label>
            </div>
            <span className="text-sm text-gray-500">{votes[option]} votes</span>
          </div>
        ))}
      </RadioGroup>
      <Button onClick={handleVote} className="mt-4 w-full" disabled={!selected}>
        Vote
      </Button>
    </div>
  )
}
