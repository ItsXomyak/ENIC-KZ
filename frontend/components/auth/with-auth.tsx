"use client"

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
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
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading) {
        // Если требуется аутентификация и пользователь не авторизован
        if (requireAuth && !user) {
          router.push('/login')
          return
        }

        // Если требуются определенные роли
        if (requiredRoles && user) {
          const hasRequiredRole = requiredRoles.includes(user.role)
          if (!hasRequiredRole) {
            router.push('/')
            return
          }
        }
      }
    }, [user, isLoading, router])

    // Показываем загрузку или ничего, пока проверяем авторизацию
    if (isLoading || (requireAuth && !user) || (requiredRoles && user && !requiredRoles.includes(user.role))) {
      return null
    }

    return <WrappedComponent {...props} />
  }
} 