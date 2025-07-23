"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { nowPaymentsService } from "@/lib/nowpayments"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Bitcoin,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

export default function CryptoPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "completed" | "failed">("pending")
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes in seconds
  const [paymentData, setPaymentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = searchParams?.get('order')

  // Load payment data on mount
  useEffect(() => {
    if (!orderId || !user) return

    const loadPaymentData = async () => {
      try {
        setLoading(true)
        // Check if payment already exists for this order
        const statusResponse = await nowPaymentsService.checkPaymentStatus(orderId, user.id)

        if (statusResponse.success && statusResponse.payment) {
          // Payment already exists, use existing data
          setPaymentData({
            amount: statusResponse.order?.final_amount || 0,
            currency: "USD",
            cryptoAmount: statusResponse.order?.crypto_amount || 0,
            cryptoCurrency: statusResponse.order?.crypto_currency?.toUpperCase() || "BTC",
            address: statusResponse.order?.crypto_address || "",
            paymentId: statusResponse.payment.payment_id,
            qrCode: nowPaymentsService.generateQRCodeDataUrl(
              statusResponse.order?.crypto_address || "",
              statusResponse.order?.crypto_amount || 0,
              statusResponse.order?.crypto_currency || "btc"
            ),
          })
          setPaymentStatus(statusResponse.payment.payment_status === 'confirmed' || statusResponse.payment.payment_status === 'finished' ? 'completed' : 'pending')
        } else if (statusResponse.success && statusResponse.order) {
          // Order exists but no payment yet - this should not happen with the new flow
          // but we'll handle it gracefully
          setPaymentData({
            amount: statusResponse.order.final_amount,
            currency: "USD",
            cryptoAmount: 0,
            cryptoCurrency: statusResponse.order.crypto_currency?.toUpperCase() || "BTC",
            address: "",
            paymentId: "",
            qrCode: "",
          })
          setError("Payment is being processed. Please wait or refresh the page.")
        } else {
          setError("Order not found. Please create a new order.")
        }
      } catch (err) {
        console.error('Error loading payment data:', err)
        setError("Failed to load payment data")
      } finally {
        setLoading(false)
      }
    }

    loadPaymentData()
  }, [orderId, user])

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining > 0 && paymentStatus === "pending") {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining, paymentStatus])

  // Poll payment status
  useEffect(() => {
    if (!orderId || !user || paymentStatus === 'completed') return

    const pollStatus = async () => {
      try {
        const statusResponse = await nowPaymentsService.checkPaymentStatus(orderId, user.id)
        if (statusResponse.success && statusResponse.payment) {
          const status = statusResponse.payment.payment_status
          if (status === 'confirmed' || status === 'finished') {
            setPaymentStatus('completed')
          } else if (status === 'failed' || status === 'expired') {
            setPaymentStatus('failed')
          }
        }
      } catch (err) {
        console.error('Error polling payment status:', err)
      }
    }

    const interval = setInterval(pollStatus, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [orderId, user, paymentStatus])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-2xl border border-slate-800/30 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">Loading payment details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show error state
  if (error || !paymentData) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-2xl border border-red-800/30 text-center">
            <div className="text-red-400 mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Error</h3>
            <p className="text-slate-400 mb-4">{error || "Payment data not found"}</p>
            <Button onClick={() => router.push('/dashboard/buy-challenge')} className="gradient-primary">
              Create New Order
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/30">
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <Bitcoin className="w-8 h-8 text-orange-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Crypto Payment</h1>
              <p className="text-slate-400 font-medium">Complete your payment using cryptocurrency</p>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <Card className="glass-card border-slate-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {paymentStatus === "pending" && <Clock className="w-6 h-6 text-yellow-400" />}
                {paymentStatus === "processing" && <AlertCircle className="w-6 h-6 text-blue-400" />}
                {paymentStatus === "completed" && <CheckCircle className="w-6 h-6 text-emerald-400" />}
                {paymentStatus === "failed" && <AlertCircle className="w-6 h-6 text-red-400" />}
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {paymentStatus === "pending" && "Waiting for Payment"}
                    {paymentStatus === "processing" && "Processing Payment"}
                    {paymentStatus === "completed" && "Payment Completed"}
                    {paymentStatus === "failed" && "Payment Expired"}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Payment ID: {paymentData.paymentId}
                  </p>
                </div>
              </div>
              {paymentStatus === "pending" && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  {formatTime(timeRemaining)} remaining
                </Badge>
              )}
            </div>

            {paymentStatus === "pending" && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  <strong>Important:</strong> Send the exact amount to the address below within the time limit.
                  Do not send from an exchange wallet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code */}
          <Card className="glass-card border-slate-800/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Scan QR Code</CardTitle>
              <p className="text-slate-400">Scan with your crypto wallet</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-64 h-64 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={paymentData.qrCode}
                  alt="Payment QR Code"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text display if QR code fails
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <div class="text-slate-800 font-bold text-center">
                          <div class="text-sm mb-2">QR Code</div>
                          <div class="text-xs text-slate-600">Scan to Pay</div>
                        </div>
                      `
                    }
                  }}
                />
              </div>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {paymentData.cryptoCurrency}
              </Badge>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="glass-card border-slate-800/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Payment Details</CardTitle>
              <p className="text-slate-400">Send the exact amount to this address</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-slate-400 font-medium text-sm">Amount to Send</label>
                <div className="flex items-center justify-between p-3 glass-card rounded-lg border border-slate-700/50 mt-1">
                  <span className="text-white font-mono text-lg">{paymentData.cryptoAmount} {paymentData.cryptoCurrency}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(paymentData.cryptoAmount, "Amount")}
                    className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium text-sm">Bitcoin Address</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 p-3 glass-card rounded-lg border border-slate-700/50">
                    <div className="text-white font-mono text-sm break-all">{paymentData.address}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(paymentData.address, "Address")}
                    className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium text-sm">USD Equivalent</label>
                <div className="text-2xl font-bold text-emerald-400 mt-1">${paymentData.amount}</div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="text-blue-400 font-semibold mb-2">Instructions:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Send exactly {paymentData.cryptoAmount} {paymentData.cryptoCurrency}</li>
                  <li>• Use only the {paymentData.cryptoCurrency} network</li>
                  <li>• Do not send from exchange wallets</li>
                  <li>• Payment will be confirmed automatically</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={handleBackToDashboard}
            variant="outline"
            className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent px-8 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex space-x-4">
            <Button
              onClick={() => window.open("https://nowpayments.io/", "_blank")}
              variant="outline"
              className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent px-6 py-3"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Help & Support
            </Button>
            
            {paymentStatus === "completed" && (
              <Button
                onClick={handleBackToDashboard}
                className="gradient-primary shadow-glow-emerald text-white font-semibold px-8 py-3"
              >
                <Shield className="w-5 h-5 mr-2" />
                Continue to Dashboard
              </Button>
            )}
          </div>
        </div>

        {/* Real NowPayments Integration Active */}
        <Card className="glass-card border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Real NowPayments Integration Active</h3>
            <p className="text-slate-400 mb-4">
              This payment system is connected to real NowPayments API for actual cryptocurrency transactions.
            </p>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Live Mode
            </Badge>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
