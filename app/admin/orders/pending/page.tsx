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
import BulkOperations from "@/components/admin/BulkOperations"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Clock,
  Search,
  Eye,
  Edit,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface PendingOrder {
  id: string
  user: {
    name: string
    email: string
  }
  accountSize: number
  platform: string
  challengeType: string
  status: "pending"
  paymentMethod: string
  transactionId: string
  createdAt: string
  paymentProofUploaded: boolean
  priority: "high" | "medium" | "low"
}

export default function PendingOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [challengeFilter, setChallengeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Mock data for pending orders
  const pendingOrders: PendingOrder[] = [
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
      paymentProofUploaded: true,
      priority: "high",
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
      paymentProofUploaded: true,
      priority: "high",
    },
    {
      id: "FxE48731998",
      user: { name: "El hassouni", email: "hamzaelhassouni@gmail.com" },
      accountSize: 1000,
      platform: "mt5",
      challengeType: "instant",
      status: "pending",
      paymentMethod: "USDT (BEP20)",
      transactionId: "IJ7890456",
      createdAt: "6/23/2025, 2:50:22 PM",
      paymentProofUploaded: false,
      priority: "medium",
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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "High" },
      medium: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Medium" },
      low: { color: "bg-slate-500/20 text-slate-400 border-slate-500/30", label: "Low" },
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    )
  }

  const filteredOrders = pendingOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPlatform = platformFilter === "all" || order.platform === platformFilter
    const matchesChallenge = challengeFilter === "all" || order.challengeType === challengeFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

    return matchesSearch && matchesPlatform && matchesChallenge && matchesPriority
  })

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  const handleViewOrder = (order: PendingOrder) => {
    setSelectedOrder(order)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleEditOrder = (order: PendingOrder) => {
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
    setSelectedOrders([])
    setSelectAll(false)
  }

  const handleClearSelection = () => {
    setSelectedOrders([])
    setSelectAll(false)
  }

  const highPriorityCount = pendingOrders.filter(order => order.priority === "high").length
  const withoutProofCount = pendingOrders.filter(order => !order.paymentProofUploaded).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Clock className="w-8 h-8 mr-3 text-yellow-400" />
            Pending Orders
          </h1>
          <p className="text-slate-400 mt-2">Orders awaiting review and processing</p>
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
              <p className="text-2xl font-bold text-yellow-400">{pendingOrders.length}</p>
              <p className="text-sm text-slate-400">Total Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{highPriorityCount}</p>
              <p className="text-sm text-slate-400">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{withoutProofCount}</p>
              <p className="text-sm text-slate-400">Missing Proof</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">${pendingOrders.reduce((sum, order) => sum + order.accountSize, 0).toLocaleString()}</p>
              <p className="text-sm text-slate-400">Total Value</p>
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
                  placeholder="Search pending orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-card border-slate-700/50 text-white placeholder:text-slate-500 pl-10"
                />
              </div>
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="glass-card border-slate-700/50 text-white">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
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
                <SelectItem value="oneStep">OneStep</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pending Orders Table */}
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Pending Orders ({filteredOrders.length} total)</span>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <AlertCircle className="w-3 h-3 mr-1" />
              Awaiting Review
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
                  <TableHead className="text-slate-400">Challenge</TableHead>
                  <TableHead className="text-slate-400">Priority</TableHead>
                  <TableHead className="text-slate-400">Payment Proof</TableHead>
                  <TableHead className="text-slate-400">Created</TableHead>
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
                    <TableCell className="font-mono text-yellow-400">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{order.user.name}</p>
                        <p className="text-sm text-slate-400">{order.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-semibold">${order.accountSize.toLocaleString()}</TableCell>
                    <TableCell>{getChallengeTypeBadge(order.challengeType)}</TableCell>
                    <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                    <TableCell>
                      {order.paymentProofUploaded ? (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 text-sm">Uploaded</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 text-sm">Missing</span>
                        </div>
                      )}
                    </TableCell>
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
