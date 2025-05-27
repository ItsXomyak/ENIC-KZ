'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { withAuth } from '@/components/auth/with-auth'
import { useAuth } from '@/components/auth-provider'

interface User {
	id: string
	email: string
	role: string
	createdAt: string
}

const API_BASE = 'http://localhost:8085/api/v1'

const formatDate = (dateString: string) => {
	const isoString = dateString.replace(' ', 'T')
	const date = new Date(isoString)
	return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString()
  }

function UsersPage() {
	const router = useRouter()
	const { user: currentUser } = useAuth()
	const [users, setUsers] = useState<User[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetchUsers()
	}, [])

	const fetchUsers = async () => {
		setIsLoading(true)
		try {
			const response = await fetch(`${API_BASE}/admin/users`, {
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
			})
			if (response.ok) {
				const data = await response.json()
				setUsers(data)
			} else {
				console.error('Failed to fetch users:', response.status)
			}
		} catch (error) {
			console.error('Error fetching users:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const promoteUser = async (id: string) => {
		if (!confirm('Подтвердить повышение прав?')) return
		await fetch(`${API_BASE}/admin/promote`, {
		  method: 'POST',
		  credentials: 'include',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ userID: id }),
		})
		fetchUsers()
	  }

	  const demoteUser = async (id: string) => {
		if (!confirm('Подтвердить понижение прав?')) return
		await fetch(`${API_BASE}/admin/demote`, {
		  method: 'POST',
		  credentials: 'include',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ adminID: id }),
		})
		fetchUsers()
	  }

	  const deleteUser = async (id: string) => {
		if (!confirm('Удалить пользователя?')) return
		await fetch(`${API_BASE}/admin/users/delete`, {
		  method: 'DELETE',
		  credentials: 'include',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ userID: id }),
		})
		fetchUsers()
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
	
			<div className='bg-[#1A2234] rounded-lg p-6 overflow-x-auto'>
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
					<tr><td colSpan={4} className='text-center py-4'>Загрузка...</td></tr>
				  ) : users.length === 0 ? (
					<tr><td colSpan={4} className='text-center py-4'>Пользователи не найдены</td></tr>
				  ) : (
					users.map(user => {
					  const isSelf = currentUser?.id === user.id
					  const canPromote = user.role === 'user'
					  const canDemote = user.role === 'admin' && currentUser?.role === 'root_admin' && !isSelf
					  const canDelete = currentUser?.role === 'root_admin' && user.role !== 'root_admin'
	
					  return (
						<tr key={user.id} className='border-b border-gray-700'>
						  <td className='py-4 px-4'>{user.email}</td>
						  <td className='py-4 px-4'>
							<span className={`px-2 py-1 rounded text-sm ${
							  user.role === 'root_admin' ? 'bg-indigo-500' :
							  user.role === 'admin'      ? 'bg-purple-500' :
															'bg-green-500'
							}`}>
							  {user.role}
							</span>
						  </td>
						  <td className='py-4 px-4'>{formatDate(user.createdAt)}</td>
						  <td className='py-4 px-4'>
							<div className='flex gap-2'>
							  {canPromote && (
								<button onClick={() => promoteUser(user.id)} className='bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm transition-colors'>Повысить</button>
							  )}
							  {canDemote && (
								<button onClick={() => demoteUser(user.id)} className='bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm transition-colors'>Понизить</button>
							  )}
							  {canDelete && (
								<button onClick={() => deleteUser(user.id)} className='bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors'>Удалить</button>
							  )}
							</div>
						  </td>
						</tr>
					  )
					})
				  )}
				</tbody>
			  </table>
			</div>
		  </div>
		</div>
	  )
	}
	
	export default withAuth(UsersPage, { requiredRoles: ['admin', 'root_admin'] })
	