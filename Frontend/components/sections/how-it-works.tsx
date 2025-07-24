"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Gauge, DollarSign, Trophy, ArrowRight, CheckCircle, Clock } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Choose Your Learning Path",
      description:
        "Select from instant simulation or skill assessment programs based on your trading experience and learning goals.",
      icon: Target,
      color: "emerald",
      details: [
        "Instant simulation for immediate practice",
        "1-step or 2-step skill assessments available",
        "Training account sizes from $1K to $500K",
        "Multiple educational platforms supported",
      ],
      duration: "2 minutes",
    },
    {
      step: "02",
      title: "Complete Skill Assessment",
      description: "Pass our trading skill assessment or get instant access to start practicing with simulated capital.",
      icon: Gauge,
      color: "teal",
      details: [
        "Realistic market simulation conditions",
        "Clear and fair educational guidelines",
        "Professional risk management training",
        "24/7 learning support during assessment",
      ],
      duration: "1-30 days",
    },
    {
      step: "03",
      title: "Access Training Account",
      description: "Receive your training account credentials and start practicing with institutional-grade simulation infrastructure.",
      icon: DollarSign,
      color: "blue",
      details: [
        "Instant training account activation",
        "MetaTrader 4/5 & cTrader educational access",
        "Ultra-low latency simulation execution",
        "Advanced risk management learning tools",
      ],
      duration: "24 hours",
    },
    {
      step: "04",
      title: "Practice & Earn Rewards",
      description: "Keep up to 90% of your training profits with instant reward recognition and professional mentorship.",
      icon: Trophy,
      color: "emerald",
      details: [
        "Training reward splits up to 90%",
        "Instant reward recognition requests",
        "Performance-based educational rewards",
        "Ongoing mentorship & guidance",
      ],
      duration: "Ongoing",
    },
  ]

  return (
    <section id="how-it-works" className="relative">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      {/* Trading Chart Background */}
      <div className="absolute top-10 right-10 opacity-[0.03]">
        <svg width="300" height="200" viewBox="0 0 300 200" className="text-emerald-400">
          {/* Candlestick Chart */}
          <rect x="20" y="80" width="8" height="40" fill="currentColor" />
          <rect x="40" y="60" width="8" height="60" fill="currentColor" />
          <rect x="60" y="90" width="8" height="30" fill="currentColor" />
          <rect x="80" y="50" width="8" height="70" fill="currentColor" />
          <rect x="100" y="70" width="8" height="50" fill="currentColor" />
          <rect x="120" y="40" width="8" height="80" fill="currentColor" />
          <rect x="140" y="85" width="8" height="35" fill="currentColor" />
          <rect x="160" y="55" width="8" height="65" fill="currentColor" />
          <rect x="180" y="75" width="8" height="45" fill="currentColor" />
          <rect x="200" y="45" width="8" height="75" fill="currentColor" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 backdrop-blur-sm">
            <Clock className="w-4 h-4 mr-2" />
            Simple Process
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            Get funded in 4 simple steps and start trading with our capital
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden xl:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-600 to-transparent z-10">
                  <ArrowRight className="absolute -right-2 -top-2 w-4 h-4 text-slate-600" />
                </div>
              )}

              <Card className="bg-slate-900/40 border-slate-800/50 hover:border-emerald-500/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-500 group-hover:scale-105 h-full backdrop-blur-sm">
                <CardHeader className="text-center pb-4 relative">
                  {/* Step Icon */}
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-${step.color}-500/20 to-${step.color}-600/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative border border-${step.color}-500/20`}
                  >
                    <step.icon className={`w-10 h-10 text-${step.color}-400`} />
                  </div>

                  <CardTitle className="text-2xl mb-3 text-white">{step.title}</CardTitle>
                  <div
                    className={`inline-flex items-center space-x-1 text-sm text-${step.color}-400 font-medium mb-4 bg-${step.color}-500/10 px-3 py-1 rounded-full`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{step.duration}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-slate-400 text-center leading-relaxed">{step.description}</p>

                  {/* Step Details */}
                  <div className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start space-x-3">
                        <CheckCircle className={`w-4 h-4 text-${step.color}-400 mt-0.5 flex-shrink-0`} />
                        <span className="text-sm text-slate-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
