"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  TrendingUp,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Activity,
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (!password) {
      setError("Password is required")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await signIn(email, password)

      if (error) {
        setError(error.message)
        return
      }

      // Successful login - redirect to dashboard
      router.push('/dashboard')

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
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
              <linearGradient id="loginChartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
              fill="url(#loginChartGradient)"
            />
          </svg>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-10 opacity-[0.05] animate-float">
          <TrendingUp className="w-16 h-16 text-emerald-400" />
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
            <div className="mb-8">
              <Image
                src="/logo 800 4.svg"
                alt="FlashFundX"
                width={310}
                height={200}
                className="h-14 w-auto"
              />
              <div className="text-xs text-slate-400 font-medium mt-2">Professional Trading Capital</div>
            </div>

            {/* Welcome Message */}
            <h1 className="text-4xl font-bold mb-6 text-white">Welcome Back, Trader</h1>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed font-light">
              Access your funded trading account and continue your journey to financial success.
            </p>

            {/* Trust Indicators */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300 font-medium">Secure & Encrypted Login</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300 font-medium">24/7 Account Access</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300 font-medium">Professional Support</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center glass-card p-4 rounded-xl border border-emerald-500/20">
                <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">15K+</div>
                <div className="text-xs text-slate-400">Active Traders</div>
              </div>
              <div className="text-center glass-card p-4 rounded-xl border border-teal-500/20">
                <Award className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">$850K+</div>
                <div className="text-xs text-slate-400">Paid Out</div>
              </div>
              <div className="text-center glass-card p-4 rounded-xl border border-blue-500/20">
                <Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">99.9%</div>
                <div className="text-xs text-slate-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Image
                src="/250 1.svg"
                alt="FlashFundX"
                width={195}
                height={126}
                className="h-10 w-auto"
              />
            </div>

            <Card className="glass border-slate-800/30 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-white mb-2">Sign In to Your Account</CardTitle>
                <p className="text-slate-400 font-medium">Enter your credentials to access your trading dashboard</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                      <p className="text-red-400 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                        className="border-slate-600"
                      />
                      <label htmlFor="remember" className="text-sm text-slate-400 font-medium">
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full gradient-primary shadow-glow-emerald text-white font-semibold h-12 hover:scale-105 transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-slate-400 font-medium">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <Badge className="glass-card text-emerald-300 border-emerald-500/30 font-medium">
                <Shield className="w-3 h-3 mr-2" />
                256-bit SSL Encrypted
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
