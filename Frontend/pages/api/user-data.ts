import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Simple Supabase client with anon key (RLS disabled, so this works fine)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId } = req.query

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' })
    }

    console.log('🔍 User Data API: Fetching data for user:', userId)

    // Reduced timeout for better UX
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('User data API timeout after 15 seconds')), 15000)
    )

    // Fetch both orders and accounts in parallel for better performance
    console.log('📊 User Data API: Fetching user data in parallel...')

    const dataPromise = Promise.all([
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50), // Limit for better performance
      supabase
        .from('delivered_accounts')
        .select('*')
        .eq('user_id', userId)
        .order('delivered_at', { ascending: false })
        .limit(50) // Limit for better performance
    ])

    const [ordersResult, accountsResult] = await Promise.race([
      dataPromise,
      timeoutPromise
    ]) as any[]

    const orders = ordersResult.data
    const ordersError = ordersResult.error
    const accounts = accountsResult.data
    const accountsError = accountsResult.error

    console.log('📊 User Data API: Results:', {
      ordersCount: orders?.length || 0,
      accountsCount: accounts?.length || 0,
      ordersError: ordersError?.message || null,
      accountsError: accountsError?.message || null
    })

    console.log('✅ User Data API: Successfully returning data')

    // Return the data
    res.status(200).json({
      orders: orders || [],
      deliveredAccounts: accounts || [],
      errors: {
        ordersError: ordersError?.message || null,
        accountsError: accountsError?.message || null
      }
    })

  } catch (error) {
    console.error('❌ User Data API: Critical error:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
