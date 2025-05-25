'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { withAuth } from '@/components/auth/with-auth'

function SettingsPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const handleSaveSettings = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		// Здесь будет логика сохранения настроек
		setIsLoading(false)
	}

	return (
		<div className='min-h-screen bg-[#0B1120] text-white'>
			<div className='container mx-auto py-8 px-4'>
				<div className='flex items-center justify-between mb-8'>
					<h1 className='text-3xl font-bold'>Настройки системы</h1>
					<button
						onClick={() => router.push('/admin')}
						className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
					>
						Назад
					</button>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Основные настройки */}
					<div className='bg-[#1A2234] rounded-lg p-6'>
						<h2 className='text-xl font-semibold mb-4'>Основные настройки</h2>
						<form onSubmit={handleSaveSettings} className='space-y-4'>
							<div>
								<label className='block text-sm font-medium mb-2'>
									Название системы
								</label>
								<input
									type='text'
									className='w-full bg-[#232B3D] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
									placeholder='ENIC Kazakhstan'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium mb-2'>
									Email администратора
								</label>
								<input
									type='email'
									className='w-full bg-[#232B3D] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
									placeholder='admin@example.com'
								/>
							</div>

							<button
								type='submit'
								disabled={isLoading}
								className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors disabled:opacity-50'
							>
								{isLoading ? 'Сохранение...' : 'Сохранить настройки'}
							</button>
						</form>
					</div>

					{/* Настройки безопасности */}
					<div className='bg-[#1A2234] rounded-lg p-6'>
						<h2 className='text-xl font-semibold mb-4'>
							Настройки безопасности
						</h2>
						<form className='space-y-4'>
							<div>
								<label className='block text-sm font-medium mb-2'>
									Минимальная длина пароля
								</label>
								<input
									type='number'
									className='w-full bg-[#232B3D] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
									placeholder='8'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium mb-2'>
									Время жизни сессии (часы)
								</label>
								<input
									type='number'
									className='w-full bg-[#232B3D] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
									placeholder='24'
								/>
							</div>

							<button
								type='submit'
								className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors'
							>
								Сохранить настройки безопасности
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withAuth(SettingsPage, {
	requiredRoles: ['admin', 'root_admin'],
})
