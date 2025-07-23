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

  // Get unique account sizes from trading rules
  const dynamicAccountSizes = Array.from(new Set(tradingRules.map(rule => rule.account_size)))
    .sort((a, b) => a - b)
    .map(size => ({
      value: `${size / 1000}k`,
      label: databaseUtils.formatCurrency(size).replace('.00', ''),
      popular: size === 25000,
      numericValue: size
    }))

  // Fallback to static data if no trading rules loaded
  const fallbackSizes = [
    { value: "1k", label: "$1K", popular: false, numericValue: 1000 },
    { value: "3k", label: "$3K", popular: false, numericValue: 3000 },
    { value: "5k", label: "$5K", popular: false, numericValue: 5000 },
    { value: "10k", label: "$10K", popular: false, numericValue: 10000 },
    { value: "25k", label: "$25K", popular: true, numericValue: 25000 },
    { value: "50k", label: "$50K", popular: false, numericValue: 50000 },
    { value: "100k", label: "$100K", popular: false, numericValue: 100000 },
    { value: "200k", label: "$200K", popular: false, numericValue: 200000 },
    { value: "500k", label: "$500K", popular: false, numericValue: 500000 },
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
      name: "Instant Accounts",
      shortName: "Instant",
      description: "Start trading immediately with no evaluation period",
      icon: Zap,
      color: "emerald",
      popular: false,
      badge: "No Wait",
      features: [
        "Instant account activation",
        "No evaluation required",
        "Up to 90% profit split",
        "5% maximum drawdown",
        "Weekend holding allowed",
        "News trading permitted",
        "Expert advisors allowed",
        "24/7 support",
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
      name: "HFT Accounts",
      shortName: "HFT",
      description: "High-frequency trading with ultra-low latency execution",
      icon: BarChart3,
      color: "teal",
      popular: true,
      badge: "Most Popular",
      features: [
        "Ultra-low latency execution",
        "Co-located servers",
        "Up to 85% profit split",
        "6% maximum drawdown",
        "Scalping strategies allowed",
        "Advanced order types",
        "Institutional liquidity",
        "Priority support",
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
      name: "1-Step Evaluation",
      shortName: "1-Step",
      description: "Single phase challenge with competitive pricing",
      icon: Target,
      color: "blue",
      popular: false,
      badge: "Single Phase",
      features: [
        "Single evaluation phase",
        "30-day time limit",
        "Up to 80% profit split",
        "8% maximum drawdown",
        "Refundable fee on success",
        "Flexible trading rules",
        "Multiple attempts allowed",
        "Educational resources",
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
      name: "2-Step Evaluation",
      shortName: "2-Step",
      description: "Traditional evaluation with highest profit splits",
      icon: Award,
      color: "purple",
      popular: false,
      badge: "Best Value",
      features: [
        "Two-phase evaluation",
        "Phase 1: 30 days",
        "Phase 2: 60 days",
        "Up to 90% profit split",
        "10% maximum drawdown",
        "Most affordable option",
        "Comprehensive training",
        "Community support",
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
    <section id="pricing" className="py-20 lg:py-32 relative">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      <div className="container mx-auto px-6 relative z-10">
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

          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {accountSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => setSelectedSize(size.value)}
                className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
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
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, index) => {
            const price = pricingData[selectedSize][plan.id]

            return (
              <Card
                key={index}
                className={`relative glass-card border-slate-800/50 hover:border-slate-700/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  plan.popular ? "ring-2 ring-emerald-500/30 shadow-glow-emerald" : ""
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
                    <div className="text-4xl font-bold text-emerald-400">${price}</div>
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
                        const dynamicSpecs = selectedAccountSize
                          ? getSpecsForAccountType(plan.id === 'oneStep' ? 'one_step' : plan.id === 'twoStep' ? 'two_step' : plan.id, selectedAccountSize.numericValue)
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
                      } text-white font-semibold transition-all duration-300 hover:scale-105`}
                    >
                      Get Started
                    </Button>
                  </Link>

                  <div className="text-center">
                    <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                      View All Features →
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Professional Comparison Table */}
        <div className="glass rounded-2xl p-8 border border-slate-800/30 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-white">Detailed Comparison</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-4 text-slate-300 font-bold">Feature</th>
                  <th className="text-center py-4 text-emerald-400 font-bold">Instant</th>
                  <th className="text-center py-4 text-teal-400 font-bold">HFT</th>
                  <th className="text-center py-4 text-blue-400 font-bold">1-Step</th>
                  <th className="text-center py-4 text-purple-400 font-bold">2-Step</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800/30">
                  <td className="py-4 font-semibold">Evaluation Period</td>
                  <td className="text-center py-4">
                    <Badge className="glass-card text-emerald-300 border-emerald-500/30 font-semibold">None</Badge>
                  </td>
                  <td className="text-center py-4">
                    <Badge className="glass-card text-teal-300 border-teal-500/30 font-semibold">None</Badge>
                  </td>
                  <td className="text-center py-4 font-medium">30 days</td>
                  <td className="text-center py-4 font-medium">30 + 60 days</td>
                </tr>
                <tr className="border-b border-slate-800/30">
                  <td className="py-4 font-semibold">Profit Split</td>
                  <td className="text-center py-4 text-emerald-400 font-bold">Up to 90%</td>
                  <td className="text-center py-4 text-teal-400 font-bold">Up to 85%</td>
                  <td className="text-center py-4 text-blue-400 font-bold">Up to 80%</td>
                  <td className="text-center py-4 text-purple-400 font-bold">Up to 90%</td>
                </tr>
                <tr className="border-b border-slate-800/30">
                  <td className="py-4 font-semibold">Maximum Drawdown</td>
                  <td className="text-center py-4 font-semibold">5%</td>
                  <td className="text-center py-4 font-semibold">6%</td>
                  <td className="text-center py-4 font-semibold">8%</td>
                  <td className="text-center py-4 font-semibold">10%</td>
                </tr>
                <tr className="border-b border-slate-800/30">
                  <td className="py-4 font-semibold">Daily Drawdown</td>
                  <td className="text-center py-4 font-semibold">3%</td>
                  <td className="text-center py-4 font-semibold">4%</td>
                  <td className="text-center py-4 font-semibold">5%</td>
                  <td className="text-center py-4 font-semibold">5%</td>
                </tr>
                <tr className="border-b border-slate-800/30">
                  <td className="py-4 font-semibold">Minimum Trading Days</td>
                  <td className="text-center py-4">
                    <Badge className="glass-card text-emerald-300 border-emerald-500/30 font-semibold">None</Badge>
                  </td>
                  <td className="text-center py-4">
                    <Badge className="glass-card text-teal-300 border-teal-500/30 font-semibold">None</Badge>
                  </td>
                  <td className="text-center py-4 font-semibold">5 days</td>
                  <td className="text-center py-4 font-semibold">5 days</td>
                </tr>
                <tr className="border-b border-slate-800/30">
                  <td className="py-4 font-semibold">Refundable Fee</td>
                  <td className="text-center py-4">❌</td>
                  <td className="text-center py-4">❌</td>
                  <td className="text-center py-4">
                    <Badge className="glass-card text-blue-300 border-blue-500/30 font-semibold">✅ Yes</Badge>
                  </td>
                  <td className="text-center py-4">
                    <Badge className="glass-card text-purple-300 border-purple-500/30 font-semibold">✅ Yes</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold">Best For</td>
                  <td className="text-center py-4 text-xs font-medium">Experienced traders</td>
                  <td className="text-center py-4 text-xs font-medium">Scalpers & HFT</td>
                  <td className="text-center py-4 text-xs font-medium">Quick evaluation</td>
                  <td className="text-center py-4 text-xs font-medium">Budget conscious</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Professional Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-6 glass rounded-2xl p-8 border border-slate-800/30">
            <div className="text-left">
              <div className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Need help choosing?</span>
              </div>
              <div className="text-sm text-slate-400 font-medium">
                Our experts can help you select the perfect account type
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 font-semibold bg-transparent"
              >
                Contact Support
              </Button>
              <Link href="/signup">
                <Button className="gradient-primary shadow-glow-emerald text-white font-semibold hover:scale-105 transition-all duration-300">
                  Compare All Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
