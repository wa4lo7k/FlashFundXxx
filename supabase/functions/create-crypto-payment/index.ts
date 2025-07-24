// Supabase Edge Function: Create NowPayments crypto payment

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
import { NowPaymentsClient, generateOrderDescription } from '../shared/nowpayments.ts'
import { 
  getOrderById, 
  updateOrderPaymentDetails, 
  logPaymentEvent,
  getWebhookUrl,
  getRedirectUrls,
  isOrderPayable
} from '../shared/database.ts'
import { CreatePaymentRequest, CreatePaymentResponse } from '../shared/types.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const requestData: CreatePaymentRequest = await req.json()

    console.log('Received payment request data:', JSON.stringify(requestData, null, 2))
    console.log('Crypto currency received:', requestData.cryptoCurrency)

    // Validate required fields
    const requiredFields: (keyof CreatePaymentRequest)[] = ['orderId', 'userId', 'accountType', 'accountSize', 'platformType', 'cryptoCurrency', 'amount', 'finalAmount']
    const missingFields = requiredFields.filter(field => !requestData[field])

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Creating crypto payment for order:', requestData.orderId)

    // Get order from database
    const order = await getOrderById(requestData.orderId)
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
    if (order.user_id !== requestData.userId) {
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

    // Check if order is payable
    if (!isOrderPayable(order)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Order is not in a payable state' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize NowPayments client
    const nowPaymentsApiKey = Deno.env.get('NOWPAYMENTS_API_KEY') || 'SANDBOX_API_KEY_FOR_TESTING'

    console.log('NowPayments API key configured:', !!nowPaymentsApiKey)
    console.log('Using API key:', nowPaymentsApiKey.substring(0, 10) + '...')

    if (!nowPaymentsApiKey || nowPaymentsApiKey === 'SANDBOX_API_KEY_FOR_TESTING') {
      console.warn('Using test/sandbox API key - this is for testing only')
    }

    const nowPayments = new NowPaymentsClient(nowPaymentsApiKey)

    // Prepare payment data
    const orderDescription = generateOrderDescription(
      requestData.accountType,
      requestData.accountSize,
      requestData.platformType
    )

    const webhookUrl = getWebhookUrl()
    const { success_url, cancel_url } = getRedirectUrls(requestData.orderId)

    // Map frontend currency to NowPayments currency
    const currencyMap: Record<string, string> = {
      'usdt_bsc': 'usdtbsc',
      'usdt_polygon': 'usdtmatic',
      'usdt_trc20': 'usdttrc20',
      'bnb': 'bnbbsc',
      'btc': 'btc',
      'trx': 'trx'
    }

    const nowPaymentsCurrency = currencyMap[requestData.cryptoCurrency] || 'usdtbsc'
    console.log(`Currency mapping: ${requestData.cryptoCurrency} -> ${nowPaymentsCurrency}`)

    const paymentData = {
      price_amount: requestData.finalAmount,
      price_currency: 'USD',
      pay_currency: nowPaymentsCurrency, // Use mapped currency
      order_id: requestData.orderId,
      order_description: orderDescription,
      success_url,
      cancel_url,
      ipn_callback_url: webhookUrl
    }

    console.log('Creating NowPayments payment with data:', paymentData)

    // Create payment with NowPayments (for hosted checkout page)
    let paymentResponse: any
    try {
      paymentResponse = await nowPayments.createPaymentForHostedCheckout(paymentData)
      console.log('NowPayments payment response:', paymentResponse)
    } catch (nowPaymentsError) {
      console.error('NowPayments API error:', nowPaymentsError)
      const errorMessage = nowPaymentsError instanceof Error ? nowPaymentsError.message : 'Unknown NowPayments error'
      return new Response(
        JSON.stringify({
          success: false,
          error: `NowPayments error: ${errorMessage}`
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Update order with payment details and mark as NowPayments
    await updateOrderPaymentDetails(requestData.orderId, {
      payment_provider_id: paymentResponse.payment_id,
      payment_provider: 'nowpayments',
      crypto_currency: paymentResponse.pay_currency || requestData.cryptoCurrency.toLowerCase(),
      crypto_amount: paymentResponse.pay_amount || 0,
      crypto_address: paymentResponse.pay_address || '',
      payment_status: 'pending',
      order_status: 'processing'
    })

    // Log payment creation event
    await logPaymentEvent(
      requestData.orderId,
      'payment_created',
      paymentResponse,
      paymentResponse.payment_id
    )

    // Prepare response with invoice URL for redirect
    const response: CreatePaymentResponse = {
      success: true,
      invoice_url: paymentResponse.invoice_url,
      payment: {
        payment_id: paymentResponse.payment_id,
        pay_address: paymentResponse.pay_address || '',
        pay_amount: paymentResponse.pay_amount || 0,
        pay_currency: paymentResponse.pay_currency || requestData.cryptoCurrency.toLowerCase(),
        qr_code: '', // Will be available on hosted page
        time_limit: '',
        expiration_date: ''
      }
    }

    console.log('Payment created successfully:', response)

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error creating crypto payment:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})


