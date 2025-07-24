"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from '@/lib/supabaseClient'
import { cryptoAddressService, orderService } from '@/lib/database'
import { createClient } from '@supabase/supabase-js'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

// HIDDEN: This is the old manual payment page - replaced with new automated payment system
// TODO: Remove this file after testing the new payment system

// Service role client for order creation (bypasses RLS)
const supabaseServiceRole = createClient(
  'https://evogjimjdofyrpqaukdq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b2dqaW1qZG9meXJwcWF1a2RxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI0MjQyOSwiZXhwIjoyMDY3ODE4NDI5fQ.hzhtT1KkZDO6UNqaW2E8Au_Dqb2O1YXMxsbphOUPs5E',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Upload,
  Copy,
  Check,
  Zap,
  Target,
  BarChart3,
  Award,
  Shield,
} from "lucide-react"
import { toast } from "sonner"

interface OrderData {
  challengeType: string
  accountSize: string
  platform: string
  paymentMethod: string
  transactionId: string
  paymentScreenshot: File | null
  paymentProofUrl?: string
  amount: number
}

export default function PlaceOrderPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [copiedAddress, setCopiedAddress] = useState("")
  const [orderData, setOrderData] = useState<OrderData>({
    challengeType: "",
    accountSize: "",
    platform: "",
    paymentMethod: "",
    transactionId: "",
    paymentScreenshot: null,
    amount: 0,
  })

  const [cryptoAddresses, setCryptoAddresses] = useState<any[]>([])
  const [isLoadingCrypto, setIsLoadingCrypto] = useState(true)
  const [cryptoPayments, setCryptoPayments] = useState<any[]>([])
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

  // Transform database crypto addresses to match the expected format
  // Using flashfundx-database-schema.sql structure: crypto_name, network, wallet_address, display_name, qr_code_url
  const transformCryptoAddresses = (addresses: any[]) => {
    return (addresses || []).map(crypto => {
      // Safety check for crypto object - use flashfundx schema fields
      if (!crypto || !crypto.crypto_name) {
        console.warn('Invalid crypto object (missing crypto_name):', crypto)
        return null
      }

      // Map crypto names to icons and colors
      const getIconAndColor = (cryptoName: string) => {
        const name = (cryptoName || '').toLowerCase()
        if (name.includes('usdt')) {
          return { icon: '₮', color: 'emerald' }
        } else if (name.includes('bitcoin') || name.includes('btc')) {
          return { icon: '₿', color: 'orange' }
        } else if (name.includes('ethereum') || name.includes('eth')) {
          return { icon: 'Ξ', color: 'blue' }
        } else if (name.includes('bnb')) {
          return { icon: '⬡', color: 'yellow' }
        } else if (name.includes('solana') || name.includes('sol')) {
          return { icon: '◎', color: 'purple' }
        } else {
          return { icon: '◉', color: 'slate' }
        }
      }

      const { icon, color } = getIconAndColor(crypto.crypto_name)

      return {
        id: (crypto.id || 0).toString(),
        name: crypto.display_name || crypto.crypto_name || 'Unknown', // Use display_name first, fallback to crypto_name
        network: crypto.network || '',
        address: crypto.wallet_address || '',
        qr_code_url: crypto.qr_code_url || null,
        icon,
        color,
      }
    }).filter(Boolean) // Remove any null entries
  }

  // Fetch crypto addresses from database using flashfundx-database-schema
  const fetchCryptoAddresses = async () => {
    try {
      console.log('🔍 Fetching crypto addresses using flashfundx-database-schema...')

      // Try direct supabase query first
      const { data, error } = await supabase
        .from('crypto_addresses')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('❌ Direct query error:', error)
        console.error('Error details:', error.message, error.code)

        // Try using the database service as fallback
        console.log('🔄 Trying database service fallback...')
        const { data: serviceData, error: serviceError } = await cryptoAddressService.getActiveCryptoAddresses()

        if (serviceError) {
          console.error('❌ Database service also failed:', serviceError)

          // If table doesn't exist, set empty array and continue
          if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
            console.warn('⚠️ crypto_addresses table does not exist. Please run flashfundx-database-schema.sql')
            setCryptoAddresses([])
            setCryptoPayments([])
            return
          }

          // For other errors, still set empty array to prevent crash
          console.error('❌ Setting empty arrays due to error')
          setCryptoAddresses([])
          setCryptoPayments([])
          return
        }

        // Use service data if available
        console.log('✅ Database service succeeded:', serviceData)
        setCryptoAddresses(serviceData || [])
        const transformedPayments = transformCryptoAddresses(serviceData || [])
        setCryptoPayments(transformedPayments)
        return
      }

      console.log('✅ Direct query succeeded:', data)
      console.log('📊 Number of addresses:', data?.length || 0)

      if (data && data.length > 0) {
        console.log('🔍 First address structure:', data[0])
        console.log('🔍 Expected fields: crypto_name, network, wallet_address, display_name, qr_code_url')
      }

      setCryptoAddresses(data || [])

      // Transform and set crypto payments
      const transformedPayments = transformCryptoAddresses(data || [])
      console.log('🔄 Transformed payments:', transformedPayments)
      console.log('📊 Number of transformed payments:', transformedPayments.length)
      setCryptoPayments(transformedPayments)
    } catch (err) {
      console.error('💥 Failed to fetch crypto addresses:', err)
      // Always set empty array to prevent crashes
      setCryptoAddresses([])
      setCryptoPayments([])
    } finally {
      setIsLoadingCrypto(false)
    }
  }

  useEffect(() => {
    fetchCryptoAddresses()
  }, [])

  // Debug: Monitor cryptoPayments state changes
  useEffect(() => {
    console.log('🔄 CryptoPayments state updated:', cryptoPayments)
    console.log('📊 CryptoPayments length:', cryptoPayments.length)
    console.log('⏳ Is loading crypto:', isLoadingCrypto)
  }, [cryptoPayments, isLoadingCrypto])

  const challengeTypes = [
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
      id: "one_step",
      name: "1-Step Evaluation",
      description: "Single phase challenge with competitive pricing",
      icon: Target,
      color: "blue",
      badge: "Single Phase",
      features: ["Single challenge phase", "8% profit target", "Up to 80% profit split", "8% max drawdown"],
    },
    {
      id: "two_step",
      name: "2-Step Evaluation",
      description: "Traditional evaluation with highest profit splits",
      icon: Award,
      color: "purple",
      badge: "Best Value",
      features: ["Two-phase evaluation", "8%/5% targets", "Up to 90% profit split", "10% max drawdown"],
    },
  ]

  const accountSizes = [
    { value: "1k", label: "$1,000", prices: { instant: 89, hft: 149, one_step: 49, two_step: 0.5 } },
    { value: "3k", label: "$3,000", prices: { instant: 139, hft: 199, one_step: 69, two_step: 59 } },
    { value: "5k", label: "$5,000", prices: { instant: 189, hft: 249, one_step: 99, two_step: 79 } },
    { value: "10k", label: "$10,000", prices: { instant: 289, hft: 349, one_step: 149, two_step: 119 } },
    { value: "25k", label: "$25,000", prices: { instant: 489, hft: 599, one_step: 249, two_step: 199 } },
    { value: "50k", label: "$50,000", prices: { instant: 789, hft: 899, one_step: 399, two_step: 319 } },
    { value: "100k", label: "$100,000", prices: { instant: 1289, hft: 1499, one_step: 649, two_step: 519 } },
    { value: "200k", label: "$200,000", prices: { instant: 2189, hft: 2499, one_step: 1099, two_step: 879 } },
    { value: "500k", label: "$500,000", prices: { instant: 4989, hft: 5999, one_step: 2499, two_step: 1999 } },
    { value: "500k", label: "$500,000", prices: { instant: 4989, hft: 5999, one_step: 2499, two_step: 1999 } },
  ]

  const platforms = [
    { value: "mt4", label: "MetaTrader 4", description: "Most popular trading platform" },
    { value: "mt5", label: "MetaTrader 5", description: "Advanced features and timeframes" },
  ]



  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAddress(type)
    toast.success("Address copied to clipboard!")
    setTimeout(() => setCopiedAddress(""), 2000)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Please upload an image file (PNG, JPG, JPEG) or PDF")
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    try {
      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `orders/temp_${timestamp}.${fileExtension}`

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        toast.error(`Upload failed: ${uploadError.message}`)
        return
      }

      // Get the file URL for storage in database later
      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName)

      setOrderData({
        ...orderData,
        paymentScreenshot: file,
        paymentProofUrl: urlData.publicUrl // Store URL for database
      })
      toast.success("Payment screenshot uploaded successfully!")
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`)
    }
  }

  const calculatePrice = () => {
    if (!orderData.challengeType || !orderData.accountSize) return 0
    const sizeData = accountSizes.find((size) => size.value === orderData.accountSize)
    return sizeData?.prices[orderData.challengeType as keyof typeof sizeData.prices] || 0
  }

  const selectedChallenge = challengeTypes.find((type) => type.id === orderData.challengeType)
  const selectedSize = accountSizes.find((size) => size.value === orderData.accountSize)
  const selectedPlatform = platforms.find((platform) => platform.value === orderData.platform)
  const selectedPayment = cryptoPayments.find((payment) => payment.id === orderData.paymentMethod)

  const canProceedStep1 = orderData.challengeType && orderData.accountSize && orderData.platform
  const canProceedStep2 = orderData.paymentMethod && orderData.transactionId && orderData.paymentScreenshot

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      if (currentStep === 1) {
        setOrderData({ ...orderData, amount: calculatePrice() })
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitOrder = async () => {
    try {
      setIsSubmittingOrder(true) // Start loading
      console.log('Submit order clicked!')
      console.log('Order data:', orderData)

      // Check terms checkbox
      const termsCheckbox = document.getElementById('terms') as HTMLInputElement
      if (!termsCheckbox?.checked) {
        toast.error("Please accept the Terms of Service and Trading Rules")
        return
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user:', user)
      if (!user) {
        toast.error("Please log in to place an order")
        return
      }
      console.log('User ID for order:', user.id)

      // Validate required fields
      if (!orderData.challengeType || !orderData.accountSize || !orderData.platform || !orderData.paymentMethod) {
        toast.error("Please fill in all required fields")
        console.log('Missing fields:', {
          challengeType: orderData.challengeType,
          accountSize: orderData.accountSize,
          platform: orderData.platform,
          paymentMethod: orderData.paymentMethod
        })
        return
      }

      if (!orderData.transactionId) {
        toast.error("Please enter your transaction ID")
        return
      }

      if (!orderData.paymentProofUrl) {
        toast.error("Please upload your payment proof")
        return
      }

      console.log('All validations passed, creating order...')

      // Generate FFX order ID (FFX + 9 random numbers)
      const generateOrderId = (): string => {
        const randomNumbers = Math.floor(100000000 + Math.random() * 900000000).toString()
        return `FFX${randomNumbers}`
      }

      const orderId = generateOrderId()

      // Convert account size string to number (e.g., "$10K" -> 10000)
      const parseAccountSize = (sizeStr: string): number => {
        const cleanStr = sizeStr.replace(/[$,]/g, '').toUpperCase()
        if (cleanStr.includes('K')) {
          return parseFloat(cleanStr.replace('K', '')) * 1000
        }
        return parseFloat(cleanStr) || 0
      }

      const accountSizeNumber = parseAccountSize(orderData.accountSize)

      // Create order in database using correct flashfundx-database-schema
      console.log('Inserting order with data (flashfundx schema):', {
        order_id: orderId,
        user_id: user.id,
        account_type: orderData.challengeType,
        account_size: accountSizeNumber, // Convert to number
        platform_type: orderData.platform, // Use platform_type
        amount: orderData.amount, // Use amount not total_amount
        final_amount: orderData.amount, // Required field
        payment_method: 'crypto',
        transaction_id: orderData.transactionId,
        payment_proof: orderData.paymentProofUrl, // Use payment_proof not payment_proof_url
        order_status: 'pending', // Use order_status not status
        payment_status: 'pending',
        delivery_status: 'pending'
      })

      // Use service role client to bypass RLS permission issues
      const { data, error } = await supabaseServiceRole
        .from('orders')
        .insert({
          order_id: orderId, // Required field
          user_id: user.id,
          account_type: orderData.challengeType,
          account_size: accountSizeNumber, // Convert to DECIMAL
          platform_type: orderData.platform, // Correct field name
          amount: orderData.amount, // Correct field name
          final_amount: orderData.amount, // Required field
          payment_method: 'crypto',
          transaction_id: orderData.transactionId,
          payment_proof: orderData.paymentProofUrl, // Correct field name
          order_status: 'pending', // Correct field name
          payment_status: 'pending', // Required field
          delivery_status: 'pending' // Required field
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating order:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        toast.error(`Failed to submit order: ${error.message}`)
        setIsSubmittingOrder(false) // Reset loading on error
        return
      }

      console.log('Order created successfully:', data)
      toast.success("Order submitted successfully! Redirecting to dashboard...")

      // Reset form
      setOrderData({
        challengeType: "",
        accountSize: "",
        platform: "",
        paymentMethod: "",
        transactionId: "",
        paymentScreenshot: null,
        amount: 0,
      })
      setCurrentStep(1)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        setIsSubmittingOrder(false) // Reset loading before redirect
        router.push('/dashboard')
      }, 1500)

    } catch (error) {
      console.error('Error submitting order:', error)
      toast.error("An error occurred while submitting your order. Please try again.")
      setIsSubmittingOrder(false) // Reset loading on catch error
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/30">
          <div className="flex items-center space-x-3 mb-2">
            <Plus className="w-6 h-6 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Place New Order</h1>
          </div>
          <p className="text-slate-400 font-medium text-lg">Create your funded trading account in 3 simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/30">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step <= currentStep
                      ? "bg-emerald-500 text-white shadow-glow-emerald"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                <div className="ml-3">
                  <div className={`font-semibold ${step <= currentStep ? "text-emerald-400" : "text-slate-400"}`}>
                    Step {step}
                  </div>
                  <div className="text-sm text-slate-500">
                    {step === 1 && "Choose Account"}
                    {step === 2 && "Payment Details"}
                    {step === 3 && "Review & Complete"}
                  </div>
                </div>
                {step < 3 && (
                  <ArrowRight
                    className={`w-5 h-5 mx-6 ${step < currentStep ? "text-emerald-400" : "text-slate-600"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Choose Account */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Challenge Type Selection */}
            <Card className="glass-card border-slate-800/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">1. Choose Challenge Type</CardTitle>
                <p className="text-slate-400">Select the account type that best fits your trading style</p>
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
                            className={`w-12 h-12 rounded-xl bg-${type.color}-500/20 flex items-center justify-center border border-${type.color}-500/30`}
                          >
                            <type.icon className={`w-6 h-6 text-${type.color}-400`} />
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
                <CardTitle className="text-xl font-bold text-white">2. Choose Account Size</CardTitle>
                <p className="text-slate-400">Select your preferred account size</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {accountSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setOrderData({ ...orderData, accountSize: size.value })}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
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
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Selection */}
            <Card className="glass-card border-slate-800/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">3. Choose Trading Platform</CardTitle>
                <p className="text-slate-400">Select your preferred trading platform</p>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={orderData.platform}
                  onValueChange={(value) => setOrderData({ ...orderData, platform: value })}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
                        <h3 className="text-lg font-bold text-white mb-2">{platform.label}</h3>
                        <p className="text-slate-400 text-sm">{platform.description}</p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Summary */}
            {orderData.challengeType && orderData.accountSize && (
              <Card className="glass-card border-emerald-500/30 bg-emerald-500/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Order Summary</h3>
                      <p className="text-slate-400">
                        {selectedChallenge?.name} • {selectedSize?.label} • {selectedPlatform?.label}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">${calculatePrice()}</div>
                      <div className="text-sm text-slate-400">Total Amount</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button
                onClick={nextStep}
                disabled={!canProceedStep1}
                className="gradient-primary shadow-glow-emerald text-white font-semibold px-8 py-3"
              >
                Continue to Payment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <Card className="glass-card border-slate-800/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Choose Payment Method</CardTitle>
                <p className="text-slate-400">Select your preferred cryptocurrency for payment</p>
              </CardHeader>
              <CardContent>
                {isLoadingCrypto ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading payment methods...</p>
                  </div>
                ) : cryptoPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-400 text-2xl">⚠️</span>
                      </div>
                      <p className="text-slate-400 text-lg font-semibold">Database Setup Required</p>
                      <p className="text-sm text-slate-500 mt-2">
                        The crypto_addresses table is not set up yet.
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Please run the database setup script in Supabase SQL Editor.
                      </p>
                      <div className="mt-4 p-3 bg-slate-800/50 rounded-lg text-left">
                        <p className="text-xs text-slate-400 font-mono">
                          1. Go to Supabase SQL Editor<br/>
                          2. Run: create-database-from-scratch.sql<br/>
                          3. Refresh this page
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <RadioGroup
                    value={orderData.paymentMethod}
                    onValueChange={(value) => setOrderData({ ...orderData, paymentMethod: value })}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {cryptoPayments.map((crypto) => (
                    <div key={crypto.id} className="relative">
                      <RadioGroupItem value={crypto.id} id={crypto.id} className="sr-only" />
                      <Label
                        htmlFor={crypto.id}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          orderData.paymentMethod === crypto.id
                            ? `border-${crypto.color}-500 bg-${crypto.color}-500/10`
                            : "border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full bg-${crypto.color}-500/20 flex items-center justify-center border border-${crypto.color}-500/30`}
                          >
                            <span className={`text-${crypto.color}-400 font-bold text-lg`}>{crypto.icon}</span>
                          </div>
                          <div>
                            <div className="font-bold text-white">{crypto.name}</div>
                            <div className="text-xs text-slate-400">{crypto.network}</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* Payment Details */}
            {orderData.paymentMethod && selectedPayment && (
              <Card className="glass-card border-slate-800/30">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Payment Details</CardTitle>
                  <p className="text-slate-400">Send payment to the address below</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* QR Code */}
                    <div className="text-center">
                      <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center overflow-hidden">
                        {selectedPayment.qr_code_url ? (
                          <img
                            src={selectedPayment.qr_code_url}
                            alt={`${selectedPayment.name} QR Code`}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="text-slate-800 font-bold text-center">
                            <div className="text-2xl mb-2">📱</div>
                            <div className="text-sm">QR Code</div>
                            <div className="text-xs text-slate-600">Not Available</div>
                          </div>
                        )}
                      </div>
                      <Badge
                        className={`bg-${selectedPayment.color}-500/20 text-${selectedPayment.color}-400 border-${selectedPayment.color}-500/30`}
                      >
                        {selectedPayment.name}
                      </Badge>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-400 font-medium">Payment Amount</Label>
                        <div className="text-2xl font-bold text-emerald-400">${orderData.amount}</div>
                      </div>

                      <div>
                        <Label className="text-slate-400 font-medium">Network</Label>
                        <div className="text-white font-semibold">{selectedPayment.network}</div>
                      </div>

                      <div>
                        <Label className="text-slate-400 font-medium">Wallet Address</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex-1 p-3 glass-card rounded-lg border border-slate-700/50">
                            <div className="text-white font-mono text-sm break-all">{selectedPayment.address}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(selectedPayment.address, selectedPayment.id)}
                            className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent"
                          >
                            {copiedAddress === selectedPayment.id ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="text-yellow-400 font-semibold mb-2">Important:</div>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>
                            • Send exactly ${orderData.amount} worth of {selectedPayment.name}
                          </li>
                          <li>• Use only the {selectedPayment.network} network</li>
                          <li>• Double-check the address before sending</li>
                          <li>• Keep your transaction ID for verification</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transaction Details */}
            {orderData.paymentMethod && (
              <Card className="glass-card border-slate-800/30">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Transaction Verification</CardTitle>
                  <p className="text-slate-400">Provide transaction details for verification</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="txid" className="text-slate-300 font-medium">
                      Transaction ID (TXID) *
                    </Label>
                    <Input
                      id="txid"
                      placeholder="Enter your transaction ID"
                      value={orderData.transactionId}
                      onChange={(e) => setOrderData({ ...orderData, transactionId: e.target.value })}
                      className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300 font-medium">Payment Screenshot *</Label>
                    <div className="mt-2">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="screenshot"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer glass-card hover:border-slate-600 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-slate-400" />
                            <p className="mb-2 text-sm text-slate-400">
                              <span className="font-semibold">Click to upload</span> payment screenshot
                            </p>
                            <p className="text-xs text-slate-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                          </div>
                          <input
                            id="screenshot"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                      {orderData.paymentScreenshot && (
                        <div className="mt-2 p-3 glass-card rounded-lg border border-emerald-500/30">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">{orderData.paymentScreenshot.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button
                onClick={prevStep}
                variant="outline"
                className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent px-8 py-3"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canProceedStep2}
                className="gradient-primary shadow-glow-emerald text-white font-semibold px-8 py-3"
              >
                Review Order
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Complete */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card className="glass-card border-slate-800/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Order Review</CardTitle>
                <p className="text-slate-400">Please review your order details before submitting</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Account Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Challenge Type:</span>
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
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Payment Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payment Method:</span>
                        <span className="text-white font-semibold">{selectedPayment?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Amount Paid:</span>
                        <span className="text-emerald-400 font-semibold">${orderData.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transaction ID:</span>
                        <span className="text-white font-mono text-sm">{orderData.transactionId.slice(0, 20)}...</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Rules */}
                <div className="p-6 glass-card rounded-xl border border-blue-500/30 bg-blue-500/5">
                  <h3 className="text-lg font-semibold text-white mb-4">Account Rules Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedChallenge?.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Savings Display */}
                <div className="p-6 glass-card rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">You're Saving!</h3>
                      <p className="text-slate-400">Compared to other prop firms</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">$150</div>
                      <div className="text-sm text-slate-400">Average savings</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Submit */}
            <Card className="glass-card border-slate-800/30">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="text-yellow-400 font-semibold mb-2">Important Notice:</div>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Your account will be activated within 24-48 hours after payment verification</li>
                      <li>• You will receive login credentials via email once verified</li>
                      <li>• Please ensure your payment details are accurate</li>
                      <li>• Contact support if you have any questions</li>
                    </ul>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="terms" className="w-4 h-4" />
                    <label htmlFor="terms" className="text-slate-300 text-sm">
                      I agree to the{" "}
                      <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer">Terms of Service</span>{" "}
                      and <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer">Trading Rules</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                onClick={prevStep}
                variant="outline"
                className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent px-8 py-3"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Payment
              </Button>

              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Submit Order button clicked!')
                  submitOrder()
                }}
                disabled={isSubmittingOrder}
                className="gradient-primary shadow-glow-emerald text-white font-semibold px-12 py-3 text-lg hover:scale-105 transition-transform duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ pointerEvents: 'auto', zIndex: 10 }}
              >
                {isSubmittingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Submit Order
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
