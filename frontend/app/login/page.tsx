'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/components/auth-provider'
import { useToast } from '@/components/ui/use-toast'




export default function LoginPage() {
	const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
	const [registerErrorMessage, setRegisterErrorMessage] = useState<string>('');
	const router = useRouter()
	const { login, register } = useAuth()
	const { toast } = useToast()
	const [isLoading, setIsLoading] = useState(false)

	// Login form state
	const [loginData, setLoginData] = useState({
		email: '',
		password: '',
	})

	// Register form state
	const [registerData, setRegisterData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	})

	// Form validation errors
	const [errors, setErrors] = useState({
		login: {
			email: '',
			password: '',
		},
		register: {
			email: '',
			password: '',
			confirmPassword: '',
		},
	})

	const handleLoginSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoginErrorMessage('');

		// Reset errors
		setErrors({
			...errors,
			login: { email: '', password: '' },
		})

		// Validate form
		let isValid = true
		if (!loginData.email) {
			setErrors(prev => ({
				...prev,
				login: { ...prev.login, email: 'Email is required' },
			}))
			isValid = false
		}

		if (!loginData.password) {
			setErrors(prev => ({
				...prev,
				login: { ...prev.login, password: 'Password is required' },
			}))
			isValid = false
		}

		if (!isValid) return

		setIsLoading(true)

		try {
			const success = await login(loginData.email, loginData.password)

			if (success) {
				toast({
					title: 'Login successful',
					description: 'You have been logged in successfully.',
				})
				router.push('/')
				router.refresh()
			} else {
				setLoginErrorMessage('Неверный логин или пароль');
			}
		} catch (error: any) {
			if (error.response?.status === 404) {
				setLoginErrorMessage('Аккаунт с таким email не найден');
			} else {
				setLoginErrorMessage('Ошибка сервера, попробуйте позже');
			}
		} finally {
			setIsLoading(false);
		}
	}

	const handleRegisterSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setRegisterErrorMessage('');

		// Reset errors
		setErrors({
			...errors,
			register: { email: '', password: '', confirmPassword: '' },
		})

		// Validate form
		let isValid = true
		if (!registerData.email) {
			setErrors(prev => ({
				...prev,
				register: { ...prev.register, email: 'Email is required' },
			}))
			isValid = false
		} else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
			setErrors(prev => ({
				...prev,
				register: { ...prev.register, email: 'Email is invalid' },
			}))
			isValid = false
		}

		if (!registerData.password) {
			setErrors(prev => ({
				...prev,
				register: { ...prev.register, password: 'Password is required' },
			}))
			isValid = false
		} else if (registerData.password.length < 6) {
			setErrors(prev => ({
				...prev,
				register: {
					...prev.register,
					password: 'Password must be at least 8 characters',
				},
			}))
			isValid = false
		}

		if (registerData.password !== registerData.confirmPassword) {
			setErrors(prev => ({
				...prev,
				register: {
					...prev.register,
					confirmPassword: 'Passwords do not match',
				},
			}))
			isValid = false
		}

		if (!isValid) return

		setIsLoading(true)

		try {
			const success = await register(registerData.email, registerData.password)

			if (success) {
				toast({
					title: 'Registration successful',
					description: 'Please check your email to confirm your account.',
				})
				router.push('/login') // Редиректим на страницу логина после успешной регистрации
			} else {
				setRegisterErrorMessage('Не удалось зарегистрироваться');
			}
		} catch (error: any) {
			if (error.response?.status === 409) {
				setRegisterErrorMessage('Пользователь с таким email уже существует');
			} else {
				setRegisterErrorMessage('Ошибка сервера, попробуйте позже');
			}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className='container mx-auto px-4 py-12'>
			<div className='max-w-md mx-auto'>
				<Tabs defaultValue='login'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='login'>Login</TabsTrigger>
						<TabsTrigger value='register'>Register</TabsTrigger>
					</TabsList>
					<TabsContent value='login'>
						<Card>
							<CardHeader>
								<CardTitle>Login</CardTitle>
								<CardDescription>
									Enter your credentials to access your account
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleLoginSubmit} className='space-y-4'>
									<div className='space-y-2'>
										<Label htmlFor='email'>Email</Label>
										<Input
											id='email'
											type='email'
											placeholder='Enter your email'
											value={loginData.email}
											onChange={e =>
												setLoginData({ ...loginData, email: e.target.value })
											}
										/>
										{errors.login.email && (
											<p className='text-sm text-red-500'>
												{errors.login.email}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='password'>Password</Label>
										<Input
											id='password'
											type='password'
											placeholder='Enter your password'
											value={loginData.password}
											onChange={e =>
												setLoginData({ ...loginData, password: e.target.value })
											}
										/>
										{errors.login.password && (
											<p className='text-sm text-red-500'>
												{errors.login.password}
											</p>
										)}
									</div>
									<div className='text-sm'>
										<Link
											href='/forgot-password'
											className='text-blue-600 hover:underline'
										>
											Forgot password?
										</Link>
									</div>
									<Button type='submit' className='w-full' disabled={isLoading}>
										{isLoading ? 'Logging in...' : 'Login'}
									</Button>
								</form>
								{loginErrorMessage && (
									<p className="mt-2 text-sm text-red-500">{loginErrorMessage}</p>
								)}
							</CardContent>
							<CardFooter className='flex justify-center'>
								<div className='text-sm text-gray-500'>
									Don't have an account?{' '}
									<button
										onClick={() =>
											document.getElementById('register-tab')?.click()
										}
										className='text-blue-600 hover:underline'
									>
										Register
									</button>
								</div>
							</CardFooter>
						</Card>
					</TabsContent>
					<TabsContent value='register' id='register-tab'>
						<Card>
							<CardHeader>
								<CardTitle>Register</CardTitle>
								<CardDescription>Create a new account</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleRegisterSubmit} className='space-y-4'>
									<div className='space-y-2'>
										<Label htmlFor='register-email'>Email</Label>
										<Input
											id='register-email'
											type='email'
											placeholder='Enter your email'
											value={registerData.email}
											onChange={e =>
												setRegisterData({
													...registerData,
													email: e.target.value,
												})
											}
										/>
										{errors.register.email && (
											<p className='text-sm text-red-500'>
												{errors.register.email}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='register-password'>Password</Label>
										<Input
											id='register-password'
											type='password'
											placeholder='Create a password'
											value={registerData.password}
											onChange={e =>
												setRegisterData({
													...registerData,
													password: e.target.value,
												})
											}
										/>
										{errors.register.password && (
											<p className='text-sm text-red-500'>
												{errors.register.password}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='confirm-password'>Confirm Password</Label>
										<Input
											id='confirm-password'
											type='password'
											placeholder='Confirm your password'
											value={registerData.confirmPassword}
											onChange={e =>
												setRegisterData({
													...registerData,
													confirmPassword: e.target.value,
												})
											}
										/>
										{errors.register.confirmPassword && (
											<p className='text-sm text-red-500'>
												{errors.register.confirmPassword}
											</p>
										)}
									</div>
									<Button type='submit' className='w-full' disabled={isLoading}>
										{isLoading ? 'Registering...' : 'Register'}
									</Button>
								</form>
								{registerErrorMessage && (
									<p className="mt-2 text-sm text-red-500">{registerErrorMessage}</p>
								)}
							</CardContent>
							<CardFooter className='flex justify-center'>
								<div className='text-sm text-gray-500'>
									Already have an account?{' '}
									<button
										onClick={() =>
											document.getElementById('login-tab')?.click()
										}
										className='text-blue-600 hover:underline'
									>
										Login
									</button>
								</div>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
