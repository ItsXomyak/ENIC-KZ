"use client"

import { useParams } from 'next/navigation'
import { withAuth } from '@/components/auth/with-auth'
import { useUser } from '@clerk/nextjs'

function ProfilePage() {
  const { id } = useParams()
  const { user } = useUser()

  // Проверяем, имеет ли пользователь доступ к этому профилю
  const userRole = user?.publicMetadata.role as string
  const canViewProfile = user?.id === id || userRole === 'admin' || userRole === 'moderator'

  if (!canViewProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Доступ запрещен</h1>
        <p className="text-gray-600">У вас нет прав для просмотра этого профиля.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Профиль пользователя</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Личная информация</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">ID:</label>
                <p className="mt-1">{id}</p>
              </div>
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
                <p className="mt-1">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Оборачиваем компонент в HOC с требованием аутентификации
export default withAuth(ProfilePage) 