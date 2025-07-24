// NowPayments integration for FlashFundX frontend

import { supabase } from './supabaseClient'

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

export interface PaymentResponse {
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

export interface PaymentStatusResponse {
  success: boolean
  order?: {
    order_id: string
    order_status: string
    payment_status: string
    delivery_status: string
    account_type: string
    account_size: number
    platform_type: string
    amount: number
    final_amount: number
    crypto_currency: string
    crypto_amount: number
    crypto_address: string
    created_at: string
    updated_at: string
  }
  payment?: {
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
  error?: string
}

class NowPaymentsService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + '/functions/v1'
  }

  async createPayment(paymentData: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('🚀 Creating REAL NowPayments payment:', paymentData)

      const { data, error } = await supabase.functions.invoke('create-crypto-payment', {
        body: paymentData
      })

      console.log('📡 Edge Function response:', { data, error })

      if (error) {
        console.error('❌ Error creating payment:', error)
        return {
          success: false,
          error: error.message || 'Failed to create payment'
        }
      }

      if (!data || !data.success) {
        console.error('❌ Payment creation failed:', data)
        return {
          success: false,
          error: data?.error || 'Payment creation failed'
        }
      }

      console.log('✅ REAL Payment created successfully:', data)
      return data as PaymentResponse

    } catch (error) {
      console.error('❌ Error in createPayment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Mock methods removed - using REAL NowPayments integration only



  async checkPaymentStatus(orderId: string, userId: string): Promise<PaymentStatusResponse> {
    try {
      console.log('Checking payment status for order:', orderId)

      const { data, error } = await supabase.functions.invoke('check-payment-status', {
        method: 'GET',
        body: { orderId, userId }
      })

      if (error) {
        console.error('Error checking payment status:', error)
        return {
          success: false,
          error: error.message || 'Failed to check payment status'
        }
      }

      console.log('Payment status retrieved:', data)
      return data as PaymentStatusResponse

    } catch (error) {
      console.error('Error in checkPaymentStatus:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // All mock/database methods removed - using REAL NowPayments Edge Functions only

  // Generate QR code data URL for display
  generateQRCodeDataUrl(address: string, amount: number, currency: string): string {
    // This would typically use a QR code library
    // For now, return a placeholder
    const qrData = `${currency}:${address}?amount=${amount}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrData)}`
  }

  // Format crypto amount with proper precision
  formatCryptoAmount(amount: number, currency: string): string {
    const precision = this.getCryptoPrecision(currency)
    return amount.toFixed(precision)
  }

  private getCryptoPrecision(currency: string): number {
    const precisionMap: Record<string, number> = {
      btc: 8,
      eth: 8,
      usdt: 6,
      bnb: 8,
      trx: 6,
      ltc: 8,
      bch: 8,
      ada: 6,
      dot: 6,
      sol: 6,
    }
    
    return precisionMap[currency.toLowerCase()] || 8
  }

  // Get supported cryptocurrencies
  getSupportedCryptocurrencies() {
    return [
      { value: 'btc', label: 'Bitcoin', symbol: 'BTC' },
      { value: 'eth', label: 'Ethereum', symbol: 'ETH' },
      { value: 'usdt', label: 'Tether', symbol: 'USDT' },
      { value: 'bnb', label: 'Binance Coin', symbol: 'BNB' },
      { value: 'trx', label: 'Tron', symbol: 'TRX' },
      { value: 'ltc', label: 'Litecoin', symbol: 'LTC' },
      { value: 'bch', label: 'Bitcoin Cash', symbol: 'BCH' },
      { value: 'ada', label: 'Cardano', symbol: 'ADA' },
      { value: 'dot', label: 'Polkadot', symbol: 'DOT' },
      { value: 'sol', label: 'Solana', symbol: 'SOL' },
    ]
  }

  // Map crypto currency values to display names
  getCryptoCurrencyName(value: string): string {
    const currencies = this.getSupportedCryptocurrencies()
    const currency = currencies.find(c => c.value === value)
    return currency ? currency.label : value.toUpperCase()
  }

  // Check if payment is complete
  isPaymentComplete(paymentStatus: string): boolean {
    return ['confirmed', 'finished'].includes(paymentStatus)
  }

  // Check if payment failed
  isPaymentFailed(paymentStatus: string): boolean {
    return ['failed', 'expired', 'refunded'].includes(paymentStatus)
  }

  // Check if payment is pending
  isPaymentPending(paymentStatus: string): boolean {
    return ['waiting', 'confirming', 'partially_paid'].includes(paymentStatus)
  }

  // Get payment status display text
  getPaymentStatusText(paymentStatus: string): string {
    const statusMap: Record<string, string> = {
      waiting: 'Waiting for Payment',
      confirming: 'Confirming Payment',
      confirmed: 'Payment Confirmed',
      finished: 'Payment Complete',
      partially_paid: 'Partially Paid',
      failed: 'Payment Failed',
      expired: 'Payment Expired',
      refunded: 'Payment Refunded',
      sending: 'Processing Payment'
    }
    
    return statusMap[paymentStatus] || paymentStatus
  }

  // Get payment status color
  getPaymentStatusColor(paymentStatus: string): string {
    if (this.isPaymentComplete(paymentStatus)) return 'text-emerald-400'
    if (this.isPaymentFailed(paymentStatus)) return 'text-red-400'
    if (this.isPaymentPending(paymentStatus)) return 'text-yellow-400'
    return 'text-slate-400'
  }
}

// Export singleton instance
export const nowPaymentsService = new NowPaymentsService()

// Export types
export type {
  CreatePaymentRequest as NowPaymentsCreatePaymentRequest,
  PaymentResponse as NowPaymentsPaymentResponse,
  PaymentStatusResponse as NowPaymentsPaymentStatusResponse
}
