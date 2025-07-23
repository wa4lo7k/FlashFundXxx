// Supabase Edge Function: Check NowPayments payment status

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { NowPaymentsClient } from '../shared/nowpayments.ts'
import { getOrderById, validateOrderOwnership } from '../shared/database.ts'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get parameters from URL
    const url = new URL(req.url)
    const orderId = url.searchParams.get('orderId')
    const userId = url.searchParams.get('userId')

    if (!orderId || !userId) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing orderId or userId parameter' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Checking payment status for order: ${orderId}`)

    // Get order from database
    const order = await getOrderById(orderId)
    if (!order) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Order not found' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate order ownership
    if (!await validateOrderOwnership(orderId, userId)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Unauthorized' 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if order has a payment ID
    if (!order.payment_provider_id) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No payment found for this order' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize NowPayments client
    const nowPaymentsApiKey = Deno.env.get('NOWPAYMENTS_API_KEY')

    if (!nowPaymentsApiKey) {
      console.error('NowPayments API key not configured')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Payment service not configured'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const nowPayments = new NowPaymentsClient(nowPaymentsApiKey)

    // Get payment status from NowPayments
    const paymentStatus = await nowPayments.getPaymentStatus(order.payment_provider_id)

    console.log(`Payment status for ${orderId}:`, paymentStatus)

    // Prepare response with both order and payment data
    const response = {
      success: true,
      order: {
        order_id: order.order_id,
        order_status: order.order_status,
        payment_status: order.payment_status,
        delivery_status: order.delivery_status,
        account_type: order.account_type,
        account_size: order.account_size,
        platform_type: order.platform_type,
        amount: order.amount,
        final_amount: order.final_amount,
        crypto_currency: order.crypto_currency,
        crypto_amount: order.crypto_amount,
        crypto_address: order.crypto_address,
        created_at: order.created_at,
        updated_at: order.updated_at
      },
      payment: paymentStatus.payment
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error checking payment status:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/* 
Usage: GET /functions/v1/check-payment-status?orderId=FFX123456789&userId=user-uuid

Response:
{
  "success": true,
  "order": {
    "order_id": "FFX123456789",
    "order_status": "processing",
    "payment_status": "pending",
    "delivery_status": "pending",
    "account_type": "one_step",
    "account_size": 10000,
    "platform_type": "mt4",
    "amount": 649,
    "final_amount": 649,
    "crypto_currency": "btc",
    "crypto_amount": 0.02456789,
    "crypto_address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:05:00Z"
  },
  "payment": {
    "payment_id": "12345",
    "payment_status": "waiting",
    "pay_address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "pay_amount": 0.02456789,
    "actually_paid": 0,
    "pay_currency": "btc",
    "order_id": "FFX123456789",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
*/
