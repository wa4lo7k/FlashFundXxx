"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  Loader2,
} from "lucide-react"
import { adminOrderService } from "@/lib/admin-database"

interface Order {
  order_id: string
  user_profiles: {
    first_name: string
    last_name: string
    email: string
  }
  account_size: number
  platform_type: string
  account_type: string
  order_status: "pending" | "completed" | "failed" | "processing"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method: string
  transaction_id: string
  created_at: string
  paid_at?: string
  final_amount: number
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  // Load orders data from database
  const loadOrders = async () => {
    setIsLoading(true)
    try {
      console.log('📊 Loading orders from database...')
      const { data, error } = await adminOrderService.getAllOrders()

      if (error) {
        console.error('❌ Error loading orders:', error)
        setOrders([])
      } else {
        console.log('✅ Orders loaded successfully:', data?.length || 0)
        setOrders(data || [])
      }
    } catch (error) {
      console.error('❌ Exception loading orders:', error)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadOrders()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Pending" },
      completed: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Completed" },
      failed: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Failed" },
      processing: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Processing" },
      cancelled: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", label: "Cancelled" },
      refunded: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "Refunded" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Pending" },
      paid: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Paid" },
      failed: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Failed" },
      refunded: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "Refunded" },
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
      two_step: { color: "bg-teal-500/20 text-teal-400 border-teal-500/30", label: "Two Step" },
      instant: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Instant" },
      hft: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "HFT" },
      one_step: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "One Step" },
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.two_step
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    )
  }

  const filteredOrders = orders.filter((order) => {
    const userName = `${order.user_profiles?.first_name || ''} ${order.user_profiles?.last_name || ''}`.trim()
    const matchesSearch =
      order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_profiles?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.order_status === statusFilter
    const matchesPlatform = platformFilter === "all" || order.platform_type === platformFilter
    const matchesChallenge = challengeFilter === "all" || order.account_type === challengeFilter

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
      setSelectedOrders(paginatedOrders.map(order => order.order_id))
    }
    setSelectAll(!selectAll)
  }

  const handleRefresh = () => {
    loadOrders()
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
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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
              <p className="text-2xl font-bold text-emerald-400">{orders.filter(o => o.order_status === 'completed').length}</p>
              <p className="text-sm text-slate-400">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{orders.filter(o => o.order_status === 'pending').length}</p>
              <p className="text-sm text-slate-400">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{orders.filter(o => o.order_status === 'failed').length}</p>
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
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
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
                <SelectItem value="two_step">Two Step</SelectItem>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="hft">HFT</SelectItem>
                <SelectItem value="one_step">One Step</SelectItem>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                        <span className="text-slate-400">Loading orders...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <span className="text-slate-400">No orders found</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => {
                    const userName = `${order.user_profiles?.first_name || ''} ${order.user_profiles?.last_name || ''}`.trim()
                    return (
                      <TableRow key={order.order_id} className="border-slate-800 hover:bg-slate-800/30">
                        <TableCell>
                          <Checkbox
                            checked={selectedOrders.includes(order.order_id)}
                            onCheckedChange={() => handleSelectOrder(order.order_id)}
                            className="border-slate-600"
                          />
                        </TableCell>
                        <TableCell className="font-mono text-emerald-400">{order.order_id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">{userName || 'N/A'}</p>
                            <p className="text-sm text-slate-400">{order.user_profiles?.email || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-semibold">${order.account_size?.toLocaleString() || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                            {order.platform_type?.toUpperCase() || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>{getChallengeTypeBadge(order.account_type)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(order.order_status)}
                            {getPaymentStatusBadge(order.payment_status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
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
                    )
                  })
                )}
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
