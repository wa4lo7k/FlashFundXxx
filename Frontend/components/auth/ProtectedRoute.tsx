'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireAdmin?: boolean
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User not authenticated, redirect to login
        router.push(redirectTo)
        return
      }

      if (requireAdmin) {
        // Check if user has admin role (you can customize this logic)
        const isAdmin = user.user_metadata?.role === 'admin' || 
                        user.email === 'admin@flashfundx.com'
        
        if (!isAdmin) {
          // User not admin, redirect to dashboard
          router.push('/dashboard')
          return
        }
      }
    }
  }, [user, loading, router, redirectTo, requireAdmin])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null
  }

  // Don't render children if admin is required but user is not admin
  if (requireAdmin) {
    const isAdmin = user.user_metadata?.role === 'admin' || 
                    user.email === 'admin@flashfundx.com'
    if (!isAdmin) {
      return null
    }
  }

  return <>{children}</>
}
