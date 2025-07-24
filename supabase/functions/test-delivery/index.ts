// Test Edge Function to debug delivery issues

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createSupabaseClient } from '../shared/database.ts'

serve(async (req) => {
  try {
    console.log('=== DELIVERY TEST DEBUG ===')
    
    const { orderId } = await req.json()
    console.log('Testing delivery for order:', orderId)
    
    const supabase = createSupabaseClient()
    const result: any = {
      orderId,
      timestamp: new Date().toISOString(),
      tests: {}
    }
    
    // Test 1: Check order exists
    console.log('Test 1: Checking order...')
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single()
    
    result.tests.order_check = {
      success: !orderError && !!order,
      order: order,
      error: orderError?.message
    }
    
    if (!order) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Test 2: Check trading rules
    console.log('Test 2: Checking trading rules...')
    const { data: tradingRules, error: rulesError } = await supabase
      .from('trading_rules')
      .select('*')
      .eq('account_type', order.account_type)
      .eq('account_size', order.account_size)
    
    result.tests.trading_rules_check = {
      success: !rulesError && tradingRules && tradingRules.length > 0,
      rules: tradingRules,
      error: rulesError?.message,
      searched_for: {
        account_type: order.account_type,
        account_size: order.account_size
      }
    }
    
    // Test 3: Check available accounts
    console.log('Test 3: Checking available accounts...')
    const { data: accounts, error: accountsError } = await supabase
      .from('account_container')
      .select('*')
      .eq('account_size', order.account_size)
      .eq('platform_type', order.platform_type)
      .eq('status', 'available')
    
    result.tests.available_accounts_check = {
      success: !accountsError && accounts && accounts.length > 0,
      accounts: accounts,
      error: accountsError?.message,
      searched_for: {
        account_size: order.account_size,
        platform_type: order.platform_type,
        status: 'available'
      }
    }
    
    // Test 4: Try calling the delivery function directly
    console.log('Test 4: Testing delivery function...')
    try {
      const { data: deliveryResult, error: deliveryError } = await supabase
        .rpc('deliver_account_to_user', {
          p_order_id: orderId,
          p_user_id: order.user_id
        })
      
      result.tests.delivery_function_test = {
        success: !deliveryError && deliveryResult?.success,
        result: deliveryResult,
        error: deliveryError?.message
      }
    } catch (funcError: any) {
      result.tests.delivery_function_test = {
        success: false,
        error: funcError.message
      }
    }
    
    // Test 5: Check environment variables
    console.log('Test 5: Checking environment...')
    result.tests.environment_check = {
      supabase_url: !!Deno.env.get('SUPABASE_URL'),
      service_key: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      service_key_length: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.length || 0
    }
    
    console.log('=== TEST RESULTS ===')
    console.log(JSON.stringify(result, null, 2))
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Test delivery error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
