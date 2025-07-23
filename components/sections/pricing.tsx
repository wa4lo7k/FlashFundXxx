"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Target, BarChart3, Award, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"
import { tradingRulesService, databaseUtils } from "@/lib/database"

export default function Pricing() {
  const [selectedSize, setSelectedSize] = useState("25k")
  const [tradingRules, setTradingRules] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load trading rules on component mount
  useEffect(() => {
    loadTradingRules()
  }, [])

  const loadTradingRules = async () => {
    try {
      const { data, error } = await tradingRulesService.getAllRules()
      if (!error && data) {
        setTradingRules(data)
      }
    } catch (error) {
      console.error('Error loading trading rules:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get price for account type and size
  const getPriceForAccount = (accountType: string, accountSize: number): number => {
    // Basic pricing logic - you can customize this
    const basePrice = accountSize * 0.01 // 1% of account size
    const multipliers = {
      'instant': 2.0,
      'hft': 1.5,
      'one_step': 1.0,
      'two_step': 0.8
    }
    return Math.round(basePrice * (multipliers[accountType as keyof typeof multipliers] || 1))
  }

  // Helper function to format price with "k" abbreviation
  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      const kValue = price / 1000
      // Remove decimal if it's a whole number
      return kValue % 1 === 0 ? `${kValue}k` : `${kValue.toFixed(1)}k`
    }
    return price.toString()
  }

  // Helper function to format account size with "k" abbreviation
  const formatAccountSize = (amount: number): string => {
    if (amount >= 1000) {
      const kValue = amount / 1000
      // Remove decimal if it's a whole number, add $ prefix
      return kValue % 1 === 0 ? `$${kValue}k` : `$${kValue.toFixed(1)}k`
    }
    return `$${amount}`
  }

  // Get unique account sizes from trading rules
  const dynamicAccountSizes = Array.from(new Set(tradingRules.map(rule => rule.account_size)))
    .sort((a, b) => a - b)
    .map(size => ({
      value: `${size / 1000}k`,
      label: formatAccountSize(size),
      popular: size === 100000,
      numericValue: size
    }))

  // Fallback to static data if no trading rules loaded
  const fallbackSizes = [
    { value: "1k", label: "$1k", popular: false, numericValue: 1000 },
    { value: "3k", label: "$3k", popular: false, numericValue: 3000 },
    { value: "5k", label: "$5k", popular: false, numericValue: 5000 },
    { value: "10k", label: "$10k", popular: false, numericValue: 10000 },
    { value: "25k", label: "$25k", popular: false, numericValue: 25000 },
    { value: "50k", label: "$50k", popular: false, numericValue: 50000 },
    { value: "100k", label: "$100k", popular: true, numericValue: 100000 },
    { value: "200k", label: "$200k", popular: false, numericValue: 200000 },
    { value: "500k", label: "$500k", popular: false, numericValue: 500000 },
  ]

  const accountSizes = dynamicAccountSizes.length > 0 ? dynamicAccountSizes : fallbackSizes

  // Generate dynamic pricing data based on account sizes
  const generatePricingData = () => {
    const pricing: any = {}

    accountSizes.forEach(size => {
      const accountSize = size.numericValue
      pricing[size.value] = {
        instant: getPriceForAccount('instant', accountSize),
        hft: getPriceForAccount('hft', accountSize),
        oneStep: getPriceForAccount('one_step', accountSize),
        twoStep: getPriceForAccount('two_step', accountSize)
      }
    })

    return pricing
  }

  const pricingData = generatePricingData()

  // Generate dynamic plan specs based on trading rules
  const getSpecsForAccountType = (accountType: string, accountSize: number) => {
    const rule = tradingRules.find(r => r.account_type === accountType && r.account_size === accountSize)
    if (!rule) {
      // Fallback specs if no rule found
      return {
        profitSplit: "Up to 90%",
        maxDrawdown: "5%",
        dailyDrawdown: "3%",
        minDays: "None",
        target: "None",
        timeLimit: "Unlimited",
      }
    }

    if (accountType === 'instant') {
      return {
        profitSplit: `${rule.profit_share_percentage}%`,
        maxDrawdown: databaseUtils.formatCurrency(rule.live_max_total_loss),
        dailyDrawdown: databaseUtils.formatCurrency(rule.live_max_daily_loss),
        minDays: "None",
        target: "None",
        timeLimit: "Unlimited",
      }
    } else if (accountType === 'hft' || accountType === 'one_step') {
      return {
        profitSplit: `${rule.profit_share_percentage}%`,
        maxDrawdown: databaseUtils.formatCurrency(rule.challenge_max_total_loss || 0),
        dailyDrawdown: databaseUtils.formatCurrency(rule.challenge_max_daily_loss || 0),
        minDays: `${rule.challenge_min_trading_days || 0} days`,
        target: databaseUtils.formatCurrency(rule.challenge_profit_target || 0),
        timeLimit: "Unlimited",
      }
    } else { // two_step
      return {
        profitSplit: `${rule.profit_share_percentage}%`,
        maxDrawdown: databaseUtils.formatCurrency(rule.phase_1_max_total_loss || 0),
        dailyDrawdown: databaseUtils.formatCurrency(rule.phase_1_max_daily_loss || 0),
        minDays: `${rule.phase_1_min_trading_days || 0} days`,
        target: databaseUtils.formatCurrency(rule.phase_1_profit_target || 0),
        timeLimit: "Unlimited",
      }
    }
  }

  const plans = [
    {
      id: "instant",
      name: "Instant Training Program",
      shortName: "Instant",
      description: "Start practicing immediately with no skill assessment period",
      icon: Zap,
      color: "emerald",
      popular: false,
      badge: "No Wait",
      features: [
        "Instant training account activation",
        "No skill assessment required",
        "Up to 90% training reward split",
        "5% maximum educational drawdown",
        "Weekend practice allowed",
        "News trading education permitted",
        "Expert advisor learning allowed",
        "24/7 learning support",
      ],
      specs: {
        profitSplit: "Up to 90%",
        maxDrawdown: "5%",
        dailyDrawdown: "3%",
        minDays: "None",
        target: "None",
        timeLimit: "Unlimited",
      },
    },
    {
      id: "hft",
      name: "Advanced Training Program",
      shortName: "Advanced",
      description: "High-frequency trading education with ultra-low latency simulation",
      icon: BarChart3,
      color: "teal",
      popular: true,
      badge: "Most Popular",
      features: [
        "Ultra-low latency simulation execution",
        "Co-located educational servers",
        "Up to 85% training reward split",
        "6% maximum educational drawdown",
        "Scalping strategy education allowed",
        "Advanced order type training",
        "Institutional simulation liquidity",
        "Priority learning support",
      ],
      specs: {
        profitSplit: "Up to 85%",
        maxDrawdown: "6%",
        dailyDrawdown: "4%",
        minDays: "None",
        target: "None",
        timeLimit: "Unlimited",
      },
    },
    {
      id: "oneStep",
      name: "1-Step Skill Assessment",
      shortName: "1-Step",
      description: "Single phase skill development program with competitive pricing",
      icon: Target,
      color: "blue",
      popular: false,
      badge: "Single Phase",
      features: [
        "Single skill assessment phase",
        "30-day learning period",
        "Up to 80% training reward split",
        "8% maximum educational drawdown",
        "Refundable fee on skill demonstration",
        "Flexible learning rules",
        "Multiple learning attempts allowed",
        "Comprehensive educational resources",
      ],
      specs: {
        profitSplit: "Up to 80%",
        maxDrawdown: "8%",
        dailyDrawdown: "5%",
        minDays: "5 days",
        target: "8%",
        timeLimit: "30 days",
      },
    },
    {
      id: "twoStep",
      name: "2-Step Skill Development",
      shortName: "2-Step",
      description: "Traditional skill development program with highest training reward splits",
      icon: Award,
      color: "purple",
      popular: false,
      badge: "Best Value",
      features: [
        "Two-phase skill development",
        "Phase 1: 30 days learning",
        "Phase 2: 60 days practice",
        "Up to 90% training reward split",
        "10% maximum educational drawdown",
        "Most affordable learning option",
        "Comprehensive educational training",
        "Learning community support",
      ],
      specs: {
        profitSplit: "Up to 90%",
        maxDrawdown: "10%",
        dailyDrawdown: "5%",
        minDays: "5 days",
        target: "8% / 5%",
        timeLimit: "30 + 60 days",
      },
    },
  ]

  return (
    <section id="pricing" className="relative">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 glass-card text-emerald-300 px-6 py-2 font-medium">
            <TrendingUp className="w-4 h-4 mr-2" />
            Professional Pricing
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-secondary">Choose Your Account</h2>
          <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-light">
            From instant access to evaluation challenges - find the perfect fit for your trading style and budget
          </p>
        </div>

        {/* Account Size Selector */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Select Account Size</h3>
            <p className="text-slate-400 font-medium">
              Choose your preferred account size to see pricing across all plans
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3 max-w-5xl mx-auto">
            {accountSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => setSelectedSize(size.value)}
                type="button"
                className={`relative px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                  selectedSize === size.value
                    ? "gradient-primary text-white shadow-glow-emerald scale-105"
                    : "glass-card text-slate-300 hover:bg-slate-800/50 border border-slate-700/50"
                }`}
              >
                {size.label}
                {size.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold">Popular</Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {plans.map((plan, index) => {
            const price = pricingData[selectedSize][plan.id]

            return (
              <Card
                key={index}
                className={`relative glass-card border-slate-700/30 hover:border-green-500/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] ${
                  plan.popular ? "ring-2 ring-slate-600/40 shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="gradient-secondary text-white px-4 py-1 font-semibold">
                      <Star className="w-3 h-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${
                      plan.color === "emerald"
                        ? "gradient-primary"
                        : plan.color === "teal"
                          ? "gradient-secondary"
                          : plan.color === "blue"
                            ? "gradient-accent"
                            : "bg-gradient-to-br from-purple-500 to-purple-600"
                    } flex items-center justify-center shadow-glow-${plan.color}`}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>

                  <CardTitle className="text-2xl mb-2 text-white font-bold">{plan.shortName}</CardTitle>
                  <p className="text-sm text-slate-400 mb-4 font-medium">{plan.description}</p>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-emerald-400">${formatPrice(price)}</div>
                    <div className="text-sm text-slate-500 font-medium">
                      For {accountSizes.find((s) => s.value === selectedSize)?.label} account
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Specs */}
                  <div className="glass-card rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-white text-sm mb-3">Key Specifications</h4>
                    <div className="space-y-2 text-xs">
                      {(() => {
                        const selectedAccountSize = accountSizes.find(size => size.value === selectedSize)
                        let accountType = plan.id
                        if (plan.id === 'oneStep') accountType = 'one_step'
                        if (plan.id === 'twoStep') accountType = 'two_step'

                        const dynamicSpecs = selectedAccountSize
                          ? getSpecsForAccountType(accountType, selectedAccountSize.numericValue)
                          : plan.specs

                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Profit Split:</span>
                              <span className="text-emerald-400 font-bold">{dynamicSpecs.profitSplit}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Max Drawdown:</span>
                              <span className="text-white font-semibold">{dynamicSpecs.maxDrawdown}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Daily Drawdown:</span>
                              <span className="text-white font-semibold">{dynamicSpecs.dailyDrawdown}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-medium">Time Limit:</span>
                              <span className="text-white font-semibold">{dynamicSpecs.timeLimit}</span>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Top Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white text-sm">Top Features</h4>
                    {plan.features.slice(0, 4).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 mb-4">
                    <Link href="/signup">
                      <Button
                        className={`w-full ${
                          plan.color === "emerald"
                            ? "gradient-primary shadow-glow-emerald"
                            : plan.color === "teal"
                              ? "gradient-secondary shadow-glow-teal"
                              : plan.color === "blue"
                                ? "gradient-accent shadow-glow-blue"
                                : "bg-gradient-to-r from-purple-500 to-purple-600"
                        } text-white font-semibold transition-all duration-300 hover:scale-[1.02]`}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>

                  <div className="text-center">
                    <button type="button" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                      View All Features →
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Enhanced Professional Comparison Table */}
        <div className="glass rounded-2xl p-8 border border-slate-800/30 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-secondary">Detailed Comparison</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Compare all features across our trading programs to find your perfect match
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-700/50">
                  <th className="text-left py-6 px-4 text-slate-300 font-bold text-base">Feature</th>
                  <th className="text-center py-6 px-4 bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 border-l border-r border-emerald-500/20">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow-emerald">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-emerald-400 font-bold text-base">Instant</span>
                    </div>
                  </th>
                  <th className="text-center py-6 px-4 bg-gradient-to-b from-teal-500/10 to-teal-500/5 border-l border-r border-teal-500/20">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 rounded-lg gradient-secondary flex items-center justify-center shadow-glow-teal">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-teal-400 font-bold text-base">HFT</span>
                    </div>
                  </th>
                  <th className="text-center py-6 px-4 bg-gradient-to-b from-blue-500/10 to-blue-500/5 border-l border-r border-blue-500/20">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shadow-glow-blue">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-blue-400 font-bold text-base">1-Step</span>
                    </div>
                  </th>
                  <th className="text-center py-6 px-4 bg-gradient-to-b from-purple-500/10 to-purple-500/5 border-l border-r border-purple-500/20">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-purple-400 font-bold text-base">2-Step</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors duration-300 rounded-lg hover:rounded-lg">
                  <td className="py-5 px-4 font-bold text-lg text-slate-100 tracking-wide">Evaluation Period</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-emerald-500/5 to-transparent border-l border-r border-emerald-500/10">
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold px-3 py-1">None</Badge>
                  </td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-teal-500/5 to-transparent border-l border-r border-teal-500/10">
                    <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/40 font-semibold px-3 py-1">None</Badge>
                  </td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-blue-500/5 to-transparent border-l border-r border-blue-500/10 font-semibold">30 days</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-purple-500/5 to-transparent border-l border-r border-purple-500/10 font-semibold">30 + 60 days</td>
                </tr>
                <tr className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors duration-300 rounded-lg hover:rounded-lg">
                  <td className="py-5 px-4 font-bold text-lg text-slate-100 tracking-wide">Profit Split</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-emerald-500/5 to-transparent border-l border-r border-emerald-500/10 text-emerald-400 font-bold text-base">Up to 90%</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-teal-500/5 to-transparent border-l border-r border-teal-500/10 text-teal-400 font-bold text-base">Up to 85%</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-blue-500/5 to-transparent border-l border-r border-blue-500/10 text-blue-400 font-bold text-base">Up to 80%</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-purple-500/5 to-transparent border-l border-r border-purple-500/10 text-purple-400 font-bold text-base">Up to 90%</td>
                </tr>
                <tr className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors duration-300 rounded-lg hover:rounded-lg">
                  <td className="py-5 px-4 font-bold text-lg text-slate-100 tracking-wide">Maximum Drawdown</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-emerald-500/5 to-transparent border-l border-r border-emerald-500/10 font-semibold text-white">5%</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-teal-500/5 to-transparent border-l border-r border-teal-500/10 font-semibold text-white">6%</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-blue-500/5 to-transparent border-l border-r border-blue-500/10 font-semibold text-white">8%</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-purple-500/5 to-transparent border-l border-r border-purple-500/10 font-semibold text-white">10%</td>
                </tr>
                <tr className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors duration-300 rounded-lg hover:rounded-lg">
                  <td className="py-5 px-4 font-bold text-lg text-slate-100 tracking-wide">Daily Drawdown</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-emerald-500/5 to-transparent border-l border-r border-emerald-500/10 font-semibold text-white">3%</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-teal-500/5 to-transparent border-l border-r border-teal-500/10 font-semibold text-white">4%</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-blue-500/5 to-transparent border-l border-r border-blue-500/10 font-semibold text-white">5%</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-purple-500/5 to-transparent border-l border-r border-purple-500/10 font-semibold text-white">5%</td>
                </tr>
                <tr className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors duration-300 rounded-lg hover:rounded-lg">
                  <td className="py-5 px-4 font-bold text-lg text-slate-100 tracking-wide">Minimum Trading Days</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-emerald-500/5 to-transparent border-l border-r border-emerald-500/10">
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold px-3 py-1">None</Badge>
                  </td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-teal-500/5 to-transparent border-l border-r border-teal-500/10">
                    <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/40 font-semibold px-3 py-1">None</Badge>
                  </td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-blue-500/5 to-transparent border-l border-r border-blue-500/10 font-semibold text-white">5 days</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-purple-500/5 to-transparent border-l border-r border-purple-500/10 font-semibold text-white">5 days</td>
                </tr>
                <tr className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors duration-300 rounded-lg hover:rounded-lg">
                  <td className="py-5 px-4 font-bold text-lg text-slate-100 tracking-wide">Refundable Fee</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-emerald-500/5 to-transparent border-l border-r border-emerald-500/10">
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 border border-red-500/40">
                      <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-teal-500/5 to-transparent border-l border-r border-teal-500/10">
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 border border-red-500/40">
                      <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-blue-500/5 to-transparent border-l border-r border-blue-500/10">
                    <span className="text-blue-300 font-semibold">Yes</span>
                  </td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-purple-500/5 to-transparent border-l border-r border-purple-500/10">
                    <span className="text-purple-300 font-semibold">Yes</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/20 transition-colors duration-300 rounded-lg hover:rounded-lg">
                  <td className="py-5 px-4 font-bold text-lg text-slate-100 tracking-wide">Best For</td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-emerald-500/5 to-transparent border-l border-r border-emerald-500/10">
                    <span className="text-emerald-300 font-semibold">Experienced traders</span>
                  </td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-teal-500/5 to-transparent border-l border-r border-teal-500/10">
                    <span className="text-teal-300 font-semibold">Scalpers & HFT</span>
                  </td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-blue-500/5 to-transparent border-l border-r border-blue-500/10">
                    <span className="text-blue-300 font-semibold">Quick evaluation</span>
                  </td>
                  <td className="text-center py-5 px-4 bg-gradient-to-b from-purple-500/5 to-transparent border-l border-r border-purple-500/10">
                    <span className="text-purple-300 font-semibold">Budget conscious</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
