"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

export default function CardPaymentPage() {
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "completed" | "failed">("pending")

  const cardPaymentIcons = [
    { name: "Visa", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg", fallback: "VISA" },
    { name: "Mastercard", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", fallback: "MC" },
    { name: "American Express", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg", fallback: "AMEX" },
    { name: "Discover", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg", fallback: "DISC" },
    { name: "Google Pay", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg", fallback: "GPay" },
    { name: "Apple Pay", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg", fallback: "APay" },
  ]

  // Mock payment data - this will come from LemonSqueezy API
  const paymentData = {
    amount: 649,
    currency: "USD",
    paymentId: "LS_12345678",
    checkoutUrl: "https://checkout.lemonsqueezy.com/...",
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  const handleProceedToCheckout = () => {
    // TODO: Redirect to LemonSqueezy checkout
    toast.success("Redirecting to secure checkout...")
    // window.open(paymentData.checkoutUrl, "_blank")
    
    // For demo purposes, simulate payment processing
    setTimeout(() => {
      setPaymentStatus("processing")
      setTimeout(() => {
        setPaymentStatus("completed")
        toast.success("Payment completed successfully!")
      }, 3000)
    }, 1000)
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
            <CreditCard className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Card Payment</h1>
              <p className="text-slate-400 font-medium">Complete your payment using credit or debit card</p>
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
                    {paymentStatus === "pending" && "Ready for Payment"}
                    {paymentStatus === "processing" && "Processing Payment"}
                    {paymentStatus === "completed" && "Payment Completed"}
                    {paymentStatus === "failed" && "Payment Failed"}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Payment ID: {paymentData.paymentId}
                  </p>
                </div>
              </div>
              {paymentStatus === "pending" && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Secure Checkout
                </Badge>
              )}
            </div>

            {paymentStatus === "pending" && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm">
                  <strong>Secure Payment:</strong> You'll be redirected to our secure payment processor to complete your transaction.
                  All card details are processed securely and never stored on our servers.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Info */}
          <Card className="glass-card border-slate-800/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Payment Details</CardTitle>
              <p className="text-slate-400">Secure card payment processing</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-slate-400 font-medium text-sm">Amount to Pay</label>
                <div className="text-3xl font-bold text-blue-400 mt-1">${paymentData.amount}</div>
                <div className="text-slate-400 text-sm">USD</div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="text-blue-400 font-semibold mb-2">Accepted Cards:</h4>
                <div className="grid grid-cols-3 gap-3">
                  {cardPaymentIcons.map((card, index) => (
                    <div
                      key={index}
                      className="h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center p-2"
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
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <h4 className="text-emerald-400 font-semibold mb-2">Security Features:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• SSL encrypted checkout</li>
                  <li>• PCI DSS compliant processing</li>
                  <li>• 3D Secure authentication</li>
                  <li>• Fraud protection included</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Process */}
          <Card className="glass-card border-slate-800/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Checkout Process</CardTitle>
              <p className="text-slate-400">How your payment will be processed</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Secure Redirect</h4>
                    <p className="text-slate-400 text-sm">You'll be redirected to our secure payment processor</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Enter Card Details</h4>
                    <p className="text-slate-400 text-sm">Safely enter your card information on the secure page</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Instant Confirmation</h4>
                    <p className="text-slate-400 text-sm">Receive immediate confirmation and account delivery</p>
                  </div>
                </div>
              </div>

              {paymentStatus === "pending" && (
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 text-lg hover:scale-105 transition-transform duration-200"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Proceed to Secure Checkout
                </Button>
              )}
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
              onClick={() => window.open("https://lemonsqueezy.com/", "_blank")}
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

        {/* Demo Notice */}
        <Card className="glass-card border-blue-500/30 bg-blue-500/5">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">LemonSqueezy Integration Ready</h3>
            <p className="text-slate-400 mb-4">
              This is a preview of the card payment interface. The actual LemonSqueezy integration will be implemented next.
            </p>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Demo Mode
            </Badge>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
