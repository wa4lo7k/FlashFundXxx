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
  CheckCircle,
  Search,
  Eye,
  Edit,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Award,
  TrendingUp,
} from "lucide-react"

interface CompletedOrder {
  id: string
  user: {
    name: string
    email: string
  }
  accountSize: number
  platform: string
  challengeType: string
  status: "completed"
  paymentMethod: string
  transactionId: string
  createdAt: string
  completedAt: string
  profitGenerated: number
  certificateIssued: boolean
}

export default function CompletedOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [challengeFilter, setChallengeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<CompletedOrder | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data for completed orders
  const completedOrders: CompletedOrder[] = [
    {
      id: "FxE42616723",
      user: { name: "Erkinov", email: "diyorerkinov5577@acloud.com" },
      accountSize: 1000,
      platform: "mt5",
      challengeType: "twoStep",
      status: "completed",
      paymentMethod: "USDT (BEP20)",
      transactionId: "AD5666198",
      createdAt: "7/4/2025, 5:21:42 PM",
      completedAt: "7/5/2025, 2:15:30 PM",
      profitGenerated: 150.75,
      certificateIssued: true,
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
      completedAt: "7/3/2025, 11:22:18 AM",
      profitGenerated: 89.25,
      certificateIssued: true,
    },
    {
      id: "FxE12345678",
      user: { name: "Ahmed Hassan", email: "ahmed.hassan@email.com" },
      accountSize: 5000,
      platform: "mt5",
      challengeType: "hft",
      status: "completed",
      paymentMethod: "USDT (BEP20)",
      transactionId: "HF7890123",
      createdAt: "6/28/2025, 3:45:12 PM",
      completedAt: "6/30/2025, 9:30:45 AM",
      profitGenerated: 425.50,
      certificateIssued: false,
    },
  ]

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

  const filteredOrders = completedOrders.filter((order) => {
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

  const handleViewOrder = (order: CompletedOrder) => {
    setSelectedOrder(order)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleEditOrder = (order: CompletedOrder) => {
    setSelectedOrder(order)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const totalProfit = completedOrders.reduce((sum, order) => sum + order.profitGenerated, 0)
  const certificatesIssued = completedOrders.filter(order => order.certificateIssued).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <CheckCircle className="w-8 h-8 mr-3 text-emerald-400" />
            Completed Orders
          </h1>
          <p className="text-slate-400 mt-2">Successfully completed trading challenges</p>
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
              <p className="text-2xl font-bold text-emerald-400">{completedOrders.length}</p>
              <p className="text-sm text-slate-400">Total Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-400">${totalProfit.toFixed(2)}</p>
              <p className="text-sm text-slate-400">Total Profit</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{certificatesIssued}</p>
              <p className="text-sm text-slate-400">Certificates Issued</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{Math.round((certificatesIssued / completedOrders.length) * 100)}%</p>
              <p className="text-sm text-slate-400">Success Rate</p>
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
                  placeholder="Search completed orders..."
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Completed Orders Table */}
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Completed Orders ({filteredOrders.length} total)</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Award className="w-3 h-3 mr-1" />
              Success Stories
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
                  <TableHead className="text-slate-400">Profit Generated</TableHead>
                  <TableHead className="text-slate-400">Completed Date</TableHead>
                  <TableHead className="text-slate-400">Certificate</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="font-mono text-emerald-400">{order.id}</TableCell>
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
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">${order.profitGenerated}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{order.completedAt}</TableCell>
                    <TableCell>
                      {order.certificateIssued ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          Issued
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                          Pending
                        </Badge>
                      )}
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
