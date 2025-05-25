 'use client'

 import { useState, useEffect } from 'react'
 import { useRouter } from 'next/navigation'
 import { withAuth } from '@/components/auth/with-auth'

 function StatisticsPage() {
		const router = useRouter()
		const [grafanaUrl, setGrafanaUrl] = useState('http://localhost:3000')

		useEffect(() => {
			const envGrafanaUrl = process.env.NEXT_PUBLIC_GRAFANA_URL
			if (envGrafanaUrl) {
				setGrafanaUrl(envGrafanaUrl)
			}
		}, [])

		return (
			<div className='min-h-screen bg-[#0B1120] text-white'>
				<div className='container mx-auto py-8 px-4'>
					<div className='flex items-center justify-between mb-8'>
						<h1 className='text-3xl font-bold'>Статистика</h1>
						<button
							onClick={() => router.push('/admin')}
							className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
						>
							Назад
						</button>
					</div>

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* Основной дашборд */}
						<div className='bg-[#1A2234] rounded-lg p-6'>
							<h2 className='text-xl font-semibold mb-4'>
								Системный мониторинг
							</h2>
							<div className='aspect-video'>
								<iframe
									src={`${grafanaUrl}/d/default/enic-kz-monitoring?orgId=1&kiosk=true`}
									width='100%'
									height='100%'
									frameBorder='0'
									className='rounded'
								/>
							</div>
						</div>

						{/* Статистика пользователей */}
						<div className='bg-[#1A2234] rounded-lg p-6'>
							<h2 className='text-xl font-semibold mb-4'>
								Статистика пользователей
							</h2>
							<div className='aspect-video'>
								<iframe
									src={`${grafanaUrl}/d/users/user-statistics?orgId=1&kiosk=true`}
									width='100%'
									height='100%'
									frameBorder='0'
									className='rounded'
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
 }

 export default withAuth(StatisticsPage, {
		requiredRoles: ['admin', 'root_admin'],
 })