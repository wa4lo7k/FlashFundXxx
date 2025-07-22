"use client"

import type React from "react"

import { useState } from "react"
import OrderDetailModal from "@/components/admin/OrderDetailModal"
import BulkOperations from "@/components/admin/BulkOperations"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface Order {
  id: string
  user: {
    name: string
    email: string
  }
  accountSize: number
  platform: string
  challengeType: string
  status: "pending" | "completed" | "failed" | "processing" | "stage2"
  paymentMethod: string
  transactionId: string
  createdAt: string
  updatedAt: string
}

export default function AllOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [challengeFilter, setChallengeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Mock data - replace with actual API call
  const orders: Order[] = [
    {
      id: "FxE42616723",
      user: { name: "Erkinov", email: "diyorerkinov5577@acloud.com" },
      accountSize: 1000,
      platform: "mt5",
      challengeType: "twoStep",
      status: "pending",
      paymentMethod: "USDT (BEP20)",
      transactionId: "AD5666198",
      createdAt: "7/4/2025, 5:21:42 PM",
      updatedAt: "N/A",
    },
    {
      id: "FxE26963453",
      user: { name: "dsadas", email: "camawag765@asimarif.com" },
      accountSize: 100000,
      platform: "mt5",
      challengeType: "twoStep",
      status: "pending",
      paymentMethod: "USDT (BEP20)",
      transactionId: "BD7889234",
      createdAt: "7/2/2025, 3:52:17 PM",
      updatedAt: "N/A",
    },
    {
      id: "FxE46883135",
      user: { name: "Nsendamina", email: "edwardchiblf@gmail.com" },
      accountSize: 1000,
      platform: "mt5",
      challengeType: "instant",
      status: "completed",
      paymentMethod: "USDT (BEP20)",
      transactionId: "CD9912567",
      createdAt: "7/2/2025, 6:34:45 AM",
      updatedAt: "7/2/2025, 8:15:22 AM",
    },
    {
      id: "FxE40599107",
      user: { name: "Ramzan trader", email: "ramzanhussain700@gmail.com" },
      accountSize: 1000,
      platform: "mt5",
      challengeType: "hft",
      status: "stage2",
      paymentMethod: "USDT (BEP20)",
      transactionId: "EF1234890",
      createdAt: "6/25/2025, 9:54:07 PM",
      updatedAt: "6/26/2025, 2:30:15 PM",
    },
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
      updatedAt: "6/25/2025, 11:45:18 AM",
    },
    {
      id: "FxE48731998",
      user: { name: "El hassouni", email: "hamzaelhassouni@gmail.com" },
      accountSize: 1000,
      platform: "mt5",
      challengeType: "instant",
      status: "processing",
      paymentMethod: "USDT (BEP20)",
      transactionId: "IJ7890456",
      createdAt: "6/23/2025, 2:50:22 PM",
      updatedAt: "6/23/2025, 4:12:08 PM",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Pending" },
      completed: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Completed" },
      failed: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Failed" },
      processing: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Processing" },
      stage2: { color: "bg-teal-500/20 text-teal-400 border-teal-500/30", label: "Stage 2" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    )
  }

  const getChallengeTypeBadge = (type: string) => {
    const typeConfig = {
      twoStep: { color: "bg-teal-500/20 text-teal-400 border-teal-500/30", label: "Two Step" },
      instant: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Instant" },
      hft: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "HFT" },
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.twoStep
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    )
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPlatform = platformFilter === "all" || order.platform === platformFilter
    const matchesChallenge = challengeFilter === "all" || order.challengeType === challengeFilter

    return matchesSearch && matchesStatus && matchesPlatform && matchesChallenge
  })

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(paginatedOrders.map(order => order.id))
    }
    setSelectAll(!selectAll)
  }

  const handleBulkAction = (action: string, options?: any) => {
    console.log("Bulk action:", action, "on orders:", selectedOrders, "with options:", options)
    // Implement bulk action logic here
    setSelectedOrders([])
    setSelectAll(false)
  }

  const handleClearSelection = () => {
    setSelectedOrders([])
    setSelectAll(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <ShoppingCart className="w-8 h-8 mr-3 text-emerald-400" />
            All Orders
          </h1>
          <p className="text-slate-400 mt-2">View and manage all orders</p>
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
              <p className="text-2xl font-bold text-white">{orders.length}</p>
              <p className="text-sm text-slate-400">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{orders.filter(o => o.status === 'completed').length}</p>
              <p className="text-sm text-slate-400">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{orders.filter(o => o.status === 'pending').length}</p>
              <p className="text-sm text-slate-400">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{orders.filter(o => o.status === 'failed').length}</p>
              <p className="text-sm text-slate-400">Failed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card border-slate-800/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by ID, TXID, user, email..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="stage2">Stage 2</SelectItem>
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
            <Select value={challengeFilter} onValueChange={setChallengeFilter}>
              <SelectTrigger className="glass-card border-slate-700/50 text-white">
                <SelectValue placeholder="Challenge" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Challenges</SelectItem>
                <SelectItem value="twoStep">Two Step</SelectItem>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="hft">HFT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>All Orders ({filteredOrders.length} total)</span>
            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/50">
              Page {currentPage} of {totalPages}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400 w-12">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      className="border-slate-600"
                    />
                  </TableHead>
                  <TableHead className="text-slate-400">Order ID</TableHead>
                  <TableHead className="text-slate-400">User</TableHead>
                  <TableHead className="text-slate-400">Account Size</TableHead>
                  <TableHead className="text-slate-400">Platform</TableHead>
                  <TableHead className="text-slate-400">Challenge</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Date</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                        className="border-slate-600"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-emerald-400">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{order.user.name}</p>
                        <p className="text-sm text-slate-400">{order.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-semibold">${order.accountSize.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                        {order.platform.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{getChallengeTypeBadge(order.challengeType)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-slate-300">{order.createdAt}</TableCell>
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

      {/* Bulk Operations */}
      <BulkOperations
        selectedItems={selectedOrders}
        itemType="orders"
        onClearSelection={handleClearSelection}
        onBulkAction={handleBulkAction}
      />
    </div>
  )
}
