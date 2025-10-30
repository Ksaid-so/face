import { NextRequest, NextFetchEvent } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Public paths that don't require authentication
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/api/auth',
    '/api/health',
    '/_next',
    '/favicon.ico',
    '/robots.txt'
  ]
  
  const { pathname } = request.nextUrl
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname.startsWith(path)
  )
  
  // Get the JWT token
  const token = await getToken({ req: request })
  
  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // If there's no token and it's not a public path, redirect to login
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  
  // For authenticated users, check role-based access if needed
  // This is where you could implement more granular access control
  
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}