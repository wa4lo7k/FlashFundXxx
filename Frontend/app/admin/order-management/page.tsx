'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  adminOrderService,
  adminDeliveredAccountService,
  adminAccountContainerService
} from '@/lib/admin-database'
import { databaseUtils, Order } from '@/lib/database'
import {
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  User,
  Calendar,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Send,
  Eye,
  Edit
} from 'lucide-react'

// Extended order type for admin with user profile data
interface AdminOrder extends Order {
  user_profiles: {
    first_name: string
    last_name: string
    email: string
  }
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingOrder, setProcessingOrder] = useState<string | null>(null)
  const [deliveringOrder, setDeliveringOrder] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }



  const fetchOrders = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) {
      setIsLoading(true)
    }

    try {
      console.log('🔄 Order Management: Fetching orders...')

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Orders fetch timeout after 15 seconds')), 15000)
      )

      const dataPromise = adminOrderService.getAllOrders()

      const { data, error } = await Promise.race([dataPromise, timeoutPromise]) as any

      if (error) {
        console.error('❌ Order Management: Error fetching orders:', error)
        showMessage(`Error fetching orders: ${error.message}`, 'error')
        return
      }

      console.log('✅ Order Management: Orders fetched successfully:', data?.length || 0)
      setOrders((data as AdminOrder[]) || [])
    } catch (err: any) {
      console.error('❌ Order Management: Critical error:', err)
      showMessage(`Failed to fetch orders: ${err.message}`, 'error')
    } finally {
      console.log('🏁 Order Management: Setting loading to false')
      setIsLoading(false)
    }
  }

  const confirmPaymentAndDeliver = async (orderId: string, userId: string) => {
    setProcessingOrder(orderId)
    console.log('🔄 Order Management: Starting payment confirmation and delivery for order:', orderId)

    try {
      // First update payment status
      console.log('💳 Order Management: Updating payment status...')
      const { error: updateError } = await adminOrderService.updatePaymentStatus(orderId, 'paid')

      if (updateError) {
        console.error('❌ Order Management: Payment update error:', updateError)
        showMessage(`Error updating payment: ${updateError.message}`, 'error')
        return
      }

      // Update order status to processing
      console.log('📝 Order Management: Updating order status...')
      const { error: orderUpdateError } = await adminOrderService.updateOrder(orderId, {
        order_status: 'processing' as 'processing'
      })

      if (orderUpdateError) {
        console.error('❌ Order Management: Order update error:', orderUpdateError)
        showMessage(`Error updating order status: ${orderUpdateError.message}`, 'error')
        return
      }

      // Call the delivery function
      console.log('📦 Order Management: Delivering account...')
      const { data, error } = await adminDeliveredAccountService.deliverAccount(orderId, userId)

      if (error) {
        console.error('❌ Order Management: Delivery error:', error)
        showMessage(`Delivery error: ${error.message}`, 'error')
        return
      }

      if (data && data.success) {
        console.log('✅ Order Management: Account delivered successfully')
        showMessage(`✅ Account delivered successfully to order ${orderId}!`, 'success')
        // Refresh orders without showing loading spinner
        console.log('🔄 Order Management: Refreshing orders list...')
        await fetchOrders(false)
      } else {
        console.error('❌ Order Management: Delivery failed:', data)
        showMessage(`Delivery failed: ${data?.error || 'Unknown error'}`, 'error')
      }
    } catch (err: any) {
      console.error('❌ Order Management: Critical error in confirmPaymentAndDeliver:', err)
      showMessage(`Failed to process order: ${err.message}`, 'error')
    } finally {
      console.log('🏁 Order Management: Clearing processing state')
      setProcessingOrder(null)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStatusBadge = (status: string, type: 'order' | 'payment' | 'delivery') => {
    const baseClasses = "text-xs font-medium"
    
    if (type === 'order') {
      switch (status) {
        case 'pending': return <Badge variant="secondary" className={baseClasses}>Pending</Badge>
        case 'processing': return <Badge className={`${baseClasses} bg-blue-500/20 text-blue-400`}>Processing</Badge>
        case 'completed': return <Badge className={`${baseClasses} bg-green-500/20 text-green-400`}>Completed</Badge>
        case 'failed': return <Badge variant="destructive" className={baseClasses}>Failed</Badge>
        case 'cancelled': return <Badge variant="outline" className={baseClasses}>Cancelled</Badge>
        default: return <Badge variant="secondary" className={baseClasses}>{status}</Badge>
      }
    }
    
    if (type === 'payment') {
      switch (status) {
        case 'pending': return <Badge variant="secondary" className={baseClasses}>Pending</Badge>
        case 'paid': return <Badge className={`${baseClasses} bg-green-500/20 text-green-400`}>Paid</Badge>
        case 'failed': return <Badge variant="destructive" className={baseClasses}>Failed</Badge>
        default: return <Badge variant="secondary" className={baseClasses}>{status}</Badge>
      }
    }
    
    if (type === 'delivery') {
      switch (status) {
        case 'pending': return <Badge variant="secondary" className={baseClasses}>Pending</Badge>
        case 'delivered': return <Badge className={`${baseClasses} bg-green-500/20 text-green-400`}>Delivered</Badge>
        case 'failed': return <Badge variant="destructive" className={baseClasses}>Failed</Badge>
        default: return <Badge variant="secondary" className={baseClasses}>{status}</Badge>
      }
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return databaseUtils.formatCurrency(amount)
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <Package className="w-6 h-6 mr-2 text-emerald-400" />
            Order Management
          </CardTitle>
          <p className="text-slate-400">
            Manage orders, confirm payments, and deliver accounts
          </p>
        </CardHeader>
        <CardContent>
          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg border mb-4 ${
              messageType === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
              messageType === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
              'bg-blue-900/20 border-blue-500/30 text-blue-400'
            }`}>
              {message}
            </div>
          )}

          {/* Orders List */}
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No orders found</p>
              </div>
            ) : (
              orders.map((order, index) => (
                <Card key={order.order_id || `order-${index}`} className="glass-card border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{order.order_id}</h3>
                          <p className="text-sm text-slate-400">
                            {order.user_profiles.first_name} {order.user_profiles.last_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-400">
                          {formatCurrency(order.final_amount)}
                        </p>
                        <p className="text-sm text-slate-400">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Account Details</p>
                        <p className="text-white font-medium">
                          {formatCurrency(order.account_size)} {order.platform_type.toUpperCase()}
                        </p>
                        <p className="text-sm text-slate-400">{order.account_type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Customer</p>
                        <p className="text-white font-medium">{order.user_profiles.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Status</p>
                        <div className="flex flex-wrap gap-2">
                          {getStatusBadge(order.order_status, 'order')}
                          {getStatusBadge(order.payment_status, 'payment')}
                          {getStatusBadge(order.delivery_status, 'delivery')}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div className="text-sm text-slate-400">
                        {order.payment_status === 'paid' && order.delivery_status === 'pending' && (
                          <span className="flex items-center text-yellow-400">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Ready for delivery
                          </span>
                        )}
                        {order.delivery_status === 'delivered' && (
                          <span className="flex items-center text-green-400">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Delivered on {formatDate(order.delivered_at)}
                          </span>
                        )}
                      </div>
                      
                      {order.payment_status === 'pending' && (
                        <Button
                          onClick={() => confirmPaymentAndDeliver(order.order_id, order.user_id)}
                          disabled={processingOrder === order.order_id}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          {processingOrder === order.order_id ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirm Payment & Deliver
                            </div>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
