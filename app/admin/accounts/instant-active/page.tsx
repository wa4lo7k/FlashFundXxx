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
  Zap,
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
} from "lucide-react"

interface InstantActiveAccount {
  id: string
  user: {
    name: string
    email: string
  }
  accountSize: number
  platform: string
  status: "active"
  challengeType: "instant"
  activatedAt: string
  currentBalance: number
  profitTarget: number
  maxDrawdown: number
  tradingDays: number
  lastActivity: string
  server: string
  login: string
}

export default function InstantActiveAccountsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedAccount, setSelectedAccount] = useState<InstantActiveAccount | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data for instant active accounts
  const instantActiveAccounts: InstantActiveAccount[] = [
    {
      id: "FxE42616723",
      user: { name: "Erkinov", email: "diyorerkinov5577@acloud.com" },
      accountSize: 1000,
      platform: "mt5",
      status: "active",
      challengeType: "instant",
      activatedAt: "7/4/2025, 5:21:42 PM",
      currentBalance: 1085.50,
      profitTarget: 1100,
      maxDrawdown: 950,
      tradingDays: 12,
      lastActivity: "2 hours ago",
      server: "FlashFundX-Live01",
      login: "50001234",
    },
    {
      id: "FxE46883135",
      user: { name: "Nsendamina", email: "edwardchiblf@gmail.com" },
      accountSize: 5000,
      platform: "mt5",
      status: "active",
      challengeType: "instant",
      activatedAt: "7/2/2025, 6:34:45 AM",
      currentBalance: 5245.75,
      profitTarget: 5500,
      maxDrawdown: 4750,
      tradingDays: 8,
      lastActivity: "1 day ago",
      server: "FlashFundX-Live02",
      login: "50001235",
    },
    {
      id: "FxE12345678",
      user: { name: "Ahmed Hassan", email: "ahmed.hassan@email.com" },
      accountSize: 10000,
      platform: "mt5",
      status: "active",
      challengeType: "instant",
      activatedAt: "6/28/2025, 3:45:12 PM",
      currentBalance: 10890.25,
      profitTarget: 11000,
      maxDrawdown: 9500,
      tradingDays: 18,
      lastActivity: "5 minutes ago",
      server: "FlashFundX-Live01",
      login: "50001236",
    },
  ]

  const getBalanceStatus = (currentBalance: number, profitTarget: number, maxDrawdown: number) => {
    if (currentBalance >= profitTarget) {
      return { status: "profit", color: "text-emerald-400", label: "Target Reached" }
    } else if (currentBalance <= maxDrawdown) {
      return { status: "danger", color: "text-red-400", label: "Near Drawdown" }
    } else {
      return { status: "active", color: "text-blue-400", label: "Active Trading" }
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

  const filteredAccounts = instantActiveAccounts.filter((account) => {
    const matchesSearch = 
      account.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.login.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPlatform = platformFilter === "all" || account.platform === platformFilter
    const matchesSize = sizeFilter === "all" || 
      (sizeFilter === "small" && account.accountSize <= 5000) ||
      (sizeFilter === "medium" && account.accountSize > 5000 && account.accountSize <= 25000) ||
      (sizeFilter === "large" && account.accountSize > 25000)

    return matchesSearch && matchesPlatform && matchesSize
  })

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage)

  const handleViewAccount = (account: InstantActiveAccount) => {
    setSelectedAccount(account)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleEditAccount = (account: InstantActiveAccount) => {
    setSelectedAccount(account)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAccount(null)
  }

  const totalBalance = instantActiveAccounts.reduce((sum, account) => sum + account.currentBalance, 0)
  const avgTradingDays = Math.round(instantActiveAccounts.reduce((sum, account) => sum + account.tradingDays, 0) / instantActiveAccounts.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Zap className="w-8 h-8 mr-3 text-emerald-400" />
            Instant Active Accounts
          </h1>
          <p className="text-slate-400 mt-2">Live instant challenge accounts currently trading</p>
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
              <p className="text-2xl font-bold text-emerald-400">{instantActiveAccounts.length}</p>
              <p className="text-sm text-slate-400">Active Accounts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">${totalBalance.toFixed(2)}</p>
              <p className="text-sm text-slate-400">Total Balance</p>
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
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{instantActiveAccounts.filter(a => a.currentBalance >= a.profitTarget).length}</p>
              <p className="text-sm text-slate-400">Target Reached</p>
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
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="glass-card border-slate-700/50 text-white">
                <SelectValue placeholder="Account Size" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">≤ $5K</SelectItem>
                <SelectItem value="medium">$5K - $25K</SelectItem>
                <SelectItem value="large">&gt; $25K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Instant Active Accounts ({filteredAccounts.length} total)</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Activity className="w-3 h-3 mr-1" />
              Live Trading
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
                  <TableHead className="text-slate-400">Progress</TableHead>
                  <TableHead className="text-slate-400">Trading Days</TableHead>
                  <TableHead className="text-slate-400">Last Activity</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAccounts.map((account) => {
                  const balanceStatus = getBalanceStatus(account.currentBalance, account.profitTarget, account.maxDrawdown)
                  const progressPercentage = ((account.currentBalance - account.accountSize) / (account.profitTarget - account.accountSize)) * 100
                  
                  return (
                    <TableRow key={account.id} className="border-slate-800 hover:bg-slate-800/30">
                      <TableCell className="font-mono text-emerald-400">{account.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{account.user.name}</p>
                          <p className="text-sm text-slate-400">{account.login}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-semibold">${account.accountSize.toLocaleString()}</TableCell>
                      <TableCell>
                        <div>
                          <p className={`font-semibold ${balanceStatus.color}`}>${account.currentBalance.toFixed(2)}</p>
                          <p className="text-xs text-slate-400">{balanceStatus.label}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Target</span>
                            <span className="text-white">{Math.max(0, Math.min(100, progressPercentage)).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                progressPercentage >= 100 ? 'bg-emerald-400' : 
                                progressPercentage >= 75 ? 'bg-teal-400' : 
                                progressPercentage >= 50 ? 'bg-blue-400' : 'bg-yellow-400'
                              }`}
                              style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
                            />
                          </div>
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
