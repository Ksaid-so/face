'use client'

import DashboardOverview from '@/components/dashboard/DashboardOverview'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface CustomSession {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    id?: string
  }
  expires: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string }
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-gray-400 border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <DashboardOverview />
    </div>
  )
}
