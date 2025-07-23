// Shared TypeScript types for NowPayments integration

export interface CreatePaymentRequest {
  orderId: string
  userId: string
  accountType: 'instant' | 'hft' | 'one_step' | 'two_step'
  accountSize: number
  platformType: 'mt4' | 'mt5'
  cryptoCurrency: string
  amount: number
  finalAmount: number
}

export interface NowPaymentsCreatePaymentRequest {
  price_amount: number
  price_currency: string
  pay_currency: string
  ipn_callback_url: string
  order_id: string
  order_description: string
  success_url?: string
  cancel_url?: string
}

export interface NowPaymentsCreatePaymentResponse {
  payment_id: string
  payment_status: string
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  pay_currency: string
  order_id: string
  order_description: string
  ipn_callback_url: string
  created_at: string
  updated_at: string
  purchase_id: string
  amount_received: number
  payin_extra_id?: string
  smart_contract?: string
  network?: string
  network_precision?: number
  time_limit?: string
  burning_percent?: number
  expiration_estimate_date?: string
}

export interface NowPaymentsWebhookPayload {
  payment_id: string
  payment_status: 'waiting' | 'confirming' | 'confirmed' | 'sending' | 'partially_paid' | 'finished' | 'failed' | 'refunded' | 'expired'
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  actually_paid: number
  pay_currency: string
  order_id: string
  order_description: string
  purchase_id: string
  created_at: string
  updated_at: string
  outcome_amount: number
  outcome_currency: string
}

export interface DatabaseOrder {
  id: string
  order_id: string
  user_id: string
  account_type: string
  account_size: number
  platform_type: string
  amount: number
  final_amount: number
  order_status: string
  payment_status: string
  delivery_status: string
  payment_method: string
  payment_provider_id?: string
  crypto_currency?: string
  crypto_amount?: number
  crypto_address?: string
  created_at: string
  updated_at: string
}

export interface PaymentStatusResponse {
  success: boolean
  payment: {
    payment_id: string
    payment_status: string
    pay_address: string
    pay_amount: number
    actually_paid: number
    pay_currency: string
    order_id: string
    created_at: string
    updated_at: string
  }
}

export interface CreatePaymentResponse {
  success: boolean
  invoice_url?: string // For hosted payment page redirect
  payment?: {
    payment_id: string
    pay_address: string
    pay_amount: number
    pay_currency: string
    qr_code?: string
    time_limit?: string
    expiration_date?: string
  }
  error?: string
}

// Account type configurations
export const ACCOUNT_TYPES = {
  instant: {
    name: 'Instant Account',
    description: 'Direct live trading account'
  },
  hft: {
    name: 'HFT Account', 
    description: 'High-frequency trading challenge'
  },
  one_step: {
    name: '1-Step Evaluation',
    description: 'Single phase challenge'
  },
  two_step: {
    name: '2-Step Evaluation', 
    description: 'Traditional two-phase challenge'
  }
} as const

// Supported cryptocurrencies
export const SUPPORTED_CRYPTOCURRENCIES = [
  'btc', 'eth', 'usdt', 'bnb', 'trx', 'ltc', 'bch', 'ada', 'dot', 'sol'
] as const

export type SupportedCryptoCurrency = typeof SUPPORTED_CRYPTOCURRENCIES[number]
