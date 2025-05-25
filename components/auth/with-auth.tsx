"use client"

import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

type Role = 'admin' | 'moderator' | 'user'

interface WithAuthProps {
  requiredRoles?: Role[]
  requireAuth?: boolean
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { requiredRoles, requireAuth = true }: WithAuthProps = {}
) {
  return function WithAuthComponent(props: P) {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    useEffect(() => {
      if (isLoaded) {
        // Если требуется аутентификация и пользователь не авторизован
        if (requireAuth && !user) {
          router.push('/sign-in')
          return
        }

        // Если требуются определенные роли
        if (requiredRoles && user) {
          // Получаем роль из публичных метаданных пользователя
          const userRole = user.publicMetadata.role as Role
          const hasRequiredRole = requiredRoles.includes(userRole)
          if (!hasRequiredRole) {
            router.push('/')
            return
          }
        }
      }
    }, [user, isLoaded, router])

    // Показываем загрузку или ничего, пока проверяем авторизацию
    if (!isLoaded || (requireAuth && !user) || (requiredRoles && user && !requiredRoles.includes(user.publicMetadata.role as Role))) {
      return null
    }

    return <WrappedComponent {...props} />
  }
} 