"use client"

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SyncRole() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    const syncRole = async () => {
      try {
        const response = await fetch('/api/sync-role')
        if (!response.ok) throw new Error('Failed to sync role')
        const data = await response.json()
        
        // Проверяем, изменилась ли роль
        const currentRole = user?.publicMetadata?.role
        if (currentRole !== data.role) {
          // Если роль изменилась, обновляем страницу
          router.refresh()
        }
      } catch (error) {
        console.error('Error syncing role:', error)
      }
    }

    if (isLoaded && user) {
      syncRole()
    }
  }, [user, isLoaded, router])

  return null
} 