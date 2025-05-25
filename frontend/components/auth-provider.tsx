'use client'

import type React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'

type User = {
	id: string
	email: string
	role: 'user' | 'admin' | 'root_admin'
} | null

type AuthContextType = {
	user: User
	login: (email: string, password: string) => Promise<boolean>
	logout: () => void
	register: (email: string, password: string) => Promise<boolean>
	isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api/v1'

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User>(null)
	const [isLoading, setIsLoading] = useState(true)

	// Check if user is logged in on initial load
	useEffect(() => {
		const checkAuth = async () => {
			try {
				console.log('Current cookies:', document.cookie)
				const response = await fetch(`${API_URL}/auth/validate`, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				})

				if (response.ok) {
					const userData = await response.json()
					console.log('Initial auth check - user data:', userData)

					const user = {
						id: userData.user_id,
						email: userData.email,
						role: userData.role,
					}

					setUser(user)
					console.log('Initial auth check - user state:', user)
				} else {
					console.log('Initial auth check failed - response not ok')
					setUser(null)
				}
			} catch (error) {
				console.error('Auth check failed:', error)
				setUser(null)
			} finally {
				setIsLoading(false)
			}
		}

		checkAuth()
	}, [])

	const login = async (email: string, password: string): Promise<boolean> => {
		setIsLoading(true)

		try {
			const response = await fetch(`${API_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include', // Important for cookies
				body: JSON.stringify({ email, password }),
			})

			// Логируем заголовки ответа
			console.log(
				'Login response headers:',
				Object.fromEntries(response.headers.entries())
			)
			console.log('Login response cookies:', document.cookie)

			console.log('Login response:', await response.clone().json())
			console.log('Login cookies:', document.cookie)

			if (response.ok) {
				// After successful login, fetch user data
				await new Promise(resolve => setTimeout(resolve, 100)) // Небольшая задержка, чтобы кука успела установиться

				const validateResponse = await fetch(`${API_URL}/auth/validate`, {
					method: 'GET',
					credentials: 'include', // Это заставит браузер отправить куки
				})

				// Логируем заголовки запроса validate
				console.log('Validate request cookies:', document.cookie)
				console.log('Validate response status:', validateResponse.status)

				console.log('Validate response:', validateResponse.status)
				if (!validateResponse.ok) {
					const errorText = await validateResponse.text()
					console.log('Validate error:', errorText)
				}

				if (validateResponse.ok) {
					const userData = await validateResponse.json()
					console.log('User data from validate:', userData)

					const user = {
						id: userData.user_id,
						email: userData.email,
						role: userData.role,
					}

					setUser(user)
					console.log('User state after setting:', user)
					return true
				}
			}

			return false
		} catch (error) {
			console.error('Login failed:', error)
			return false
		} finally {
			setIsLoading(false)
		}
	}

	const register = async (
		email: string,
		password: string
	): Promise<boolean> => {
		setIsLoading(true)

		try {
			const response = await fetch(`${API_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			if (response.ok) {
				return true
			}

			return false
		} catch (error) {
			console.error('Registration failed:', error)
			return false
		} finally {
			setIsLoading(false)
		}
	}

	const logout = async () => {
		try {
			await fetch(`${API_URL}/auth/logout`, {
				method: 'POST',
				credentials: 'include',
			})
		} catch (error) {
			console.error('Logout failed:', error)
		} finally {
			setUser(null)
		}
	}

	return (
		<AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
