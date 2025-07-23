import { supabase } from './supabaseClient'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
  country?: string
  marketing_consent: boolean
  account_status: 'active' | 'suspended' | 'banned'
  total_orders: number
  total_spent: number
  signup_ip?: string
  last_login_at?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_id: string
  user_id: string
  account_type: 'instant' | 'hft' | 'one_step' | 'two_step'
  account_size: number
  platform_type: 'mt4' | 'mt5'
  amount: number
  currency: string
  discount_amount: number
  final_amount: number
  order_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  delivery_status: 'pending' | 'delivered' | 'failed'
  payment_method?: 'crypto' | 'lemon_squeezy' | 'nowpayments' | 'stripe' | 'manual'
  payment_provider_id?: string
  transaction_id?: string
  crypto_currency?: string
  crypto_amount?: number
  crypto_address?: string
  payment_proof?: string
  created_at: string
  paid_at?: string
  delivered_at?: string
  updated_at: string
}

export interface TradingRules {
  id: string
  account_type: 'instant' | 'hft' | 'one_step' | 'two_step'
  account_size: number
  challenge_profit_target?: number
  challenge_max_daily_loss?: number
  challenge_max_total_loss?: number
  challenge_min_trading_days?: number
  phase_1_profit_target?: number
  phase_1_max_daily_loss?: number
  phase_1_max_total_loss?: number
  phase_1_min_trading_days?: number
  phase_2_profit_target?: number
  phase_2_max_daily_loss?: number
  phase_2_max_total_loss?: number
  phase_2_min_trading_days?: number
  live_max_daily_loss: number
  live_max_total_loss: number
  profit_share_percentage: number
  created_at: string
  updated_at: string
}

export interface AccountContainer {
  id: string
  account_size: number
  platform_type: 'mt4' | 'mt5'
  server_name: string
  login_id: string
  password: string
  investor_password?: string
  status: 'available' | 'reserved' | 'delivered' | 'disabled'
  reserved_for_order_id?: string
  reserved_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface DeliveredAccount {
  id: string
  user_id: string
  order_id: string
  container_account_id: string
  trading_rules_id: string
  account_type: 'instant' | 'hft' | 'one_step' | 'two_step'
  account_size: number
  platform_type: string
  server_name: string
  login_id: string
  password: string
  investor_password?: string
  current_phase: 'challenge' | 'phase_1' | 'phase_2' | 'live'
  phase_status: 'active' | 'pending' | 'passed' | 'failed'
  challenge_status: 'active' | 'pending' | 'passed' | 'failed'
  challenge_completed_at?: string
  phase_1_status: 'active' | 'pending' | 'passed' | 'failed'
  phase_1_completed_at?: string
  phase_2_status: 'active' | 'pending' | 'passed' | 'failed'
  phase_2_completed_at?: string
  live_status: 'active' | 'pending' | 'passed' | 'failed'
  live_activated_at?: string
  account_status: 'active' | 'suspended' | 'closed' | 'breached'
  email_sent: boolean
  email_sent_at?: string
  delivered_at: string
  last_updated: string
}

export interface CryptoAddress {
  id: string
  crypto_name: string
  network: string
  wallet_address: string
  qr_code_url?: string
  display_name: string
  is_active: boolean
  sort_order: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface EmailTemplate {
  id: string
  template_name: string
  template_type: 'account_delivery' | 'welcome' | 'phase_completion' | 'account_breach'
  subject: string
  html_content: string
  text_content?: string
  variables: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PaymentTransaction {
  id: string
  order_id: string
  user_id: string
  transaction_type: 'payment' | 'refund' | 'chargeback'
  amount: number
  currency: string
  provider?: 'lemon_squeezy' | 'nowpayments' | 'stripe' | 'manual'
  provider_transaction_id?: string
  provider_status?: string
  provider_response?: any
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  created_at: string
  processed_at?: string
  updated_at: string
}

// ============================================================================
// USER PROFILES
// ============================================================================

export const userProfileService = {
  // Test database connectivity
  async testConnection(): Promise<{ success: boolean; error?: any }> {
    try {
      console.log('🔍 Testing database connection...')
      const { error } = await supabase.from('user_profiles').select('count').limit(1)
      if (error) {
        console.error('❌ Database connection test failed:', error)
        return { success: false, error }
      }
      console.log('✅ Database connection test successful')
      return { success: true }
    } catch (error) {
      console.error('❌ Database connection test exception:', error)
      return { success: false, error }
    }
  },

  // Get user profile by ID
  async getProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    try {
      console.log('🔍 Fetching user profile for ID:', userId)

      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) {
        console.error('❌ Authentication error:', authError)
        return { data: null, error: authError }
      }

      if (!user) {
        console.error('❌ No authenticated user found')
        return { data: null, error: { message: 'No authenticated user' } }
      }

      console.log('✅ User authenticated:', user.id)

      // Add timeout to the query itself
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // Increased to 10 seconds

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .abortSignal(controller.signal)
        .single()

      clearTimeout(timeoutId)

      if (error) {
        console.error('❌ Database error fetching profile:', {
          error,
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details,
          userId,
          authenticatedUserId: user.id
        })
      } else {
        console.log('✅ Profile fetched successfully from database:', data)
      }

      return { data, error }
    } catch (error: any) {
      console.error('❌ Exception in getProfile:', {
        error,
        message: error.message,
        stack: error.stack,
        userId
      })
      return { data: null, error }
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get all user profiles (admin only)
  async getAllProfiles(): Promise<{ data: UserProfile[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update last login
  async updateLastLogin(userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId)

      return { error }
    } catch (error) {
      return { error }
    }
  }
}

// ============================================================================
// ORDERS
// ============================================================================

export const orderService = {
  // Create new order
  async createOrder(orderData: Partial<Order>): Promise<{ data: Order | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get user orders
  async getUserOrders(userId: string): Promise<{ data: Order[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get order by ID
  async getOrder(orderId: string): Promise<{ data: Order | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update order
  async updateOrder(orderId: string, updates: Partial<Order>): Promise<{ data: Order | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('order_id', orderId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get all orders (admin only)
  async getAllOrders(): Promise<{ data: Order[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles!inner(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update payment status
  async updatePaymentStatus(orderId: string, status: string, transactionId?: string): Promise<{ error: any }> {
    try {
      const updates: any = { 
        payment_status: status,
        updated_at: new Date().toISOString()
      }
      
      if (status === 'paid') {
        updates.paid_at = new Date().toISOString()
      }
      
      if (transactionId) {
        updates.transaction_id = transactionId
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('order_id', orderId)

      return { error }
    } catch (error) {
      return { error }
    }
  }
}

// ============================================================================
// TRADING RULES
// ============================================================================

export const tradingRulesService = {
  // Get trading rules by account type and size
  async getRules(accountType: string, accountSize: number): Promise<{ data: TradingRules | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('trading_rules')
        .select('*')
        .eq('account_type', accountType)
        .eq('account_size', accountSize)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get all trading rules
  async getAllRules(): Promise<{ data: TradingRules[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('trading_rules')
        .select('*')
        .order('account_type', { ascending: true })
        .order('account_size', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get rules by account type
  async getRulesByType(accountType: string): Promise<{ data: TradingRules[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('trading_rules')
        .select('*')
        .eq('account_type', accountType)
        .order('account_size', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update trading rules (admin only)
  async updateRules(id: string, updates: Partial<TradingRules>): Promise<{ data: TradingRules | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('trading_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================================================
// ACCOUNT CONTAINER
// ============================================================================

export const accountContainerService = {
  // Get available accounts by size and platform
  async getAvailableAccounts(accountSize: number, platformType: string): Promise<{ data: AccountContainer[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('account_container')
        .select('*')
        .eq('account_size', accountSize)
        .eq('platform_type', platformType)
        .eq('status', 'available')
        .order('created_at', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get all accounts (admin only)
  async getAllAccounts(): Promise<{ data: AccountContainer[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('account_container')
        .select('*')
        .order('account_size', { ascending: true })
        .order('platform_type', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Add new account (admin only)
  async addAccount(accountData: Partial<AccountContainer>): Promise<{ data: AccountContainer | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('account_container')
        .insert(accountData)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update account status
  async updateAccountStatus(id: string, status: string, orderId?: string): Promise<{ error: any }> {
    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      }

      if (orderId) {
        updates.reserved_for_order_id = orderId
        updates.reserved_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('account_container')
        .update(updates)
        .eq('id', id)

      return { error }
    } catch (error) {
      return { error }
    }
  },

  // Get account availability count
  async getAvailabilityCount(): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .rpc('get_available_accounts_count')

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================================================
// DELIVERED ACCOUNTS
// ============================================================================

export const deliveredAccountService = {
  // Get user's delivered accounts
  async getUserAccounts(userId: string): Promise<{ data: DeliveredAccount[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('delivered_accounts')
        .select(`
          *,
          trading_rules!inner(*)
        `)
        .eq('user_id', userId)
        .order('delivered_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get account by order ID
  async getAccountByOrder(orderId: string): Promise<{ data: DeliveredAccount | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('delivered_accounts')
        .select(`
          *,
          trading_rules!inner(*)
        `)
        .eq('order_id', orderId)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update account phase status
  async updatePhaseStatus(id: string, updates: Partial<DeliveredAccount>): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('delivered_accounts')
        .update({
          ...updates,
          last_updated: new Date().toISOString()
        })
        .eq('id', id)

      return { error }
    } catch (error) {
      return { error }
    }
  },

  // Get all delivered accounts (admin only)
  async getAllDeliveredAccounts(): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('delivered_accounts')
        .select(`
          *,
          user_profiles!inner(first_name, last_name, email),
          trading_rules!inner(*)
        `)
        .order('delivered_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Deliver account to user
  async deliverAccount(orderId: string, userId: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .rpc('deliver_account_to_user', {
          p_order_id: orderId,
          p_user_id: userId
        })

      // If account delivery was successful, send email notification
      if (data && data.success && !error) {
        try {
          // Import email service dynamically to avoid circular dependencies
          const { emailService } = await import('./email-service')

          await emailService.sendAccountDeliveryEmail(userId, {
            account_type: data.account_type,
            account_size: data.account_size,
            login_id: data.login_id,
            password: data.password,
            server_name: data.server_name,
            platform_type: data.platform_type
          })
        } catch (emailError) {
          console.error('Failed to send account delivery email:', emailError)
          // Don't fail the delivery if email fails
        }
      }

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================================================
// CRYPTO ADDRESSES
// ============================================================================

export const cryptoAddressService = {
  // Get all active crypto addresses
  async getActiveCryptoAddresses(): Promise<{ data: CryptoAddress[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('crypto_addresses')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get all crypto addresses (admin only)
  async getAllCryptoAddresses(): Promise<{ data: CryptoAddress[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('crypto_addresses')
        .select('*')
        .order('sort_order', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update crypto address (admin only)
  async updateCryptoAddress(id: string, updates: Partial<CryptoAddress>): Promise<{ data: CryptoAddress | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('crypto_addresses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Add new crypto address (admin only)
  async addCryptoAddress(addressData: Partial<CryptoAddress>): Promise<{ data: CryptoAddress | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('crypto_addresses')
        .insert(addressData)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

export const emailTemplateService = {
  // Get email template by name
  async getTemplate(templateName: string): Promise<{ data: EmailTemplate | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('template_name', templateName)
        .eq('is_active', true)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get all email templates (admin only)
  async getAllTemplates(): Promise<{ data: EmailTemplate[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('template_type', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update email template (admin only)
  async updateTemplate(id: string, updates: Partial<EmailTemplate>): Promise<{ data: EmailTemplate | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// ============================================================================
// PAYMENT TRANSACTIONS
// ============================================================================

export const paymentTransactionService = {
  // Create payment transaction
  async createTransaction(transactionData: Partial<PaymentTransaction>): Promise<{ data: PaymentTransaction | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert(transactionData)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get user transactions
  async getUserTransactions(userId: string): Promise<{ data: PaymentTransaction[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update transaction status
  async updateTransactionStatus(id: string, status: string, providerResponse?: any): Promise<{ error: any }> {
    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      }

      if (status === 'completed') {
        updates.processed_at = new Date().toISOString()
      }

      if (providerResponse) {
        updates.provider_response = providerResponse
      }

      const { error } = await supabase
        .from('payment_transactions')
        .update(updates)
        .eq('id', id)

      return { error }
    } catch (error) {
      return { error }
    }
  }
}

// ============================================================================
// FILE STORAGE HELPERS
// ============================================================================

export const storageService = {
  // Upload payment proof
  async uploadPaymentProof(file: File, orderId: string): Promise<{ data: string | null; error: any }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `payment-proofs/${orderId}-${Date.now()}.${fileExt}`

      const { error } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName)

      return { data: publicUrl, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Upload QR code
  async uploadQRCode(file: File, cryptoName: string): Promise<{ data: string | null; error: any }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `qr-codes/${cryptoName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`

      const { error } = await supabase.storage
        .from('qr-codes')
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('qr-codes')
        .getPublicUrl(fileName)

      return { data: publicUrl, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete file
  async deleteFile(bucket: string, path: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      return { error }
    } catch (error) {
      return { error }
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const databaseUtils = {
  // Format currency
  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  },

  // Format date
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Get account type display name
  getAccountTypeDisplayName: (accountType: string): string => {
    const displayNames: { [key: string]: string } = {
      'instant': 'Instant Funding',
      'hft': 'HFT Challenge',
      'one_step': 'One-Step Challenge',
      'two_step': 'Two-Step Challenge'
    }
    return displayNames[accountType] || accountType
  },

  // Get phase display name
  getPhaseDisplayName: (phase: string): string => {
    const displayNames: { [key: string]: string } = {
      'challenge': 'Challenge Phase',
      'phase_1': 'Phase 1',
      'phase_2': 'Phase 2',
      'live': 'Live Trading'
    }
    return displayNames[phase] || phase
  },

  // Get status color
  getStatusColor: (status: string): string => {
    const colors: { [key: string]: string } = {
      'active': 'text-green-400',
      'pending': 'text-yellow-400',
      'passed': 'text-green-400',
      'failed': 'text-red-400',
      'suspended': 'text-orange-400',
      'completed': 'text-green-400',
      'cancelled': 'text-gray-400',
      'paid': 'text-green-400',
      'delivered': 'text-green-400'
    }
    return colors[status] || 'text-gray-400'
  }
}
