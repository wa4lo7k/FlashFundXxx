// Supabase Edge Function: Handle NowPayments webhooks

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { 
  getOrderById, 
  updatePaymentStatus, 
  triggerAccountDelivery,
  logPaymentEvent,
  isPaymentComplete,
  isPaymentFailed
} from '../shared/database.ts'
import { NowPaymentsWebhookPayload } from '../shared/types.ts'

serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    console.log('Received NowPayments webhook')

    // Parse webhook payload
    const webhookPayload: NowPaymentsWebhookPayload = await req.json()
    
    console.log('Webhook payload:', webhookPayload)

    // Validate required fields
    if (!webhookPayload.payment_id || !webhookPayload.order_id || !webhookPayload.payment_status) {
      console.error('Invalid webhook payload - missing required fields')
      return new Response('Invalid payload', { status: 400 })
    }

    const { payment_id, order_id, payment_status, actually_paid, pay_amount } = webhookPayload

    // Get order from database
    const order = await getOrderById(order_id)
    if (!order) {
      console.error(`Order not found: ${order_id}`)
      return new Response('Order not found', { status: 404 })
    }

    console.log(`Processing webhook for order ${order_id}, payment ${payment_id}, status: ${payment_status}`)

    // Log the webhook event
    await logPaymentEvent(
      order_id,
      'webhook_received',
      webhookPayload,
      payment_id
    )

    // Handle different payment statuses
    switch (payment_status) {
      case 'waiting':
        console.log(`Payment ${payment_id} is waiting for confirmation`)
        // No action needed, payment is still pending
        break

      case 'confirming':
        console.log(`Payment ${payment_id} is being confirmed`)
        await updatePaymentStatus(order_id, 'pending', 'processing')
        break

      case 'confirmed':
      case 'finished':
        console.log(`Payment ${payment_id} is confirmed/finished`)
        
        // Check if payment amount is sufficient
        const expectedAmount = order.crypto_amount || order.final_amount
        const receivedAmount = actually_paid || pay_amount

        console.log(`💰 Payment amount check:`)
        console.log(`  Expected: ${expectedAmount} (from crypto_amount: ${order.crypto_amount}, final_amount: ${order.final_amount})`)
        console.log(`  Received: ${receivedAmount} (from actually_paid: ${actually_paid}, pay_amount: ${pay_amount})`)
        console.log(`  Minimum required (99%): ${expectedAmount * 0.99}`)
        console.log(`  Payment sufficient: ${receivedAmount >= expectedAmount * 0.99}`)

        if (receivedAmount < expectedAmount * 0.99) { // Allow 1% tolerance
          console.warn(`❌ Insufficient payment: expected ${expectedAmount}, received ${receivedAmount}`)
          await logPaymentEvent(
            order_id,
            'insufficient_payment',
            { expected: expectedAmount, received: receivedAmount, minimum_required: expectedAmount * 0.99 },
            payment_id
          )
          // Don't complete the order, wait for full payment
          break
        }

        console.log(`✅ Payment amount is sufficient, proceeding with delivery`)

        // Payment is complete - update status and deliver account
        await updatePaymentStatus(order_id, 'paid', 'completed')
        
        console.log(`Triggering account delivery for order ${order_id}`)
        try {
          await triggerAccountDelivery(order_id, order.user_id)
          console.log(`Account delivered successfully for order ${order_id}`)
          
          await logPaymentEvent(
            order_id,
            'account_delivered',
            { delivered_at: new Date().toISOString() },
            payment_id
          )
        } catch (deliveryError) {
          console.error(`Failed to deliver account for order ${order_id}:`, deliveryError)
          
          await logPaymentEvent(
            order_id,
            'delivery_failed',
            { error: deliveryError.message },
            payment_id
          )
          
          // Payment was successful but delivery failed
          // This should trigger manual review
        }
        break

      case 'partially_paid':
        console.log(`Payment ${payment_id} is partially paid`)
        await logPaymentEvent(
          order_id,
          'partial_payment',
          { 
            expected: pay_amount, 
            received: actually_paid,
            percentage: (actually_paid / pay_amount) * 100
          },
          payment_id
        )
        // Keep status as pending, wait for full payment
        break

      case 'failed':
      case 'expired':
        console.log(`Payment ${payment_id} failed or expired`)
        await updatePaymentStatus(order_id, 'failed', 'failed')
        
        await logPaymentEvent(
          order_id,
          'payment_failed',
          { reason: payment_status },
          payment_id
        )
        break

      case 'refunded':
        console.log(`Payment ${payment_id} was refunded`)
        await updatePaymentStatus(order_id, 'refunded', 'refunded')
        
        await logPaymentEvent(
          order_id,
          'payment_refunded',
          webhookPayload,
          payment_id
        )
        break

      case 'sending':
        console.log(`Payment ${payment_id} is being sent`)
        // This status might not be relevant for incoming payments
        break

      default:
        console.warn(`Unknown payment status: ${payment_status}`)
        await logPaymentEvent(
          order_id,
          'unknown_status',
          webhookPayload,
          payment_id
        )
    }

    console.log(`Webhook processed successfully for payment ${payment_id}`)

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    
    // Log the error but still return 200 to prevent webhook retries
    // NowPayments will retry failed webhooks
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 200, // Return 200 to prevent retries for server errors
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

/* 
Webhook URL: https://your-project.supabase.co/functions/v1/payment-webhook

Expected webhook payload from NowPayments:
{
  "payment_id": "12345",
  "payment_status": "confirmed",
  "pay_address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "price_amount": 649,
  "price_currency": "USD",
  "pay_amount": 0.02456789,
  "actually_paid": 0.02456789,
  "pay_currency": "btc",
  "order_id": "FFX123456789",
  "order_description": "FlashFundX 1-Step Challenge - $10K MT4",
  "purchase_id": "67890",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:05:00Z",
  "outcome_amount": 649,
  "outcome_currency": "USD"
}

Payment Status Flow:
1. waiting -> Payment created, waiting for user to send crypto
2. confirming -> Payment received, waiting for blockchain confirmations
3. confirmed -> Payment confirmed on blockchain
4. finished -> Payment fully processed
5. failed/expired -> Payment failed or expired
6. refunded -> Payment was refunded
*/
