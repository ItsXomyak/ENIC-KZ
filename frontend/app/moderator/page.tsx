"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MessageSquare, Users, Ban } from "lucide-react"
import { withAuth } from '@/components/auth/with-auth'

interface Question {
  id: string
  userEmail: string
  question: string
  answer?: string
  status: "pending" | "answered"
  createdAt: string
}

interface User {
  id: string
  email: string
  role: "user" | "moderator" | "admin"
  status: "active" | "blocked"
  createdAt: string
}

function ModeratorPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [answerText, setAnswerText] = useState("")

  // Mock data
  const questions: Question[] = [
    {
      id: "1",
      userEmail: "user1@example.com",
      question: "Как подать заявку на признание диплома?",
      status: "pending",
      createdAt: "2024-01-20",
    },
    {
      id: "2",
      userEmail: "user2@example.com",
      question: "Сколько времени занимает аккредитация?",
      answer: "Процедура аккредитации занимает от 3 до 6 месяцев.",
      status: "answered",
      createdAt: "2024-01-18",
    },
  ]

  const users: User[] = [
    {
      id: "1",
      email: "user1@example.com",
      role: "user",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: "2",
      email: "user2@example.com",
      role: "user",
      status: "active",
      createdAt: "2024-01-08",
    },
    {
      id: "3",
      email: "moderator@example.com",
      role: "moderator",
      status: "active",
      createdAt: "2024-01-05",
    },
    {
      id: "4",
      email: "admin@example.com",
      role: "admin",
      status: "active",
      createdAt: "2024-01-01",
    },
  ]

  const handleAnswerQuestion = (question: Question) => {
    setSelectedQuestion(question)
    setAnswerText(question.answer || "")
  }

  const submitAnswer = () => {
    if (selectedQuestion && answerText.trim()) {
      // Handle answer submission logic
      alert("Ответ отправлен")
      setSelectedQuestion(null)
      setAnswerText("")
    }
  }

  const handleBlockUser = (userId: string) => {
    // Handle user blocking logic
    alert("Пользователь заблокирован")
  }

  const canBlockUser = (user: User) => {
    // Модераторы не могут блокировать других модераторов и администраторов
    return user.role === "user" && user.status === "active"
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "moderator":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "active" ? "default" : "destructive"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Панель модератора</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Модерация контента</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Проверка и модерация пользовательского контента
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Отчеты</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Просмотр отчетов о нарушениях
          </p>
        </div>
      </div>
    </div>
  )
}

// Оборачиваем компонент в HOC с требованием роли модератора или администратора
export default withAuth(ModeratorPage, { requiredRoles: ['moderator', 'admin'] })
