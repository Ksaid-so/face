'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { 
  PackageIcon, 
  ShoppingCartIcon, 
  BarChartIcon, 
  UsersIcon, 
  SettingsIcon, 
  LogOutIcon,
  MenuIcon
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: PackageIcon, roles: ['STAFF', 'MANAGER', 'ADMIN'] },
  { name: 'Point of Sale', href: '/pos', icon: ShoppingCartIcon, roles: ['STAFF', 'MANAGER', 'ADMIN'] },
  { name: 'Inventory', href: '/inventory', icon: PackageIcon, roles: ['MANAGER', 'ADMIN'] },
  { name: 'Sales', href: '/sales', icon: BarChartIcon, roles: ['MANAGER', 'ADMIN'] },
  { name: 'Expenses', href: '/expenses', icon: BarChartIcon, roles: ['MANAGER', 'ADMIN'] },
  { name: 'Users', href: '/users', icon: UsersIcon, roles: ['ADMIN'] },
  { name: 'Settings', href: '/settings', icon: SettingsIcon, roles: ['ADMIN'] },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession() as { data: CustomSession | null }
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Remove the useEffect that redirects unauthenticated users since that's handled by ProtectedRoute

  const userRole = session?.user?.role || 'STAFF'
  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes('STAFF') || 
    item.roles.includes(userRole)
  )

  const handleLogout = async () => {
    try {
      // Call our custom logout API to clear user context
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      // Sign out from NextAuth
      const { signOut } = await import('next-auth/react')
      await signOut({ redirect: false })
      
      // Redirect to login page
      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar trigger */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 md:hidden"
          >
            <MenuIcon className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <div className="flex items-center gap-2">
                <PackageIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">BoltPOS</span>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="border-t p-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="border-b p-4">
          <div className="flex items-center gap-2">
            <PackageIcon className="h-6 w-6" />
            <span className="text-lg font-semibold">BoltPOS</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="hidden items-center justify-between border-b bg-background px-6 py-4 md:flex">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session?.user?.name || session?.user?.email || 'User'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {session?.user?.role || 'STAFF'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/auth/profile')}
            >
              Profile
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}