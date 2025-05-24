"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Lock, MessageSquare } from "lucide-react"

interface UserQuestion {
  id: string
  question: string
  answer?: string
  status: "pending" | "answered"
  createdAt: string
}

export default function ProfilePage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Mock user data
  const userEmail = "user@example.com"
  const userQuestions: UserQuestion[] = [
    {
      id: "1",
      question: "Как подать заявку на признание диплома?",
      answer: "Для подачи заявки необходимо заполнить форму на странице признания и приложить необходимые документы.",
      status: "answered",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      question: "Сколько времени занимает процедура аккредитации?",
      status: "pending",
      createdAt: "2024-01-20",
    },
  ]

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Пароли не совпадают")
      return
    }
    // Handle password change logic
    alert("Пароль успешно изменен")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Пароль
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Мои вопросы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Информация профиля</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={userEmail} disabled className="bg-gray-50" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Смена пароля</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Текущий пароль</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">Новый пароль</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handlePasswordChange} className="w-full">
                  Изменить пароль
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Мои вопросы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userQuestions.map((question) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{question.question}</h3>
                        <Badge variant={question.status === "answered" ? "default" : "secondary"}>
                          {question.status === "answered" ? "Отвечен" : "Ожидает ответа"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Дата: {new Date(question.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                      {question.answer && (
                        <>
                          <Separator className="my-2" />
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm font-medium mb-1">Ответ:</p>
                            <p className="text-sm">{question.answer}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
