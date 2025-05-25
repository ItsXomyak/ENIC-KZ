'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { withAuth } from '@/components/auth/with-auth'

interface User {
	id: string
	email: string
	role: string
	created_at: string
}

function UsersPage() {
	const router = useRouter()
	const [users, setUsers] = useState<User[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetchUsers()
	}, [])

	const fetchUsers = async () => {
		try {
			const response = await fetch('http://localhost:8085/api/v1/admin/users', {
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (response.ok) {
				const data = await response.json()
				setUsers(data)
			}
		} catch (error) {
			console.error('Error fetching users:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-[#0B1120] text-white'>
			<div className='container mx-auto py-8 px-4'>
				<div className='flex items-center justify-between mb-8'>
					<h1 className='text-3xl font-bold'>Управление пользователями</h1>
					<button
						onClick={() => router.push('/admin')}
						className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
					>
						Назад
					</button>
				</div>

				<div className='bg-[#1A2234] rounded-lg p-6'>
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead>
								<tr className='text-left border-b border-gray-700'>
									<th className='pb-3 px-4'>Email</th>
									<th className='pb-3 px-4'>Роль</th>
									<th className='pb-3 px-4'>Дата регистрации</th>
									<th className='pb-3 px-4'>Действия</th>
								</tr>
							</thead>
							<tbody>
								{isLoading ? (
									<tr>
										<td colSpan={4} className='text-center py-4'>
											Загрузка...
										</td>
									</tr>
								) : users.length === 0 ? (
									<tr>
										<td colSpan={4} className='text-center py-4'>
											Пользователи не найдены
										</td>
									</tr>
								) : (
									users.map(user => (
										<tr key={user.id} className='border-b border-gray-700'>
											<td className='py-4 px-4'>{user.email}</td>
											<td className='py-4 px-4'>
												<span
													className={`px-2 py-1 rounded text-sm ${
														user.role === 'admin'
															? 'bg-purple-500'
															: user.role === 'moderator'
															? 'bg-blue-500'
															: 'bg-gray-500'
													}`}
												>
													{user.role}
												</span>
											</td>
											<td className='py-4 px-4'>
												{new Date(user.created_at).toLocaleDateString()}
											</td>
											<td className='py-4 px-4'>
												<div className='flex gap-2'>
													<button className='bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm transition-colors'>
														Повысить
													</button>
													<button className='bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm transition-colors'>
														Понизить
													</button>
													<button className='bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors'>
														Удалить
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withAuth(UsersPage, { requiredRoles: ['admin', 'root_admin'] })
