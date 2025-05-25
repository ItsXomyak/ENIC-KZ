"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@clerk/nextjs"
import { useApi } from "@/lib/hooks/use-api"
import { toast } from "sonner"
import { AskQuestion } from "./ask-question"

interface Question {
  id: string
  question: string
  answer?: string
  status: "PENDING" | "ANSWERED"
  createdAt: string
  user: {
    email: string
  }
}

export function QuestionsList() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState("")
  const { user } = useUser()
  const userRole = user?.publicMetadata.role as string
  const { get, post, isLoading } = useApi()

  const canAnswer = userRole === "ADMIN" || userRole === "MODERATOR"

  const fetchQuestions = async () => {
    const data = await get<Question[]>("/api/questions")
    if (data) {
      setQuestions(data)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleAnswerSubmit = async (questionId: string) => {
    if (!answerText.trim()) {
      toast.error("Пожалуйста, введите ответ")
      return
    }

    const result = await post(`/api/questions/${questionId}/answer`, { answer: answerText })
    if (result) {
      setSelectedQuestion(null)
      setAnswerText("")
      fetchQuestions()
      toast.success("Ответ успешно отправлен")
    }
  }

  return (
    <div className="space-y-6">
      {userRole === "USER" && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Задать вопрос</h2>
          <AskQuestion onQuestionCreated={fetchQuestions} />
        </div>
      )}

      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    От: {question.user.email} • {new Date(question.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={question.status === "ANSWERED" ? "default" : "secondary"}>
                  {question.status === "ANSWERED" ? "Отвечен" : "Ожидает ответа"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {question.answer && (
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="font-medium mb-1">Ответ:</p>
                  <p>{question.answer}</p>
                </div>
              )}
              {canAnswer && question.status === "PENDING" && (
                <div className="mt-4">
                  {selectedQuestion === question.id ? (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Введите ответ..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        disabled={isLoading}
                      />
                      <div className="space-x-2">
                        <Button 
                          onClick={() => handleAnswerSubmit(question.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Отправка..." : "Отправить ответ"}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedQuestion(null)}
                          disabled={isLoading}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => setSelectedQuestion(question.id)}>
                      Ответить
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 