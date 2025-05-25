'use client'

import { Toaster } from 'sonner'
import QuestionsList from '@/components/QuestionsList'
import AskQuestion from '@/components/AskQuestion'
import { useState } from 'react'

export default function QuestionsPage() {
  const [key, setKey] = useState(0)

  const handleQuestionAdded = () => {
    setKey(prev => prev + 1)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Toaster position="top-center" />
      
      <h1 className="text-3xl font-bold mb-8 text-center">Вопросы и ответы</h1>
      
      <div className="space-y-8">
        <AskQuestion onQuestionAdded={handleQuestionAdded} />
        <QuestionsList key={key} />
      </div>
    </div>
  )
} 