"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminDeliveredAccountService } from '@/lib/admin-database'
import { toast } from 'sonner'

export default function ManualDeliveryPage() {
  const [orderId, setOrderId] = useState('FFX481021149') // Pre-filled with your order
  const [userId, setUserId] = useState('')
  const [isDelivering, setIsDelivering] = useState(false)

  const handleDelivery = async () => {
    if (!orderId || !userId) {
      toast.error('Please enter both Order ID and User ID')
      return
    }

    setIsDelivering(true)
    try {
      console.log('🚀 Manual delivery for order:', orderId, 'user:', userId)
      
      const { data, error } = await adminDeliveredAccountService.deliverAccount(orderId, userId)
      
      if (error) {
        console.error('❌ Delivery error:', error)
        toast.error(`Delivery failed: ${error.message}`)
        return
      }

      if (data && data.success) {
        console.log('✅ Account delivered successfully:', data)
        toast.success(`✅ Account delivered successfully to order ${orderId}!`)
      } else {
        console.error('❌ Delivery failed:', data)
        toast.error(`Delivery failed: ${data?.error || 'Unknown error'}`)
      }
    } catch (err: any) {
      console.error('❌ Critical error:', err)
      toast.error(`Failed to deliver account: ${err.message}`)
    } finally {
      setIsDelivering(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Manual Account Delivery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order ID</label>
            <Input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="FFX481021149"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">User ID</label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user UUID"
            />
          </div>
          
          <Button 
            onClick={handleDelivery}
            disabled={isDelivering}
            className="w-full"
          >
            {isDelivering ? 'Delivering...' : 'Deliver Account'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
