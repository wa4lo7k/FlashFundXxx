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
  XCircle,
  Search,
  Eye,
  Edit,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  TrendingDown,
} from "lucide-react"

interface FailedOrder {
  id: string
  user: {
    name: string
    email: string
  }
  accountSize: number
  platform: string
  challengeType: string
  status: "failed"
  paymentMethod: string
  transactionId: string
  createdAt: string
  failedAt: string
  failureReason: string
  refundStatus: "pending" | "processed" | "rejected"
}

export default function FailedOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [challengeFilter, setChallengeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<FailedOrder | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data for failed orders
  const failedOrders: FailedOrder[] = [
    {
      id: "FxE28511211",
      user: { name: "Obidov", email: "obidovdavronbek4@gmail.com" },
      accountSize: 1000,
      platform: "mt5",
      challengeType: "twoStep",
      status: "failed",
      paymentMethod: "USDT (BEP20)",
      transactionId: "GH5567123",
      createdAt: "6/24/2025, 9:23:33 AM",
      failedAt: "6/25/2025, 11:45:18 AM",
      failureReason: "Exceeded maximum drawdown limit",
      refundStatus: "processed",
    },
    {
      id: "FxE40599107",
      user: { name: "Ramzan trader", email: "ramzanhussain700@gmail.com" },
      accountSize: 1000,
      platform: "mt5",
      challengeType: "hft",
      status: "failed",
      paymentMethod: "USDT (BEP20)",
      transactionId: "EF1234890",
      createdAt: "6/25/2025, 9:54:07 PM",
      failedAt: "6/26/2025, 2:30:15 PM",
      failureReason: "Violated trading rules",
      refundStatus: "pending",
    },
  ]

  const getChallengeTypeBadge = (type: string) => {
    const typeConfig = {
      twoStep: { color: "bg-teal-500/20 text-teal-400 border-teal-500/30", label: "Two Step" },
      instant: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Instant" },
      hft: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "HFT" },
      oneStep: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "OneStep" },
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.twoStep
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    )
  }

  const getRefundStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Pending" },
      processed: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Processed" },
      rejected: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Rejected" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    )
  }

  const filteredOrders = failedOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPlatform = platformFilter === "all" || order.platform === platformFilter
    const matchesChallenge = challengeFilter === "all" || order.challengeType === challengeFilter

    return matchesSearch && matchesPlatform && matchesChallenge
  })

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  const handleViewOrder = (order: FailedOrder) => {
    setSelectedOrder(order)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleEditOrder = (order: FailedOrder) => {
    setSelectedOrder(order)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const totalRefunds = failedOrders.reduce((sum, order) => sum + order.accountSize, 0)
  const pendingRefunds = failedOrders.filter(order => order.refundStatus === "pending").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <XCircle className="w-8 h-8 mr-3 text-red-400" />
            Failed Orders
          </h1>
          <p className="text-slate-400 mt-2">Orders that failed to meet challenge requirements</p>
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
              <p className="text-2xl font-bold text-red-400">{failedOrders.length}</p>
              <p className="text-sm text-slate-400">Total Failed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">${totalRefunds.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Total Refunds</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{pendingRefunds}</p>
              <p className="text-sm text-slate-400">Pending Refunds</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-400">{Math.round((failedOrders.length / 131) * 100)}%</p>
              <p className="text-sm text-slate-400">Failure Rate</p>
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
                  placeholder="Search failed orders..."
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
            <Select value={challengeFilter} onValueChange={setChallengeFilter}>
              <SelectTrigger className="glass-card border-slate-700/50 text-white">
                <SelectValue placeholder="Challenge" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Challenges</SelectItem>
                <SelectItem value="twoStep">Two Step</SelectItem>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="hft">HFT</SelectItem>
                <SelectItem value="oneStep">OneStep</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Failed Orders Table */}
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Failed Orders ({filteredOrders.length} total)</span>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Requires Attention
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">Order ID</TableHead>
                  <TableHead className="text-slate-400">User</TableHead>
                  <TableHead className="text-slate-400">Account Size</TableHead>
                  <TableHead className="text-slate-400">Challenge</TableHead>
                  <TableHead className="text-slate-400">Failure Reason</TableHead>
                  <TableHead className="text-slate-400">Failed Date</TableHead>
                  <TableHead className="text-slate-400">Refund Status</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="font-mono text-red-400">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{order.user.name}</p>
                        <p className="text-sm text-slate-400">{order.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-semibold">${order.accountSize.toLocaleString()}</TableCell>
                    <TableCell>{getChallengeTypeBadge(order.challengeType)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-sm">{order.failureReason}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{order.failedAt}</TableCell>
                    <TableCell>{getRefundStatusBadge(order.refundStatus)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          onClick={() => handleEditOrder(order)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results
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

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        mode={modalMode}
      />
    </div>
  )
}
