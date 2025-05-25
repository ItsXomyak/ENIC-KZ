"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useApi } from "@/lib/hooks/use-api"
import { toast } from "sonner"

interface AskQuestionProps {
  onQuestionCreated?: () => void
}

export function AskQuestion({ onQuestionCreated }: AskQuestionProps) {
  const [question, setQuestion] = useState("")
  const { post, isLoading } = useApi()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) {
      toast.error("Пожалуйста, введите ваш вопрос")
      return
    }

    const result = await post("/api/questions", { question })
    if (result) {
      setQuestion("")
      toast.success("Вопрос успешно отправлен")
      onQuestionCreated?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Введите ваш вопрос..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Отправка..." : "Задать вопрос"}
      </Button>
    </form>
  )
} 