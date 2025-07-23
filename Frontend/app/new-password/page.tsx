'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
  Shield,
  Check,
  X,
} from 'lucide-react'

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

function NewPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updatePassword } = useAuth()

  const email = searchParams?.get('email') || ''
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const getPasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) score++
    else feedback.push('At least 8 characters')

    if (/[a-z]/.test(password)) score++
    else feedback.push('One lowercase letter')

    if (/[A-Z]/.test(password)) score++
    else feedback.push('One uppercase letter')

    if (/\d/.test(password)) score++
    else feedback.push('One number')

    if (/[^a-zA-Z0-9]/.test(password)) score++
    else feedback.push('One special character')

    let color = 'red'
    if (score >= 4) color = 'green'
    else if (score >= 3) color = 'yellow'
    else if (score >= 2) color = 'orange'

    return { score, feedback, color }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (passwordStrength.score < 4) {
      setError('Please create a stronger password')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await updatePassword(password)

      if (error) {
        setError(error.message)
        return
      }

      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="glass-card border-slate-800/50 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Password Updated!
              </CardTitle>
              <p className="text-slate-400 font-medium">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl"
              >
                Continue to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/login"
            className="inline-flex items-center text-slate-400 hover:text-emerald-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          <Card className="glass-card border-slate-800/50 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Create New Password
              </CardTitle>
              <p className="text-slate-400 font-medium">
                Create a strong password for your account security.
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

                {/* New Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-300">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-12 pr-12 h-12 font-medium"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-slate-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrength.color === 'red' ? 'bg-red-500' :
                              passwordStrength.color === 'orange' ? 'bg-orange-500' :
                              passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.color === 'red' ? 'text-red-400' :
                          passwordStrength.color === 'orange' ? 'text-orange-400' :
                          passwordStrength.color === 'yellow' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {passwordStrength.score < 2 ? 'Weak' :
                           passwordStrength.score < 4 ? 'Medium' : 'Strong'}
                        </span>
                      </div>
                      
                      {passwordStrength.feedback.length > 0 && (
                        <div className="space-y-1">
                          {passwordStrength.feedback.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs">
                              <X className="w-3 h-3 text-red-400" />
                              <span className="text-slate-400">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-12 pr-12 h-12 font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {confirmPassword && password !== confirmPassword && (
                    <div className="flex items-center space-x-2 text-xs">
                      <X className="w-3 h-3 text-red-400" />
                      <span className="text-red-400">Passwords do not match</span>
                    </div>
                  )}
                  
                  {confirmPassword && password === confirmPassword && (
                    <div className="flex items-center space-x-2 text-xs">
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">Passwords match</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || passwordStrength.score < 4 || password !== confirmPassword}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating Password...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Update Password
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <NewPasswordContent />
    </Suspense>
  )
}
