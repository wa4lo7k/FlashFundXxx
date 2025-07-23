"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminOrderService } from '@/lib/admin-database'
import { toast } from 'sonner'

export default function LookupUserPage() {
  const [orderId, setOrderId] = useState('FFX481021149')
  const [orderData, setOrderData] = useState<any>(null)
  const [isLooking, setIsLooking] = useState(false)

  const handleLookup = async () => {
    if (!orderId) {
      toast.error('Please enter Order ID')
      return
    }

    setIsLooking(true)
    try {
      console.log('🔍 Looking up order:', orderId)
      
      const { data, error } = await adminOrderService.getOrders()
      
      if (error) {
        console.error('❌ Lookup error:', error)
        toast.error(`Lookup failed: ${error.message}`)
        return
      }

      const order = data?.find((o: any) => o.order_id === orderId)
      
      if (order) {
        console.log('✅ Order found:', order)
        setOrderData(order)
        toast.success('Order found!')
      } else {
        toast.error('Order not found')
        setOrderData(null)
      }
    } catch (err: any) {
      console.error('❌ Critical error:', err)
      toast.error(`Failed to lookup order: ${err.message}`)
    } finally {
      setIsLooking(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Order & User Lookup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="FFX481021149"
              className="flex-1"
            />
            <Button 
              onClick={handleLookup}
              disabled={isLooking}
            >
              {isLooking ? 'Looking...' : 'Lookup'}
            </Button>
          </div>
          
          {orderData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Order Details:</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Order ID:</strong> {orderData.order_id}</p>
                <p><strong>User ID:</strong> {orderData.user_id}</p>
                <p><strong>Email:</strong> {orderData.user_profiles?.email}</p>
                <p><strong>Name:</strong> {orderData.user_profiles?.first_name} {orderData.user_profiles?.last_name}</p>
                <p><strong>Account Type:</strong> {orderData.account_type}</p>
                <p><strong>Account Size:</strong> ${orderData.account_size}</p>
                <p><strong>Payment Status:</strong> {orderData.payment_status}</p>
                <p><strong>Order Status:</strong> {orderData.order_status}</p>
                <p><strong>Amount:</strong> ${orderData.final_amount}</p>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-sm"><strong>Copy this User ID for manual delivery:</strong></p>
                <code className="block mt-1 p-2 bg-white rounded text-xs break-all">
                  {orderData.user_id}
                </code>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
