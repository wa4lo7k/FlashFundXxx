import { createClient } from '@supabase/supabase-js'

// ============================================================================
// ADMIN DATABASE CLIENT WITH SERVICE ROLE ACCESS
// ============================================================================

// Admin client with service role key for full database access
const supabaseAdmin = createClient(
  'https://evogjimjdofyrpqaukdq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b2dqaW1qZG9meXJwcWF1a2RxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI0MjQyOSwiZXhwIjoyMDY3ODE4NDI5fQ.hzhtT1KkZDO6UNqaW2E8Au_Dqb2O1YXMxsbphOUPs5E',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// ============================================================================
// ADMIN USER PROFILE SERVICE
// ============================================================================

export const adminUserProfileService = {
  // Get all user profiles (admin only)
  async getAllProfiles(): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get user profile by ID
  async getProfile(userId: string): Promise<{ data: any | null; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: any): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================================================
// ADMIN ORDER SERVICE
// ============================================================================

export const adminOrderService = {
  // Get all orders (admin only)
  async getAllOrders(): Promise<{ data: any[] | null; error: any }> {
    try {
      console.log('📊 Admin Orders: Starting fetch...')

      // Reduced timeout and simplified query for better performance
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Orders request timeout after 15 seconds')), 15000)
      )

      // Use correct field names and simplified query
      const dataPromise = supabaseAdmin
        .from('orders')
        .select(`
          order_id, user_id, account_type, account_size, platform_type,
          amount, final_amount, order_status, payment_status, delivery_status,
          payment_method, transaction_id, created_at, paid_at, delivered_at,
          user_profiles(first_name, last_name, email, phone, country)
        `)
        .order('created_at', { ascending: false })
        .limit(100) // Limit results for better performance

      const { data, error } = await Promise.race([dataPromise, timeoutPromise]) as any

      if (error) {
        console.error('📊 Admin Orders: Database error:', error)
        return { data: null, error }
      }

      console.log('📊 Admin Orders: Success:', {
        count: data?.length || 0
      })

      return { data, error }
    } catch (error) {
      console.error('❌ Admin Orders: Error:', error)
      return { data: null, error }
    }
  },

  // Get order by ID
  async getOrder(orderId: string): Promise<{ data: any | null; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
          *,
          user_profiles!inner(first_name, last_name, email, phone, country)
        `)
        .eq('id', orderId)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update order
  async updateOrder(orderId: string, updates: any): Promise<{ data: any; error: any }> {
    try {
      // Add updated_at timestamp
      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabaseAdmin
        .from('orders')
        .update(updatesWithTimestamp)
        .eq('order_id', orderId) // Use order_id instead of id
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update payment status
  async updatePaymentStatus(orderId: string, status: string): Promise<{ data: any; error: any }> {
    try {
      const updates: any = {
        payment_status: status,
        updated_at: new Date().toISOString()
      }

      // Use the correct column name from the schema
      if (status === 'paid') {
        updates.paid_at = new Date().toISOString()
      }

      const { data, error } = await supabaseAdmin
        .from('orders')
        .update(updates)
        .eq('order_id', orderId) // Use order_id instead of id
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================================================
// ADMIN DELIVERED ACCOUNTS SERVICE
// ============================================================================

export const adminDeliveredAccountService = {
  // Get all delivered accounts (admin only)
  async getAllDeliveredAccounts(): Promise<{ data: any[] | null; error: any }> {
    try {
      console.log('📦 Admin Delivered Accounts: Starting fetch...')

      // Add timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Delivered accounts request timeout')), 15000)
      )

      const dataPromise = supabaseAdmin
        .from('delivered_accounts')
        .select(`
          *,
          user_profiles!inner(first_name, last_name, email),
          trading_rules!inner(*)
        `)
        .order('delivered_at', { ascending: false })

      const { data, error } = await Promise.race([dataPromise, timeoutPromise]) as any

      console.log('📦 Admin Delivered Accounts: Result:', {
        count: data?.length || 0,
        error: error
      })

      return { data, error }
    } catch (error) {
      console.error('❌ Admin Delivered Accounts: Error:', error)
      return { data: null, error }
    }
  },

  // Deliver account to user
  async deliverAccount(orderId: string, userId: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .rpc('deliver_account_to_user', {
          p_order_id: orderId,
          p_user_id: userId
        })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================================================
// ADMIN ACCOUNT CONTAINER SERVICE
// ============================================================================

export const adminAccountContainerService = {
  // Get all accounts
  async getAllAccounts(): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('account_container')
        .select('*')
        .order('account_size', { ascending: true })
        .order('platform_type', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Add new account
  async addAccount(accountData: any): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('account_container')
        .insert([accountData])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update account status
  async updateAccountStatus(accountId: string, status: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('account_container')
        .update({ status })
        .eq('id', accountId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get availability count
  async getAvailabilityCount(): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await supabaseAdmin.rpc('get_available_accounts_count')
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================================================
// ADMIN CRYPTO ADDRESS SERVICE
// ============================================================================

export const adminCryptoAddressService = {
  // Get all crypto addresses
  async getAllAddresses(): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('crypto_addresses')
        .select('*')
        .order('sort_order', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Add new crypto address
  async addAddress(addressData: any): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('crypto_addresses')
        .insert([addressData])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update crypto address
  async updateAddress(addressId: string, updates: any): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('crypto_addresses')
        .update(updates)
        .eq('id', addressId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete crypto address
  async deleteAddress(addressId: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('crypto_addresses')
        .delete()
        .eq('id', addressId)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================================================
// ADMIN TRADING RULES SERVICE
// ============================================================================

export const adminTradingRulesService = {
  // Get all trading rules
  async getAllRules(): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('trading_rules')
        .select('*')
        .order('account_type', { ascending: true })
        .order('account_size', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update trading rules
  async updateRules(ruleId: string, updates: any): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('trading_rules')
        .update(updates)
        .eq('id', ruleId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Add missing 1K trading rules
  async add1KTradingRules(): Promise<{ data: any; error: any }> {
    try {
      console.log('📊 Adding missing 1K trading rules...')

      const rules1K = [
        // INSTANT $1K ACCOUNT (Direct live account - no challenge)
        {
          account_type: 'instant',
          account_size: 1000,
          challenge_profit_target: null,
          challenge_max_daily_loss: null,
          challenge_max_total_loss: null,
          challenge_min_trading_days: null,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 50,
          live_max_total_loss: 100,
          profit_share_percentage: 80
        },
        // HFT $1K ACCOUNT (Single HFT challenge phase)
        {
          account_type: 'hft',
          account_size: 1000,
          challenge_profit_target: 80,
          challenge_max_daily_loss: 40,
          challenge_max_total_loss: 80,
          challenge_min_trading_days: 1,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 50,
          live_max_total_loss: 100,
          profit_share_percentage: 80
        },
        // ONE-STEP $1K ACCOUNT (Single one-step challenge phase)
        {
          account_type: 'one_step',
          account_size: 1000,
          challenge_profit_target: 100,
          challenge_max_daily_loss: 50,
          challenge_max_total_loss: 100,
          challenge_min_trading_days: 4,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 50,
          live_max_total_loss: 100,
          profit_share_percentage: 80
        },
        // TWO-STEP $1K ACCOUNT (Two challenge phases)
        {
          account_type: 'two_step',
          account_size: 1000,
          challenge_profit_target: null,
          challenge_max_daily_loss: null,
          challenge_max_total_loss: null,
          challenge_min_trading_days: null,
          phase_1_profit_target: 80,
          phase_1_max_daily_loss: 50,
          phase_1_max_total_loss: 100,
          phase_1_min_trading_days: 4,
          phase_2_profit_target: 50,
          phase_2_max_daily_loss: 50,
          phase_2_max_total_loss: 100,
          phase_2_min_trading_days: 4,
          live_max_daily_loss: 50,
          live_max_total_loss: 100,
          profit_share_percentage: 80
        }
      ]

      const { data, error } = await supabaseAdmin
        .from('trading_rules')
        .upsert(rules1K, {
          onConflict: 'account_type,account_size',
          ignoreDuplicates: false
        })
        .select()

      console.log('📊 1K Trading rules result:', { count: data?.length || 0, error })

      return { data, error }
    } catch (error) {
      console.error('❌ Error adding 1K trading rules:', error)
      return { data: null, error }
    }
  },

  // Add 3K trading rules for all account types
  async add3KTradingRules(): Promise<{ data: any[] | null; error: any }> {
    try {
      console.log('📊 Adding 3K trading rules for all account types...')

      const rules3K = [
        // INSTANT $3K ACCOUNT
        {
          account_type: 'instant',
          account_size: 3000,
          challenge_profit_target: null,
          challenge_max_daily_loss: null,
          challenge_max_total_loss: null,
          challenge_min_trading_days: null,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 150,
          live_max_total_loss: 300,
          profit_share_percentage: 80
        },
        // HFT $3K ACCOUNT
        {
          account_type: 'hft',
          account_size: 3000,
          challenge_profit_target: 240,
          challenge_max_daily_loss: 120,
          challenge_max_total_loss: 240,
          challenge_min_trading_days: 1,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 150,
          live_max_total_loss: 300,
          profit_share_percentage: 80
        },
        // ONE-STEP $3K ACCOUNT
        {
          account_type: 'one_step',
          account_size: 3000,
          challenge_profit_target: 300,
          challenge_max_daily_loss: 150,
          challenge_max_total_loss: 300,
          challenge_min_trading_days: 4,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 150,
          live_max_total_loss: 300,
          profit_share_percentage: 80
        },
        // TWO-STEP $3K ACCOUNT
        {
          account_type: 'two_step',
          account_size: 3000,
          challenge_profit_target: null,
          challenge_max_daily_loss: null,
          challenge_max_total_loss: null,
          challenge_min_trading_days: null,
          phase_1_profit_target: 240,
          phase_1_max_daily_loss: 150,
          phase_1_max_total_loss: 300,
          phase_1_min_trading_days: 4,
          phase_2_profit_target: 150,
          phase_2_max_daily_loss: 150,
          phase_2_max_total_loss: 300,
          phase_2_min_trading_days: 4,
          live_max_daily_loss: 150,
          live_max_total_loss: 300,
          profit_share_percentage: 80
        }
      ]

      const { data, error } = await supabaseAdmin
        .from('trading_rules')
        .upsert(rules3K, {
          onConflict: 'account_type,account_size',
          ignoreDuplicates: false
        })
        .select()

      console.log('📊 3K Trading rules result:', { count: data?.length || 0, error })

      return { data, error }
    } catch (error) {
      console.error('❌ Error adding 3K trading rules:', error)
      return { data: null, error }
    }
  },

  // Add 5K trading rules for all account types
  async add5KTradingRules(): Promise<{ data: any[] | null; error: any }> {
    try {
      console.log('📊 Adding 5K trading rules for all account types...')

      const rules5K = [
        // INSTANT $5K ACCOUNT
        {
          account_type: 'instant',
          account_size: 5000,
          challenge_profit_target: null,
          challenge_max_daily_loss: null,
          challenge_max_total_loss: null,
          challenge_min_trading_days: null,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 250,
          live_max_total_loss: 500,
          profit_share_percentage: 80
        },
        // HFT $5K ACCOUNT
        {
          account_type: 'hft',
          account_size: 5000,
          challenge_profit_target: 400,
          challenge_max_daily_loss: 200,
          challenge_max_total_loss: 400,
          challenge_min_trading_days: 1,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 250,
          live_max_total_loss: 500,
          profit_share_percentage: 80
        },
        // ONE-STEP $5K ACCOUNT
        {
          account_type: 'one_step',
          account_size: 5000,
          challenge_profit_target: 500,
          challenge_max_daily_loss: 250,
          challenge_max_total_loss: 500,
          challenge_min_trading_days: 4,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 250,
          live_max_total_loss: 500,
          profit_share_percentage: 80
        },
        // TWO-STEP $5K ACCOUNT
        {
          account_type: 'two_step',
          account_size: 5000,
          challenge_profit_target: null,
          challenge_max_daily_loss: null,
          challenge_max_total_loss: null,
          challenge_min_trading_days: null,
          phase_1_profit_target: 400,
          phase_1_max_daily_loss: 250,
          phase_1_max_total_loss: 500,
          phase_1_min_trading_days: 4,
          phase_2_profit_target: 250,
          phase_2_max_daily_loss: 250,
          phase_2_max_total_loss: 500,
          phase_2_min_trading_days: 4,
          live_max_daily_loss: 250,
          live_max_total_loss: 500,
          profit_share_percentage: 80
        }
      ]

      const { data, error } = await supabaseAdmin
        .from('trading_rules')
        .upsert(rules5K, {
          onConflict: 'account_type,account_size',
          ignoreDuplicates: false
        })
        .select()

      console.log('📊 5K Trading rules result:', { count: data?.length || 0, error })

      return { data, error }
    } catch (error) {
      console.error('❌ Error adding 5K trading rules:', error)
      return { data: null, error }
    }
  },

  // Add 500K trading rules for all account types
  async add500KTradingRules(): Promise<{ data: any[] | null; error: any }> {
    try {
      console.log('📊 Adding 500K trading rules for all account types...')

      const rules500K = [
        // INSTANT $500K ACCOUNT
        {
          account_type: 'instant',
          account_size: 500000,
          challenge_profit_target: null,
          challenge_max_daily_loss: null,
          challenge_max_total_loss: null,
          challenge_min_trading_days: null,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 25000,
          live_max_total_loss: 50000,
          profit_share_percentage: 90
        },
        // HFT $500K ACCOUNT
        {
          account_type: 'hft',
          account_size: 500000,
          challenge_profit_target: 40000,
          challenge_max_daily_loss: 20000,
          challenge_max_total_loss: 40000,
          challenge_min_trading_days: 1,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 25000,
          live_max_total_loss: 50000,
          profit_share_percentage: 90
        },
        // ONE-STEP $500K ACCOUNT
        {
          account_type: 'one_step',
          account_size: 500000,
          challenge_profit_target: 50000,
          challenge_max_daily_loss: 25000,
          challenge_max_total_loss: 50000,
          challenge_min_trading_days: 4,
          phase_1_profit_target: null,
          phase_1_max_daily_loss: null,
          phase_1_max_total_loss: null,
          phase_1_min_trading_days: null,
          phase_2_profit_target: null,
          phase_2_max_daily_loss: null,
          phase_2_max_total_loss: null,
          phase_2_min_trading_days: null,
          live_max_daily_loss: 25000,
          live_max_total_loss: 50000,
          profit_share_percentage: 90
        },
        // TWO-STEP $500K ACCOUNT
        {
          account_type: 'two_step',
          account_size: 500000,
          challenge_profit_target: null,
          challenge_max_daily_loss: null,
          challenge_max_total_loss: null,
          challenge_min_trading_days: null,
          phase_1_profit_target: 40000,
          phase_1_max_daily_loss: 25000,
          phase_1_max_total_loss: 50000,
          phase_1_min_trading_days: 4,
          phase_2_profit_target: 25000,
          phase_2_max_daily_loss: 25000,
          phase_2_max_total_loss: 50000,
          phase_2_min_trading_days: 4,
          live_max_daily_loss: 25000,
          live_max_total_loss: 50000,
          profit_share_percentage: 90
        }
      ]

      const { data, error } = await supabaseAdmin
        .from('trading_rules')
        .upsert(rules500K, {
          onConflict: 'account_type,account_size',
          ignoreDuplicates: false
        })
        .select()

      console.log('📊 500K Trading rules result:', { count: data?.length || 0, error })

      return { data, error }
    } catch (error) {
      console.error('❌ Error adding 500K trading rules:', error)
      return { data: null, error }
    }
  }
}

// ============================================================================
// ADMIN STATISTICS SERVICE
// ============================================================================

export const adminStatsService = {
  // Test database connection
  async testConnection(): Promise<{ data: any; error: any }> {
    try {
      console.log('🔍 Testing admin database connection...')
      const { data, error } = await supabaseAdmin.from('user_profiles').select('count').limit(1)
      console.log('🔍 Connection test result:', { data, error })
      return { data, error }
    } catch (error) {
      console.error('❌ Connection test failed:', error)
      return { data: null, error }
    }
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<{ data: any; error: any }> {
    try {
      console.log('🔍 Admin Stats: Starting data fetch...')

      // Test connection first
      const connectionTest = await this.testConnection()
      if (connectionTest.error) {
        console.error('❌ Database connection failed:', connectionTest.error)
        return { data: null, error: connectionTest.error }
      }

      // Reduced timeout and optimized queries
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout after 15 seconds')), 15000)
      )

      // Try simple queries first to check what tables exist
      console.log('🔍 Testing individual table access...')

      // Test each table individually
      const ordersTest = await supabaseAdmin.from('orders').select('count').limit(1)
      const usersTest = await supabaseAdmin.from('user_profiles').select('count').limit(1)
      const accountsTest = await supabaseAdmin.from('delivered_accounts').select('count').limit(1)

      console.log('🔍 Table access test results:', {
        orders: ordersTest.error ? 'FAILED' : 'SUCCESS',
        users: usersTest.error ? 'FAILED' : 'SUCCESS',
        accounts: accountsTest.error ? 'FAILED' : 'SUCCESS',
        ordersError: ordersTest.error?.message,
        usersError: usersTest.error?.message,
        accountsError: accountsTest.error?.message
      })

      // Use correct field names based on actual database schema
      const dataPromise = Promise.all([
        supabaseAdmin.from('orders').select('order_id, order_status, payment_status, final_amount, amount, created_at').limit(50),
        supabaseAdmin.from('user_profiles').select('id, first_name, last_name, email, created_at').limit(50),
        supabaseAdmin.from('delivered_accounts').select('id, user_id, account_type, delivered_at').limit(50)
      ])

      const [ordersResult, usersResult, accountsResult] = await Promise.race([
        dataPromise,
        timeoutPromise
      ]) as any[]

      console.log('🔍 Admin Stats: Raw query results:', {
        ordersResult: ordersResult?.error ? 'ERROR' : 'SUCCESS',
        usersResult: usersResult?.error ? 'ERROR' : 'SUCCESS',
        accountsResult: accountsResult?.error ? 'ERROR' : 'SUCCESS',
        ordersError: ordersResult?.error?.message,
        usersError: usersResult?.error?.message,
        accountsError: accountsResult?.error?.message
      })

      // Handle errors more gracefully - continue with available data
      const orders = ordersResult?.error ? [] : (ordersResult?.data || [])
      const users = usersResult?.error ? [] : (usersResult?.data || [])
      const accounts = accountsResult?.error ? [] : (accountsResult?.data || [])

      console.log('📊 Admin Stats: Processed data:', {
        ordersCount: orders.length,
        usersCount: users.length,
        accountsCount: accounts.length,
        hasOrdersError: !!ordersResult?.error,
        hasUsersError: !!usersResult?.error,
        hasAccountsError: !!accountsResult?.error
      })

      // Calculate statistics with safe field access
      const stats = {
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: orders
          .filter(order => order.payment_status === 'paid')
          .reduce((sum, order) => {
            // Use the correct field name from database schema
            const amount = order.final_amount || order.amount || 0
            return sum + Number(amount)
          }, 0),
        pendingOrders: orders.filter(order => order.order_status === 'pending').length,
        completedOrders: orders.filter(order => order.order_status === 'completed').length,
        deliveredAccounts: accounts.length,
        recentOrders: orders.slice(0, 10),
        recentUsers: users.slice(0, 10)
      }

      console.log('✅ Admin Stats: Calculated stats:', stats)
      return { data: stats, error: null }
    } catch (error) {
      console.error('❌ Admin Stats: Critical error:', error)
      return { data: null, error }
    }
  }
}

// Export admin client for direct use if needed
export { supabaseAdmin }
