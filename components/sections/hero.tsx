"use client"

// TypeScript declaration for dotlottie-player web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': any;
    }
  }
}

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, DollarSign, Award, Activity, Coins, UserCheck, ShieldCheck, Trophy, CircleDollarSign, UsersRound, ShieldCheckIcon, TrophyIcon, LineChart, Calculator, PieChart, Target, Gauge, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  const [currentStat, setCurrentStat] = useState(0)
  const bitcoinIconRef = useRef<HTMLDivElement>(null)
  const ethereumIconRef = useRef<HTMLDivElement>(null)
  const lottieIconRef = useRef<HTMLDivElement>(null)
  const lottieReactIconRef = useRef<HTMLDivElement>(null)

  const stats = [
    { value: "$850K+", label: "Paid to Traders", icon: CircleDollarSign },
    { value: "15,000+", label: "Active Traders", icon: UsersRound },
    { value: "24/7", label: "Support", icon: ShieldCheck },
    { value: "99.9%", label: "Uptime", icon: Trophy },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [stats.length])

  // GSAP Animation for floating background icons
  useEffect(() => {
    const icons = [bitcoinIconRef.current, ethereumIconRef.current, lottieIconRef.current, lottieReactIconRef.current].filter(Boolean)

    icons.forEach((icon, index) => {
      if (!icon) return

      // Initial position setup
      gsap.set(icon, {
        rotation: 0,
        scale: 1,
      })

      // Create floating animation with different parameters for each icon
      const floatDistance = 12 + (index * 4) // Different float distances
      const duration = 3.5 + (index * 0.5) // Different durations
      const delay = index * 1.2 // Staggered start times

      // Main floating animation (gentle for background elements)
      gsap.to(icon, {
        y: -floatDistance,
        rotation: index % 2 === 0 ? 5 : -5, // Alternate tilt directions
        duration: duration,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: delay,
      })

      // Add subtle scale animation
      gsap.to(icon, {
        scale: 1.04,
        duration: duration * 0.8,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: delay + 0.5,
      })

      // Add gentle continuous rotation
      gsap.to(icon, {
        rotation: `+=${index % 2 === 0 ? 180 : -180}`,
        duration: 25 + (index * 5),
        ease: "none",
        repeat: -1,
        delay: delay,
      })

      // Add subtle pulsing glow effect
      gsap.to(icon, {
        filter: "brightness(1.08) saturate(1.03)",
        duration: 2.8 + (index * 0.4),
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: delay + 1.5,
      })
    })
  }, [])

  // Load dotlottie-wc web component script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs'
    script.type = 'module'
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <section className="relative pt-32 lg:pt-40 overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950" />

        {/* Subtle accent gradients */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-950/[0.03] to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-teal-950/[0.03] to-transparent" />
      </div>

      {/* Floating Background Icons */}
      {/* Bitcoin Icon - Left Side Background */}
      <div
        ref={bitcoinIconRef}
        className="hero-crypto-icon hero-crypto-bitcoin absolute top-16 sm:top-20 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 opacity-25 sm:opacity-25 md:opacity-25 lg:opacity-30 z-5"
        style={{
          filter: "drop-shadow(0 2px 10px rgba(251, 146, 60, 0.4)) drop-shadow(0 0 20px rgba(255, 193, 7, 0.2))"
        }}
      >
        {/* Professional Bitcoin Image */}
        <Image
          src="/bitcoin-btc-logo.svg"
          alt="Bitcoin"
          width={256}
          height={256}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Ethereum Icon - Mid Left Background */}
      <div
        ref={ethereumIconRef}
        className="hero-crypto-icon hero-crypto-ethereum absolute top-1/2 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 opacity-25 sm:opacity-25 md:opacity-25 lg:opacity-30 z-5"
        style={{
          filter: "drop-shadow(0 2px 10px rgba(255, 193, 7, 0.4)) drop-shadow(0 0 20px rgba(251, 191, 36, 0.2))"
        }}
      >
        {/* Professional Ethereum Image */}
        <Image
          src="/etherium.png"
          alt="Ethereum"
          width={256}
          height={256}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Lottie Animation - Mid Right Background */}
      <div
        ref={lottieIconRef}
        className="hero-crypto-icon hero-crypto-lottie absolute top-1/3 right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 opacity-25 sm:opacity-25 md:opacity-25 lg:opacity-30 z-5"
        style={{
          filter: "drop-shadow(0 2px 10px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 20px rgba(147, 197, 253, 0.2))"
        }}
      >
        {/* Professional Lottie Animation - Web Component */}
        <dotlottie-player
          src="https://lottie.host/b3c4d7f6-bb64-4384-ad8f-7e90058f6e72/4QBEGKirJq.lottie"
          background="transparent"
          speed="1"
          style={{ width: '100%', height: '100%' }}
          loop
          autoplay
        ></dotlottie-player>
      </div>

      {/* DotLottieReact Component - Top Right Background */}
      <div
        ref={lottieReactIconRef}
        className="hero-crypto-icon hero-crypto-lottie-react absolute top-16 sm:top-20 right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 opacity-25 sm:opacity-25 md:opacity-25 lg:opacity-30 z-5"
        style={{
          filter: "drop-shadow(0 2px 10px rgba(16, 185, 129, 0.4)) drop-shadow(0 0 20px rgba(20, 184, 166, 0.2))"
        }}
      >
        {/* Professional Lottie Animation - React Component */}
        <DotLottieReact
          src="https://lottie.host/7c6d026a-40a9-43e5-b159-464d9401e806/q3OWzbxoxa.lottie"
          loop
          autoplay
          style={{ width: '100%', height: '100%', transform: 'rotate(0deg)' }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Professional Announcement */}
          <div className="inline-flex items-center space-x-2 mb-8">
            <Badge className="glass-card px-6 py-2 text-sm font-medium border shadow-glow-gold-subtle" style={{
              color: '#B8A082',
              borderColor: 'rgba(184, 160, 130, 0.2)',
              background: 'rgba(184, 160, 130, 0.1)'
            }}>
              <Zap className="w-4 h-4 mr-2" style={{ color: '#A0956B' }} />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className={`hero-stat-card relative bg-slate-900/40 border-slate-800/50 backdrop-blur-sm hover:scale-105 ${
                  index === currentStat ? "shadow-glow-gold active" : ""
                }`}

              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <div className="golden-icon-modern flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 group relative">
                      {/* Inner highlight overlay */}
                      <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                      {/* Icon with enhanced styling */}
                      <stat.icon
                        className="w-6 h-6 sm:w-8 sm:h-8 text-black transition-all duration-500 group-hover:scale-125 relative z-10"
                        strokeWidth={2.5}
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      />
                      {/* Gradient overlay for depth */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-gradient-gold">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</div>
                  {index === currentStat && (
                    <div className="absolute inset-0 rounded-lg animate-pulse pointer-events-none hero-stat-pulse" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Professional CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto gradient-primary hover:shadow-glow-emerald text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold transition-all duration-300 group hover:scale-105 shadow-2xl"
              >
                Start Trading Today
                <ArrowRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

          </div>


        </div>
      </div>
    </section>
  )
}
