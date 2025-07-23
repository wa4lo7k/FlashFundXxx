"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"

export default function PaymentCancelledPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const orderId = searchParams?.get('order')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
  }, [user, router])

  const handleRetryPayment = () => {
    if (orderId) {
      router.push(`/dashboard/payment/crypto?order=${orderId}`)
    } else {
      router.push('/dashboard/buy-challenge')
    }
  }

  const handleNewOrder = () => {
    router.push('/dashboard/buy-challenge')
  }

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <CardTitle className="text-2xl text-white">Payment Cancelled</CardTitle>
            <p className="text-slate-400">
              Your payment was cancelled. No charges have been made to your account.
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
                    <span className="text-red-400">Cancelled</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">What happened?</h4>
              <p className="text-sm text-slate-300">
                The payment process was cancelled before completion. This could be due to:
              </p>
              <ul className="text-sm text-slate-300 mt-2 space-y-1">
                <li>• You closed the payment window</li>
                <li>• Payment timeout occurred</li>
                <li>• You chose to cancel the transaction</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              {orderId && (
                <Button
                  onClick={handleRetryPayment}
                  className="gradient-primary text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Payment
                </Button>
              )}
              <Button
                onClick={handleNewOrder}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Create New Order
              </Button>
              <Button
                onClick={handleBackToDashboard}
                variant="ghost"
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
