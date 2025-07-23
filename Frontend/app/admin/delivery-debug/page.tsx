"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminOrderService, adminAccountContainerService, adminTradingRulesService } from '@/lib/admin-database'
import { toast } from 'sonner'

export default function DeliveryDebugPage() {
  const [orderId, setOrderId] = useState('FFX433073137')
  const [debugResult, setDebugResult] = useState<any>(null)
  const [isDebugging, setIsDebugging] = useState(false)

  const runFullDebug = async () => {
    if (!orderId) {
      toast.error('Please enter Order ID')
      return
    }

    setIsDebugging(true)
    const debug: any = {
      orderId,
      timestamp: new Date().toISOString(),
      steps: {}
    }

    try {
      // Step 1: Check if order exists
      console.log('🔍 Step 1: Checking order existence...')
      const { data: orders, error: ordersError } = await adminOrderService.getOrders()
      
      if (ordersError) {
        debug.steps.step1_order_check = { success: false, error: ordersError.message }
        setDebugResult(debug)
        toast.error(`Order check failed: ${ordersError.message}`)
        return
      }

      const order = orders?.find((o: any) => o.order_id === orderId)
      debug.steps.step1_order_check = {
        success: !!order,
        order: order || null,
        error: order ? null : 'Order not found'
      }

      if (!order) {
        setDebugResult(debug)
        toast.error('Order not found')
        return
      }

      // Step 2: Check payment status
      console.log('💰 Step 2: Checking payment status...')
      debug.steps.step2_payment_status = {
        payment_status: order.payment_status,
        is_paid: order.payment_status === 'paid',
        delivery_status: order.delivery_status,
        order_status: order.order_status
      }

      // Step 3: Check trading rules
      console.log('📋 Step 3: Checking trading rules...')
      const { data: tradingRules, error: rulesError } = await adminTradingRulesService.getAllTradingRules()
      
      if (rulesError) {
        debug.steps.step3_trading_rules = { success: false, error: rulesError.message }
      } else {
        const matchingRule = tradingRules?.find((rule: any) => 
          rule.account_type === order.account_type && 
          rule.account_size === order.account_size
        )
        debug.steps.step3_trading_rules = {
          success: !!matchingRule,
          matching_rule: matchingRule || null,
          all_rules_count: tradingRules?.length || 0,
          searched_for: {
            account_type: order.account_type,
            account_size: order.account_size
          }
        }
      }

      // Step 4: Check available accounts
      console.log('🏦 Step 4: Checking available accounts...')
      const { data: allAccounts, error: accountsError } = await adminAccountContainerService.getAllAccounts()
      
      if (accountsError) {
        debug.steps.step4_available_accounts = { success: false, error: accountsError.message }
      } else {
        const matchingAccounts = allAccounts?.filter((acc: any) => 
          acc.account_size === order.account_size && 
          acc.platform_type === order.platform_type &&
          acc.status === 'available'
        )
        
        const allMatchingSize = allAccounts?.filter((acc: any) => 
          acc.account_size === order.account_size
        )

        debug.steps.step4_available_accounts = {
          success: (matchingAccounts?.length || 0) > 0,
          matching_available_accounts: matchingAccounts || [],
          all_matching_size_accounts: allMatchingSize || [],
          total_accounts: allAccounts?.length || 0,
          searched_for: {
            account_size: order.account_size,
            platform_type: order.platform_type,
            status: 'available'
          }
        }
      }

      // Step 5: Try manual delivery
      console.log('🚀 Step 5: Attempting manual delivery...')
      try {
        const deliveryResponse = await fetch('https://evogjimjdofyrpqaukdq.supabase.co/functions/v1/payment-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            payment_id: `debug_${Date.now()}`,
            payment_status: 'finished',
            pay_address: 'debug_test',
            price_amount: 0.5,
            price_currency: 'USD',
            pay_amount: 0.00064198,
            actually_paid: 0.00064198,
            pay_currency: 'BNB',
            order_id: orderId,
            order_description: 'Debug Test',
            purchase_id: 'debug',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            outcome_amount: 0.5,
            outcome_currency: 'USD'
          })
        })

        const deliveryResult = await deliveryResponse.json()
        debug.steps.step5_manual_delivery = {
          success: deliveryResult.success,
          response: deliveryResult,
          http_status: deliveryResponse.status
        }
      } catch (deliveryError: any) {
        debug.steps.step5_manual_delivery = {
          success: false,
          error: deliveryError.message
        }
      }

      setDebugResult(debug)
      
      // Summary
      const allStepsSuccess = Object.values(debug.steps).every((step: any) => step.success !== false)
      if (allStepsSuccess) {
        toast.success('All delivery steps passed!')
      } else {
        toast.error('Some delivery steps failed - check the debug results')
      }

    } catch (err: any) {
      debug.error = err.message
      setDebugResult(debug)
      toast.error(`Debug failed: ${err.message}`)
    } finally {
      setIsDebugging(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Account Delivery Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="FFX433073137"
              className="flex-1"
            />
            <Button 
              onClick={runFullDebug}
              disabled={isDebugging}
            >
              {isDebugging ? 'Debugging...' : 'Run Full Debug'}
            </Button>
          </div>
          
          {debugResult && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-lg">Debug Results:</h3>
              
              {Object.entries(debugResult.steps).map(([stepName, stepData]: [string, any]) => (
                <Card key={stepName} className={`${stepData.success === false ? 'border-red-500' : stepData.success === true ? 'border-green-500' : 'border-yellow-500'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {stepData.success === false ? '❌' : stepData.success === true ? '✅' : '⚠️'}
                      {stepName.replace(/_/g, ' ').toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-40">
                      {JSON.stringify(stepData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
