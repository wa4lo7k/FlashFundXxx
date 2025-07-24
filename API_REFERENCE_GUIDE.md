# FlashFundX API Reference Guide

## Overview

This document provides detailed API specifications for all FlashFundX Edge Functions with complete request/response examples, error handling, and integration patterns.

## Base Configuration

- **Base URL**: `https://[project-id].supabase.co/functions/v1/`
- **Authentication**: Supabase JWT token in Authorization header
- **Content-Type**: `application/json`
- **CORS**: Enabled for all origins with credentials

## Authentication

All user-facing endpoints require Supabase authentication:

```javascript
// Frontend authentication example
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)

// Get authenticated user token
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

// Use token in API calls
const response = await fetch('/functions/v1/create-crypto-payment', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestData)
})
```

## Edge Function Endpoints

### 1. Create Crypto Payment

Creates a new cryptocurrency payment through NowPayments and returns hosted checkout URL.

#### Endpoint Details
- **URL**: `POST /create-crypto-payment`
- **Authentication**: Required (Supabase Auth)
- **Rate Limit**: 10 requests per minute per user
- **Timeout**: 30 seconds

#### Request Schema
```typescript
interface CreatePaymentRequest {
  orderId: string              // FFX order ID (e.g., "FFX123456789")
  userId: string               // Supabase user UUID
  accountType: 'instant' | 'hft' | 'one_step' | 'two_step'
  accountSize: number          // Account size (10000, 25000, 50000, 100000, 200000)
  platformType: 'mt4' | 'mt5'  // Trading platform
  cryptoCurrency: string       // Frontend currency code
  amount: number               // Original amount in USD
  finalAmount: number          // Final amount after discounts
}
```

#### Supported Cryptocurrencies
| Frontend Code | NowPayments Code | Network | Description |
|---------------|------------------|---------|-------------|
| `usdt_bsc` | `usdtbsc` | BSC | USDT on Binance Smart Chain |
| `usdt_polygon` | `usdtmatic` | Polygon | USDT on Polygon |
| `usdt_trc20` | `usdttrc20` | Tron | USDT on Tron |
| `bnb` | `bnbbsc` | BSC | BNB on Binance Smart Chain |
| `btc` | `btc` | Bitcoin | Bitcoin |
| `trx` | `trx` | Tron | Tron |

#### Complete Request Example
```bash
curl -X POST https://your-project.supabase.co/functions/v1/create-crypto-payment \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "FFX123456789",
    "userId": "aa44f489-ffbc-4ca4-a9fb-1a86452ddfb6",
    "accountType": "one_step",
    "accountSize": 10000,
    "platformType": "mt4",
    "cryptoCurrency": "usdt_bsc",
    "amount": 649,
    "finalAmount": 649
  }'
```

#### Response Schema
```typescript
interface CreatePaymentResponse {
  success: boolean
  invoice_url?: string         // NowPayments hosted checkout URL
  payment?: {
    payment_id: string         // NowPayments payment ID
    pay_address: string        // Crypto wallet address
    pay_amount: number         // Amount to pay in crypto
    pay_currency: string       // Cryptocurrency code
    qr_code?: string          // QR code for payment (empty for hosted)
    time_limit?: string       // Payment time limit
    expiration_date?: string  // Payment expiration
  }
  error?: string              // Error message if failed
}
```

#### Success Response Examples

**Hosted Checkout Success (200)**
```json
{
  "success": true,
  "invoice_url": "https://nowpayments.io/payment/?iid=12345678",
  "payment": {
    "payment_id": "5514469786",
    "pay_address": "0x742d35Cc6634C0532925a3b8D4C9db96DfbBfC88",
    "pay_amount": 649.50,
    "pay_currency": "usdtbsc",
    "qr_code": "",
    "time_limit": "",
    "expiration_date": ""
  }
}
```

#### Error Response Examples

**400 - Missing Required Fields**
```json
{
  "success": false,
  "error": "Missing required fields: orderId, userId"
}
```

**400 - Invalid Account Type**
```json
{
  "success": false,
  "error": "Invalid account type. Must be one of: instant, hft, one_step, two_step"
}
```

**400 - Order Not Payable**
```json
{
  "success": false,
  "error": "Order is not in a payable state"
}
```

**404 - Order Not Found**
```json
{
  "success": false,
  "error": "Order not found"
}
```

**403 - Unauthorized Access**
```json
{
  "success": false,
  "error": "Unauthorized: Order does not belong to user"
}
```

**500 - NowPayments API Error**
```json
{
  "success": false,
  "error": "NowPayments error: Invalid currency or insufficient balance"
}
```

#### Integration Example

```javascript
// Frontend integration example
async function createCryptoPayment(orderData) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch('/functions/v1/create-crypto-payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: orderData.orderId,
        userId: session.user.id,
        accountType: orderData.accountType,
        accountSize: orderData.accountSize,
        platformType: orderData.platformType,
        cryptoCurrency: orderData.selectedCrypto,
        amount: orderData.amount,
        finalAmount: orderData.finalAmount
      })
    })

    const result = await response.json()

    if (result.success && result.invoice_url) {
      // Redirect user to NowPayments hosted checkout
      window.location.href = result.invoice_url
    } else {
      throw new Error(result.error || 'Payment creation failed')
    }
  } catch (error) {
    console.error('Payment creation error:', error)
    // Handle error (show user message, etc.)
  }
}
```

### 2. Check Payment Status

Retrieves current payment and order status for a specific order.

#### Endpoint Details
- **URL**: `GET /check-payment-status`
- **Authentication**: Required (Supabase Auth)
- **Rate Limit**: 60 requests per minute per user
- **Timeout**: 15 seconds

#### Query Parameters
- `orderId` (required): FFX order ID
- `userId` (required): Supabase user UUID

#### Request Example
```bash
curl -X GET "https://your-project.supabase.co/functions/v1/check-payment-status?orderId=FFX123456789&userId=aa44f489-ffbc-4ca4-a9fb-1a86452ddfb6" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response Schema
```typescript
interface PaymentStatusResponse {
  success: boolean
  order?: {
    order_id: string
    order_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    delivery_status: 'pending' | 'delivered' | 'failed'
    account_type: string
    account_size: number
    platform_type: string
    amount: number
    final_amount: number
    crypto_currency?: string
    crypto_amount?: number
    crypto_address?: string
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
```

#### Success Response Example
```json
{
  "success": true,
  "order": {
    "order_id": "FFX123456789",
    "order_status": "processing",
    "payment_status": "pending",
    "delivery_status": "pending",
    "account_type": "one_step",
    "account_size": 10000,
    "platform_type": "mt4",
    "amount": 649,
    "final_amount": 649,
    "crypto_currency": "btc",
    "crypto_amount": 0.02456789,
    "crypto_address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:05:00Z"
  },
  "payment": {
    "payment_id": "12345",
    "payment_status": "waiting",
    "pay_address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "pay_amount": 0.02456789,
    "actually_paid": 0,
    "pay_currency": "btc",
    "order_id": "FFX123456789",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

#### Payment Status Values
- `waiting`: Payment created, waiting for user to send crypto
- `confirming`: Payment received, waiting for blockchain confirmations
- `confirmed`: Payment confirmed, processing order
- `finished`: Payment complete, order fulfilled
- `partially_paid`: Partial payment received
- `failed`: Payment failed or expired
- `refunded`: Payment refunded

#### Integration Example
```javascript
// Poll payment status
async function checkPaymentStatus(orderId, userId) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    const response = await fetch(
      `/functions/v1/check-payment-status?orderId=${orderId}&userId=${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      }
    )

    const result = await response.json()
    
    if (result.success) {
      return {
        orderStatus: result.order.order_status,
        paymentStatus: result.order.payment_status,
        deliveryStatus: result.order.delivery_status,
        paymentDetails: result.payment
      }
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Status check error:', error)
    throw error
  }
}

// Usage with polling
const pollPaymentStatus = async (orderId, userId) => {
  const maxAttempts = 60 // 5 minutes with 5-second intervals
  let attempts = 0

  const poll = async () => {
    try {
      const status = await checkPaymentStatus(orderId, userId)
      
      if (status.paymentStatus === 'paid' && status.deliveryStatus === 'delivered') {
        // Payment complete and account delivered
        return status
      } else if (status.paymentStatus === 'failed') {
        throw new Error('Payment failed')
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(poll, 5000) // Check again in 5 seconds
      } else {
        throw new Error('Payment timeout')
      }
    } catch (error) {
      console.error('Polling error:', error)
      throw error
    }
  }

  return poll()
}
```

### 3. Payment Webhook

Handles NowPayments webhook notifications to update payment status and trigger account delivery.

#### Endpoint Details
- **URL**: `POST /payment-webhook`
- **Authentication**: None (Webhook endpoint)
- **Rate Limit**: None (webhook endpoint)
- **Timeout**: 30 seconds

#### Webhook Configuration
Configure this URL in your NowPayments dashboard:
```
https://your-project.supabase.co/functions/v1/payment-webhook
```

#### Webhook Payload Schema
```typescript
interface NowPaymentsWebhookPayload {
  payment_id: string
  payment_status: 'waiting' | 'confirming' | 'confirmed' | 'sending' |
                  'partially_paid' | 'finished' | 'failed' | 'refunded' | 'expired'
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
```

#### Webhook Processing Logic
1. **Validate Payload**: Check required fields are present
2. **Find Order**: Locate order by order_id in database
3. **Update Status**: Update payment and order status based on webhook
4. **Trigger Delivery**: Automatically deliver account on payment confirmation
5. **Log Event**: Record webhook event for audit trail

#### Status Mapping
| NowPayments Status | Order Status | Payment Status | Action |
|-------------------|--------------|----------------|---------|
| `waiting` | `processing` | `pending` | Log event |
| `confirming` | `processing` | `pending` | Log event |
| `confirmed` | `processing` | `paid` | Update status |
| `finished` | `completed` | `paid` | Trigger delivery |
| `failed` | `failed` | `failed` | Mark failed |
| `expired` | `failed` | `failed` | Mark expired |
| `refunded` | `refunded` | `refunded` | Process refund |

#### Success Response
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

#### Error Responses
```json
// Invalid payload
{
  "success": false,
  "error": "Invalid payload"
}

// Order not found
{
  "success": false,
  "error": "Order not found"
}
```

### 4. Test Delivery

Debug and test the account delivery process for troubleshooting.

#### Endpoint Details
- **URL**: `POST /test-delivery`
- **Authentication**: Service Role Key required
- **Rate Limit**: 10 requests per minute
- **Timeout**: 60 seconds

#### Request Headers
```http
Authorization: Bearer <service-role-key>
Content-Type: application/json
```

#### Request Body
```json
{
  "orderId": "FFX123456789"
}
```

#### Response Schema
```typescript
interface TestDeliveryResponse {
  orderId: string
  timestamp: string
  tests: {
    order_check: {
      success: boolean
      order?: DatabaseOrder
      error?: string
    }
    trading_rules_check: {
      success: boolean
      rules?: TradingRule[]
      error?: string
      searched_for: {
        account_type: string
        account_size: number
      }
    }
    available_accounts_check: {
      success: boolean
      accounts?: AccountContainer[]
      error?: string
      searched_for: {
        account_size: number
        platform_type: string
        status: string
      }
    }
    delivery_function_test: {
      success: boolean
      result?: any
      error?: string
    }
    environment_check: {
      supabase_url: boolean
      service_key: boolean
      service_key_length: number
    }
  }
}
```

#### Example Usage
```bash
curl -X POST https://your-project.supabase.co/functions/v1/test-delivery \
  -H "Authorization: Bearer service-role-key-here" \
  -H "Content-Type: application/json" \
  -d '{"orderId": "FFX123456789"}'
```

#### Success Response Example
```json
{
  "orderId": "FFX433073137",
  "timestamp": "2025-07-22T21:08:40.859Z",
  "tests": {
    "order_check": {
      "success": true,
      "order": {
        "id": "591c4190-6848-4ade-9ff5-b6831fe329d8",
        "order_id": "FFX433073137",
        "user_id": "aa44f489-ffbc-4ca4-a9fb-1a86452ddfb6",
        "account_type": "two_step",
        "account_size": 1000,
        "platform_type": "mt5",
        "order_status": "processing",
        "payment_status": "pending",
        "delivery_status": "pending"
      }
    },
    "trading_rules_check": {
      "success": true,
      "rules": [
        {
          "id": "2358e62c-0781-4462-8520-227a8486e944",
          "account_type": "two_step",
          "account_size": 1000,
          "phase_1_profit_target": 80,
          "phase_1_max_daily_loss": 50,
          "phase_1_max_total_loss": 100,
          "phase_2_profit_target": 50,
          "phase_2_max_daily_loss": 50,
          "phase_2_max_total_loss": 100,
          "live_max_daily_loss": 50,
          "live_max_total_loss": 100,
          "profit_share_percentage": 80
        }
      ],
      "searched_for": {
        "account_type": "two_step",
        "account_size": 1000
      }
    },
    "available_accounts_check": {
      "success": true,
      "accounts": [
        {
          "id": "b7fceaba-8f3e-42df-bdd0-aad7d5ae123f",
          "account_size": 1000,
          "platform_type": "mt5",
          "server_name": "FlashFundX-Live01",
          "login_id": "12345678",
          "password": "password123",
          "investor_password": "investor123",
          "status": "available"
        }
      ],
      "searched_for": {
        "account_size": 1000,
        "platform_type": "mt5",
        "status": "available"
      }
    },
    "delivery_function_test": {
      "success": false,
      "result": {
        "error": "Order not paid",
        "success": false
      }
    },
    "environment_check": {
      "supabase_url": true,
      "service_key": true,
      "service_key_length": 219
    }
  }
}
```

### 5. Webhook Debug

Debug webhook calls from NowPayments for troubleshooting webhook delivery issues.

#### Endpoint Details
- **URL**: `POST /webhook-debug`
- **Authentication**: None
- **Rate Limit**: None
- **Timeout**: 30 seconds

#### Purpose
- Log all incoming webhook requests
- Capture headers, body, and metadata
- Help troubleshoot webhook delivery issues
- Return success response to prevent retries

#### Response
```json
{
  "success": true,
  "message": "Webhook debug received",
  "timestamp": "2025-07-22T21:08:40.859Z"
}
```

#### Usage
Configure as temporary webhook URL in NowPayments dashboard to debug webhook issues:
```
https://your-project.supabase.co/functions/v1/webhook-debug
```

## Error Handling

### Standard Error Response Format
```typescript
interface ErrorResponse {
  success: false
  error: string
  details?: any
}
```

### HTTP Status Codes
- **200**: Success
- **400**: Bad Request (invalid parameters, missing fields)
- **401**: Unauthorized (invalid or missing authentication)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **405**: Method Not Allowed (wrong HTTP method)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error (server-side error)

### Rate Limiting
- **User endpoints**: 60 requests per minute per user
- **Payment creation**: 10 requests per minute per user
- **Webhook endpoints**: No rate limiting
- **Admin endpoints**: 100 requests per minute

### CORS Configuration
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}
```

## Integration Best Practices

### 1. Authentication Management
```javascript
// Refresh token before API calls
const ensureValidSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    // Redirect to login
    window.location.href = '/login'
    return null
  }

  // Check if token expires soon (within 5 minutes)
  const expiresAt = session.expires_at * 1000
  const fiveMinutes = 5 * 60 * 1000

  if (Date.now() + fiveMinutes > expiresAt) {
    const { data: { session: newSession } } = await supabase.auth.refreshSession()
    return newSession
  }

  return session
}
```

### 2. Error Handling
```javascript
const handleApiError = (error, response) => {
  if (response.status === 401) {
    // Redirect to login
    window.location.href = '/login'
  } else if (response.status === 429) {
    // Rate limited - show retry message
    showMessage('Too many requests. Please wait and try again.')
  } else if (response.status >= 500) {
    // Server error - show generic message
    showMessage('Service temporarily unavailable. Please try again later.')
  } else {
    // Show specific error message
    showMessage(error.error || 'An error occurred')
  }
}
```

### 3. Payment Flow Implementation
```javascript
const processPayment = async (orderData) => {
  try {
    // 1. Create payment
    const payment = await createCryptoPayment(orderData)

    // 2. Redirect to payment page
    window.location.href = payment.invoice_url

    // 3. On return, poll for status
    // (This would be on a return/success page)
    const finalStatus = await pollPaymentStatus(orderData.orderId, orderData.userId)

    if (finalStatus.deliveryStatus === 'delivered') {
      // Show success and account details
      showAccountDelivered(finalStatus)
    }
  } catch (error) {
    handleApiError(error)
  }
}
```
```
