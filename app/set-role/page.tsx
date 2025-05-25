"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SetRolePage() {
  const router = useRouter()
  const { user } = useUser()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      const { role } = await response.json()

      // Обновляем роль пользователя в метаданных Clerk
      await user?.update({
        publicMetadata: {
          role
        }
      })

      // Перенаправляем на соответствующую страницу
      if (role === "admin") {
        router.push("/admin")
      } else if (role === "moderator") {
        router.push("/moderator")
      } else {
        router.push("/profile")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка при установке роли")
    } finally {
      setIsLoading(false)
    }
  }

  const skipSetup = () => {
    // Устанавливаем роль "user" по умолчанию
    user?.update({
      publicMetadata: {
        role: "user"
      }
    }).then(() => {
      router.push("/profile")
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Установка роли</CardTitle>
            <CardDescription>
              Введите пароль для получения роли администратора или модератора.
              Если у вас нет пароля, вы будете зарегистрированы как обычный пользователь.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Пароль для роли</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль для роли"
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <div className="space-x-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Установка роли..." : "Установить роль"}
                </Button>
                <Button type="button" variant="outline" onClick={skipSetup} disabled={isLoading}>
                  Пропустить
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 