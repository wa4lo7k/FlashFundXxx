"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, TrendingUp, Shield, Zap, BarChart3, DollarSign, Users, Award, Activity } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  const [currentStat, setCurrentStat] = useState(0)

  const stats = [
    { value: "$2.4M+", label: "Paid to Traders", icon: DollarSign },
    { value: "15,000+", label: "Active Traders", icon: Users },
    { value: "24/7", label: "Support", icon: Shield },
    { value: "99.9%", label: "Uptime", icon: Award },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [stats.length])

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950" />

        {/* Professional trading chart background */}
        <div className="absolute top-20 right-10 opacity-[0.08] animate-float">
          <svg width="400" height="280" viewBox="0 0 400 280" className="text-emerald-400">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="candleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Candlestick Chart */}
            <g className="animate-pulse">
              {/* Bullish candles */}
              <rect x="30" y="120" width="12" height="40" fill="url(#candleGradient)" rx="2" />
              <rect x="60" y="100" width="12" height="60" fill="url(#candleGradient)" rx="2" />
              <rect x="90" y="130" width="12" height="30" fill="url(#candleGradient)" rx="2" />
              <rect x="120" y="80" width="12" height="80" fill="url(#candleGradient)" rx="2" />
              <rect x="150" y="110" width="12" height="50" fill="url(#candleGradient)" rx="2" />
              <rect x="180" y="70" width="12" height="90" fill="url(#candleGradient)" rx="2" />
              <rect x="210" y="125" width="12" height="35" fill="url(#candleGradient)" rx="2" />
              <rect x="240" y="85" width="12" height="75" fill="url(#candleGradient)" rx="2" />
              <rect x="270" y="115" width="12" height="45" fill="url(#candleGradient)" rx="2" />
              <rect x="300" y="75" width="12" height="85" fill="url(#candleGradient)" rx="2" />

              {/* Wicks */}
              <line x1="36" y1="110" x2="36" y2="170" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="66" y1="90" x2="66" y2="170" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="96" y1="120" x2="96" y2="170" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="126" y1="70" x2="126" y2="170" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="156" y1="100" x2="156" y2="170" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="186" y1="60" x2="186" y2="170" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="216" y1="115" x2="216" y2="170" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="246" y1="75" x2="246" y2="170" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="276" y1="105" x2="276" y2="170" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <line x1="306" y1="65" x2="306" y2="170" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            </g>

            {/* Trend line */}
            <path
              d="M30 150 L60 140 L90 145 L120 130 L150 135 L180 120 L210 140 L240 125 L270 130 L300 115"
              stroke="#0d9488"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              opacity="0.7"
              className="animate-pulse"
            />

            {/* Area under curve */}
            <path
              d="M30 150 L60 140 L90 145 L120 130 L150 135 L180 120 L210 140 L240 125 L270 130 L300 115 L300 200 L30 200 Z"
              fill="url(#chartGradient)"
            />
          </svg>
        </div>

        {/* Professional trading icons */}
        <div className="absolute top-1/4 left-10 opacity-[0.06] animate-float">
          <div className="relative">
            <TrendingUp className="w-20 h-20 text-emerald-400" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400/20 rounded-full flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 right-20 opacity-[0.06] animate-float" style={{ animationDelay: "2s" }}>
          <div className="relative">
            <BarChart3 className="w-18 h-18 text-teal-400" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-400/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-3 h-3 text-teal-400" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-1/3 left-1/3 opacity-[0.06] animate-float" style={{ animationDelay: "4s" }}>
          <div className="relative">
            <Shield className="w-16 h-16 text-emerald-400" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400/20 rounded-full flex items-center justify-center">
              <Award className="w-2.5 h-2.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Professional grid overlay */}
        <div className="absolute top-1/4 left-1/2 opacity-[0.03]">
          <svg width="300" height="200" viewBox="0 0 300 200" className="text-emerald-400">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Data points */}
            <circle cx="50" cy="80" r="3" fill="currentColor" opacity="0.6" />
            <circle cx="100" cy="60" r="3" fill="currentColor" opacity="0.6" />
            <circle cx="150" cy="90" r="3" fill="currentColor" opacity="0.6" />
            <circle cx="200" cy="50" r="3" fill="currentColor" opacity="0.6" />
            <circle cx="250" cy="70" r="3" fill="currentColor" opacity="0.6" />

            {/* Connecting lines */}
            <path
              d="M50 80 L100 60 L150 90 L200 50 L250 70"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Subtle accent gradients */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-950/[0.03] to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-teal-950/[0.03] to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Professional Announcement */}
          <div className="inline-flex items-center space-x-2 mb-8">
            <Badge className="glass-card text-emerald-300 px-6 py-2 text-sm font-medium border border-emerald-500/20">
              <Zap className="w-4 h-4 mr-2" />
              Instant Funding Available • No Evaluation Required
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.85] tracking-tight">
            <span className="text-gradient-primary">Fund Your Future</span>
            <br />
            <span className="text-white font-light">Grow with Confidence</span>
          </h1>

          {/* Professional Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 mb-12 max-w-5xl mx-auto leading-relaxed font-light">
            Join thousands of successful traders with{" "}
            <span className="text-emerald-400 font-semibold">instant funding up to $500K</span>.
            <br />
            Professional-grade infrastructure with institutional execution.
          </p>

          {/* Enhanced Stats Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`relative glass-card p-6 rounded-2xl transition-all duration-700 hover:scale-105 border border-slate-800/30 ${
                  index === currentStat ? "animate-pulse-glow border-emerald-500/20 shadow-glow-emerald" : ""
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-emerald-400 mb-2" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                {index === currentStat && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {/* Professional CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/signup">
              <Button
                size="lg"
                className="gradient-primary hover:shadow-glow-emerald text-white px-12 py-6 text-xl font-semibold transition-all duration-300 group hover:scale-105 shadow-2xl"
              >
                Start Trading Today
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 px-12 py-6 text-xl group bg-transparent shadow-xl"
            >
              <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Professional Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            <div className="flex items-center space-x-2 text-sm text-slate-400 font-medium">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>15,000+ Active Traders</span>
            </div>
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full" />
              ))}
              <span className="ml-2 text-sm text-slate-400 font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400 font-medium">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Regulated & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
