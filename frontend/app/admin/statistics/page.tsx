'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { withAuth } from '@/components/auth/with-auth'

export default withAuth(function StatisticsPage() {
  const router = useRouter()
  const [base, setBase] = useState('')
  const [isListView, setIsListView] = useState(false)

  useEffect(() => {
    setBase(process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://localhost:3002')
  }, [])

  const panelUrls = [
    // Аутентификация и безопасность
    `${base}/d-solo/03f8c31f-b317-41c9-894d-994f2a2d5b66/enic-kz?orgId=1&timezone=browser&panelId=2&__feature.dashboardSceneSolo`,
    // Админ-панель
    `${base}/d-solo/03f8c31f-b317-41c9-894d-994f2a2d5b66/enic-kz?orgId=1&timezone=browser&panelId=1&__feature.dashboardSceneSolo`,
    // Новостная метрика
    `${base}/d-solo/03f8c31f-b317-41c9-894d-994f2a2d5b66/enic-kz?orgId=1&timezone=browser&panelId=5&__feature.dashboardSceneSolo`,
    // Производительность API-шлюза
    `${base}/d-solo/03f8c31f-b317-41c9-894d-994f2a2d5b66/enic-kz?orgId=1&timezone=browser&panelId=3&__feature.dashboardSceneSolo`,
    // Антивирус
    `${base}/d-solo/03f8c31f-b317-41c9-894d-994f2a2d5b66/enic-kz?orgId=1&timezone=browser&panelId=6&__feature.dashboardSceneSolo`,
    // Go-метрики
    `${base}/d-solo/03f8c31f-b317-41c9-894d-994f2a2d5b66/enic-kz?orgId=1&timezone=browser&panelId=4&__feature.dashboardSceneSolo`,
  ]

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl">Статистика</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/admin')} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Назад
          </button>
          <button onClick={() => setIsListView(!isListView)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
            {isListView ? 'Сетка' : 'Список'}
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${
        isListView 
          ? 'grid-cols-1' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {panelUrls.map((url, idx) => (
          <div
            key={idx}
            className={
              `bg-[#1A2234] rounded-lg overflow-hidden ${
                isListView ? 'h-[80vh]' : 'aspect-video'
              }`
            }
          >
            <iframe
              src={url}
              className="w-full h-full"
              frameBorder="0"
            />
          </div>
        ))}
      </div>
    </div>
  )
}, { requiredRoles: ['admin','root_admin'] })
