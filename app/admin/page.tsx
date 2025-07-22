"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  BarChart3,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import {
  adminOrderService,
  adminUserProfileService,
  adminDeliveredAccountService,
  adminAccountContainerService,
  adminStatsService
} from '@/lib/admin-database'
import { databaseUtils } from '@/lib/database'

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [deliveredAccounts, setDeliveredAccounts] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const loadingRef = useRef(false)

  // Load admin data with debouncing
  useEffect(() => {
    if (loadingRef.current) return
    loadAdminData()
  }, [])

  const loadAdminData = async (isRefresh = false) => {
    // Prevent multiple simultaneous loads
    if (loadingRef.current && !isRefresh) return

    loadingRef.current = true
    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    console.log('🔄 Admin Dashboard: Starting data load...')

    try {
      // Load dashboard statistics using the new admin stats service
      console.log('📊 Admin Dashboard: Loading stats...')
      const { data: statsData, error: statsError } = await adminStatsService.getDashboardStats()

      if (statsError) {
        console.error('❌ Admin Dashboard: Error loading stats:', statsError)
        console.error('❌ Admin Dashboard: Error details:', {
          message: statsError.message,
          code: statsError.code,
          details: statsError.details
        })

        // Continue with empty data instead of failing completely
        setStats({
          totalOrders: 0,
          totalUsers: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          completedOrders: 0,
          deliveredAccounts: 0,
          recentOrders: [],
          recentUsers: []
        })
        setOrders([])
        setUsers([])
      } else {
        console.log('✅ Admin Dashboard: Stats loaded successfully:', statsData)
        setStats(statsData || {
          totalOrders: 0,
          totalUsers: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          completedOrders: 0,
          deliveredAccounts: 0,
          recentOrders: [],
          recentUsers: []
        })
        setOrders(statsData?.recentOrders || [])
        setUsers(statsData?.recentUsers || [])
      }

      // Load delivered accounts
      console.log('📦 Admin Dashboard: Loading delivered accounts...')
      const { data: accountsData, error: accountsError } = await adminDeliveredAccountService.getAllDeliveredAccounts()

      if (accountsError) {
        console.error('❌ Admin Dashboard: Error loading delivered accounts:', accountsError)
        setDeliveredAccounts([])
      } else {
        console.log('✅ Admin Dashboard: Delivered accounts loaded:', accountsData?.length || 0)
        setDeliveredAccounts(accountsData || [])
      }

      setLastRefresh(new Date())
      console.log('✅ Admin Dashboard: Data load completed successfully')

    } catch (error) {
      console.error('❌ Admin Dashboard: Critical error loading admin data:', error)
      // Set default empty state
      setStats({
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        deliveredAccounts: 0,
        recentOrders: [],
        recentUsers: []
      })
      setOrders([])
      setUsers([])
      setDeliveredAccounts([])
    } finally {
      console.log('🏁 Admin Dashboard: Setting loading to false')
      setIsLoading(false)
      setIsRefreshing(false)
      loadingRef.current = false
    }
  }

  // Refresh function for manual refresh
  const handleRefresh = () => {
    if (!loadingRef.current) {
      loadAdminData(true)
    }
  }

  // Calculate real-time stats
  const totalOrders = orders.length
  const totalUsers = users.length
  const completedOrders = orders.filter(o => o.order_status === 'completed').length
  const failedOrders = orders.filter(o => o.order_status === 'failed').length
  const pendingOrders = orders.filter(o => o.order_status === 'pending').length
  const processingOrders = orders.filter(o => o.order_status === 'processing').length
  const paidOrders = orders.filter(o => o.payment_status === 'paid').length
  const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.final_amount, 0)

  const statsCards = [
    {
      name: "Total Orders",
      value: totalOrders.toString(),
      change: "+12%", // You can calculate this based on historical data
      changeType: "increase" as const,
      icon: ShoppingCart,
      color: "blue",
    },
    {
      name: "Total Users",
      value: totalUsers.toString(),
      change: "+8%",
      changeType: "increase" as const,
      icon: Users,
      color: "emerald",
    },
    {
      name: "Completed Orders",
      value: completedOrders.toString(),
      change: "+15%",
      changeType: "increase" as const,
      icon: CheckCircle,
      color: "emerald",
    },
    {
      name: "Total Revenue",
      value: databaseUtils.formatCurrency(totalRevenue),
      change: "+22%",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "green",
    },
  ]

  const secondaryStats = [
    {
      name: "Pending Orders",
      value: pendingOrders.toString(),
      icon: Clock,
      color: "orange",
    },
    {
      name: "Processing",
      value: processingOrders.toString(),
      icon: Activity,
      color: "blue",
    },
    {
      name: "Paid Orders",
      value: paidOrders.toString(),
      icon: CheckCircle,
      color: "emerald",
    },
    {
      name: "Failed Orders",
      value: failedOrders.toString(),
      icon: XCircle,
      color: "red",
    },
    {
      name: "Active Accounts",
      value: deliveredAccounts.filter(a => a.account_status === 'active').length.toString(),
      icon: Target,
      color: "teal",
    },
    {
      name: "Live Trading",
      value: deliveredAccounts.filter(a => a.live_status === 'active').length.toString(),
      icon: TrendingUp,
      color: "green",
    },
    {
      name: "Instant Accounts",
      value: orders.filter(o => o.account_type === 'instant').length.toString(),
      icon: Zap,
      color: "purple",
    },
    {
      name: "HFT Accounts",
      value: orders.filter(o => o.account_type === 'hft').length.toString(),
      icon: BarChart3,
      color: "blue",
    },
  ]

  // Calculate account type statistics
  const getAccountTypeStats = () => {
    const accountTypes = ['instant', 'hft', 'one_step', 'two_step']
    return accountTypes.map(type => {
      const typeOrders = orders.filter(o => o.account_type === type)
      const activeAccounts = deliveredAccounts.filter(a => a.account_type === type && a.account_status === 'active')
      const failedAccounts = deliveredAccounts.filter(a => a.account_type === type && a.account_status === 'breached')
      const total = activeAccounts.length + failedAccounts.length
      const percentage = total > 0 ? Math.round((activeAccounts.length / total) * 100) : 0

      return [
        {
          name: `${databaseUtils.getAccountTypeDisplayName(type)} Active`,
          value: activeAccounts.length.toString(),
          total: total.toString(),
          percentage: percentage,
          color: "emerald",
          icon: type === 'instant' ? Zap : type === 'hft' ? BarChart3 : Target,
        },
        {
          name: `${databaseUtils.getAccountTypeDisplayName(type)} Failed`,
          value: failedAccounts.length.toString(),
          total: total.toString(),
          percentage: 100 - percentage,
          color: "red",
          icon: type === 'instant' ? Zap : type === 'hft' ? BarChart3 : Target,
        }
      ]
    }).flat()
  }

  const accountTypeStats = getAccountTypeStats()

  // Generate recent activity from real data
  const getRecentActivity = () => {
    const activities: any[] = []

    // Add recent orders
    orders.slice(0, 10).forEach(order => {
      const user = users.find(u => u.id === order.user_id)
      const timeAgo = new Date(order.created_at).toLocaleString()

      activities.push({
        id: order.order_id,
        user: user ? `${user.first_name} ${user.last_name}` : 'Unknown User',
        action: `Order ${order.order_status}`,
        time: timeAgo,
        status: order.order_status === 'completed' ? 'success' :
                order.order_status === 'failed' ? 'error' : 'info',
        type: 'order',
        amount: databaseUtils.formatCurrency(order.final_amount),
      })
    })

    // Add recent account deliveries
    deliveredAccounts.slice(0, 5).forEach(account => {
      const user = users.find(u => u.id === account.user_id)
      const timeAgo = new Date(account.delivered_at).toLocaleString()

      activities.push({
        id: account.order_id,
        user: user ? `${user.first_name} ${user.last_name}` : 'Unknown User',
        action: `Account Delivered - ${account.current_phase}`,
        time: timeAgo,
        status: 'success',
        type: 'account',
        amount: databaseUtils.formatCurrency(account.account_size),
      })
    })

    // Sort by most recent and return top 6
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6)
  }

  const recentActivity = getRecentActivity()

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Manage orders and users • Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
          disabled={isLoading || isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
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
                    <span className="text-sm text-slate-500 ml-1">vs last month</span>
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

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {secondaryStats.map((stat) => (
          <Card key={stat.name} className="glass-card border-slate-800/50">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className={`w-10 h-10 bg-${stat.color}-500/20 border border-${stat.color}-500/30 rounded-lg flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Account Types Overview */}
        <Card className="glass-card border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-emerald-400" />
              Account Types Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {accountTypeStats.map((account) => (
              <div key={account.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-${account.color}-500/20 border border-${account.color}-500/30 rounded-lg flex items-center justify-center`}>
                      <account.icon className={`w-4 h-4 text-${account.color}-400`} />
                    </div>
                    <span className="text-sm font-medium text-white">{account.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">{account.value}</span>
                    <span className="text-xs text-slate-400">/ {account.total}</span>
                    <Badge className={`${
                      account.color === 'red' 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : `bg-${account.color}-500/20 text-${account.color}-400 border-${account.color}-500/30`
                    } text-xs px-2 py-0.5`}>
                      {account.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className={`${
                      account.color === 'red' 
                        ? 'bg-red-400'
                        : account.color === 'emerald'
                        ? 'bg-emerald-400'
                        : account.color === 'blue'
                        ? 'bg-blue-400'
                        : 'bg-teal-400'
                    } h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${account.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Enhanced Recent Activity */}
        <Card className="glass-card border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-emerald-400" />
                Recent Activity
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs">Live</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.status === 'success'
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : activity.status === 'error'
                        ? 'bg-red-500/20 border border-red-500/30'
                        : 'bg-blue-500/20 border border-blue-500/30'
                    }`}>
                      {activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-blue-400" />}
                      {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-emerald-400" />}
                      {activity.type === 'account' && <XCircle className="w-4 h-4 text-red-400" />}
                      {activity.type === 'progress' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                      {activity.type === 'user' && <Users className="w-4 h-4 text-teal-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-400">
                        {activity.id} • {activity.user}
                        {activity.amount && <span className="text-emerald-400 ml-2">{activity.amount}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{activity.time}</p>
                    <div className={`w-1 h-1 rounded-full ml-auto mt-1 ${
                      index < 2 ? 'bg-emerald-400' : 'bg-slate-600'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <Button variant="ghost" className="w-full text-slate-400 hover:text-white text-sm">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-emerald-400" />
              Quick Actions
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <ShoppingCart className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white">All Orders</p>
                <p className="text-xs text-emerald-400">{totalOrders} total</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <Users className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white">Users</p>
                <p className="text-xs text-blue-400">{totalUsers} active</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white">Analytics</p>
                <p className="text-xs text-purple-400">View reports</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 transition-colors cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <Target className="w-8 h-8 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white">Accounts</p>
                <p className="text-xs text-teal-400">{deliveredAccounts.length} delivered</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <Clock className="w-8 h-8 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white">Pending</p>
                <p className="text-xs text-yellow-400">{pendingOrders} orders</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <XCircle className="w-8 h-8 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white">Failed</p>
                <p className="text-xs text-red-400">{failedOrders} orders</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live System Status */}
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-emerald-400" />
              System Status
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm">All Systems Operational</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                <span className="text-emerald-400 font-medium">Trading Platform</span>
              </div>
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-xs text-slate-400">Uptime</p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <span className="text-blue-400 font-medium">Payment System</span>
              </div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-slate-400">Operational</p>
            </div>
            <div className="text-center p-4 bg-teal-500/10 border border-teal-500/20 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-teal-400 rounded-full" />
                <span className="text-teal-400 font-medium">API Services</span>
              </div>
              <p className="text-2xl font-bold text-white">1.2s</p>
              <p className="text-xs text-slate-400">Response Time</p>
            </div>
            <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full" />
                <span className="text-purple-400 font-medium">Database</span>
              </div>
              <p className="text-2xl font-bold text-white">0.8s</p>
              <p className="text-xs text-slate-400">Query Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
