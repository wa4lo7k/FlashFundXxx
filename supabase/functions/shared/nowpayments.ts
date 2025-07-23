// NowPayments API client for Supabase Edge Functions

import { 
  NowPaymentsCreatePaymentRequest, 
  NowPaymentsCreatePaymentResponse,
  PaymentStatusResponse 
} from './types.ts'

export class NowPaymentsClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.baseUrl = 'https://api.nowpayments.io/v1'
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`

    console.log(`Making request to: ${url}`)
    console.log('Request options:', {
      method: options.method || 'GET',
      headers: {
        'x-api-key': this.apiKey ? '[REDACTED]' : 'NOT_SET',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body
    })

    const response = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    console.log(`Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`NowPayments API error: ${response.status} - ${errorText}`)
      throw new Error(`NowPayments API error: ${response.status} - ${errorText}`)
    }

    const responseData = await response.json()
    console.log('Response data:', responseData)
    return responseData
  }

  async getApiStatus() {
    return this.makeRequest('/status')
  }

  async getCurrencies() {
    return this.makeRequest('/currencies')
  }

  async getEstimatePrice(amount: number, currencyFrom: string, currencyTo: string) {
    return this.makeRequest(
      `/estimate?amount=${amount}&currency_from=${currencyFrom}&currency_to=${currencyTo}`
    )
  }

  async createPayment(paymentData: NowPaymentsCreatePaymentRequest): Promise<NowPaymentsCreatePaymentResponse> {
    return this.makeRequest('/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
  }



  // Create invoice using NowPayments invoice API for hosted checkout
  async createPaymentForHostedCheckout(paymentData: {
    price_amount: number
    price_currency: string
    pay_currency: string // Add this parameter
    order_id: string
    order_description: string
    success_url?: string
    cancel_url?: string
    ipn_callback_url?: string
  }): Promise<{
    payment_id: string
    payment_status: string
    pay_address: string
    price_amount: number
    price_currency: string
    pay_amount: number
    pay_currency: string
    order_id: string
    order_description: string
    ipn_callback_url?: string
    created_at: string
    updated_at: string
    invoice_url?: string
  }> {
    console.log('Creating NowPayments invoice with data:', paymentData)

    try {
      // NowPayments invoice creation for hosted checkout
      const requestBody = {
        price_amount: paymentData.price_amount,
        price_currency: paymentData.price_currency,
        pay_currency: paymentData.pay_currency, // Currency is already mapped in the Edge Function
        order_id: paymentData.order_id,
        order_description: paymentData.order_description,
        ipn_callback_url: paymentData.ipn_callback_url,
        success_url: paymentData.success_url,
        cancel_url: paymentData.cancel_url
      }

      console.log('NowPayments invoice request body:', requestBody)

      const response = await this.makeRequest('/invoice', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      console.log('NowPayments invoice response:', response)

      // Check if invoice was created successfully
      const paymentId = response.id || response.payment_id
      if (!paymentId) {
        throw new Error('Invoice creation failed: No payment ID received from NowPayments')
      }

      // Generate hosted checkout URL using the correct format
      const invoiceUrl = response.invoice_url || `https://nowpayments.io/payment/?iid=${paymentId}`

      // Return standardized response format
      return {
        payment_id: paymentId,
        payment_status: response.payment_status || 'waiting',
        pay_address: response.pay_address || '',
        price_amount: response.price_amount || paymentData.price_amount,
        price_currency: response.price_currency || paymentData.price_currency,
        pay_amount: response.pay_amount || 0,
        pay_currency: response.pay_currency || paymentData.pay_currency,
        order_id: response.order_id || paymentData.order_id,
        order_description: response.order_description || paymentData.order_description,
        ipn_callback_url: response.ipn_callback_url,
        created_at: response.created_at || new Date().toISOString(),
        updated_at: response.updated_at || new Date().toISOString(),
        invoice_url: invoiceUrl
      }
    } catch (error) {
      console.error('Error creating NowPayments payment:', error)
      throw error
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await this.makeRequest(`/payment/${paymentId}`)
    return {
      success: true,
      payment: response
    }
  }

  async getMinimumPaymentAmount(currencyFrom: string, currencyTo: string) {
    return this.makeRequest(`/min-amount?currency_from=${currencyFrom}&currency_to=${currencyTo}`)
  }

  // Generate QR code for payment address
  generateQRCode(address: string, amount: number, currency: string): string {
    // For Bitcoin
    if (currency.toLowerCase() === 'btc') {
      return `bitcoin:${address}?amount=${amount}`
    }
    
    // For Ethereum and ERC-20 tokens
    if (currency.toLowerCase() === 'eth' || currency.toLowerCase() === 'usdt') {
      return `ethereum:${address}?value=${amount}`
    }
    
    // Generic format for other currencies
    return `${currency}:${address}?amount=${amount}`
  }

  // Validate webhook signature (if NowPayments provides signature verification)
  validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Implementation depends on NowPayments webhook signature method
    // This is a placeholder - check NowPayments documentation for actual implementation
    return true
  }
}

// Utility functions
export function formatCryptoAmount(amount: number, currency: string): string {
  const precision = getCryptoPrecision(currency)
  return amount.toFixed(precision)
}

export function getCryptoPrecision(currency: string): number {
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

export function generateOrderDescription(accountType: string, accountSize: number, platform: string): string {
  const accountTypeNames = {
    instant: 'Instant Account',
    hft: 'HFT Account',
    one_step: '1-Step Challenge',
    two_step: '2-Step Challenge'
  }
  
  const typeName = accountTypeNames[accountType as keyof typeof accountTypeNames] || accountType
  const sizeFormatted = accountSize >= 1000 
    ? `$${(accountSize / 1000).toFixed(0)}K` 
    : `$${accountSize}`
  
  return `FlashFundX ${typeName} - ${sizeFormatted} ${platform.toUpperCase()}`
}

// Error handling
export class NowPaymentsError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'NowPaymentsError'
  }
}

// Rate limiting helper
export class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private timeWindow: number

  constructor(maxRequests = 100, timeWindowMs = 60000) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindowMs
  }

  canMakeRequest(): boolean {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.timeWindow)
    
    if (this.requests.length >= this.maxRequests) {
      return false
    }
    
    this.requests.push(now)
    return true
  }

  getTimeUntilReset(): number {
    if (this.requests.length === 0) return 0
    
    const oldestRequest = Math.min(...this.requests)
    const timeUntilReset = this.timeWindow - (Date.now() - oldestRequest)
    
    return Math.max(0, timeUntilReset)
  }
}
