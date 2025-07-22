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
import {
  TrendingUp,
  Shield,
  Mail,
  ArrowLeft,
  CheckCircle,
  Clock,
  Users,
  Award,
  Activity,
  Lock,
} from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await resetPassword(email)

      if (error) {
        setError(error.message)
        return
      }

      // Redirect to code verification page
      router.push(`/verify-code?email=${encodeURIComponent(email)}&type=recovery`)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
        {/* Professional Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950" />

          {/* Trading Chart Background */}
          <div className="absolute top-20 right-10 opacity-[0.04] animate-float">
            <svg width="300" height="200" viewBox="0 0 300 200" className="text-emerald-400">
              <defs>
                <linearGradient id="resetChartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                fill="url(#resetChartGradient)"
              />
            </svg>
          </div>

          {/* Floating Icons */}
          <div className="absolute top-1/4 left-10 opacity-[0.05] animate-float">
            <Mail className="w-16 h-16 text-emerald-400" />
          </div>
          <div className="absolute bottom-1/3 right-20 opacity-[0.05] animate-float" style={{ animationDelay: "2s" }}>
            <Shield className="w-14 h-14 text-teal-400" />
          </div>

          {/* Subtle gradients */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-950/[0.02] to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-teal-950/[0.02] to-transparent" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Card className="glass-card border-slate-800/50 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Check Your Email
                </CardTitle>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We've sent a password reset link to your email address.
                </p>
                <div className="mt-3">
                  <Badge className="bg-slate-800/50 text-slate-300 border-slate-700/50 px-3 py-1">
                    {email}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Reset link expires in 15 minutes</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Check your spam folder if you don't see the email in your inbox.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 h-12"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Send Another Email
                  </Button>
                  
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-12"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Help Text */}
            <div className="text-center mt-6">
              <p className="text-slate-500 text-xs">
                Still having trouble?{" "}
                <Link href="/support" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
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
              <linearGradient id="forgotChartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
              fill="url(#forgotChartGradient)"
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
            <div className="mb-8">
              <Image
                src="/logo 800 4.svg"
                alt="FlashFundX"
                width={310}
                height={200}
                className="h-14 w-auto"
              />
              <div className="text-xs text-slate-400 font-medium mt-2">Professional Trading Platform</div>
            </div>

            {/* Reset Password Benefits */}
            <div className="space-y-6 mb-8">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Secure Account Recovery
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Reset your password securely and get back to trading. We'll send you a secure link to create a new password.
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-300 font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-teal-400" />
                </div>
                <span className="text-slate-300 font-medium">Encrypted Reset Process</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300 font-medium">15-Minute Expiry Links</span>
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
                <div className="w-20 h-20 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Reset Password
                </CardTitle>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        className="glass-card border-slate-700/50 text-white placeholder:text-slate-500 pl-11 h-12 text-base"
                        required
                      />
                    </div>
                    {error && (
                      <p className="text-red-400 text-sm">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full gradient-primary hover:shadow-glow-emerald transition-all duration-300 h-12 text-base font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link 
                      href="/login" 
                      className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Help Text */}
            <div className="text-center mt-6">
              <p className="text-slate-500 text-xs">
                Don't have an account?{" "}
                <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
