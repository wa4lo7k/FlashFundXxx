"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminDeliveredAccountService } from '@/lib/admin-database'
import { supabaseAdmin } from '@/lib/admin-database'
import { toast } from 'sonner'

export default function SimpleDeliveryTestPage() {
  const [orderId, setOrderId] = useState('FFX433073137')
  const [userId, setUserId] = useState('')
  const [result, setResult] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const testDirectDelivery = async () => {
    if (!orderId) {
      toast.error('Please enter Order ID')
      return
    }

    setIsProcessing(true)
    try {
      console.log('🧪 Testing direct delivery function call...')
      
      // First, get the order to find user_id
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single()

      if (orderError || !orderData) {
        setResult({ success: false, error: 'Order not found', orderError })
        toast.error('Order not found')
        return
      }

      console.log('📋 Order found:', orderData)
      setUserId(orderData.user_id)

      // Update payment status to 'paid' first
      console.log('💰 Updating payment status to paid...')
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({ 
          payment_status: 'paid',
          order_status: 'completed',
          paid_at: new Date().toISOString()
        })
        .eq('order_id', orderId)

      if (updateError) {
        setResult({ success: false, error: 'Failed to update payment status', updateError })
        toast.error('Failed to update payment status')
        return
      }

      // Now try delivery
      console.log('🚀 Calling delivery function...')
      const { data: deliveryData, error: deliveryError } = await supabaseAdmin
        .rpc('deliver_account_to_user', {
          p_order_id: orderId,
          p_user_id: orderData.user_id
        })

      console.log('📦 Delivery result:', { deliveryData, deliveryError })

      setResult({
        success: !deliveryError && deliveryData?.success,
        order: orderData,
        deliveryData,
        deliveryError,
        timestamp: new Date().toISOString()
      })

      if (!deliveryError && deliveryData?.success) {
        toast.success('✅ Account delivered successfully!')
      } else {
        toast.error(`❌ Delivery failed: ${deliveryError?.message || deliveryData?.error || 'Unknown error'}`)
      }

    } catch (err: any) {
      console.error('❌ Critical error:', err)
      setResult({ success: false, error: err.message })
      toast.error(`Failed: ${err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const checkOrderStatus = async () => {
    if (!orderId) {
      toast.error('Please enter Order ID')
      return
    }

    try {
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single()

      if (orderError || !orderData) {
        toast.error('Order not found')
        return
      }

      // Also check available accounts
      const { data: accountsData, error: accountsError } = await supabaseAdmin
        .from('account_container')
        .select('*')
        .eq('account_size', orderData.account_size)
        .eq('platform_type', orderData.platform_type)
        .eq('status', 'available')

      // Check trading rules
      const { data: rulesData, error: rulesError } = await supabaseAdmin
        .from('trading_rules')
        .select('*')
        .eq('account_type', orderData.account_type)
        .eq('account_size', orderData.account_size)

      setResult({
        order: orderData,
        availableAccounts: accountsData || [],
        tradingRules: rulesData || [],
        errors: {
          orderError,
          accountsError,
          rulesError
        }
      })

      toast.success('Order status checked')
    } catch (err: any) {
      toast.error(`Failed to check status: ${err.message}`)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Simple Delivery Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order ID</label>
            <Input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="FFX433073137"
            />
          </div>

          {userId && (
            <div>
              <label className="block text-sm font-medium mb-2">User ID (Auto-filled)</label>
              <Input value={userId} readOnly className="bg-gray-50" />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={checkOrderStatus}
              variant="outline"
              className="flex-1"
            >
              Check Order Status
            </Button>
            
            <Button 
              onClick={testDirectDelivery}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Testing...' : 'Test Direct Delivery'}
            </Button>
          </div>
          
          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
