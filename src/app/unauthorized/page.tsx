'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-9xl font-bold text-gray-300">403</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Access Denied</h2>
        <p className="mt-2 text-lg text-gray-500">
          You don't have permission to access this page.
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push('/dashboard')}>
            Go back to dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}