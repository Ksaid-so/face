'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Icons } from '@/components/ui/icons'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'MANAGER' | 'STAFF'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    if (requiredRole && session.user.role !== 'ADMIN' && session.user.role !== requiredRole) {
      router.push('/unauthorized')
    }
  }, [session, status, router, requiredRole])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (requiredRole && session.user.role !== 'ADMIN' && session.user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}