"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Shield,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Activity,
  Zap,
  Target,
  BarChart3,
  DollarSign,
  Star,
} from "lucide-react"

export default function EmailVerifiedPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const nextSteps = [
    {
      icon: Target,
      title: "Choose Your Challenge",
      description: "Select from our range of trading challenges",
      color: "emerald",
    },
    {
      icon: DollarSign,
      title: "Fund Your Account",
      description: "Complete payment to activate your challenge",
      color: "teal",
    },
    {
      icon: BarChart3,
      title: "Start Trading",
      description: "Begin your journey to becoming a funded trader",
      color: "blue",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % nextSteps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [nextSteps.length])

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950" />

        {/* Success Celebration Background */}
        <div className="absolute top-20 right-10 opacity-[0.06] animate-float">
          <svg width="400" height="300" viewBox="0 0 400 300" className="text-emerald-400">
            <defs>
              <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.4" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Success Chart Pattern */}
            <path
              d="M50 200 L100 150 L150 120 L200 80 L250 60 L300 40 L350 20"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M50 200 L100 150 L150 120 L200 80 L250 60 L300 40 L350 20 L350 250 L50 250 Z"
              fill="url(#successGradient)"
            />
            {/* Success Stars */}
            <g className="animate-pulse">
              <circle cx="100" cy="150" r="3" fill="currentColor" opacity="0.8" />
              <circle cx="200" cy="80" r="4" fill="currentColor" opacity="0.6" />
              <circle cx="300" cy="40" r="3" fill="currentColor" opacity="0.9" />
            </g>
          </svg>
        </div>

        {/* Floating Success Icons */}
        <div className="absolute top-1/4 left-10 opacity-[0.08] animate-float">
          <CheckCircle className="w-20 h-20 text-emerald-400" />
        </div>
        <div className="absolute bottom-1/3 right-20 opacity-[0.06] animate-float" style={{ animationDelay: "2s" }}>
          <Star className="w-16 h-16 text-teal-400" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-[0.04] animate-float" style={{ animationDelay: "4s" }}>
          <Zap className="w-14 h-14 text-blue-400" />
        </div>

        {/* Enhanced gradients for celebration */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-950/[0.08] to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-teal-950/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Celebration */}
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

            {/* Welcome Message */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1">
                  Account Verified
                </Badge>
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight">
                Welcome to the Future of Trading
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Your email has been verified! You're now ready to join thousands of successful traders and start your journey to financial freedom.
              </p>
            </div>

            {/* Next Steps Preview */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-white">Your Next Steps:</h3>
              {nextSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-500 ${
                    currentStep === index 
                      ? `bg-${step.color}-500/20 border border-${step.color}-500/30` 
                      : 'bg-slate-800/30 border border-slate-700/30'
                  }`}
                >
                  <div className={`w-10 h-10 bg-${step.color}-500/20 rounded-lg flex items-center justify-center`}>
                    <step.icon className={`w-5 h-5 text-${step.color}-400`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{step.title}</div>
                    <div className="text-xs text-slate-400">{step.description}</div>
                  </div>
                  {currentStep === index && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Success Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4 rounded-xl border border-emerald-500/20">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-lg font-bold text-white">15K+</div>
                    <div className="text-xs text-slate-400">Funded Traders</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-teal-500/20">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-teal-400" />
                  <div>
                    <div className="text-lg font-bold text-white">$2.4M+</div>
                    <div className="text-xs text-slate-400">Total Payouts</div>
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

        {/* Right Side - Success Card & Actions */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Card className="glass-card border-slate-800/50 shadow-2xl">
              <CardHeader className="text-center pb-6">
                {/* Animated Success Icon */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl animate-pulse" />
                  <div className="absolute inset-2 bg-emerald-500/30 rounded-xl animate-ping" />
                  <div className="relative w-full h-full bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                  </div>
                </div>

                <CardTitle className="text-3xl font-bold text-white mb-3">
                  🎉 Email Verified!
                </CardTitle>
                <p className="text-slate-400 text-base leading-relaxed">
                  Congratulations! Your account is now fully activated and ready for trading.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Success Message */}
                <div className="text-center p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Star className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Account Fully Activated</span>
                      <Star className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-emerald-300 text-sm">
                      You now have access to all platform features including trading challenges, dashboard, and support.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Link href="/dashboard">
                    <Button className="w-full gradient-primary hover:shadow-glow-emerald transition-all duration-300 h-14 text-lg font-semibold">
                      <BarChart3 className="w-6 h-6 mr-3" />
                      Access Your Dashboard
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </Link>

                  <Link href="/dashboard/place-order">
                    <Button 
                      variant="outline" 
                      className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 h-12 text-base font-medium transition-all duration-300"
                    >
                      <Target className="w-5 h-5 mr-2" />
                      Start Your First Challenge
                    </Button>
                  </Link>
                </div>

                {/* Quick Tips */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-300 text-center">Quick Tips to Get Started:</h4>
                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <span>Explore your dashboard to understand account rules</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                      <span>Choose a challenge that matches your trading style</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span>Join our community for tips and support</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Help */}
            <div className="text-center mt-6 space-y-2">
              <p className="text-slate-500 text-xs">
                Need help getting started?{" "}
                <Link href="/support" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Contact our support team
                </Link>
              </p>
              <p className="text-slate-600 text-xs">
                Or check out our{" "}
                <Link href="/help" className="text-teal-400 hover:text-teal-300 transition-colors">
                  getting started guide
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
