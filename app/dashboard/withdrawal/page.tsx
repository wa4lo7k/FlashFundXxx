"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Lock, AlertCircle, FileCheck } from "lucide-react"

export default function WithdrawalPage() {
  const kycStatus = {
    isCompleted: false, // Set to true to unlock withdrawals
    status: "Not Started",
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/30">
          <div className="flex items-center space-x-3 mb-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Profit Withdrawal</h1>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-3 py-1">
              <Lock className="w-4 h-4 mr-2" />
              Locked
            </Badge>
          </div>
          <p className="text-slate-400 font-medium text-lg">Withdraw your trading profits securely and efficiently</p>
        </div>

        {/* KYC Requirement */}
        <Card className="glass-card border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <span>KYC Verification Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                <FileCheck className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Complete KYC Verification First</h3>
                <p className="text-slate-400 mb-4">
                  To comply with financial regulations and ensure secure transactions, you must complete the KYC (Know
                  Your Customer) verification process before making any withdrawals.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-slate-300">Identity verification required</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-slate-300">Address verification required</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-slate-300">Financial information required</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/30">
              <div>
                <div className="text-white font-semibold">Current KYC Status: {kycStatus.status}</div>
                <div className="text-slate-400 text-sm">Complete KYC verification to unlock withdrawals</div>
              </div>
              <Button className="gradient-primary shadow-glow-emerald text-white font-semibold">
                <FileCheck className="w-5 h-5 mr-2" />
                Complete KYC
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Preview (Locked) */}
        <Card className="glass-card border-slate-800/30 opacity-60">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-400 flex items-center space-x-3">
              <Lock className="w-6 h-6" />
              <span>Withdrawal System (Locked)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-400 mb-2">Withdrawals Locked</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Complete your KYC verification to unlock withdrawal capabilities and access your trading profits.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="glass-card border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-400" />
              <span>Withdrawal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-300 font-medium">
                  <strong className="text-white">KYC Required:</strong> Complete identity verification before accessing
                  withdrawal features.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-300 font-medium">
                  <strong className="text-white">Fast Processing:</strong> Once unlocked, most withdrawals are processed
                  within 24-48 hours.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-300 font-medium">
                  <strong className="text-white">Multiple Methods:</strong> Bank transfer, PayPal, cryptocurrency, and
                  more payment options available.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-300 font-medium">
                  <strong className="text-white">Low Fees:</strong> Most withdrawal methods have minimal or no fees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
