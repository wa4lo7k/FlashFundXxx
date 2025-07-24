"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Download } from "lucide-react"
import { toast } from "sonner"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState<any>(null)

  const orderId = searchParams?.get('order')

  useEffect(() => {
    if (!orderId || !user) {
      router.push('/dashboard')
      return
    }

    // Here you would typically verify the payment status
    // For now, we'll just show success
    setLoading(false)
    toast.success("Payment completed successfully!")
  }, [orderId, user, router])

  const handleViewDashboard = () => {
    router.push('/dashboard')
  }

  const handleDownloadAccount = () => {
    // This would download account credentials
    toast.info("Account delivery is being processed...")
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <CardTitle className="text-2xl text-white">Payment Successful!</CardTitle>
            <p className="text-slate-400">
              Your order has been processed successfully. Your trading account will be delivered shortly.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderId && (
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="text-white font-mono">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400">Paid</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Delivery:</span>
                    <span className="text-yellow-400">Processing</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">What's Next?</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Your trading account is being set up</li>
                <li>• You'll receive login credentials via email within 24 hours</li>
                <li>• Check your dashboard for account status updates</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleViewDashboard}
                className="flex-1 gradient-primary text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
              <Button
                onClick={handleDownloadAccount}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
