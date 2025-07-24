'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/admin-auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  TrendingUp,
  BarChart3,
  Users,
  Settings
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const { adminLogin, isAdminAuthenticated, isLoading: authLoading } = useAdminAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAdminAuthenticated) {
      router.push('/admin')
    }
  }, [isAdminAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simple delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500))

    const success = adminLogin(username, password)

    if (success) {
      // Small delay to ensure state is set before redirect
      setTimeout(() => {
        router.push('/admin')
      }, 100)
    } else {
      setError('Invalid username or password')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950" />
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-10 opacity-[0.04] animate-float">
          <Shield className="w-16 h-16 text-emerald-400" />
        </div>
        <div className="absolute top-1/3 right-10 opacity-[0.05] animate-float">
          <BarChart3 className="w-20 h-20 text-emerald-400" />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-[0.03] animate-float">
          <TrendingUp className="w-24 h-24 text-emerald-400" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
          <Users className="w-32 h-32 text-emerald-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          <Card className="glass-card border-slate-800/50 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                FlashFundX Admin
              </CardTitle>
              <p className="text-slate-400 font-medium">
                Administrative Portal Access
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Username Field */}
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-semibold text-slate-300">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter admin username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-12 h-12 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-12 pr-12 h-12 font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 h-12"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Authenticating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Access Admin Portal
                    </div>
                  )}
                </Button>
              </form>

              {/* Admin Features */}
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <p className="text-xs text-slate-400 text-center mb-4">Admin Portal Features</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-400">User Management</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <BarChart3 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-400">Analytics</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-400">Order Management</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Settings className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-400">System Settings</p>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <p className="text-xs text-slate-400 text-center">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Secure administrative access for FlashFundX platform management
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
