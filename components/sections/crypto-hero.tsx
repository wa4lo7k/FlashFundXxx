"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CryptoHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    // Set up GSAP timeline for floating animations
    const tl = gsap.timeline({ repeat: -1 })

    // Animate each of the 3 background icons with different timings and directions
    iconsRef.current.forEach((icon, index) => {
      if (!icon) return

      // Initial position setup
      gsap.set(icon, {
        rotation: 0,
        scale: 1,
      })

      // Create floating animation with different parameters for each icon
      const floatDistance = 12 + (index * 4) // Different float distances (smaller for background)
      const duration = 3 + (index * 0.4) // Different durations
      const delay = index * 0.8 // Staggered start times

      // Main floating animation (gentler for background elements)
      gsap.to(icon, {
        y: -floatDistance,
        rotation: index % 2 === 0 ? 6 : -6, // Alternate tilt directions (reduced for subtlety)
        duration: duration,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: delay,
      })

      // Add subtle scale animation (reduced for background elements)
      gsap.to(icon, {
        scale: 1.05,
        duration: duration * 0.9,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: delay + 0.4,
      })

      // Add gentle rotation animation (slower for background)
      gsap.to(icon, {
        rotation: `+=${index % 2 === 0 ? 180 : -180}`,
        duration: 20 + (index * 3),
        ease: "none",
        repeat: -1,
        delay: delay,
      })

      // Add subtle pulsing glow effect (gentler for background)
      gsap.to(icon, {
        filter: "brightness(1.1) saturate(1.05)",
        duration: 2.5 + (index * 0.3),
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: delay + 1.2,
      })
    })

    return () => {
      tl.kill()
    }
  }, [])

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !iconsRef.current.includes(el)) {
      iconsRef.current.push(el)
    }
  }

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f1419 0%, #1a2332 25%, #0d1b2a 50%, #1a2332 75%, #0f1419 100%)"
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #10b981 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, #059669 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, #047857 0%, transparent 50%)
            `,
            backgroundSize: "400px 400px, 300px 300px, 500px 500px",
            animation: "float 20s ease-in-out infinite"
          }}
        />
      </div>

      {/* Background Cryptocurrency & Security Icons */}
      {/* Bitcoin - Left Side Background */}
      <div
        ref={addToRefs}
        className="absolute top-20 left-4 sm:left-8 md:left-12 lg:left-16 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 opacity-20 sm:opacity-25 md:opacity-30 z-0"
        style={{
          filter: "drop-shadow(0 0 20px rgba(251, 146, 60, 0.3))"
        }}
      >
        {/* Bitcoin 3D Icon with Professional Styling */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600 flex items-center justify-center"
             style={{
               background: "linear-gradient(135deg, #f59e0b 0%, #f97316 25%, #ea580c 50%, #dc2626 75%, #b91c1c 100%)",
               boxShadow: "inset 0 2px 8px rgba(255, 255, 255, 0.3), inset 0 -2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(251, 146, 60, 0.4)"
             }}>
          {/* Inner highlight for 3D effect */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
          {/* Bitcoin symbol */}
          <div className="relative text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl drop-shadow-lg">₿</div>
          {/* Bottom shadow for depth */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 rounded-b-full bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      {/* Ethereum - Left Side Background (Lower) */}
      <div
        ref={addToRefs}
        className="absolute bottom-32 left-6 sm:left-12 md:left-16 lg:left-20 w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 opacity-20 sm:opacity-25 md:opacity-30 z-0"
        style={{
          filter: "drop-shadow(0 0 20px rgba(96, 165, 250, 0.3))"
        }}
      >
        {/* Ethereum 3D Icon with Professional Styling */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600 flex items-center justify-center"
             style={{
               background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 25%, #2563eb 50%, #1d4ed8 75%, #1e40af 100%)",
               boxShadow: "inset 0 2px 8px rgba(255, 255, 255, 0.3), inset 0 -2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(96, 165, 250, 0.4)"
             }}>
          {/* Inner highlight for 3D effect */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
          {/* Ethereum symbol */}
          <div className="relative text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl drop-shadow-lg">Ξ</div>
          {/* Bottom shadow for depth */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 rounded-b-full bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      {/* Security/Shield Icon - Right Side Background */}
      <div
        ref={addToRefs}
        className="absolute top-1/2 right-4 sm:right-8 md:right-12 lg:right-16 transform -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 opacity-20 sm:opacity-25 md:opacity-30 z-0"
        style={{
          filter: "drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))"
        }}
      >
        {/* Security Shield 3D Icon with Professional Styling */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Shield shape with 3D styling */}
          <div className="relative w-full h-full flex items-center justify-center"
               style={{
                 background: "linear-gradient(135deg, #10b981 0%, #059669 25%, #047857 50%, #065f46 75%, #064e3b 100%)",
                 clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                 boxShadow: "inset 0 2px 8px rgba(255, 255, 255, 0.3), inset 0 -2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(16, 185, 129, 0.4)"
               }}>
            {/* Inner highlight for 3D effect */}
            <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent"
                 style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
            {/* Security checkmark */}
            <div className="relative text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl drop-shadow-lg">✓</div>
            {/* Bottom shadow for depth */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"
                 style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight">
          Welcome to{" "}
          <span
            className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent"
            style={{
              textShadow: "0 0 30px rgba(16, 185, 129, 0.3)"
            }}
          >
            CryptoXchange
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto px-2">
          Trade the future of finance with institutional-grade security and lightning-fast execution
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <Link href="/signup">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold transition-all duration-300 group hover:scale-105 shadow-2xl border-0"
              style={{
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.3), 0 10px 30px rgba(0, 0, 0, 0.3)"
              }}
            >
              Start Trading
              <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Additional Features Section */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="text-center p-4 rounded-lg bg-slate-800/30 backdrop-blur-sm border border-slate-700/50">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">24/7</div>
            <div className="text-sm sm:text-base text-gray-300">Trading Available</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/30 backdrop-blur-sm border border-slate-700/50">
            <div className="text-2xl sm:text-3xl font-bold text-teal-400 mb-2">0.1%</div>
            <div className="text-sm sm:text-base text-gray-300">Trading Fees</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-800/30 backdrop-blur-sm border border-slate-700/50">
            <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">500+</div>
            <div className="text-sm sm:text-base text-gray-300">Cryptocurrencies</div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-1deg); }
        }
      `}</style>
    </section>
  )
}
