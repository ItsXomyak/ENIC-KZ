"use client"

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

// Интервал синхронизации в миллисекундах
const SYNC_INTERVAL = 1000 * 60 * 5 // 5 минут

export function SyncRole() {
  const { getToken } = useAuth()
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const syncUserRole = async () => {
      try {
        const token = await getToken()
        const response = await fetch('/api/sync-role', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (!response.ok) {
          console.warn('Ошибка синхронизации роли:', await response.text())
          return
        }
        
        const result = await response.json()
        console.debug('Роль успешно синхронизирована:', result)
      } catch (err) {
        console.error('Ошибка при синхронизации роли:', err)
      } finally {
        timeoutId = setTimeout(syncUserRole, SYNC_INTERVAL)
      }
    }

    syncUserRole()
    return () => clearTimeout(timeoutId)
  }, [getToken])

  return null
} 