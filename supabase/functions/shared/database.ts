// Database helper functions for Supabase Edge Functions

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DatabaseOrder } from './types.ts'

export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function getOrderById(orderId: string): Promise<DatabaseOrder | null> {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', orderId)
    .single()
  
  if (error) {
    console.error('Error fetching order:', error)
    return null
  }
  
  return data as DatabaseOrder
}

export async function updateOrderPaymentDetails(
  orderId: string,
  paymentData: {
    payment_provider_id?: string
    payment_provider?: string
    crypto_currency?: string
    crypto_amount?: number
    crypto_address?: string
    payment_status?: string
    order_status?: string
  }
) {
  const supabase = createSupabaseClient()

  const updateData = {
    ...paymentData,
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('order_id', orderId)
    .select()
    .single()

  if (error) {
    console.error('Error updating order:', error)
    throw new Error(`Failed to update order: ${error.message}`)
  }

  return data as DatabaseOrder
}

export async function updatePaymentStatus(
  orderId: string, 
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  orderStatus?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
) {
  const supabase = createSupabaseClient()
  
  const updateData: any = {
    payment_status: paymentStatus,
    updated_at: new Date().toISOString()
  }
  
  if (orderStatus) {
    updateData.order_status = orderStatus
  }
  
  if (paymentStatus === 'paid') {
    updateData.paid_at = new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('order_id', orderId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating payment status:', error)
    throw new Error(`Failed to update payment status: ${error.message}`)
  }
  
  return data as DatabaseOrder
}

export async function triggerAccountDelivery(orderId: string, userId: string) {
  const supabase = createSupabaseClient()
  
  try {
    // Call the deliver_account_to_user function
    const { data, error } = await supabase.rpc('deliver_account_to_user', {
      p_order_id: orderId,
      p_user_id: userId
    })
    
    if (error) {
      console.error('Error delivering account:', error)
      throw new Error(`Failed to deliver account: ${error.message}`)
    }
    
    console.log('Account delivered successfully:', data)
    return data
  } catch (error) {
    console.error('Error in triggerAccountDelivery:', error)
    throw error
  }
}

export async function logPaymentEvent(
  orderId: string,
  eventType: string,
  eventData: any,
  paymentId?: string
) {
  const supabase = createSupabaseClient()
  
  // Create a payment transaction log entry
  const { error } = await supabase
    .from('payment_transactions')
    .insert({
      order_id: orderId,
      payment_provider: 'nowpayments',
      payment_provider_id: paymentId,
      transaction_type: eventType,
      transaction_data: eventData,
      status: eventData.payment_status || 'unknown',
      amount: eventData.pay_amount || eventData.price_amount,
      currency: eventData.pay_currency || eventData.price_currency,
      created_at: new Date().toISOString()
    })
  
  if (error) {
    console.error('Error logging payment event:', error)
    // Don't throw here as this is just logging
  }
}

export async function getUserById(userId: string) {
  const supabase = createSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user:', error)
    return null
  }
  
  return data
}

export async function validateOrderOwnership(orderId: string, userId: string): Promise<boolean> {
  const order = await getOrderById(orderId)
  return order?.user_id === userId
}

// Helper function to check if order is in valid state for payment
export function isOrderPayable(order: DatabaseOrder): boolean {
  return order.payment_status === 'pending' && 
         order.order_status === 'pending' &&
         order.delivery_status === 'pending'
}

// Helper function to determine if payment is complete
export function isPaymentComplete(paymentStatus: string): boolean {
  return ['confirmed', 'finished'].includes(paymentStatus)
}

// Helper function to determine if payment failed
export function isPaymentFailed(paymentStatus: string): boolean {
  return ['failed', 'expired', 'refunded'].includes(paymentStatus)
}

// Helper function to get webhook URL
export function getWebhookUrl(): string {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  return `${supabaseUrl}/functions/v1/payment-webhook`
}

// Helper function to get success/cancel URLs
export function getRedirectUrls(orderId: string) {
  // Use environment variable or fallback to localhost with correct port
  const frontendUrl = Deno.env.get('FRONTEND_URL') || 'http://localhost:3001'

  return {
    success_url: `${frontendUrl}/dashboard/payment/success?order=${orderId}`,
    cancel_url: `${frontendUrl}/dashboard/payment/cancelled?order=${orderId}`
  }
}
