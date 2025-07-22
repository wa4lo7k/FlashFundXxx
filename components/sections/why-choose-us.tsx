"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Globe, Users, Award, Headphones, TrendingUp, Lock, Wifi, Server } from "lucide-react"

export default function WhyChooseUs() {
  const features = [
    {
      title: "Instant Payouts",
      description: "Get your profits paid out instantly with no waiting periods or complex withdrawal processes.",
      icon: Zap,
      color: "emerald",
      stats: "< 24 hours",
      bgIcon: "⚡",
      benefits: [
        "No minimum payout amount",
        "Multiple payment methods",
        "Automated processing",
        "Weekend payouts available",
      ],
    },
    {
      title: "HFT Infrastructure",
      description: "Ultra-low latency execution with institutional-grade servers located in major financial centers.",
      icon: Server,
      color: "teal",
      stats: "< 10ms latency",
      bgIcon: "🏢",
      benefits: [
        "Tier-1 liquidity providers",
        "Co-located servers",
        "99.9% uptime guarantee",
        "Advanced order routing",
      ],
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock support from our expert trading team and technical specialists.",
      icon: Headphones,
      color: "blue",
      stats: "24/7/365",
      bgIcon: "🎧",
      benefits: [
        "Live chat support",
        "Phone support available",
        "Dedicated account managers",
        "Multi-language support",
      ],
    },
    {
      title: "Advanced Risk Controls",
      description: "Sophisticated risk management tools to protect your account and maximize your trading potential.",
      icon: Shield,
      color: "emerald",
      stats: "99.8% protected",
      bgIcon: "🛡️",
      benefits: ["Real-time monitoring", "Customizable risk limits", "Automated stop-loss", "Position sizing tools"],
    },
    {
      title: "Global Access",
      description: "Trade from anywhere in the world with full platform access and regulatory compliance.",
      icon: Globe,
      color: "teal",
      stats: "150+ countries",
      bgIcon: "🌍",
      benefits: ["Multi-jurisdiction licenses", "Local payment methods", "Regional support", "Compliance guaranteed"],
    },
    {
      title: "Trader Community",
      description: "Join our exclusive community of successful funded traders and learn from the best.",
      icon: Users,
      color: "blue",
      stats: "15,000+ traders",
      bgIcon: "👥",
      benefits: ["Private Discord server", "Weekly webinars", "Trading competitions", "Mentorship programs"],
    },
  ]

  const achievements = [
    { icon: TrendingUp, label: "Success Rate", value: "95%", color: "teal" },
    { icon: Lock, label: "Funds Secured", value: "$850K", color: "blue" },
    { icon: Wifi, label: "Uptime", value: "99.9%", color: "emerald" },
    { icon: Users, label: "Active Users", value: "15,000+", color: "blue" },
  ]

  return (
    <section id="features" className="relative">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />

      {/* Trading Network Background */}
      <div className="absolute top-20 left-10 opacity-[0.02]">
        <svg width="400" height="300" viewBox="0 0 400 300" className="text-teal-400">
          {/* Network nodes */}
          <circle cx="50" cy="50" r="4" fill="currentColor" />
          <circle cx="150" cy="80" r="4" fill="currentColor" />
          <circle cx="250" cy="60" r="4" fill="currentColor" />
          <circle cx="350" cy="90" r="4" fill="currentColor" />
          <circle cx="100" cy="150" r="4" fill="currentColor" />
          <circle cx="200" cy="180" r="4" fill="currentColor" />
          <circle cx="300" cy="160" r="4" fill="currentColor" />

          {/* Network connections */}
          <line x1="50" y1="50" x2="150" y2="80" stroke="currentColor" strokeWidth="1" />
          <line x1="150" y1="80" x2="250" y2="60" stroke="currentColor" strokeWidth="1" />
          <line x1="250" y1="60" x2="350" y2="90" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="150" x2="200" y2="180" stroke="currentColor" strokeWidth="1" />
          <line x1="200" y1="180" x2="300" y2="160" stroke="currentColor" strokeWidth="1" />
          <line x1="150" y1="80" x2="100" y2="150" stroke="currentColor" strokeWidth="1" />
          <line x1="250" y1="60" x2="200" y2="180" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-teal-500/10 text-teal-300 border border-teal-500/20 backdrop-blur-sm">
            <Award className="w-4 h-4 mr-2" />
            Why Choose Us
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent leading-tight py-2">
            Industry-Leading Features
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-light">
            Experience the difference with our cutting-edge technology, unmatched support, and trader-first approach
          </p>
        </div>

        {/* Achievements Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center group">
              <div
                className={`w-16 h-16 mx-auto mb-4 bg-slate-900/40 border border-${achievement.color}-500/20 rounded-2xl flex items-center justify-center group-hover:bg-slate-800/50 transition-all duration-300 group-hover:scale-110 backdrop-blur-sm`}
              >
                <achievement.icon className={`w-8 h-8 text-${achievement.color}-400`} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{achievement.value}</div>
              <div className="text-sm text-slate-400 font-medium">{achievement.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-slate-900/40 border-slate-800/50 hover:border-emerald-500/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 hover:shadow-emerald-400/10 backdrop-blur-sm"
            >
              <CardHeader className="pb-4 relative">
                {/* Background Icon */}
                <div className="absolute top-4 right-4 text-3xl opacity-10">{feature.bgIcon}</div>

                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-${feature.color}-500/20`}
                  >
                    <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                  </div>
                  <Badge
                    className={`bg-${feature.color}-500/10 text-${feature.color}-300 border border-${feature.color}-500/20 backdrop-blur-sm`}
                  >
                    {feature.stats}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-3 text-white">{feature.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>

                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-3 text-sm">
                      <div className={`w-1.5 h-1.5 bg-${feature.color}-400 rounded-full`} />
                      <span className="text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


      </div>
    </section>
  )
}
