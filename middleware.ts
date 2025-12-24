import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('sportify-auth-storage')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  const isPublicPage = isAuthPage || request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/api')

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPage) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If has token and trying to access login page, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
