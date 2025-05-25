'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { useEffect } from 'react'

type Role = 'user' | 'admin' | 'root_admin'

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

		// Временно отключена вся защита - просто возвращаем компонент
		console.log('Auth check disabled - rendering component directly')
		return <WrappedComponent {...props} />
	}
}
