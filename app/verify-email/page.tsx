"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Shield,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ArrowRight,
  Users,
  Award,
  Activity,
} from "lucide-react"

type VerificationStatus = "pending" | "verifying" | "success" | "error" | "expired"

function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")
  
  const [status, setStatus] = useState<VerificationStatus>("pending")
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const verifyEmail = async (verificationToken: string) => {
    setStatus("verifying")
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.3
      setStatus(isSuccess ? "success" : "error")
    } catch (error) {
      setStatus("error")
    }
  }

  const handleResendEmail = async () => {
    setIsResending(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setResendCooldown(60) // 60 second cooldown
    } catch (error) {
      console.error("Failed to resend email")
    } finally {
      setIsResending(false)
    }
  }

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: Mail,
          iconColor: "text-blue-400",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
          title: "Check Your Email",
          message: "We've sent a verification link to your email address.",
        }
      case "verifying":
        return {
          icon: RefreshCw,
          iconColor: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/30",
          title: "Verifying...",
          message: "Please wait while we verify your email address.",
        }
      case "success":
        return {
          icon: CheckCircle,
          iconColor: "text-emerald-400",
          bgColor: "bg-emerald-500/20",
          borderColor: "border-emerald-500/30",
          title: "Email Verified!",
          message: "Your email has been successfully verified. You can now access your dashboard.",
        }
      case "error":
        return {
          icon: XCircle,
          iconColor: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
          title: "Verification Failed",
          message: "The verification link is invalid or has expired. Please request a new one.",
        }
      case "expired":
        return {
          icon: Clock,
          iconColor: "text-orange-400",
          bgColor: "bg-orange-500/20",
          borderColor: "border-orange-500/30",
          title: "Link Expired",
          message: "This verification link has expired. Please request a new verification email.",
        }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950" />

        {/* Trading Chart Background */}
        <div className="absolute top-20 right-10 opacity-[0.04] animate-float">
          <svg width="300" height="200" viewBox="0 0 300 200" className="text-emerald-400">
            <defs>
              <linearGradient id="verifyChartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
              fill="url(#verifyChartGradient)"
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

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="mb-8">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow-emerald transition-all duration-300 group-hover:scale-105">
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
              </Link>
            </div>

            {/* Verification Benefits */}
            <div className="space-y-6 mb-8">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Secure Your Trading Journey
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Email verification ensures the security of your account and enables important notifications about your trading progress.
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-300 font-medium">Account Security Protection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-teal-400" />
                </div>
                <span className="text-slate-300 font-medium">Important Trading Notifications</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300 font-medium">Account Recovery Access</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="glass-card p-4 rounded-xl border border-emerald-500/20">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-lg font-bold text-white">15K+</div>
                    <div className="text-xs text-slate-400">Verified Traders</div>
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

        {/* Right Side - Verification Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Card className="glass-card border-slate-800/50 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className={`w-20 h-20 ${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <statusConfig.icon className={`w-10 h-10 ${statusConfig.iconColor} ${status === "verifying" ? "animate-spin" : ""}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {statusConfig.title}
                </CardTitle>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {statusConfig.message}
                </p>
                {email && (
                  <div className="mt-3">
                    <Badge className="bg-slate-800/50 text-slate-300 border-slate-700/50 px-3 py-1">
                      {email}
                    </Badge>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {status === "success" && (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <p className="text-emerald-400 text-sm font-medium">
                        🎉 Welcome to FlashFundX! Your account is now fully activated.
                      </p>
                    </div>
                    <Link href="/dashboard">
                      <Button className="w-full gradient-primary hover:shadow-glow-emerald transition-all duration-300 h-12 text-base font-semibold">
                        Access Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}

                {(status === "error" || status === "expired" || status === "pending") && (
                  <div className="space-y-4">
                    <Button
                      onClick={handleResendEmail}
                      disabled={isResending || resendCooldown > 0}
                      className="w-full gradient-primary hover:shadow-glow-emerald transition-all duration-300 h-12 text-base font-semibold disabled:opacity-50"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : resendCooldown > 0 ? (
                        `Resend in ${resendCooldown}s`
                      ) : (
                        <>
                          <Mail className="w-5 h-5 mr-2" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center">
                      <Link 
                        href="/login" 
                        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                      >
                        Back to Login
                      </Link>
                    </div>
                  </div>
                )}

                {status === "verifying" && (
                  <div className="text-center">
                    <div className="animate-pulse text-slate-400 text-sm">
                      This may take a few moments...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help Text */}
            <div className="text-center mt-6">
              <p className="text-slate-500 text-xs">
                Having trouble? Contact our{" "}
                <Link href="/support" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
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
      <VerifyEmailForm />
    </Suspense>
  )
}
