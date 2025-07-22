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
import {
  ResponsiveTable,
  ResponsiveTableBody,
  ResponsiveTableCell,
  ResponsiveTableHead,
  ResponsiveTableHeader,
  ResponsiveTableRow,
} from "@/components/ui/responsive-table"
import {
  Users,
  Search,
  Eye,
  EyeOff,
  Edit,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Calendar,
  Activity,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  password: string
  status: "active" | "suspended" | "pending"
  emailVerified: boolean
  kycStatus: "verified" | "pending" | "rejected" | "not_submitted"
  registeredAt: string
  lastLogin: string
  totalOrders: number
  completedOrders: number
  totalSpent: number
  country: string
  phone?: string
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [kycFilter, setKycFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({})

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }))
  }

  // Mock data for users
  const users: User[] = [
    {
      id: "USR001",
      name: "Erkinov",
      email: "diyorerkinov5577@acloud.com",
      password: "MyPass123!",
      status: "active",
      emailVerified: true,
      kycStatus: "verified",
      registeredAt: "2025-06-15",
      lastLogin: "2 hours ago",
      totalOrders: 3,
      completedOrders: 2,
      totalSpent: 2500,
      country: "Uzbekistan",
      phone: "+998901234567",
    },
    {
      id: "USR002",
      name: "Nsendamina",
      email: "edwardchiblf@gmail.com",
      password: "SecurePass456!",
      status: "active",
      emailVerified: true,
      kycStatus: "pending",
      registeredAt: "2025-06-20",
      lastLogin: "1 day ago",
      totalOrders: 1,
      completedOrders: 1,
      totalSpent: 1000,
      country: "Uganda",
    },
    {
      id: "USR003",
      name: "Ahmed Hassan",
      email: "ahmed.hassan@email.com",
      password: "StrongPass789!",
      status: "active",
      emailVerified: true,
      kycStatus: "verified",
      registeredAt: "2025-06-10",
      lastLogin: "5 minutes ago",
      totalOrders: 5,
      completedOrders: 4,
      totalSpent: 15000,
      country: "Egypt",
      phone: "+201234567890",
    },
    {
      id: "USR004",
      name: "Ramzan trader",
      email: "ramzanhussain700@gmail.com",
      status: "suspended",
      emailVerified: true,
      kycStatus: "rejected",
      registeredAt: "2025-05-28",
      lastLogin: "1 week ago",
      totalOrders: 2,
      completedOrders: 0,
      totalSpent: 500,
      country: "Pakistan",
    },
    {
      id: "USR005",
      name: "Obidov",
      email: "obidovdavronbek4@gmail.com",
      status: "pending",
      emailVerified: false,
      kycStatus: "not_submitted",
      registeredAt: "2025-07-01",
      lastLogin: "Never",
      totalOrders: 0,
      completedOrders: 0,
      totalSpent: 0,
      country: "Uzbekistan",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Active" },
      suspended: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Suspended" },
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Pending" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    )
  }

  const getKycBadge = (kycStatus: string) => {
    const kycConfig = {
      verified: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Verified", icon: CheckCircle },
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Pending", icon: Clock },
      rejected: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Rejected", icon: XCircle },
      not_submitted: { color: "bg-slate-500/20 text-slate-400 border-slate-500/30", label: "Not Submitted", icon: XCircle },
    }
    const config = kycConfig[kycStatus as keyof typeof kycConfig] || kycConfig.not_submitted
    return (
      <Badge className={`${config.color} text-xs px-2 py-1 flex items-center space-x-1`}>
        <config.icon className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    )
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.country.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesKyc = kycFilter === "all" || user.kycStatus === kycFilter

    return matchesSearch && matchesStatus && matchesKyc
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === "active").length
  const verifiedUsers = users.filter(u => u.kycStatus === "verified").length
  const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Users className="w-8 h-8 mr-3 text-emerald-400" />
            User Management
          </h1>
          <p className="text-slate-400 mt-2">Manage registered users and their accounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Download className="w-4 h-4 mr-2" />
            Export Users
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
              <p className="text-2xl font-bold text-emerald-400">{totalUsers}</p>
              <p className="text-sm text-slate-400">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{activeUsers}</p>
              <p className="text-sm text-slate-400">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-400">{verifiedUsers}</p>
              <p className="text-sm text-slate-400">KYC Verified</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-slate-800/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Total Revenue</p>
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
                  placeholder="Search users by name, email, ID, or country..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={kycFilter} onValueChange={setKycFilter}>
              <SelectTrigger className="glass-card border-slate-700/50 text-white">
                <SelectValue placeholder="KYC Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All KYC</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="not_submitted">Not Submitted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Users ({filteredUsers.length} total)</span>
            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/50">
              Page {currentPage} of {totalPages}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveTable>
            <ResponsiveTableHeader>
              <ResponsiveTableRow className="border-slate-800">
                <ResponsiveTableHead className="text-slate-400">User ID</ResponsiveTableHead>
                <ResponsiveTableHead className="text-slate-400">User Info</ResponsiveTableHead>
                <ResponsiveTableHead className="text-slate-400">Password</ResponsiveTableHead>
                <ResponsiveTableHead className="text-slate-400">Status</ResponsiveTableHead>
                <ResponsiveTableHead className="text-slate-400">KYC Status</ResponsiveTableHead>
                <ResponsiveTableHead className="text-slate-400">Orders</ResponsiveTableHead>
                <ResponsiveTableHead className="text-slate-400">Total Spent</ResponsiveTableHead>
                <ResponsiveTableHead className="text-slate-400">Last Login</ResponsiveTableHead>
                <ResponsiveTableHead className="text-slate-400">Actions</ResponsiveTableHead>
              </ResponsiveTableRow>
            </ResponsiveTableHeader>
            <ResponsiveTableBody>
                {paginatedUsers.map((user) => (
                  <ResponsiveTableRow key={user.id} className="border-slate-800 hover:bg-slate-800/30">
                    <ResponsiveTableCell label="User ID" className="font-mono text-emerald-400">{user.id}</ResponsiveTableCell>
                    <ResponsiveTableCell label="User Info">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-white">{user.name}</p>
                          {user.emailVerified && (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                        <p className="text-xs text-slate-500">{user.country}</p>
                      </div>
                    </ResponsiveTableCell>
                    <ResponsiveTableCell label="Password" hideOnMobile>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-300 font-mono">
                          {showPasswords[user.id] ? user.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          {showPasswords[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </ResponsiveTableCell>
                    <ResponsiveTableCell label="Status">{getStatusBadge(user.status)}</ResponsiveTableCell>
                    <ResponsiveTableCell label="KYC Status">{getKycBadge(user.kycStatus)}</ResponsiveTableCell>
                    <ResponsiveTableCell label="Orders">
                      <div className="text-center">
                        <p className="text-white font-medium">{user.completedOrders}/{user.totalOrders}</p>
                        <p className="text-xs text-slate-400">completed</p>
                      </div>
                    </ResponsiveTableCell>
                    <ResponsiveTableCell label="Total Spent" className="text-white font-semibold">${user.totalSpent.toLocaleString()}</ResponsiveTableCell>
                    <ResponsiveTableCell label="Last Login" hideOnMobile>
                      <div className="flex items-center space-x-1">
                        <Activity className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-300 text-sm">{user.lastLogin}</span>
                      </div>
                    </ResponsiveTableCell>
                    <ResponsiveTableCell label="Actions" hideOnMobile>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </ResponsiveTableCell>
                  </ResponsiveTableRow>
                ))}
            </ResponsiveTableBody>
          </ResponsiveTable>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
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
    </div>
  )
}
