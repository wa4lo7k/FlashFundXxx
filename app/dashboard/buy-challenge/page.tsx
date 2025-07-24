"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { nowPaymentsService } from "@/lib/nowpayments"
import { supabase } from "@/lib/supabaseClient"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  BarChart3,
  Award,
  CreditCard,
  Bitcoin,
  Wallet,
  Shield,
  Star,
} from "lucide-react"
import { toast } from "sonner"

interface OrderData {
  challengeType: string
  accountSize: string
  platform: string
  paymentMethod: string
  cryptoCurrency: string
  amount: number
}

export default function BuyChallengePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderData, setOrderData] = useState<OrderData>({
    challengeType: "",
    accountSize: "",
    platform: "",
    paymentMethod: "",
    cryptoCurrency: "",
    amount: 0,
  })

  const challengeTypes = [
    {
      id: "instant",
      name: "Instant Account",
      description: "Start trading immediately with no evaluation",
      icon: Zap,
      iconUrl: "https://img.icons8.com/fluency/48/lightning-bolt.png",
      color: "emerald",
      badge: "No Challenge",
      features: ["Instant activation", "No evaluation", "Up to 90% profit split", "5% max drawdown"],
      fallback: "⚡"
    },
    {
      id: "hft",
      name: "HFT Account",
      description: "Single challenge phase for high-frequency trading",
      icon: BarChart3,
      iconUrl: "https://img.icons8.com/fluency/48/speed.png",
      color: "teal",
      badge: "Single Phase",
      features: ["Single challenge phase", "Ultra-low latency", "Co-located servers", "Up to 85% profit split"],
      fallback: "🚀"
    },
    {
      id: "one_step",
      name: "1-Step Evaluation",
      description: "Single phase challenge with competitive pricing",
      icon: Target,
      iconUrl: "https://img.icons8.com/fluency/48/bullseye.png",
      color: "blue",
      badge: "Single Phase",
      features: ["Single challenge phase", "8% profit target", "Up to 80% profit split", "8% max drawdown"],
      fallback: "🎯"
    },
    {
      id: "two_step",
      name: "2-Step Evaluation",
      description: "Traditional evaluation with highest profit splits",
      icon: Award,
      iconUrl: "https://img.icons8.com/fluency/48/trophy.png",
      color: "purple",
      badge: "Best Value",
      features: ["Two-phase evaluation", "8%/5% targets", "Up to 90% profit split", "10% max drawdown"],
      fallback: "🏆"
    },
  ]

  const accountSizes = [
    { value: "1k", label: "$1,000", prices: { instant: 89, hft: 149, one_step: 49, two_step: 0.5 } },
    { value: "3k", label: "$3,000", prices: { instant: 139, hft: 199, one_step: 69, two_step: 59 } },
    { value: "5k", label: "$5,000", prices: { instant: 189, hft: 249, one_step: 99, two_step: 79 } },
    { value: "10k", label: "$10,000", prices: { instant: 289, hft: 349, one_step: 149, two_step: 119 } },
    { value: "25k", label: "$25,000", prices: { instant: 489, hft: 599, one_step: 249, two_step: 199 } },
    { value: "50k", label: "$50,000", prices: { instant: 789, hft: 899, one_step: 399, two_step: 319 } },
    { value: "100k", label: "$100,000", prices: { instant: 1289, hft: 1499, one_step: 649, two_step: 519 }, popular: true },
    { value: "200k", label: "$200,000", prices: { instant: 2189, hft: 2499, one_step: 1099, two_step: 879 } },
  ]

  const platforms = [
    {
      value: "mt4",
      label: "MetaTrader 4",
      description: "Most popular trading platform",
      iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzE5NzNGRiIvPgo8dGV4dCB4PSIyNCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NVDQ8L3RleHQ+Cjwvc3ZnPgo=",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      fallback: "MT4"
    },
    {
      value: "mt5",
      label: "MetaTrader 5",
      description: "Advanced features and timeframes",
      iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzEwQjk4MSIvPgo8dGV4dCB4PSIyNCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NVDU8L3RleHQ+Cjwvc3ZnPgo=",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      fallback: "MT5"
    },
  ]

  const cryptocurrencies = [
    {
      value: "usdt_bsc",
      label: "USDT",
      network: "BSC",
      iconUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
      networkColor: "bg-yellow-500/20 text-yellow-400",
      description: "Binance Smart Chain"
    },
    {
      value: "usdt_polygon",
      label: "USDT",
      network: "POLYGON",
      iconUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
      networkColor: "bg-purple-500/20 text-purple-400",
      description: "Polygon Network"
    },
    {
      value: "usdt_trc20",
      label: "USDT",
      network: "TRC20",
      iconUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
      networkColor: "bg-red-500/20 text-red-400",
      description: "Tron Network"
    },
    {
      value: "bnb",
      label: "BNB",
      network: "BSC",
      iconUrl: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
      networkColor: "bg-yellow-500/20 text-yellow-400",
      description: "Binance Coin"
    },
    {
      value: "btc",
      label: "BTC",
      network: "",
      iconUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      networkColor: "",
      description: "Bitcoin"
    },
    {
      value: "trx",
      label: "TRX",
      network: "",
      iconUrl: "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png",
      networkColor: "",
      description: "Tron"
    },
  ]

  const cardPaymentIcons = [
    { name: "Visa", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg", fallback: "VISA" },
    { name: "Mastercard", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", fallback: "MC" },
    { name: "American Express", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg", fallback: "AMEX" },
    { name: "Discover", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg", fallback: "DISC" },
    { name: "Google Pay", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg", fallback: "GPay" },
    { name: "Apple Pay", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg", fallback: "APay" },
  ]

  const paymentMethods = [
    {
      id: "crypto",
      name: "Pay through Crypto",
      description: "Pay with 300+ cryptocurrencies including Bitcoin, Ethereum, BNB, USDT & more",
      icon: Bitcoin,
      color: "orange",
      badge: "Popular",
      features: ["300+ cryptocurrencies", "Instant processing", "Low fees", "Secure payments"],
      icons: ["₿", "Ξ", "₮", "⬡", "◎", "+290"],
    },
    {
      id: "card",
      name: "Pay through Visa and Mastercard",
      description: "Pay with Visa, Mastercard, American Express, Discover, and more",
      icon: CreditCard,
      color: "blue",
      badge: "Coming Soon",
      features: ["All major cards", "Instant processing", "Secure checkout", "Global support"],
      icons: ["VISA", "MC", "AMEX", "DISC", "GPay", "APay"],
    },
  ]

  const calculatePrice = () => {
    if (!orderData.challengeType || !orderData.accountSize) return 0
    const sizeData = accountSizes.find((size) => size.value === orderData.accountSize)
    return sizeData?.prices[orderData.challengeType as keyof typeof sizeData.prices] || 0
  }

  const selectedChallenge = challengeTypes.find((type) => type.id === orderData.challengeType)
  const selectedSize = accountSizes.find((size) => size.value === orderData.accountSize)
  const selectedPlatform = platforms.find((platform) => platform.value === orderData.platform)
  const selectedPayment = paymentMethods.find((payment) => payment.id === orderData.paymentMethod)

  const canPlaceOrder = orderData.challengeType && orderData.accountSize && orderData.platform && orderData.paymentMethod &&
    (orderData.paymentMethod === "card" || (orderData.paymentMethod === "crypto" && orderData.cryptoCurrency)) && acceptedTerms

  // Debug logging
  console.log('Button state debug:', {
    challengeType: orderData.challengeType,
    accountSize: orderData.accountSize,
    platform: orderData.platform,
    paymentMethod: orderData.paymentMethod,
    cryptoCurrency: orderData.cryptoCurrency,
    acceptedTerms,
    canPlaceOrder,
    isSubmitting
  })

  // Helper function to parse account size
  const parseAccountSize = (sizeStr: string): number => {
    const cleanStr = sizeStr.replace(/[$,]/g, '').toUpperCase()
    if (cleanStr.includes('K')) {
      return parseFloat(cleanStr.replace('K', '')) * 1000
    }
    return parseFloat(cleanStr) || 0
  }

  const handlePlaceOrder = async () => {
    console.log('Place Order button clicked!')
    console.log('canPlaceOrder:', canPlaceOrder)
    console.log('orderData:', orderData)
    console.log('acceptedTerms:', acceptedTerms)

    if (!canPlaceOrder) {
      toast.error("Please fill in all required fields and accept terms")
      return
    }

    setIsSubmitting(true)

    try {
      // Calculate final amount
      const finalAmount = calculatePrice()

      // Create order in database first
      const orderId = `FFX${Math.floor(100000000 + Math.random() * 900000000)}`
      const accountSizeNumber = parseAccountSize(orderData.accountSize)

      if (!user?.id) {
        toast.error("Please login to place an order")
        return
      }

      console.log("Creating order:", {
        orderId,
        userId: user.id,
        accountType: orderData.challengeType,
        accountSize: accountSizeNumber,
        platformType: orderData.platform,
        cryptoCurrency: orderData.cryptoCurrency,
        amount: finalAmount,
        paymentMethod: orderData.paymentMethod
      })

      // Create order in database
      const { data: orderData_db, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_id: orderId,
          user_id: user.id,
          account_type: orderData.challengeType,
          account_size: accountSizeNumber,
          platform_type: orderData.platform,
          amount: finalAmount,
          final_amount: finalAmount,
          payment_method: orderData.paymentMethod,
          crypto_currency: orderData.paymentMethod === 'crypto' ? orderData.cryptoCurrency : null,
          order_status: 'pending',
          payment_status: 'pending',
          delivery_status: 'pending'
        })
        .select()
        .single()

      if (orderError) {
        console.error('Error creating order:', orderError)
        toast.error("Failed to create order. Please try again.")
        return
      }

      console.log('Order created successfully:', orderData_db)

      // For crypto payments, create NowPayments payment
      if (orderData.paymentMethod === "crypto") {
        console.log('Creating NowPayments payment...')

        const paymentResponse = await nowPaymentsService.createPayment({
          orderId,
          userId: user.id,
          accountType: orderData.challengeType as any,
          accountSize: accountSizeNumber,
          platformType: orderData.platform as any,
          cryptoCurrency: orderData.cryptoCurrency,
          amount: finalAmount,
          finalAmount: finalAmount
        })

        if (!paymentResponse.success) {
          console.error('Failed to create payment:', paymentResponse.error)
          toast.error(`Payment creation failed: ${paymentResponse.error}`)
          return
        }

        console.log('Payment created successfully:', paymentResponse.payment)

        // Check if we have an invoice URL for hosted payment page
        if (paymentResponse.invoice_url) {
          toast.success("Order placed successfully! Redirecting to NowPayments...")
          setTimeout(() => {
            // Redirect to NowPayments hosted payment page
            window.location.href = paymentResponse.invoice_url!
          }, 1000)
        } else {
          // Fallback to custom payment page
          toast.success("Order placed successfully! Redirecting to payment...")
          setTimeout(() => {
            router.push(`/dashboard/payment/crypto?order=${orderId}`)
          }, 1000)
        }
      } else if (orderData.paymentMethod === "card") {
        toast.success("Order placed successfully! Redirecting to payment...")
        setTimeout(() => {
          router.push(`/dashboard/payment/card?order=${orderId}`)
        }, 1000)
      }
    } catch (error) {
      toast.error("Failed to place order. Please try again.")
      console.error("Order placement error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">


        {/* Step 1: Payment Method Selection */}
        {!orderData.paymentMethod && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Choose Your Payment Method</h1>
              <p className="text-slate-400 text-lg">How would you like to pay for your trading account?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crypto Payment Section */}
              <Card className="glass-card border-slate-800/30 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-8">
                  <div
                    onClick={() => setOrderData({ ...orderData, paymentMethod: "crypto" })}
                    className="text-center"
                  >
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Bitcoin className="w-10 h-10 text-orange-400" />
                    </div>

                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">Pay with Crypto</h3>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Popular</Badge>
                      </div>
                      <p className="text-slate-400">Pay with 300+ cryptocurrencies including Bitcoin, Ethereum, BNB, USDT & more</p>
                    </div>

                    {/* Payment Icons */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {cryptocurrencies.slice(0, 6).map((crypto, index) => (
                        <div
                          key={index}
                          className="h-12 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center p-2"
                        >
                          <img
                            src={crypto.iconUrl}
                            alt={crypto.label}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) nextElement.style.display = 'block';
                            }}
                          />
                          <span className="hidden text-slate-300 font-semibold text-xs">{crypto.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {["300+ cryptocurrencies", "Instant processing", "Low fees", "Secure payments"].map((feature, index) => (
                        <div key={index} className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-orange-400" />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-lg group-hover:scale-105 transition-transform duration-200">
                      Choose Crypto Payment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Card Payment Section */}
              <Card className="glass-card border-slate-800/30 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-8">
                  <div
                    onClick={() => setOrderData({ ...orderData, paymentMethod: "card" })}
                    className="text-center"
                  >
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CreditCard className="w-10 h-10 text-blue-400" />
                    </div>

                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">Pay with Card</h3>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Secure</Badge>
                      </div>
                      <p className="text-slate-400">Pay with Visa, Mastercard, American Express, Discover, and more</p>
                    </div>

                    {/* Payment Icons */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {cardPaymentIcons.map((card, index) => (
                        <div
                          key={index}
                          className="h-12 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center p-2"
                        >
                          <img
                            src={card.iconUrl}
                            alt={card.name}
                            className="max-h-6 max-w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) nextElement.style.display = 'block';
                            }}
                          />
                          <span className="hidden text-slate-300 font-semibold text-xs">{card.fallback || card.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {["All major cards", "Instant processing", "Secure checkout", "Global support"].map((feature, index) => (
                        <div key={index} className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 text-lg group-hover:scale-105 transition-transform duration-200">
                      Choose Card Payment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Account Configuration (shown after payment method selection) */}
        {orderData.paymentMethod && (
          <div className="space-y-6">
            {/* Selected Payment Method Header */}
            <Card className="glass-card border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {orderData.paymentMethod === "crypto" ? (
                      <Bitcoin className="w-6 h-6 text-orange-400" />
                    ) : (
                      <CreditCard className="w-6 h-6 text-blue-400" />
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Payment Method: {orderData.paymentMethod === "crypto" ? "Cryptocurrency" : "Credit/Debit Card"}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {orderData.paymentMethod === "crypto"
                          ? "You'll pay with cryptocurrency after account configuration"
                          : "You'll pay with credit/debit card after account configuration"
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOrderData({ ...orderData, paymentMethod: "", challengeType: "", accountSize: "", platform: "", cryptoCurrency: "" })}
                    className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent"
                  >
                    Change Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          {/* Account Type Selection */}
          <Card className="glass-card border-slate-800/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">2. Choose Account Type *</CardTitle>
              <p className="text-slate-400">Select the account type that fits your trading style</p>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={orderData.challengeType}
                onValueChange={(value) => setOrderData({ ...orderData, challengeType: value })}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {challengeTypes.map((type) => (
                  <div key={type.id} className="relative">
                    <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                    <Label
                      htmlFor={type.id}
                      className={`block p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        orderData.challengeType === type.id
                          ? `border-${type.color}-500 bg-${type.color}-500/10`
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-${type.color}-500/20 flex items-center justify-center border border-${type.color}-500/30 p-2`}
                        >
                          <img
                            src={type.iconUrl}
                            alt={type.name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) nextElement.style.display = 'block';
                            }}
                          />
                          <span className={`hidden text-2xl`}>{type.fallback}</span>
                        </div>
                        <Badge
                          className={`bg-${type.color}-500/20 text-${type.color}-400 border-${type.color}-500/30`}
                        >
                          {type.badge}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{type.name}</h3>
                      <p className="text-slate-400 text-sm mb-4">{type.description}</p>
                      <div className="space-y-2">
                        {type.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className={`w-4 h-4 text-${type.color}-400`} />
                            <span className="text-slate-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Account Size Selection */}
          <Card className="glass-card border-slate-800/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">3. Choose Account Size *</CardTitle>
              <p className="text-slate-400">Select your preferred account size</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {accountSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setOrderData({ ...orderData, accountSize: size.value })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      orderData.accountSize === size.value
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-700 hover:border-slate-600 text-slate-300"
                    }`}
                  >
                    <div className="text-lg font-bold">{size.label}</div>
                    {orderData.challengeType && (
                      <div className="text-sm mt-1">
                        ${size.prices[orderData.challengeType as keyof typeof size.prices]}
                      </div>
                    )}
                    {size.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold">
                        Popular
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Selection */}
          <Card className="glass-card border-slate-800/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">4. Choose Trading Platform *</CardTitle>
              <p className="text-slate-400">Select your preferred trading platform</p>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={orderData.platform}
                onValueChange={(value) => setOrderData({ ...orderData, platform: value })}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {platforms.map((platform) => (
                  <div key={platform.value} className="relative">
                    <RadioGroupItem value={platform.value} id={platform.value} className="sr-only" />
                    <Label
                      htmlFor={platform.value}
                      className={`block p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                        orderData.platform === platform.value
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${platform.iconBg} flex items-center justify-center border ${platform.value === 'mt4' ? 'border-blue-500/30' : 'border-emerald-500/30'} p-1`}>
                        <img
                          src={platform.iconUrl}
                          alt={platform.label}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) nextElement.style.display = 'block';
                          }}
                        />
                        <span className={`hidden ${platform.iconColor} font-bold text-xl`}>{platform.fallback}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{platform.label}</h3>
                      <p className="text-slate-400 text-sm">{platform.description}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Cryptocurrency Selection - Only for crypto payments */}
          {orderData.paymentMethod === "crypto" && (
            <Card className="glass-card border-slate-800/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">5. Choose Cryptocurrency *</CardTitle>
                <p className="text-slate-400">Select which cryptocurrency you'd like to use for payment</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cryptocurrencies.map((crypto) => (
                    <button
                      key={crypto.value}
                      onClick={() => setOrderData({ ...orderData, cryptoCurrency: crypto.value })}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        orderData.cryptoCurrency === crypto.value
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-slate-700 hover:border-slate-600 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center p-1">
                          <img
                            src={crypto.iconUrl}
                            alt={crypto.label}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) nextElement.style.display = 'block';
                            }}
                          />
                          <div className="hidden text-xs font-bold text-slate-300">{crypto.label}</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{crypto.label}</div>
                          {crypto.network && (
                            <div className={`text-xs px-2 py-1 rounded-full inline-block ${crypto.networkColor}`}>
                              {crypto.network}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-slate-400">{crypto.description}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Bitcoin className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <h4 className="text-orange-400 font-semibold text-sm">Crypto Payment Info</h4>
                      <p className="text-slate-400 text-sm mt-1">
                        After placing your order, you'll receive payment instructions with the exact amount and wallet address for your selected cryptocurrency.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          {orderData.challengeType && orderData.accountSize && orderData.platform && orderData.paymentMethod &&
           (orderData.paymentMethod === "card" || (orderData.paymentMethod === "crypto" && orderData.cryptoCurrency)) && (
            <Card className="glass-card border-emerald-500/30 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Order Summary</CardTitle>
                <p className="text-slate-400">Review your order details</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Type:</span>
                      <span className="text-white font-semibold">{selectedChallenge?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Size:</span>
                      <span className="text-white font-semibold">{selectedSize?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Platform:</span>
                      <span className="text-white font-semibold">{selectedPlatform?.label}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment Method:</span>
                      <span className="text-white font-semibold">
                        {selectedPayment?.name}
                        {orderData.paymentMethod === "crypto" && orderData.cryptoCurrency && (
                          <span className="ml-2 text-emerald-400">
                            ({cryptocurrencies.find(c => c.value === orderData.cryptoCurrency)?.label}
                            {cryptocurrencies.find(c => c.value === orderData.cryptoCurrency)?.network &&
                              ` - ${cryptocurrencies.find(c => c.value === orderData.cryptoCurrency)?.network}`})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Amount:</span>
                      <span className="text-emerald-400 font-bold text-xl">${calculatePrice()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Terms and Conditions */}
          <Card className="glass-card border-slate-800/30">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-5 h-5 mt-1 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-2"
                />
                <label htmlFor="terms" className="text-slate-300 text-sm leading-relaxed">
                  I agree to the{" "}
                  <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer underline">
                    Trading Rules
                  </span>
                  . I understand that trading involves risk and I am responsible for my trading decisions.
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Place Order Button */}
          <div className="text-center">
            <Button
              onClick={handlePlaceOrder}
              disabled={!canPlaceOrder || isSubmitting}
              className="gradient-primary shadow-glow-emerald text-white font-semibold px-12 py-4 text-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Place Order - ${calculatePrice()}
                </>
              )}
            </Button>
            {!canPlaceOrder && (
              <p className="text-slate-400 text-sm mt-2">
                Please complete all fields and accept terms to place your order
              </p>
            )}
          </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
