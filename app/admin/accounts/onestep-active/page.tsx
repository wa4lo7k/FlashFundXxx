"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import OrderDetailModal from "@/components/admin/OrderDetailModal"
import {
  Target,
  Search,
  Eye,
  Edit,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  Award,
} from "lucide-react"

interface OneStepActiveAccount {
  id: string
  user: {
    name: string
    email: string
  }
  accountSize: number
  platform: string
  status: "active" | "stage1_passed" | "ready_for_funding"
  challengeType: "oneStep"
  activatedAt: string
  currentBalance: number
  profitTarget: number
  maxDrawdown: number
  tradingDays: number
  lastActivity: string
  server: string
  login: string
  stage1Profit?: number
  readyForFunding?: boolean
}

export default function OneStepActiveAccountsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedAccount, setSelectedAccount] = useState<OneStepActiveAccount | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data for onestep active accounts
  const oneStepActiveAccounts: OneStepActiveAccount[] = [
    {
      id: "FxO42616723",
      user: { name: "Sarah Johnson", email: "sarah.johnson@email.com" },
      accountSize: 10000,
      platform: "mt5",
      status: "active",
      challengeType: "oneStep",
      activatedAt: "7/4/2025, 5:21:42 PM",
      currentBalance: 10450.75,
      profitTarget: 10800,
      maxDrawdown: 9500,
      tradingDays: 8,
      lastActivity: "1 hour ago",
      server: "FlashFundX-OneStep01",
      login: "60001234",
    },
    {
      id: "FxO46883135",
      user: { name: "Michael Chen", email: "michael.chen@email.com" },
      accountSize: 25000,
      platform: "mt5",
      status: "stage1_passed",
      challengeType: "oneStep",
      activatedAt: "7/2/2025, 6:34:45 AM",
      currentBalance: 26890.25,
      profitTarget: 27000,
      maxDrawdown: 23750,
      tradingDays: 15,
      lastActivity: "30 minutes ago",
      server: "FlashFundX-OneStep02",
      login: "60001235",
      stage1Profit: 1890.25,
      readyForFunding: true,
    },
    {
      id: "FxO12345678",
      user: { name: "Emma Rodriguez", email: "emma.rodriguez@email.com" },
      accountSize: 5000,
      platform: "mt5",
      status: "ready_for_funding",
      challengeType: "oneStep",
      activatedAt: "6/28/2025, 3:45:12 PM",
      currentBalance: 5420.50,
      profitTarget: 5400,
      maxDrawdown: 4750,
      tradingDays: 22,
      lastActivity: "2 hours ago",
      server: "FlashFundX-OneStep01",
      login: "60001236",
      stage1Profit: 420.50,
      readyForFunding: true,
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Active Trading" },
      stage1_passed: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Stage 1 Passed" },
      ready_for_funding: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "Ready for Funding" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    )
  }

  const getProgressStatus = (currentBalance: number, profitTarget: number, maxDrawdown: number, status: string) => {
    if (status === "ready_for_funding") {
      return { status: "completed", color: "text-purple-400", label: "Funding Ready" }
    } else if (currentBalance >= profitTarget) {
      return { status: "target_reached", color: "text-emerald-400", label: "Target Reached" }
    } else if (currentBalance <= maxDrawdown) {
      return { status: "danger", color: "text-red-400", label: "Near Drawdown" }
    } else {
      return { status: "active", color: "text-blue-400", label: "In Progress" }
    }
  }

  const getActivityBadge = (lastActivity: string) => {
    if (lastActivity.includes("minutes") || lastActivity.includes("hour")) {
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Active</Badge>
    } else if (lastActivity.includes("day")) {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Recent</Badge>
    } else {
      return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-xs">Inactive</Badge>
    }
  }

  const filteredAccounts = oneStepActiveAccounts.filter((account) => {
    const matchesSearch = 
      account.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.login.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPlatform = platformFilter === "all" || account.platform === platformFilter
    const matchesStatus = statusFilter === "all" || account.status === statusFilter

    return matchesSearch && matchesPlatform && matchesStatus
  })

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage)

  const handleViewAccount = (account: OneStepActiveAccount) => {
    setSelectedAccount(account)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleEditAccount = (account: OneStepActiveAccount) => {
    setSelectedAccount(account)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAccount(null)
  }

  const totalBalance = oneStepActiveAccounts.reduce((sum, account) => sum + account.currentBalance, 0)
  const readyForFunding = oneStepActiveAccounts.filter(a => a.status === "ready_for_funding").length
  const avgTradingDays = Math.round(oneStepActiveAccounts.reduce((sum, account) => sum + account.tradingDays, 0) / oneStepActiveAccounts.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Target className="w-8 h-8 mr-3 text-blue-400" />
            OneStep Active Accounts
          </h1>
          <p className="text-slate-400 mt-2">Single-phase challenge accounts in progress</p>
        </div>
        <div className="flex items-center space-x-3">
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

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{oneStepActiveAccounts.length}</p>
              <p className="text-sm text-slate-400">Active Accounts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">${totalBalance.toFixed(2)}</p>
              <p className="text-sm text-slate-400">Total Balance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{readyForFunding}</p>
              <p className="text-sm text-slate-400">Ready for Funding</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-400">{avgTradingDays}</p>
              <p className="text-sm text-slate-400">Avg Trading Days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card border-slate-800/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search accounts, users, login..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-card border-slate-700/50 text-white placeholder:text-slate-500 pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="glass-card border-slate-700/50 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Trading</SelectItem>
                <SelectItem value="stage1_passed">Stage 1 Passed</SelectItem>
                <SelectItem value="ready_for_funding">Ready for Funding</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="glass-card border-slate-700/50 text-white">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="mt5">MT5</SelectItem>
                <SelectItem value="mt4">MT4</SelectItem>
                <SelectItem value="ctrader">cTrader</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>OneStep Active Accounts ({filteredAccounts.length} total)</span>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Activity className="w-3 h-3 mr-1" />
              Single Phase Challenge
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">Account ID</TableHead>
                  <TableHead className="text-slate-400">User</TableHead>
                  <TableHead className="text-slate-400">Size</TableHead>
                  <TableHead className="text-slate-400">Current Balance</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Progress</TableHead>
                  <TableHead className="text-slate-400">Trading Days</TableHead>
                  <TableHead className="text-slate-400">Last Activity</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAccounts.map((account) => {
                  const progressStatus = getProgressStatus(account.currentBalance, account.profitTarget, account.maxDrawdown, account.status)
                  const progressPercentage = ((account.currentBalance - account.accountSize) / (account.profitTarget - account.accountSize)) * 100
                  
                  return (
                    <TableRow key={account.id} className="border-slate-800 hover:bg-slate-800/30">
                      <TableCell className="font-mono text-blue-400">{account.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{account.user.name}</p>
                          <p className="text-sm text-slate-400">{account.login}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-semibold">${account.accountSize.toLocaleString()}</TableCell>
                      <TableCell>
                        <div>
                          <p className={`font-semibold ${progressStatus.color}`}>${account.currentBalance.toFixed(2)}</p>
                          <p className="text-xs text-slate-400">{progressStatus.label}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(account.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Target</span>
                            <span className="text-white">{Math.max(0, Math.min(100, progressPercentage)).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                account.status === "ready_for_funding" ? 'bg-purple-400' :
                                progressPercentage >= 100 ? 'bg-emerald-400' : 
                                progressPercentage >= 75 ? 'bg-teal-400' : 
                                progressPercentage >= 50 ? 'bg-blue-400' : 'bg-yellow-400'
                              }`}
                              style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
                            />
                          </div>
                          {account.stage1Profit && (
                            <p className="text-xs text-emerald-400">+${account.stage1Profit}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-medium">{account.tradingDays}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-slate-300 text-sm">{account.lastActivity}</p>
                          {getActivityBadge(account.lastActivity)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            onClick={() => handleViewAccount(account)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            onClick={() => handleEditAccount(account)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {account.readyForFunding && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                            >
                              <Award className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} results
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Detail Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedAccount}
        mode={modalMode}
      />
    </div>
  )
}
