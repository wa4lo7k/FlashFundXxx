"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Star,
  Quote,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Users,
  DollarSign,
  Target,
  Shield,
} from "lucide-react"

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Professional Forex Trader",
      location: "Singapore",
      account: "$100K HFT Account",
      profit: "+$34,500",
      monthlyReturn: "34.5%",
      quote:
        "The instant funding changed my trading career completely. No more waiting weeks for evaluation results! The execution speed is incredible and the support team is always there when I need them.",
      rating: 5,
      tradingStyle: "Scalping",
      experience: "5 years",
      avatar: "SC",
      verified: true,
    },
    {
      name: "Marcus Rodriguez",
      role: "Algorithmic Trader",
      location: "Miami, USA",
      account: "$250K HFT Account",
      profit: "+$87,800",
      monthlyReturn: "35.1%",
      quote:
        "As someone who relies on algorithmic trading, the ultra-low latency execution is perfect for my strategies. Zero slippage, lightning-fast fills, and the infrastructure is truly institutional-grade.",
      rating: 5,
      tradingStyle: "Algorithmic",
      experience: "8 years",
      avatar: "MR",
      verified: true,
    },
    {
      name: "David Kim",
      role: "Swing Trader",
      location: "Seoul, South Korea",
      account: "$50K Instant Account",
      profit: "+$23,200",
      monthlyReturn: "46.4%",
      quote:
        "Great support team and fair profit splits. The risk management tools helped me become more disciplined. Already scaled my account and looking forward to reaching the next level.",
      rating: 5,
      tradingStyle: "Swing Trading",
      experience: "3 years",
      avatar: "DK",
      verified: true,
    },
  ]

  const stats = [
    { label: "Total Payouts", value: "$2.4M+", icon: DollarSign, color: "emerald" },
    { label: "Success Rate", value: "89%", icon: Target, color: "teal" },
    { label: "Avg Monthly Return", value: "47.2%", icon: TrendingUp, color: "blue" },
    { label: "Active Traders", value: "15,000+", icon: Users, color: "emerald" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />

      {/* Subtle accent lights */}
      <div className="absolute top-1/3 left-1/6 w-96 h-96 bg-emerald-500/[0.015] rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/6 w-96 h-96 bg-teal-500/[0.015] rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 glass-card text-emerald-300 px-6 py-2 font-medium border border-emerald-500/20">
            <Award className="w-4 h-4 mr-2" />
            Success Stories
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-primary">Trader Success Stories</h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            See what our funded traders are saying about their experience and success with our platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div
                className={`w-16 h-16 mx-auto mb-4 glass-card rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-${stat.color}-500/20`}
              >
                <stat.icon className={`w-7 h-7 text-${stat.color}-400`} />
              </div>
              <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="glass border-slate-800/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Testimonial Content */}
                <div className="p-8 lg:p-12">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                        {testimonials[currentTestimonial].avatar}
                      </div>
                      {testimonials[currentTestimonial].verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-slate-900" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{testimonials[currentTestimonial].name}</h3>
                        <Badge className="glass-card text-emerald-300 border-emerald-500/30 text-xs">Verified</Badge>
                      </div>
                      <p className="text-slate-400 text-sm">{testimonials[currentTestimonial].role}</p>
                      <p className="text-slate-500 text-xs">{testimonials[currentTestimonial].location}</p>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-emerald-400/30" />
                    <p className="text-lg text-slate-300 leading-relaxed italic pl-6">
                      "{testimonials[currentTestimonial].quote}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevTestimonial}
                      className="text-slate-400 hover:text-emerald-400 glass-card"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex space-x-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTestimonial(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentTestimonial ? "bg-emerald-400 w-8" : "bg-slate-600"
                          }`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextTestimonial}
                      className="text-slate-400 hover:text-emerald-400 glass-card"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Stats Panel */}
                <div className="glass-card p-8 lg:p-12 flex flex-col justify-center border-l border-slate-800/30">
                  <h4 className="text-lg font-semibold text-white mb-6">Trading Performance</h4>

                  <div className="space-y-4 text-sm text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Account</span>
                      <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                        {testimonials[currentTestimonial].account}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Profit</span>
                      <span className="font-medium text-emerald-400">{testimonials[currentTestimonial].profit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Monthly Return</span>
                      <span className="font-medium text-teal-400">
                        {testimonials[currentTestimonial].monthlyReturn}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Style</span>
                      <span>{testimonials[currentTestimonial].tradingStyle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Experience</span>
                      <span>{testimonials[currentTestimonial].experience}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="glass rounded-2xl p-8 border border-slate-800/30 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-white">Join Our Success Stories</h3>
            <p className="text-slate-400 mb-6 font-light">
              Ready to become our next success story? Start your funded trading journey today.
            </p>
            <Button className="gradient-primary shadow-glow-emerald text-white font-semibold px-8 py-3 hover:scale-105 transition-all duration-300">
              Start Trading Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
