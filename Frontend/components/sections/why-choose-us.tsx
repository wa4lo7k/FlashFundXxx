"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Globe, Users, Award, Headphones, TrendingUp, Lock, Wifi, Server } from "lucide-react"

export default function WhyChooseUs() {
  const features = [
    {
      title: "Instant Rewards",
      description: "Get your training rewards recognized instantly with no waiting periods or complex processes.",
      icon: Zap,
      color: "emerald",
      stats: "< 24 hours",
      benefits: [
        "No minimum reward threshold",
        "Multiple recognition methods",
        "Automated processing",
        "Weekend rewards available",
      ],
    },
    {
      title: "Professional Training Infrastructure",
      description: "Ultra-low latency simulation with institutional-grade servers for realistic trading education.",
      icon: Server,
      color: "teal",
      stats: "< 10ms latency",
      benefits: [
        "Tier-1 market data providers",
        "Co-located educational servers",
        "99.9% uptime guarantee",
        "Advanced simulation routing",
      ],
    },
    {
      title: "24/7 Learning Support",
      description: "Round-the-clock educational support from our expert trading mentors and technical specialists.",
      icon: Headphones,
      color: "blue",
      stats: "24/7/365",
      benefits: [
        "Live chat learning support",
        "Phone mentorship available",
        "Dedicated learning coordinators",
        "Multi-language educational support",
      ],
    },
    {
      title: "Advanced Risk Education",
      description: "Sophisticated risk management training tools to protect your learning account and maximize your educational potential.",
      icon: Shield,
      color: "emerald",
      stats: "99.8% protected",
      benefits: ["Real-time monitoring training", "Customizable risk learning limits", "Automated educational stop-loss", "Position sizing education tools"],
    },
    {
      title: "Global Learning Access",
      description: "Learn from anywhere in the world with full educational platform access and comprehensive training.",
      icon: Globe,
      color: "teal",
      stats: "150+ countries",
      benefits: ["Multi-jurisdiction educational access", "Local learning methods", "Regional educational support", "Training compliance guaranteed"],
    },
    {
      title: "Student Community",
      description: "Join our exclusive community of successful trading students and learn from experienced mentors.",
      icon: Users,
      color: "blue",
      stats: "15,000+ students",
      benefits: ["Private Discord learning server", "Weekly educational webinars", "Trading skill competitions", "Mentorship programs"],
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
