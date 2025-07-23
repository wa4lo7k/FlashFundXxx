"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Zap,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
} from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [accountType, setAccountType] = useState("all")

  // Mock analytics data
  const overviewStats = [
    {
      name: "Total Revenue",
      value: "$124,580",
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
      color: "emerald",
    },
    {
      name: "Conversion Rate",
      value: "68.4%",
      change: "+3.2%",
      changeType: "increase",
      icon: Target,
      color: "blue",
    },
    {
      name: "Active Traders",
      value: "1,247",
      change: "+8.1%",
      changeType: "increase",
      icon: Users,
      color: "teal",
    },
    {
      name: "Avg Order Value",
      value: "$2,450",
      change: "-2.1%",
      changeType: "decrease",
      icon: TrendingUp,
      color: "purple",
    },
  ]

  const challengeTypeStats = [
    {
      type: "Instant",
      orders: 45,
      revenue: "$45,000",
      conversionRate: 78.2,
      avgDays: 12,
      color: "emerald",
      icon: Zap,
    },
    {
      type: "OneStep",
      orders: 34,
      revenue: "$68,000",
      conversionRate: 72.1,
      avgDays: 18,
      color: "blue",
      icon: Target,
    },
    {
      type: "TwoStep",
      orders: 67,
      revenue: "$134,000",
      conversionRate: 65.8,
      avgDays: 28,
      color: "teal",
      icon: Target,
    },
    {
      type: "HFT",
      orders: 28,
      revenue: "$84,000",
      conversionRate: 82.1,
      avgDays: 8,
      color: "purple",
      icon: BarChart3,
    },
  ]

  const monthlyData = [
    { month: "Jan", orders: 89, revenue: 89000, conversions: 62 },
    { month: "Feb", orders: 95, revenue: 95000, conversions: 68 },
    { month: "Mar", orders: 112, revenue: 112000, conversions: 74 },
    { month: "Apr", orders: 108, revenue: 108000, conversions: 71 },
    { month: "May", orders: 125, revenue: 125000, conversions: 78 },
    { month: "Jun", orders: 131, revenue: 131000, conversions: 82 },
  ]

  const topPerformers = [
    { name: "Ahmed Hassan", orders: 5, revenue: 15000, successRate: 100 },
    { name: "Sarah Johnson", orders: 3, revenue: 12000, successRate: 100 },
    { name: "Michael Chen", orders: 4, revenue: 10000, successRate: 75 },
    { name: "Emma Rodriguez", orders: 2, revenue: 8000, successRate: 100 },
    { name: "David Kim", orders: 3, revenue: 7500, successRate: 67 },
  ]

  const recentTrends = [
    {
      metric: "Order Volume",
      trend: "up",
      value: "+15.2%",
      description: "Compared to last month",
      color: "emerald",
    },
    {
      metric: "User Retention",
      trend: "up",
      value: "+8.7%",
      description: "30-day retention rate",
      color: "blue",
    },
    {
      metric: "Average Session",
      trend: "down",
      value: "-3.1%",
      description: "Trading session duration",
      color: "red",
    },
    {
      metric: "Support Tickets",
      trend: "down",
      value: "-12.4%",
      description: "Customer support requests",
      color: "emerald",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-purple-400" />
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Comprehensive platform performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="glass-card border-slate-700/50 text-white w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.name} className="glass-card border-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === "increase" ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-400" />
                    )}
                    <span
                      className={`text-sm font-medium ml-1 ${
                        stat.changeType === "increase" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-slate-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-500/20 border border-${stat.color}-500/30 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Challenge Type Performance */}
        <Card className="glass-card border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-purple-400" />
              Challenge Type Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {challengeTypeStats.map((challenge) => (
              <div key={challenge.type} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-${challenge.color}-500/20 border border-${challenge.color}-500/30 rounded-lg flex items-center justify-center`}>
                      <challenge.icon className={`w-5 h-5 text-${challenge.color}-400`} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{challenge.type}</p>
                      <p className="text-sm text-slate-400">{challenge.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{challenge.revenue}</p>
                    <p className="text-sm text-slate-400">{challenge.conversionRate}% conversion</p>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className={`bg-${challenge.color}-400 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${challenge.conversionRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Avg completion: {challenge.avgDays} days</span>
                  <span>{challenge.conversionRate}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Trends */}
        <Card className="glass-card border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
              Recent Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full bg-${trend.color}-400`} />
                  <div>
                    <p className="font-medium text-white">{trend.metric}</p>
                    <p className="text-sm text-slate-400">{trend.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {trend.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className={`w-4 h-4 ${trend.color === 'red' ? 'text-red-400' : 'text-emerald-400'}`} />
                    )}
                    <span className={`font-semibold ${
                      trend.trend === "up" ? 'text-emerald-400' : 
                      trend.color === 'red' ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {trend.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Monthly Performance Chart */}
        <Card className="glass-card border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <LineChart className="w-5 h-5 mr-2 text-purple-400" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month, index) => (
                <div key={month.month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">{month.month}</span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-400">{month.orders} orders</span>
                      <span className="text-emerald-400">${month.revenue.toLocaleString()}</span>
                      <span className="text-teal-400">{month.conversions}% conv</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-emerald-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(month.orders / 150) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="glass-card border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-400" />
              Top Performing Traders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white">{performer.name}</p>
                      <p className="text-sm text-slate-400">{performer.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-400">${performer.revenue.toLocaleString()}</p>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      <span className="text-sm text-slate-400">{performer.successRate}% success</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Summary */}
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-400" />
            Key Performance Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">89.2%</p>
              <p className="text-sm text-slate-400 mt-1">Platform Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">2.3s</p>
              <p className="text-sm text-slate-400 mt-1">Avg Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-400">94.7%</p>
              <p className="text-sm text-slate-400 mt-1">Customer Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">15.2</p>
              <p className="text-sm text-slate-400 mt-1">Avg Trading Days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">$2,847</p>
              <p className="text-sm text-slate-400 mt-1">Avg Profit/Trader</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">73.4%</p>
              <p className="text-sm text-slate-400 mt-1">Overall Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
