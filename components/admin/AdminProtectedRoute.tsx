'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminAuth } from '@/lib/admin-auth-context'

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAdminAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Don't protect the login page itself
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated && !isLoginPage) {
      // Add a small delay to prevent race conditions
      const timer = setTimeout(() => {
        router.push('/admin/login')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isAdminAuthenticated, isLoading, router, isLoginPage])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Checking admin access...</p>
        </div>
      </div>
    )
  }

  // If on login page, always render children (no protection needed)
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show nothing while redirecting (only for protected pages)
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Redirecting to admin login...</p>
        </div>
      </div>
    )
  }

  // Render children if authenticated
  return <>{children}</>
}
