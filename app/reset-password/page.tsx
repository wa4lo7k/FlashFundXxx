"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ArrowRight,
  Users,
  Award,
  Activity,
  Check,
  X,
} from "lucide-react"

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

function ResetPasswordForm() {
  const router = useRouter()
  const { updatePassword } = useAuth()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (token) {
      validateToken(token)
    } else {
      setTokenValid(false)
    }
  }, [token])

  const validateToken = async (resetToken: string) => {
    try {
      // Simulate token validation
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Simulate random token validity for demo
      const isValid = Math.random() > 0.2
      setTokenValid(isValid)
    } catch (error) {
      setTokenValid(false)
    }
  }

  const getPasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push("At least 8 characters")
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push("One uppercase letter")
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push("One lowercase letter")
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push("One number")
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push("One special character")
    }

    let color = "red"
    if (score >= 4) color = "emerald"
    else if (score >= 3) color = "yellow"
    else if (score >= 2) color = "orange"

    return { score, feedback, color }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (passwordStrength.score < 4) {
      setError("Please create a stronger password")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await updatePassword(password)

      if (error) {
        setError(error.message)
        return
      }

      setIsSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="glass-card border-slate-800/50 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Invalid Reset Link
              </CardTitle>
              <p className="text-slate-400 text-sm leading-relaxed">
                This password reset link is invalid or has expired.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/forgot-password">
                <Button className="w-full gradient-primary hover:shadow-glow-emerald transition-all duration-300 h-12">
                  Request New Reset Link
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-12">
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="glass-card border-slate-800/50 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Password Reset Successful
              </CardTitle>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-emerald-400 text-sm font-medium">
                  🎉 Welcome back! Your account is secure and ready for trading.
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full gradient-primary hover:shadow-glow-emerald transition-all duration-300 h-12">
                  Continue to Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="glass-card border-slate-800/50 shadow-2xl">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Validating reset link...</p>
              </div>
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

        {/* Trading Chart Background */}
        <div className="absolute top-20 right-10 opacity-[0.04] animate-float">
          <svg width="300" height="200" viewBox="0 0 300 200" className="text-emerald-400">
            <defs>
              <linearGradient id="resetNewChartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M20 140 L50 120 L80 130 L110 100 L140 110 L170 80 L200 90 L230 60 L260 70 L280 50"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M20 140 L50 120 L80 130 L110 100 L140 110 L170 80 L200 90 L230 60 L260 70 L280 50 L280 180 L20 180 Z"
              fill="url(#resetNewChartGradient)"
            />
          </svg>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-10 opacity-[0.05] animate-float">
          <Lock className="w-16 h-16 text-emerald-400" />
        </div>
        <div className="absolute bottom-1/3 right-20 opacity-[0.05] animate-float" style={{ animationDelay: "2s" }}>
          <Shield className="w-14 h-14 text-teal-400" />
        </div>

        {/* Subtle gradients */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-950/[0.02] to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-teal-950/[0.02] to-transparent" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="relative">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow-emerald">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-slate-900" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-gradient-primary">FlashFundX</span>
                <div className="text-xs text-slate-400 font-medium">Professional Trading Platform</div>
              </div>
            </div>

            {/* Password Security Info */}
            <div className="space-y-6 mb-8">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Create New Password
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Choose a strong password to keep your trading account secure and protected.
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-300 font-medium">Advanced Encryption</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-teal-400" />
                </div>
                <span className="text-slate-300 font-medium">Secure Password Storage</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300 font-medium">Account Protection</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="glass-card p-4 rounded-xl border border-emerald-500/20">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-lg font-bold text-white">15K+</div>
                    <div className="text-xs text-slate-400">Secure Accounts</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-teal-500/20">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-teal-400" />
                  <div>
                    <div className="text-lg font-bold text-white">99.9%</div>
                    <div className="text-xs text-slate-400">Security Rate</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-blue-500/20">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-lg font-bold text-white">24/7</div>
                    <div className="text-xs text-slate-400">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Card className="glass-card border-slate-800/50 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-emerald-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Set New Password
                </CardTitle>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Create a strong password for your account security.
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-300">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="glass-card border-slate-700/50 text-white placeholder:text-slate-500 pl-11 pr-11 h-12 text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-${passwordStrength.color}-400 transition-all duration-300`}
                              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium text-${passwordStrength.color}-400`}>
                            {passwordStrength.score < 2 ? 'Weak' : 
                             passwordStrength.score < 4 ? 'Medium' : 'Strong'}
                          </span>
                        </div>
                        {passwordStrength.feedback.length > 0 && (
                          <div className="text-xs text-slate-400 space-y-1">
                            <p>Password must include:</p>
                            <div className="grid grid-cols-1 gap-1">
                              {passwordStrength.feedback.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <X className="w-3 h-3 text-red-400" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
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
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="glass-card border-slate-700/50 text-white placeholder:text-slate-500 pl-11 pr-11 h-12 text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-red-400 text-xs flex items-center space-x-1">
                        <X className="w-3 h-3" />
                        <span>Passwords do not match</span>
                      </p>
                    )}
                    {confirmPassword && password === confirmPassword && password && (
                      <p className="text-emerald-400 text-xs flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Passwords match</span>
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || passwordStrength.score < 4 || password !== confirmPassword}
                    className="w-full gradient-primary hover:shadow-glow-emerald transition-all duration-300 h-12 text-base font-semibold disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Help Text */}
            <div className="text-center mt-6">
              <p className="text-slate-500 text-xs">
                Remember your password?{" "}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="glass-card border-slate-800/50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto"></div>
                <p className="text-slate-400 mt-4">Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
