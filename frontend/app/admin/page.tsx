'use client'

import { useRouter } from 'next/navigation'
import { withAuth } from '@/components/auth/with-auth'

function AdminPage() {
	const router = useRouter()

	return (
		<div className='min-h-screen bg-[#0B1120] text-white'>
			<div className='container mx-auto py-8 px-4'>
				<h1 className='text-3xl font-bold mb-8'>Панель администратора</h1>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{/* Управление пользователями */}
					<div
						onClick={() => router.push('/admin/users')}
						className='bg-[#1A2234] rounded-lg p-6 hover:bg-[#232B3D] transition-colors cursor-pointer'
					>
						<h2 className='text-xl font-semibold mb-4'>
							Управление пользователями
						</h2>
						<p className='text-gray-400'>
							Управление пользователями, ролями и правами доступа
						</p>
					</div>

					{/* Статистика */}
					<div
						onClick={() => router.push('/admin/statistics')}
						className='bg-[#1A2234] rounded-lg p-6 hover:bg-[#232B3D] transition-colors cursor-pointer'
					>
						<h2 className='text-xl font-semibold mb-4'>Статистика</h2>
						<p className='text-gray-400'>Просмотр статистики и аналитики</p>
					</div>

					{/* Настройки системы */}
					<div
						onClick={() => router.push('/admin/settings')}
						className='bg-[#1A2234] rounded-lg p-6 hover:bg-[#232B3D] transition-colors cursor-pointer'
					>
						<h2 className='text-xl font-semibold mb-4'>Настройки системы</h2>
						<p className='text-gray-400'>
							Управление настройками и конфигурацией системы
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withAuth(AdminPage, { requiredRoles: ['admin', 'root_admin'] })
