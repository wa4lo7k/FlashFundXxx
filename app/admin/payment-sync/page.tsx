"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function PaymentSyncPage() {
  const [orderId, setOrderId] = useState('FFX433073137') // Your current order
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleManualWebhook = async () => {
    if (!orderId) {
      toast.error('Please enter Order ID')
      return
    }

    setIsProcessing(true)
    try {
      console.log('🔄 Manually triggering webhook for order:', orderId)
      
      // Simulate the webhook call
      const webhookPayload = {
        payment_id: `manual_${Date.now()}`,
        payment_status: 'finished',
        pay_address: 'manual_trigger',
        price_amount: 0.5,
        price_currency: 'USD',
        pay_amount: 0.00064198,
        actually_paid: 0.00064198,
        pay_currency: 'BNB',
        order_id: orderId,
        order_description: 'FlashFundX Account',
        purchase_id: 'manual',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        outcome_amount: 0.5,
        outcome_currency: 'USD'
      }

      const response = await fetch('https://evogjimjdofyrpqaukdq.supabase.co/functions/v1/payment-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(webhookPayload)
      })

      const result = await response.json()
      console.log('✅ Webhook response:', result)
      
      setResult(result)
      
      if (result.success) {
        toast.success(`✅ Account delivered successfully for order ${orderId}!`)
      } else {
        toast.error(`❌ Webhook failed: ${result.error || 'Unknown error'}`)
      }
    } catch (err: any) {
      console.error('❌ Critical error:', err)
      toast.error(`Failed to process webhook: ${err.message}`)
      setResult({ success: false, error: err.message })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCheckPayment = async () => {
    if (!orderId) {
      toast.error('Please enter Order ID')
      return
    }

    setIsProcessing(true)
    try {
      console.log('🔍 Checking payment status for order:', orderId)
      
      const response = await fetch('https://evogjimjdofyrpqaukdq.supabase.co/functions/v1/check-payment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ orderId })
      })

      const result = await response.json()
      console.log('✅ Payment status:', result)
      
      setResult(result)
      
      if (result.success) {
        toast.success('Payment status checked successfully')
      } else {
        toast.error(`❌ Check failed: ${result.error || 'Unknown error'}`)
      }
    } catch (err: any) {
      console.error('❌ Critical error:', err)
      toast.error(`Failed to check payment: ${err.message}`)
      setResult({ success: false, error: err.message })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Payment Sync & Manual Delivery</CardTitle>
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
          
          <div className="flex gap-2">
            <Button 
              onClick={handleCheckPayment}
              disabled={isProcessing}
              variant="outline"
              className="flex-1"
            >
              {isProcessing ? 'Checking...' : 'Check Payment Status'}
            </Button>
            
            <Button 
              onClick={handleManualWebhook}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : 'Manual Delivery'}
            </Button>
          </div>
          
          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="text-xs bg-white p-3 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>Check Payment Status</strong>: Verifies payment with NowPayments</li>
              <li>• <strong>Manual Delivery</strong>: Forces account delivery for paid orders</li>
              <li>• Use this when automatic webhooks aren't working</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
