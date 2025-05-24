import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Маршруты, требующие аутентификации 
const protectedRoutes = ['/admin', '/moderator', '/profile'] as const
const adminRoutes = ['/admin'] as const
const moderatorRoutes = ['/moderator']

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value
  const pathname = request.nextUrl.pathname

  // Если маршрут защищенный и пользователь не авторизован
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Если есть пользователь, проверяем права доступа
  if (user) {
    const userData = JSON.parse(user)

    // Проверка доступа к админ маршрутам
    if (adminRoutes.some(route => pathname.startsWith(route)) && userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Проверка доступа к модератор маршрутам
    if (moderatorRoutes.some(route => pathname.startsWith(route)) && 
        userData.role !== 'admin' && userData.role !== 'moderator') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Проверка доступа к профилю
    if (pathname.startsWith('/profile/') && 
        !pathname.includes(`/profile/${userData.id}`) && 
        userData.role !== 'admin' && 
        userData.role !== 'moderator') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/moderator/:path*', '/profile/:path*']
} 