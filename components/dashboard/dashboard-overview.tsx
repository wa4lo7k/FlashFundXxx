"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingDown,
  DollarSign,
  Target,
  Shield,
  BarChart3,
  FileCheck,
  CreditCard,
  BookOpen,
  Download,
  Users,
  Copy,
  Check,
  Eye,
  EyeOff,
  Server,
  Key,
  User,
  Plus,
  Zap,
  Award,
  TrendingUp,
  Star,
} from "lucide-react"
import { OrderSelector } from "@/components/dashboard/order-selector"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from '@/lib/supabaseClient'

export function DashboardOverview() {
  const [copiedField, setCopiedField] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [deliveredAccounts, setDeliveredAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("25k")
  const [selectedOrderId, setSelectedOrderId] = useState<string>("")

  // Fetch user's orders and delivered accounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsLoading(false)
          return
        }

        // Fetch user's orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (ordersError) {
          console.error('❌ Error fetching orders:', ordersError)
        } else {
          console.log('📦 Orders fetched:', orders?.length || 0)
          setUserOrders(orders || [])
          // Auto-select first order if no order is selected
          if (orders && orders.length > 0 && !selectedOrderId) {
            setSelectedOrderId(orders[0].order_id)
            console.log('🎯 Auto-selected first order:', orders[0].order_id)
          }
        }

        // Fetch user's delivered accounts - FIX RLS ISSUE
        console.log('🔍 Fetching delivered accounts with RLS fix...')
        const { data: accounts, error: accountsError } = await supabase
          .from('delivered_accounts')
          .select('*')
          .order('delivered_at', { ascending: false })

        if (accountsError) {
          console.error('❌ RLS Error fetching delivered accounts:', {
            error: accountsError,
            message: accountsError.message,
            details: accountsError.details,
            hint: accountsError.hint,
            code: accountsError.code
          })
          setDeliveredAccounts([])
        } else {
          console.log('✅ RLS Query successful! Delivered accounts:', accounts)
          console.log('📊 Number of delivered accounts:', accounts?.length || 0)
          if (accounts && accounts.length > 0) {
            console.log('🔍 First account details:', accounts[0])
            console.log('🔍 Account order_ids:', accounts.map(acc => acc.order_id))
          }
          setDeliveredAccounts(accounts || [])
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Pricing data from homepage
  const accountSizes = [
    { value: "1k", label: "$1K", popular: false },
    { value: "5k", label: "$5K", popular: false },
    { value: "10k", label: "$10K", popular: false },
    { value: "25k", label: "$25K", popular: true },
    { value: "50k", label: "$50K", popular: false },
    { value: "100k", label: "$100K", popular: false },
    { value: "200k", label: "$200K", popular: false },
    { value: "500k", label: "$500K", popular: false },
  ]

  const pricingData = {
    "1k": { instant: 89, hft: 149, oneStep: 49, twoStep: 39 },
    "5k": { instant: 189, hft: 249, oneStep: 99, twoStep: 79 },
    "10k": { instant: 289, hft: 349, oneStep: 149, twoStep: 119 },
    "25k": { instant: 489, hft: 599, oneStep: 249, twoStep: 199 },
    "50k": { instant: 789, hft: 899, oneStep: 399, twoStep: 319 },
    "100k": { instant: 1289, hft: 1499, oneStep: 649, twoStep: 519 },
    "200k": { instant: 2189, hft: 2499, oneStep: 1099, twoStep: 879 },
    "500k": { instant: 4989, hft: 5999, oneStep: 2499, twoStep: 1999 },
  }

  const plans = [
    {
      id: "instant",
      name: "Instant Account",
      description: "Start trading immediately with no evaluation",
      icon: Zap,
      color: "emerald",
      badge: "No Challenge",
      features: ["Instant activation", "No evaluation", "Up to 90% profit split", "5% max drawdown"],
    },
    {
      id: "hft",
      name: "HFT Account",
      description: "Single challenge phase for high-frequency trading",
      icon: BarChart3,
      color: "teal",
      badge: "Single Phase",
      features: ["Single challenge phase", "Ultra-low latency", "Co-located servers", "Up to 85% profit split"],
    },
    {
      id: "oneStep",
      name: "1-Step Evaluation",
      description: "Single phase challenge with competitive pricing",
      icon: Target,
      color: "blue",
      badge: "Single Phase",
      features: ["Single challenge phase", "8% profit target", "Up to 80% profit split", "8% max drawdown"],
    },
    {
      id: "twoStep",
      name: "2-Step Evaluation",
      description: "Traditional evaluation with highest profit splits",
      icon: Award,
      color: "purple",
      badge: "Best Value",
      features: ["Two-phase evaluation", "8%/5% targets", "Up to 90% profit split", "10% max drawdown"],
    },
  ]

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(`${field} copied to clipboard!`)
    setTimeout(() => setCopiedField(""), 2000)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="glass-card p-6 rounded-2xl border border-slate-800/30">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show pricing for new users (no orders)
  if (userOrders.length === 0) {
    return (
      <div className="space-y-8">
        {/* Welcome Header for New Users */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/30">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to FlashFundX!</h2>
            <p className="text-slate-400 font-medium text-lg mb-6">
              Choose your account type and start your trading journey
            </p>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2 text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Ready to Get Started
            </Badge>
          </div>
        </div>

        {/* Account Size Selector */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/30">
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
                type="button"
                onClick={() => setSelectedSize(size.value)}
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {plans.map((plan) => {
            const price = (pricingData as any)[selectedSize]?.[plan.id] || 0

            return (
              <Card
                key={plan.id}
                className="glass-card border-slate-800/30 hover:border-slate-700/50 transition-all duration-300 hover:scale-105"
              >
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
                    } flex items-center justify-center`}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>

                  <CardTitle className="text-xl mb-2 text-white font-bold">{plan.name}</CardTitle>
                  <p className="text-sm text-slate-400 mb-4 font-medium">{plan.description}</p>

                  <Badge className={`mb-4 ${
                    plan.color === "emerald" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                    plan.color === "teal" ? "bg-teal-500/20 text-teal-400 border-teal-500/30" :
                    plan.color === "blue" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                    "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  }`}>
                    {plan.badge}
                  </Badge>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-emerald-400">${price}</div>
                    <div className="text-sm text-slate-500 font-medium">
                      For {accountSizes.find((s) => s.value === selectedSize)?.label} account
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/dashboard/place-order">
                    <Button className={`w-full ${
                      plan.color === "emerald"
                        ? "gradient-primary shadow-glow-emerald"
                        : plan.color === "teal"
                          ? "gradient-secondary shadow-glow-teal"
                          : plan.color === "blue"
                            ? "gradient-accent shadow-glow-blue"
                            : "bg-gradient-to-r from-purple-500 to-purple-600"
                    } text-white font-semibold transition-all duration-300 hover:scale-105`}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center glass-card p-8 rounded-2xl border border-slate-800/30">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Trading?</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Join thousands of successful traders who have chosen FlashFundX for their prop trading journey.
            Select your account type above and place your first order.
          </p>
          <Link href="/dashboard/place-order">
            <Button className="gradient-primary shadow-glow-emerald text-white font-semibold px-8 py-3 text-lg">
              <Plus className="w-5 h-5 mr-2" />
              Place Your First Order
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Filter delivered accounts by selected order - FIXED
  const selectedOrderAccounts = selectedOrderId
    ? deliveredAccounts.filter(account => account.order_id === selectedOrderId)
    : []

  console.log('🎯 Selected Order ID:', selectedOrderId)
  console.log('🏦 All Delivered Accounts:', deliveredAccounts.length)
  console.log('🎯 Filtered Accounts for Selected Order:', selectedOrderAccounts.length)
  if (selectedOrderAccounts.length > 0) {
    console.log('🔑 Account credentials found:', selectedOrderAccounts[0])
  }

  // Show dashboard for users with orders
  return (
    <div className="space-y-8">


      {/* Order Selector */}
      <OrderSelector
        orders={userOrders}
        selectedOrderId={selectedOrderId}
        onOrderSelect={setSelectedOrderId}
      />

      {/* Welcome Header */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to Your Trading Dashboard</h2>
            <p className="text-slate-400 font-medium text-lg">
              Manage your accounts and access all trading resources
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              {userOrders.length} Order{userOrders.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </div>

      {/* Account Credentials Display - Only for Selected Order */}
      {selectedOrderAccounts.length > 0 ? (
        <Card className="glass-card border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <Key className="w-6 h-6 text-emerald-400" />
              <span>Trading Platform Credentials</span>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1">
                Order: {selectedOrderId}
              </Badge>
            </CardTitle>
            <p className="text-slate-400 font-medium">Use these credentials to login to your trading platform</p>
          </CardHeader>
          <CardContent>
            {selectedOrderAccounts.map((account) => (
              <div key={account.id} className="mb-8 last:mb-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {account.account_type.toUpperCase()} Account - {account.account_size}
                  </h3>
                  <Badge className={`${
                    account.account_status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    account.account_status === 'suspended' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {account.account_status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Login Credentials */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Login Credentials</span>
                    </h4>

                    {/* Login */}
                    <div className="flex items-center justify-between p-4 glass-card rounded-lg border border-slate-700/30">
                      <div>
                        <span className="text-slate-400 font-medium text-sm">Login ID</span>
                        <div className="text-white font-bold text-lg font-mono">{account.login_id}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(account.login_id, "Login ID")}
                        className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        {copiedField === "Login ID" ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {/* Password */}
                    <div className="flex items-center justify-between p-4 glass-card rounded-lg border border-slate-700/30">
                      <div className="flex-1">
                        <span className="text-slate-400 font-medium text-sm">Password</span>
                        <div className="text-white font-bold text-lg font-mono">
                          {showPassword ? account.password : "••••••••••"}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(account.password, "Password")}
                          className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                        >
                          {copiedField === "Password" ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Platform */}
                    <div className="flex items-center justify-between p-4 glass-card rounded-lg border border-slate-700/30">
                      <div>
                        <span className="text-slate-400 font-medium text-sm">Trading Platform</span>
                        <div className="text-white font-bold text-lg">{account.platform_type}</div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Active</Badge>
                    </div>
                  </div>

                  {/* Server Information */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide flex items-center space-x-2">
                      <Server className="w-4 h-4" />
                      <span>Server Information</span>
                    </h4>

                    {/* Server Name */}
                    <div className="flex items-center justify-between p-4 glass-card rounded-lg border border-slate-700/30">
                      <div>
                        <span className="text-slate-400 font-medium text-sm">Server Name</span>
                        <div className="text-white font-bold text-lg">{account.server_name}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(account.server_name, "Server Name")}
                        className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        {copiedField === "Server Name" ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {/* Account Status */}
                    <div className="p-4 glass-card rounded-lg border border-slate-700/30">
                      <div className="text-center">
                        <span className="text-slate-400 font-medium text-sm">Current Phase</span>
                        <div className="text-white font-bold text-lg capitalize">{account.current_phase}</div>
                        <Badge className={`mt-2 ${
                          account.phase_status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          account.phase_status === 'passed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          account.phase_status === 'failed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {account.phase_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard/download" className="flex-1">
                    <Button className="w-full gradient-primary shadow-glow-emerald text-white font-semibold">
                      <Download className="w-4 h-4 mr-2" />
                      Download Trading Platform
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1 glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent"
                    onClick={() => {
                      const credentials = `Login: ${account.login_id}\nPassword: ${account.password}\nServer: ${account.server_name}`
                      copyToClipboard(credentials, "All Credentials")
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All Credentials
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : selectedOrderId ? (
        <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <Shield className="w-6 h-6 text-yellow-400" />
              <span>Account Delivery Pending</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 mb-4">
              No delivered account found for order <span className="text-yellow-400 font-mono">{selectedOrderId}</span>.
              Your account is being prepared and will be delivered shortly.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-yellow-400 font-semibold text-sm">Processing...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-slate-500/30 bg-slate-500/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <Shield className="w-6 h-6 text-slate-400" />
              <span>Select an Order</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 mb-4">
              Please select an order from the dropdown above to view your account credentials.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Orders Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="glass-card border-slate-800/30 hover:border-slate-700/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Total Orders
            </CardTitle>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <FileCheck className="w-6 h-6 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-white mb-2">{userOrders.length}</div>
            <p className="text-sm text-slate-400 font-medium">Orders placed</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-slate-800/30 hover:border-slate-700/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Active Accounts
            </CardTitle>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-white mb-2">{deliveredAccounts.length}</div>
            <p className="text-sm text-slate-400 font-medium">Delivered accounts</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-slate-800/30 hover:border-slate-700/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Pending Orders
            </CardTitle>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-white mb-2">
              {userOrders.filter(order => order.delivery_status === 'pending').length}
            </div>
            <p className="text-sm text-slate-400 font-medium">Awaiting delivery</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-slate-800/30 hover:border-slate-700/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Total Spent
            </CardTitle>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-white mb-2">
              ${userOrders.reduce((total, order) => total + (order.final_amount || 0), 0).toLocaleString()}
            </div>
            <p className="text-sm text-slate-400 font-medium">Total investment</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Users with Orders */}
      <Card className="glass-card border-slate-800/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-white">Quick Actions</CardTitle>
          <p className="text-slate-400">Access important features and manage your accounts</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/dashboard/place-order">
              <div className="glass-card p-6 rounded-xl border border-slate-800/30 hover:border-slate-700/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  Place New Order
                </h3>
                <p className="text-slate-400 text-sm font-medium">Order additional trading accounts</p>
              </div>
            </Link>

            <Link href="/dashboard/download">
              <div className="glass-card p-6 rounded-xl border border-slate-800/30 hover:border-slate-700/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Download className="w-6 h-6 text-teal-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  Download Platform
                </h3>
                <p className="text-slate-400 text-sm font-medium">Get MT4/MT5 trading platforms</p>
              </div>
            </Link>

            <Link href="/dashboard/rules">
              <div className="glass-card p-6 rounded-xl border border-slate-800/30 hover:border-slate-700/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  View Trading Rules
                </h3>
                <p className="text-slate-400 text-sm font-medium">Review all account rules and guidelines</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
