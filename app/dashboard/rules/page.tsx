"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, XCircle, Info, Shield, Target, Clock } from "lucide-react"

export default function RulesPage() {
  const accountTypes = [
    {
      name: "Instant Account",
      color: "emerald",
      rules: {
        profitTarget: "None",
        maxDrawdown: "5%",
        dailyDrawdown: "3%",
        minTradingDays: "None",
        timeLimit: "Unlimited",
        profitSplit: "Up to 90%",
        weekendHolding: "Allowed",
        newsTrading: "Allowed",
        expertAdvisors: "Allowed",
        hedging: "Allowed",
      },
    },
    {
      name: "HFT Account",
      color: "teal",
      rules: {
        profitTarget: "None",
        maxDrawdown: "6%",
        dailyDrawdown: "4%",
        minTradingDays: "None",
        timeLimit: "Unlimited",
        profitSplit: "Up to 85%",
        weekendHolding: "Allowed",
        newsTrading: "Allowed",
        expertAdvisors: "Allowed",
        hedging: "Allowed",
      },
    },
    {
      name: "1-Step Evaluation",
      color: "blue",
      rules: {
        profitTarget: "8%",
        maxDrawdown: "8%",
        dailyDrawdown: "5%",
        minTradingDays: "5 days",
        timeLimit: "30 days",
        profitSplit: "Up to 80%",
        weekendHolding: "Allowed",
        newsTrading: "Allowed",
        expertAdvisors: "Allowed",
        hedging: "Allowed",
      },
    },
    {
      name: "2-Step Evaluation",
      color: "purple",
      rules: {
        profitTarget: "Phase 1: 8% | Phase 2: 5%",
        maxDrawdown: "10%",
        dailyDrawdown: "5%",
        minTradingDays: "5 days each phase",
        timeLimit: "Phase 1: 30 days | Phase 2: 60 days",
        profitSplit: "Up to 90%",
        weekendHolding: "Allowed",
        newsTrading: "Allowed",
        expertAdvisors: "Allowed",
        hedging: "Allowed",
      },
    },
  ]

  const generalRules = [
    {
      title: "Trading Instruments",
      icon: Target,
      type: "allowed",
      rules: [
        "Major Forex pairs (EUR/USD, GBP/USD, USD/JPY, etc.)",
        "Minor Forex pairs (EUR/GBP, AUD/CAD, etc.)",
        "Exotic Forex pairs (USD/TRY, EUR/ZAR, etc.)",
        "Gold and Silver (XAUUSD, XAGUSD)",
        "Major indices (US30, SPX500, NAS100, etc.)",
        "Crude Oil (USOIL, UKOIL)",
      ],
    },
    {
      title: "Prohibited Activities",
      icon: XCircle,
      type: "forbidden",
      rules: [
        "Account copying or management by third parties",
        "Reverse engineering or exploiting platform vulnerabilities",
        "Using multiple accounts to hedge positions",
        "Coordinated trading between multiple accounts",
        "High-frequency trading on non-HFT accounts",
        "Latency arbitrage strategies",
      ],
    },
    {
      title: "Risk Management",
      icon: Shield,
      type: "warning",
      rules: [
        "Maximum lot size per trade varies by account size",
        "Position sizing must be appropriate for account balance",
        "Stop losses are recommended but not mandatory",
        "Margin level must not fall below 20%",
        "Maximum exposure per currency pair: 10%",
        "Correlation limits apply to related instruments",
      ],
    },
  ]

  const payoutRules = [
    "Minimum payout amount: $50 for most methods",
    "Payouts processed within 24-48 hours after request",
    "KYC verification required before first payout",
    "Profit split applies to all profitable trades",
    "No fees for bank transfers and most payment methods",
    "Cryptocurrency payouts subject to network fees",
    "Monthly payout limits may apply based on account type",
    "Consistent profitability required for scaling opportunities",
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/30">
          <div className="flex items-center space-x-3 mb-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Trading Rules & Guidelines</h1>
          </div>
          <p className="text-slate-400 font-medium text-lg">
            Comprehensive rules and guidelines for all account types and trading activities
          </p>
        </div>

        {/* Account Type Rules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Target className="w-6 h-6 text-emerald-400" />
            <span>Account Type Rules</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accountTypes.map((account, index) => (
              <Card key={index} className="glass-card border-slate-800/30">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
                    <Badge
                      className={`bg-${account.color}-500/20 text-${account.color}-400 border-${account.color}-500/30 px-3 py-1`}
                    >
                      {account.name}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(account.rules).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-2 border-b border-slate-800/30 last:border-b-0"
                      >
                        <span className="text-slate-400 font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="text-white font-semibold text-right max-w-[60%]">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* General Rules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Shield className="w-6 h-6 text-yellow-400" />
            <span>General Trading Rules</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {generalRules.map((section, index) => (
              <Card
                key={index}
                className={`glass-card border-slate-800/30 ${
                  section.type === "forbidden"
                    ? "border-red-500/30 bg-red-500/5"
                    : section.type === "warning"
                      ? "border-yellow-500/30 bg-yellow-500/5"
                      : "border-emerald-500/30 bg-emerald-500/5"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        section.type === "forbidden"
                          ? "bg-red-500/20 border border-red-500/30"
                          : section.type === "warning"
                            ? "bg-yellow-500/20 border border-yellow-500/30"
                            : "bg-emerald-500/20 border border-emerald-500/30"
                      }`}
                    >
                      <section.icon
                        className={`w-5 h-5 ${
                          section.type === "forbidden"
                            ? "text-red-400"
                            : section.type === "warning"
                              ? "text-yellow-400"
                              : "text-emerald-400"
                        }`}
                      />
                    </div>
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.rules.map((rule, ruleIndex) => (
                      <div key={ruleIndex} className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            section.type === "forbidden"
                              ? "bg-red-400"
                              : section.type === "warning"
                                ? "bg-yellow-400"
                                : "bg-emerald-400"
                          }`}
                        />
                        <span className="text-slate-300 text-sm font-medium leading-relaxed">{rule}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payout Rules */}
        <Card className="glass-card border-slate-800/30">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-400" />
              <span>Payout Rules & Procedures</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payoutRules.map((rule, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 font-medium">{rule}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="glass-card border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center space-x-3">
              <Info className="w-6 h-6 text-blue-400" />
              <span>Important Notice</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-300 font-medium">
                <strong className="text-white">Rule Violations:</strong> Any violation of the above rules may result in
                account termination, forfeiture of profits, or suspension of trading privileges. We reserve the right to
                review all trading activity and take appropriate action when necessary.
              </p>
              <p className="text-slate-300 font-medium">
                <strong className="text-white">Updates:</strong> These rules may be updated from time to time. Traders
                will be notified of any significant changes via email and dashboard notifications.
              </p>
              <p className="text-slate-300 font-medium">
                <strong className="text-white">Questions:</strong> If you have any questions about these rules or need
                clarification, please contact our support team through the dashboard or email support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
