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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  RefreshCw,
} from "lucide-react"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30d")
  const [reportType, setReportType] = useState("overview")

  const reportCategories = [
    {
      id: "financial",
      name: "Financial Reports",
      icon: DollarSign,
      color: "emerald",
      reports: [
        { name: "Revenue Summary", description: "Total revenue and profit margins", format: "PDF/Excel" },
        { name: "Payment Analysis", description: "Payment methods and success rates", format: "Excel" },
        { name: "Refund Report", description: "Refunds and chargebacks analysis", format: "PDF" },
        { name: "Commission Tracking", description: "Affiliate and partner commissions", format: "Excel" },
      ]
    },
    {
      id: "operational",
      name: "Operational Reports",
      icon: BarChart3,
      color: "blue",
      reports: [
        { name: "Order Processing", description: "Order flow and processing times", format: "Excel" },
        { name: "Account Delivery", description: "Account delivery success rates", format: "PDF" },
        { name: "Support Tickets", description: "Customer support metrics", format: "Excel" },
        { name: "System Performance", description: "Platform uptime and performance", format: "PDF" },
      ]
    },
    {
      id: "user",
      name: "User Analytics",
      icon: Users,
      color: "teal",
      reports: [
        { name: "User Registration", description: "New user acquisition trends", format: "Excel" },
        { name: "User Activity", description: "User engagement and retention", format: "PDF" },
        { name: "KYC Compliance", description: "Verification status and compliance", format: "Excel" },
        { name: "Geographic Analysis", description: "User distribution by region", format: "PDF/Excel" },
      ]
    },
    {
      id: "trading",
      name: "Trading Performance",
      icon: Target,
      color: "purple",
      reports: [
        { name: "Challenge Success Rates", description: "Success rates by challenge type", format: "Excel" },
        { name: "Trading Metrics", description: "Profit/loss and drawdown analysis", format: "PDF" },
        { name: "Account Performance", description: "Live account performance tracking", format: "Excel" },
        { name: "Risk Management", description: "Risk metrics and compliance", format: "PDF" },
      ]
    }
  ]

  const quickStats = [
    { label: "Total Reports Generated", value: "1,247", change: "+12%", color: "emerald" },
    { label: "Automated Reports", value: "89", change: "+5%", color: "blue" },
    { label: "Scheduled Reports", value: "23", change: "+2%", color: "teal" },
    { label: "Custom Reports", value: "156", change: "+18%", color: "purple" },
  ]

  const scheduledReports = [
    {
      name: "Daily Revenue Summary",
      schedule: "Daily at 9:00 AM",
      lastRun: "Today, 9:00 AM",
      status: "completed",
      recipients: 3,
    },
    {
      name: "Weekly User Analytics",
      schedule: "Mondays at 8:00 AM",
      lastRun: "Yesterday, 8:00 AM",
      status: "completed",
      recipients: 5,
    },
    {
      name: "Monthly Financial Report",
      schedule: "1st of each month",
      lastRun: "July 1, 2025",
      status: "completed",
      recipients: 8,
    },
    {
      name: "Quarterly Compliance Report",
      schedule: "Quarterly",
      lastRun: "April 1, 2025",
      status: "pending",
      recipients: 12,
    },
  ]

  const generateReport = (reportName: string, category: string) => {
    console.log(`Generating ${reportName} report for ${category} category`)
    // Implement report generation logic
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <FileText className="w-8 h-8 mr-3 text-purple-400" />
            Reports & Analytics
          </h1>
          <p className="text-slate-400 mt-2">Generate comprehensive business reports and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="glass-card border-slate-700/50 text-white w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="glass-card border-slate-800/50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                <Badge className={`bg-${stat.color}-500/20 text-${stat.color}-400 border-${stat.color}-500/30 text-xs`}>
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="generate" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <FileText className="w-4 h-4 mr-2" />
            Generate Reports
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Calendar className="w-4 h-4 mr-2" />
            Scheduled Reports
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <BarChart3 className="w-4 h-4 mr-2" />
            Report History
          </TabsTrigger>
        </TabsList>

        {/* Generate Reports */}
        <TabsContent value="generate" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportCategories.map((category) => (
              <Card key={category.id} className="glass-card border-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <div className={`w-10 h-10 bg-${category.color}-500/20 border border-${category.color}-500/30 rounded-lg flex items-center justify-center mr-3`}>
                      <category.icon className={`w-5 h-5 text-${category.color}-400`} />
                    </div>
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.reports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{report.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{report.description}</p>
                        <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs mt-2">
                          {report.format}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => generateReport(report.name, category.name)}
                        className={`bg-${category.color}-500/20 text-${category.color}-400 border border-${category.color}-500/30 hover:bg-${category.color}-500/30 ml-3`}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Scheduled Reports */}
        <TabsContent value="scheduled" className="space-y-6 mt-6">
          <Card className="glass-card border-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                  Automated Report Schedule
                </div>
                <Button className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
                  <Calendar className="w-4 h-4 mr-2" />
                  New Schedule
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        report.status === 'completed' ? 'bg-emerald-400' : 
                        report.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                      }`} />
                      <div>
                        <p className="font-medium text-white">{report.name}</p>
                        <p className="text-sm text-slate-400">{report.schedule}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-300">Last run: {report.lastRun}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          {report.recipients} recipients
                        </Badge>
                        <Badge className={`text-xs ${
                          report.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report History */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <Card className="glass-card border-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                Recent Report Generation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Daily Revenue Summary", generated: "2 hours ago", size: "2.4 MB", downloads: 12, type: "financial" },
                  { name: "User Registration Report", generated: "5 hours ago", size: "1.8 MB", downloads: 8, type: "user" },
                  { name: "Challenge Success Analysis", generated: "1 day ago", size: "3.2 MB", downloads: 15, type: "trading" },
                  { name: "System Performance Report", generated: "1 day ago", size: "1.1 MB", downloads: 6, type: "operational" },
                  { name: "Weekly Financial Summary", generated: "2 days ago", size: "4.7 MB", downloads: 23, type: "financial" },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        report.type === 'financial' ? 'bg-emerald-500/20 border border-emerald-500/30' :
                        report.type === 'user' ? 'bg-teal-500/20 border border-teal-500/30' :
                        report.type === 'trading' ? 'bg-purple-500/20 border border-purple-500/30' :
                        'bg-blue-500/20 border border-blue-500/30'
                      }`}>
                        <FileText className={`w-4 h-4 ${
                          report.type === 'financial' ? 'text-emerald-400' :
                          report.type === 'user' ? 'text-teal-400' :
                          report.type === 'trading' ? 'text-purple-400' :
                          'text-blue-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{report.name}</p>
                        <p className="text-xs text-slate-400">Generated {report.generated} • {report.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs">
                        {report.downloads} downloads
                      </Badge>
                      <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
