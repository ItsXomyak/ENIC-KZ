"use client"

import { withAuth } from "@/components/auth/with-auth"
import { useUser, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { QuestionsList } from "@/components/questions-list"

function ProfilePage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const userRole = user?.publicMetadata.role as string

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Мой профиль</h1>
        <Button variant="destructive" onClick={() => signOut()}>
          Выйти из аккаунта
        </Button>
      </div>
      
      <div className="grid gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Личная информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Email:</label>
              <p className="mt-1">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Имя:</label>
              <p className="mt-1">{user?.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Роль:</label>
              <p className="mt-1">{userRole || "Пользователь"}</p>
            </div>
          </div>
        </div>

        {(userRole === "admin" || userRole === "moderator") && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Панель управления</h2>
            <div className="space-x-4">
              {userRole === "admin" && (
                <Button asChild>
                  <Link href="/admin">Панель администратора</Link>
                </Button>
              )}
              <Button asChild>
                <Link href="/moderator">Панель модератора</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Мои вопросы</h2>
          <QuestionsList />
        </div>
      </div>
    </div>
  )
}

export default withAuth(ProfilePage)
