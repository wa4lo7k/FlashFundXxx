"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminNowPaymentsService } from '@/lib/admin-database'
import { 
  Search, 
  RefreshCw, 
  DollarSign, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react'
import { toast } from 'sonner'

interface NowPaymentsOrder {
  order_id: string
  payment_provider_id: string
  created_at: string
  final_amount: number
  crypto_currency: string
  payment_status: string
  order_status: string
  crypto_amount: number
  crypto_address: string
  user_profiles: {
    email: string
    first_name: string
    last_name: string
  }
}

interface NowPaymentsStats {
  total_orders: number
  total_amount: number
  paid_orders: number
  pending_orders: number
  failed_orders: number
  success_rate: string
}

export default function AdminNowPaymentsPage() {
  const [orders, setOrders] = useState<NowPaymentsOrder[]>([])
  const [stats, setStats] = useState<NowPaymentsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch orders and stats in parallel
      const [ordersResult, statsResult] = await Promise.all([
        adminNowPaymentsService.getNowPaymentsOrders(),
        adminNowPaymentsService.getNowPaymentsStats()
      ])

      if (ordersResult.error) {
        console.error('Error fetching NowPayments orders:', ordersResult.error)
        toast.error('Failed to fetch NowPayments orders')
      } else {
        setOrders(ordersResult.data || [])
      }

      if (statsResult.error) {
        console.error('Error fetching NowPayments stats:', statsResult.error)
        toast.error('Failed to fetch NowPayments statistics')
      } else {
        setStats(statsResult.data)
      }

    } catch (error) {
      console.error('Error fetching NowPayments data:', error)
      toast.error('Failed to fetch NowPayments data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
    toast.success('Data refreshed successfully')
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.payment_provider_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user_profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.crypto_currency.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Paid</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>
      case 'refunded':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Refunded</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCryptoAmount = (amount: number, currency: string) => {
    return `${amount.toFixed(8)} ${currency.toUpperCase()}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading NowPayments data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">NowPayments Management</h1>
          <p className="text-slate-400 mt-2">Monitor and manage cryptocurrency payments</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card border-slate-800/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{stats.total_orders}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-slate-800/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats.total_amount)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-slate-800/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.success_rate}%</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-slate-800/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending Orders</p>
                  <p className="text-2xl font-bold text-white">{stats.pending_orders}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="glass-card border-slate-800/30">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by Order ID, Payment ID, Email, or Currency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400"
              />
            </div>
            <div className="text-slate-400 text-sm">
              {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="glass-card border-slate-800/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">NowPayments Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/30">
                  <th className="text-left p-4 text-slate-400 font-medium">Order ID</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Payment ID</th>
                  <th className="text-left p-4 text-slate-400 font-medium">User</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Amount</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Crypto</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.order_id} className="border-b border-slate-800/20 hover:bg-slate-800/20">
                    <td className="p-4">
                      <div className="font-mono text-sm text-white">{order.order_id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-sm text-slate-300">{order.payment_provider_id}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white text-sm">{order.user_profiles.first_name} {order.user_profiles.last_name}</div>
                      <div className="text-slate-400 text-xs">{order.user_profiles.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-semibold">{formatCurrency(order.final_amount)}</div>
                      {order.crypto_amount > 0 && (
                        <div className="text-slate-400 text-xs">{formatCryptoAmount(order.crypto_amount, order.crypto_currency)}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        {order.crypto_currency.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {getPaymentStatusBadge(order.payment_status)}
                    </td>
                    <td className="p-4">
                      <div className="text-slate-300 text-sm">{formatDate(order.created_at)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No NowPayments orders found</p>
                {searchTerm && (
                  <p className="text-slate-500 text-sm mt-2">Try adjusting your search criteria</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
