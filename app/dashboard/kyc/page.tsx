"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Lock, AlertCircle, Target, BarChart3 } from "lucide-react"

export default function KYCPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/30">
          <div className="flex items-center space-x-3 mb-2">
            <FileCheck className="w-6 h-6 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">KYC Verification</h1>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-3 py-1">
              <Lock className="w-4 h-4 mr-2" />
              Locked
            </Badge>
          </div>
          <p className="text-slate-400 font-medium text-lg">
            Complete your identity verification to unlock withdrawal capabilities
          </p>
        </div>

        {/* Challenge Requirement */}
        <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <span>Challenge Phase Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
                <Target className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Complete Your Trading Challenge First</h3>
                <p className="text-slate-400 mb-4">
                  KYC verification is only available after successfully completing your trading challenge phase. This
                  ensures compliance with our risk management protocols.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/30">
              <div>
                <div className="text-white font-semibold">Current Status: Challenge Phase</div>
                <div className="text-slate-400 text-sm">Complete challenge to unlock KYC verification</div>
              </div>
              <Button
                variant="outline"
                className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Challenge Progress
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KYC Preview (Locked) */}
        <Card className="glass-card border-slate-800/30 opacity-60">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-400 flex items-center space-x-3">
              <Lock className="w-6 h-6" />
              <span>KYC Verification Process (Locked)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-400 mb-2">KYC Verification Locked</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Complete your trading challenge to unlock the KYC verification process and access withdrawal
                capabilities.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="glass-card border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-400" />
              <span>Important Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-300 font-medium">
                  <strong className="text-white">Challenge First:</strong> You must successfully complete your trading
                  challenge before accessing KYC verification.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-300 font-medium">
                  <strong className="text-white">Quick Process:</strong> Once unlocked, KYC verification typically takes
                  24-48 hours to complete.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-300 font-medium">
                  <strong className="text-white">Required Documents:</strong> You'll need government ID, proof of
                  address, and basic personal information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
