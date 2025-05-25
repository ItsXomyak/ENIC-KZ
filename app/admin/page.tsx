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
import { MessageSquare, Users, Trash2, Ban } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { withAuth } from '@/components/auth/with-auth'
import { QuestionsList } from "@/components/questions-list"

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

function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([
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
  ])

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "user1@example.com",
      role: "user",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: "2",
      email: "moderator@example.com",
      role: "moderator",
      status: "active",
      createdAt: "2024-01-05",
    },
    {
      id: "3",
      email: "blocked@example.com",
      role: "user",
      status: "blocked",
      createdAt: "2024-01-01",
    },
  ])

  const handleAnswerQuestion = async (questionId: string, answer: string) => {
    // В реальном приложении здесь будет API запрос
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, answer, status: "answered" as const }
        : q
    ))
  }

  const handleBlockUser = async (userId: string) => {
    // В реальном приложении здесь будет API запрос
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, status: u.status === "active" ? "blocked" : "active" }
        : u
    ))
  }

  const handleDeleteUser = (userId: string) => {
    // Handle user deletion logic
    alert("Пользователь удален")
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
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
      
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="questions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Вопросы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление пользователями</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "destructive" : user.role === "moderator" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "default" : "destructive"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Ban className="h-4 w-4 mr-1" />
                              {user.status === "active" ? "Заблокировать" : "Разблокировать"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {user.status === "active" ? "Заблокировать пользователя" : "Разблокировать пользователя"}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите {user.status === "active" ? "заблокировать" : "разблокировать"} пользователя {user.email}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleBlockUser(user.id)}>
                                Подтвердить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Вопросы пользователей</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionsList
                questions={questions}
                canAnswer={true}
                onAnswer={handleAnswerQuestion}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Оборачиваем компонент в HOC с требованием роли админа
export default withAuth(AdminPage, { requiredRoles: ["admin"] })
