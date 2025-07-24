# FlashFundX Backend Technical Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Backend Architecture & Core Functionalities](#backend-architecture--core-functionalities)
3. [Complete API Reference](#complete-api-reference)
4. [Admin Panel System](#admin-panel-system)
5. [Technical Implementation Deep Dive](#technical-implementation-deep-dive)
6. [Deployment & Operations](#deployment--operations)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## System Overview

FlashFundX is a comprehensive prop trading firm platform that automates the entire customer journey from order creation through cryptocurrency payment processing to MT4/MT5 trading account delivery. The system is built on Supabase with Edge Functions handling business logic and NowPayments providing cryptocurrency payment processing.

### Key Components

- **Supabase Backend**: Database, authentication, and Edge Functions
- **NowPayments Integration**: Cryptocurrency payment processing
- **Automated Account Delivery**: MT4/MT5 account provisioning system
- **Admin Management Panel**: Order tracking and account management
- **Row Level Security**: Data protection and access control

### System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase       │    │   NowPayments   │
│   (Next.js)     │◄──►│   Edge Functions │◄──►│   API           │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   PostgreSQL     │
                       │   Database       │
                       └──────────────────┘
```

---

## Backend Architecture & Core Functionalities

### Edge Functions Overview

The FlashFundX backend consists of 5 specialized Edge Functions that handle the complete payment and delivery workflow:

| Function | Purpose | Method | Authentication |
|----------|---------|--------|----------------|
| `create-crypto-payment` | Create NowPayments crypto payment | POST | Supabase Auth |
| `payment-webhook` | Handle payment status updates | POST | None (Webhook) |
| `check-payment-status` | Check payment and order status | GET | Supabase Auth |
| `test-delivery` | Debug account delivery process | POST | Service Role |
| `webhook-debug` | Debug webhook calls | POST | None |

### 1. Create Crypto Payment Function

**Purpose**: Creates a cryptocurrency payment through NowPayments API and updates order status.

**Location**: `supabase/functions/create-crypto-payment/index.ts`

**Key Features**:
- Validates order data and user authentication
- Maps frontend currency codes to NowPayments format
- Creates hosted checkout payment via NowPayments
- Updates order with payment details
- Returns invoice URL for user redirect

**Business Logic Flow**:
1. Validate request data and required fields
2. Authenticate user and verify order ownership
3. Check order is in payable state (pending/pending/pending)
4. Map cryptocurrency currency codes
5. Create NowPayments hosted checkout
6. Update order with payment provider details
7. Return invoice URL for redirect

### 2. Payment Webhook Function

**Purpose**: Processes NowPayments webhook notifications to update payment status and trigger account delivery.

**Location**: `supabase/functions/payment-webhook/index.ts`

**Key Features**:
- Handles all NowPayments webhook events
- Updates payment and order status based on webhook data
- Triggers automatic account delivery on payment confirmation
- Logs all payment events for audit trail
- Supports all payment states (waiting, confirming, confirmed, finished, failed, etc.)

**Payment Status Mapping**:
- `waiting` → Order status: processing, Payment status: pending
- `confirming` → Order status: processing, Payment status: pending
- `confirmed` → Order status: processing, Payment status: paid
- `finished` → Order status: completed, Payment status: paid + Trigger delivery
- `failed/expired/refunded` → Order status: failed, Payment status: failed

### 3. Check Payment Status Function

**Purpose**: Allows users to check current payment and order status.

**Location**: `supabase/functions/check-payment-status/index.ts`

**Key Features**:
- Validates user authentication and order ownership
- Fetches current payment status from NowPayments
- Returns combined order and payment information
- Provides real-time payment progress updates

### 4. Test Delivery Function

**Purpose**: Debug and test the account delivery process.

**Location**: `supabase/functions/test-delivery/index.ts`

**Key Features**:
- Comprehensive delivery system testing
- Validates order existence and trading rules
- Checks available account inventory
- Tests delivery function execution
- Environment configuration validation

### 5. Webhook Debug Function

**Purpose**: Debug webhook calls from NowPayments for troubleshooting.

**Location**: `supabase/functions/webhook-debug/index.ts`

**Key Features**:
- Logs all incoming webhook requests
- Captures headers, body, and metadata
- Helps troubleshoot webhook delivery issues
- Returns success response to prevent retries

---

## Database Schema Architecture

### Core Tables

#### 1. user_profiles
Stores complete user information with signup details.

**Key Fields**:
- `id` (UUID): References auth.users(id)
- `first_name`, `last_name`, `email`: User identity
- `password`: Stored for admin portal viewing
- `account_status`: active/suspended/banned
- `total_orders`, `total_spent`: User statistics

#### 2. orders
Central order management with FFX order IDs.

**Key Fields**:
- `order_id` (TEXT): Auto-generated FFX + 9 digits
- `account_type`: instant/hft/one_step/two_step
- `account_size`: Trading account size
- `platform_type`: mt4/mt5
- `order_status`: pending/processing/completed/failed/cancelled/refunded
- `payment_status`: pending/paid/failed/refunded
- `delivery_status`: pending/delivered/failed
- `payment_provider_id`: NowPayments payment ID
- `crypto_currency`, `crypto_amount`, `crypto_address`: Payment details

#### 3. trading_rules
Fixed rules by account type and size.

**Key Fields**:
- `account_type`, `account_size`: Unique combination
- Challenge rules: `challenge_profit_target`, `challenge_max_daily_loss`, etc.
- Phase rules: `phase_1_profit_target`, `phase_2_profit_target`, etc.
- Live rules: `live_max_daily_loss`, `live_max_total_loss`
- `profit_share_percentage`: Default 80%

#### 4. account_container
MT4/MT5 account inventory management.

**Key Fields**:
- `account_size`, `platform_type`: Account specifications
- `server_name`, `login_id`, `password`, `investor_password`: Login details
- `status`: available/reserved/delivered/disabled
- `reserved_for_order_id`: Order reservation tracking

#### 5. delivered_accounts
Tracks delivered accounts with challenge progress.

**Key Fields**:
- Account details copied from container for historical record
- `current_phase`: challenge/phase_1/phase_2/live
- Phase status tracking: `challenge_status`, `phase_1_status`, `phase_2_status`, `live_status`
- `account_status`: active/suspended/closed/breached
- `email_sent`: Delivery notification tracking

#### 6. payment_transactions
Payment transaction logging and audit trail.

**Key Fields**:
- `transaction_type`: payment/refund/chargeback
- `provider`: lemon_squeezy/nowpayments/stripe/manual
- `provider_transaction_id`, `provider_response`: External system data
- `status`: pending/processing/completed/failed/cancelled

---

## NowPayments Integration

### API Configuration

**Base URL**: `https://api.nowpayments.io/v1`
**Authentication**: API Key in headers
**Webhook URL**: `https://[project-id].supabase.co/functions/v1/payment-webhook`

### Supported Cryptocurrencies

| Frontend Code | NowPayments Code | Description |
|---------------|------------------|-------------|
| `usdt_bsc` | `usdtbsc` | USDT on Binance Smart Chain |
| `usdt_polygon` | `usdtmatic` | USDT on Polygon |
| `usdt_trc20` | `usdttrc20` | USDT on Tron |
| `bnb` | `bnbbsc` | BNB on Binance Smart Chain |
| `btc` | `btc` | Bitcoin |
| `trx` | `trx` | Tron |

### Payment Workflow

1. **Payment Creation**: Frontend calls `create-crypto-payment`
2. **User Redirect**: User redirected to NowPayments hosted checkout
3. **Payment Processing**: User completes payment on NowPayments
4. **Webhook Notification**: NowPayments sends status updates
5. **Status Updates**: System updates order and payment status
6. **Account Delivery**: Automatic delivery on payment confirmation

---

## Automated Account Provisioning

### Delivery Function: `deliver_account_to_user`

**Purpose**: Automatically delivers trading accounts to users upon payment confirmation.

**Process**:
1. Validate order is paid and not already delivered
2. Find matching trading rules for account type/size
3. Reserve available account from container
4. Create delivered account record with proper phase setup
5. Update order status to completed
6. Update user statistics

**Phase Initialization by Account Type**:
- **Instant**: Direct to live phase (active)
- **HFT/One-Step**: Start with challenge phase (active)
- **Two-Step**: Start with phase_1 (active)

### Account Availability Tracking

**Function**: `get_available_accounts_count`
- Returns available account count by size and platform
- Used for inventory management and admin reporting
- Helps prevent overselling of account types

---

## Complete API Reference

### Base Configuration

**Base URL**: `https://[project-id].supabase.co/functions/v1/`
**Authentication**: Supabase JWT token in Authorization header
**Content-Type**: `application/json`
**CORS**: Enabled for all origins with credentials

### 1. Create Crypto Payment

**Endpoint**: `POST /create-crypto-payment`
**Purpose**: Create a new cryptocurrency payment through NowPayments
**Authentication**: Required (Supabase Auth)

#### Request Headers
```http
Authorization: Bearer <supabase-jwt-token>
Content-Type: application/json
```

#### Request Body
```typescript
interface CreatePaymentRequest {
  orderId: string              // FFX order ID (e.g., "FFX123456789")
  userId: string               // Supabase user UUID
  accountType: 'instant' | 'hft' | 'one_step' | 'two_step'
  accountSize: number          // Account size (e.g., 10000, 25000)
  platformType: 'mt4' | 'mt5'  // Trading platform
  cryptoCurrency: string       // Frontend currency code
  amount: number               // Original amount in USD
  finalAmount: number          // Final amount after discounts
}
```

#### Example Request
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

#### Response Format
```typescript
interface CreatePaymentResponse {
  success: boolean
  invoice_url?: string         // NowPayments hosted checkout URL
  payment?: {
    payment_id: string         // NowPayments payment ID
    pay_address: string        // Crypto wallet address
    pay_amount: number         // Amount to pay in crypto
    pay_currency: string       // Cryptocurrency code
    qr_code?: string          // QR code for payment
    time_limit?: string       // Payment time limit
    expiration_date?: string  // Payment expiration
  }
  error?: string              // Error message if failed
}
```

#### Success Response (200)
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

#### Error Responses

**400 Bad Request - Missing Fields**
```json
{
  "success": false,
  "error": "Missing required fields: orderId, userId"
}
```

**400 Bad Request - Order Not Payable**
```json
{
  "success": false,
  "error": "Order is not in a payable state"
}
```

**404 Not Found - Order Not Found**
```json
{
  "success": false,
  "error": "Order not found"
}
```

**500 Internal Server Error - NowPayments Error**
```json
{
  "success": false,
  "error": "NowPayments error: Invalid currency"
}
```

### 2. Check Payment Status

**Endpoint**: `GET /check-payment-status?orderId={orderId}&userId={userId}`
**Purpose**: Check current payment and order status
**Authentication**: Required (Supabase Auth)

#### Request Headers
```http
Authorization: Bearer <supabase-jwt-token>
```

#### Query Parameters
- `orderId` (required): FFX order ID
- `userId` (required): Supabase user UUID

#### Example Request
```bash
curl -X GET "https://your-project.supabase.co/functions/v1/check-payment-status?orderId=FFX123456789&userId=aa44f489-ffbc-4ca4-a9fb-1a86452ddfb6" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Success Response (200)
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

#### Error Responses

**400 Bad Request - Missing Parameters**
```json
{
  "success": false,
  "error": "Missing required parameters: orderId and userId"
}
```

**403 Forbidden - Unauthorized**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**404 Not Found - Order Not Found**
```json
{
  "success": false,
  "error": "Order not found"
}
```

**400 Bad Request - No Payment Found**
```json
{
  "success": false,
  "error": "No payment found for this order"
}
```

### 3. Payment Webhook

**Endpoint**: `POST /payment-webhook`
**Purpose**: Handle NowPayments webhook notifications
**Authentication**: None (Webhook endpoint)

#### Request Headers
```http
Content-Type: application/json
```

#### Webhook Payload
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

#### Success Response (200)
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

#### Error Responses

**400 Bad Request - Invalid Payload**
```json
{
  "success": false,
  "error": "Invalid payload"
}
```

**404 Not Found - Order Not Found**
```json
{
  "success": false,
  "error": "Order not found"
}
```

### 4. Test Delivery

**Endpoint**: `POST /test-delivery`
**Purpose**: Debug and test account delivery process
**Authentication**: Service Role Key

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

#### Success Response (200)
```json
{
  "orderId": "FFX123456789",
  "timestamp": "2025-07-22T21:08:40.859Z",
  "tests": {
    "order_check": {
      "success": true,
      "order": { /* order object */ }
    },
    "trading_rules_check": {
      "success": true,
      "rules": [ /* trading rules array */ ]
    },
    "available_accounts_check": {
      "success": true,
      "accounts": [ /* available accounts array */ ]
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

**Endpoint**: `POST /webhook-debug`
**Purpose**: Debug webhook calls for troubleshooting
**Authentication**: None

#### Success Response (200)
```json
{
  "success": true,
  "message": "Webhook debug received",
  "timestamp": "2025-07-22T21:08:40.859Z"
}
```

---

## Admin Panel System

### Database Admin Access

The FlashFundX system includes comprehensive admin capabilities through Row Level Security policies and dedicated admin functions.

#### Admin Authentication
- Admin access is granted to users with email: `admin@flashfundx.com`
- All admin policies check for this specific email address
- Admin users have full access to all tables and functions

### Admin-Accessible Tables

#### 1. User Management (`user_profiles`)
**Admin Capabilities**:
- View all user profiles and signup details
- Monitor user account status (active/suspended/banned)
- Track user statistics (total_orders, total_spent)
- View signup IP addresses and login history
- Access stored passwords for customer support

**Key Admin Queries**:
```sql
-- View all users with statistics
SELECT first_name, last_name, email, account_status,
       total_orders, total_spent, created_at
FROM user_profiles
ORDER BY created_at DESC;

-- Find users by email or name
SELECT * FROM user_profiles
WHERE email ILIKE '%search%' OR
      first_name ILIKE '%search%' OR
      last_name ILIKE '%search%';
```

#### 2. Order Management (`orders`)
**Admin Capabilities**:
- View all orders across all users
- Monitor order lifecycle (pending → processing → completed)
- Track payment status and delivery status
- Access payment provider details and transaction IDs
- View cryptocurrency payment information

**Key Admin Queries**:
```sql
-- View recent orders with user info
SELECT o.order_id, u.first_name, u.last_name, u.email,
       o.account_type, o.account_size, o.platform_type,
       o.final_amount, o.order_status, o.payment_status,
       o.delivery_status, o.created_at
FROM orders o
JOIN user_profiles u ON o.user_id = u.id
ORDER BY o.created_at DESC;

-- Find orders by status
SELECT * FROM orders
WHERE order_status = 'pending'
   OR payment_status = 'pending'
   OR delivery_status = 'pending';
```

#### 3. Account Container Management (`account_container`)
**Admin Capabilities**:
- Manage MT4/MT5 account inventory
- Add new accounts to the system
- Monitor account availability and reservations
- Update account status (available/reserved/delivered/disabled)
- View account login credentials

**Key Admin Functions**:
```sql
-- Check available account inventory
SELECT account_size, platform_type,
       COUNT(*) as total_accounts,
       COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
       COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered
FROM account_container
GROUP BY account_size, platform_type
ORDER BY account_size, platform_type;

-- Add new accounts to inventory
INSERT INTO account_container (
  account_size, platform_type, server_name,
  login_id, password, investor_password
) VALUES
(10000, 'mt4', 'FlashFundX-Live01', '12345678', 'password123', 'investor123');
```

#### 4. Delivered Accounts Tracking (`delivered_accounts`)
**Admin Capabilities**:
- Monitor all delivered accounts and their progress
- Track challenge phase completion
- View account breach status
- Monitor email delivery status
- Access complete account history

**Key Admin Queries**:
```sql
-- View delivered accounts with progress
SELECT da.order_id, u.first_name, u.last_name,
       da.account_type, da.account_size, da.platform_type,
       da.current_phase, da.phase_status, da.account_status,
       da.delivered_at
FROM delivered_accounts da
JOIN user_profiles u ON da.user_id = u.id
ORDER BY da.delivered_at DESC;

-- Monitor challenge progress
SELECT account_type, current_phase, phase_status,
       COUNT(*) as account_count
FROM delivered_accounts
GROUP BY account_type, current_phase, phase_status;
```

#### 5. Payment Transaction Monitoring (`payment_transactions`)
**Admin Capabilities**:
- View all payment transactions and their status
- Monitor payment provider responses
- Track refunds and chargebacks
- Access complete payment audit trail

### Admin Functions

#### 1. Account Delivery Function
```sql
-- Manually deliver account to user
SELECT deliver_account_to_user('FFX123456789', 'user-uuid-here');
```

#### 2. Available Accounts Report
```sql
-- Get inventory report
SELECT * FROM get_available_accounts_count();
```

#### 3. Business Metrics Queries

**Revenue Tracking**:
```sql
-- Daily revenue report
SELECT DATE(created_at) as date,
       COUNT(*) as orders,
       SUM(final_amount) as revenue
FROM orders
WHERE payment_status = 'paid'
  AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

**Conversion Rates**:
```sql
-- Payment conversion rates
SELECT
  COUNT(*) as total_orders,
  COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_orders,
  ROUND(
    COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) * 100.0 / COUNT(*), 2
  ) as conversion_rate
FROM orders
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
```

**Account Utilization**:
```sql
-- Account type popularity
SELECT account_type, account_size,
       COUNT(*) as orders,
       SUM(final_amount) as revenue
FROM orders
WHERE payment_status = 'paid'
GROUP BY account_type, account_size
ORDER BY orders DESC;
```

### Admin Audit Trail

The system includes comprehensive audit logging through the `admin_audit_log` table:

```sql
-- View recent admin actions
SELECT admin_email, action_type, table_name,
       description, created_at
FROM admin_audit_log
ORDER BY created_at DESC
LIMIT 50;
```

---

## Technical Implementation Deep Dive

### Database Functions and Triggers

#### 1. Order ID Generation
```sql
-- Generates unique FFX order IDs
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        new_id := 'FFX' || LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0');
        SELECT COUNT(*) INTO exists_check FROM public.orders WHERE order_id = new_id;
        IF exists_check = 0 THEN EXIT; END IF;
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;
```

#### 2. Automatic Timestamp Updates
```sql
-- Updates updated_at column on record changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### 3. User Profile Creation
```sql
-- Automatically creates user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (
        id, first_name, last_name, email, password,
        phone, country, marketing_consent
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'password', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'country', ''),
        COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::boolean, false)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Row Level Security Policies

#### User Data Protection
```sql
-- Users can only view their own profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can only view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);
```

#### Admin Access Control
```sql
-- Admins can access all data
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );
```

### Environment Variables

#### Required Production Variables
```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NowPayments Integration
NOWPAYMENTS_API_KEY=your-nowpayments-api-key
NOWPAYMENTS_IPN_SECRET=your-ipn-secret-key

# Frontend Configuration
FRONTEND_URL=https://your-domain.com
```

#### Security Considerations
- **Service Role Key**: Has full database access, store securely
- **API Keys**: Rotate regularly and monitor usage
- **IPN Secret**: Used for webhook signature validation
- **Environment Isolation**: Use different keys for staging/production

### Integration Architecture

#### Supabase Components
- **Database**: PostgreSQL with Row Level Security
- **Auth**: JWT-based authentication system
- **Edge Functions**: Deno runtime for serverless functions
- **Storage**: File uploads and QR code storage
- **Real-time**: WebSocket connections for live updates

#### NowPayments Integration
- **API Client**: Custom client with error handling
- **Webhook Processing**: Automatic status updates
- **Currency Mapping**: Frontend to NowPayments currency codes
- **Payment Tracking**: Complete audit trail

#### Error Handling Strategy
- **Graceful Degradation**: System continues operating with limited functionality
- **Retry Logic**: Automatic retries for transient failures
- **Logging**: Comprehensive error logging and monitoring
- **User Feedback**: Clear error messages for users

---

## Deployment & Operations

### Edge Function Deployment

#### Automated Deployment Script
```bash
#!/bin/bash
# deploy-edge-functions.sh

echo "🚀 Deploying FlashFundX Edge Functions..."

# Deploy all functions
supabase functions deploy create-crypto-payment
supabase functions deploy payment-webhook
supabase functions deploy check-payment-status
supabase functions deploy test-delivery
supabase functions deploy webhook-debug

echo "✅ All Edge Functions deployed successfully!"
```

#### Manual Deployment Commands
```bash
# Deploy individual functions
supabase functions deploy create-crypto-payment --project-ref your-project-id
supabase functions deploy payment-webhook --project-ref your-project-id
supabase functions deploy check-payment-status --project-ref your-project-id
supabase functions deploy test-delivery --project-ref your-project-id
supabase functions deploy webhook-debug --project-ref your-project-id
```

### Environment Setup

#### Production Environment Configuration
1. **Supabase Dashboard**:
   - Navigate to Project Settings → API
   - Copy Project URL and Service Role Key
   - Set environment variables in Edge Functions

2. **NowPayments Setup**:
   - Register at https://nowpayments.io/
   - Complete KYC verification
   - Generate API key and IPN secret
   - Configure webhook URL: `https://your-project.supabase.co/functions/v1/payment-webhook`

3. **Environment Variables**:
   ```bash
   # Set in Supabase Dashboard → Edge Functions → Settings
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NOWPAYMENTS_API_KEY=your-api-key
   NOWPAYMENTS_IPN_SECRET=your-ipn-secret
   FRONTEND_URL=https://your-domain.com
   ```

### Database Setup

#### Schema Deployment
```bash
# Apply database schema
psql -h db.your-project.supabase.co -U postgres -d postgres -f flashfundx-database-schema.sql
```

#### Initial Data Setup
```sql
-- Add sample trading accounts
INSERT INTO account_container (account_size, platform_type, server_name, login_id, password, investor_password)
VALUES
(10000, 'mt4', 'FlashFundX-Live01', '12345678', 'password123', 'investor123'),
(25000, 'mt4', 'FlashFundX-Live01', '12345679', 'password124', 'investor124'),
(50000, 'mt5', 'FlashFundX-Live02', '12345680', 'password125', 'investor125');

-- Update crypto addresses with real wallet addresses
UPDATE crypto_addresses
SET wallet_address = 'your-real-wallet-address'
WHERE crypto_name = 'USDT BEP20';
```

### Monitoring and Logging

#### Function Logs
```bash
# View Edge Function logs
supabase functions logs create-crypto-payment --project-ref your-project-id
supabase functions logs payment-webhook --project-ref your-project-id
```

#### Database Monitoring
```sql
-- Monitor order processing
SELECT order_status, payment_status, delivery_status, COUNT(*)
FROM orders
WHERE created_at >= CURRENT_DATE
GROUP BY order_status, payment_status, delivery_status;

-- Check payment webhook activity
SELECT DATE(created_at) as date, event_type, COUNT(*)
FROM payment_transactions
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at), event_type
ORDER BY date DESC;
```

### Performance Optimization

#### Database Indexes
All critical indexes are included in the schema:
- Order lookups by user_id and order_id
- Payment status filtering
- Account container availability queries
- User profile email searches

#### Edge Function Optimization
- Connection pooling for database queries
- Efficient error handling and logging
- Minimal external API calls
- Proper CORS configuration

---

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Payment Creation Failures

**Issue**: `create-crypto-payment` returns 500 error
**Possible Causes**:
- Invalid NowPayments API key
- Missing environment variables
- Order not in payable state
- Database connection issues

**Debugging Steps**:
```bash
# Check function logs
supabase functions logs create-crypto-payment

# Test NowPayments API directly
curl -X GET https://api.nowpayments.io/v1/status \
  -H "x-api-key: your-api-key"

# Verify order status
SELECT order_status, payment_status, delivery_status
FROM orders WHERE order_id = 'FFX123456789';
```

**Solutions**:
- Verify API key in Supabase Dashboard
- Ensure order is in pending/pending/pending state
- Check database connectivity

#### 2. Webhook Not Receiving Updates

**Issue**: Payment status not updating after payment
**Possible Causes**:
- Incorrect webhook URL in NowPayments
- Webhook endpoint returning errors
- Network connectivity issues

**Debugging Steps**:
```bash
# Check webhook logs
supabase functions logs payment-webhook

# Test webhook endpoint manually
curl -X POST https://your-project.supabase.co/functions/v1/webhook-debug \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'

# Verify webhook URL in NowPayments dashboard
```

**Solutions**:
- Update webhook URL in NowPayments dashboard
- Check webhook endpoint is accessible
- Verify webhook payload format

#### 3. Account Delivery Failures

**Issue**: Accounts not delivered after payment confirmation
**Possible Causes**:
- No available accounts in inventory
- Missing trading rules
- Database function errors

**Debugging Steps**:
```bash
# Test delivery function
curl -X POST https://your-project.supabase.co/functions/v1/test-delivery \
  -H "Authorization: Bearer service-role-key" \
  -H "Content-Type: application/json" \
  -d '{"orderId": "FFX123456789"}'

# Check available accounts
SELECT * FROM get_available_accounts_count();

# Verify trading rules exist
SELECT * FROM trading_rules
WHERE account_type = 'one_step' AND account_size = 10000;
```

**Solutions**:
- Add accounts to account_container table
- Ensure trading rules exist for all account types/sizes
- Check deliver_account_to_user function logs

#### 4. Authentication Issues

**Issue**: API calls returning 401/403 errors
**Possible Causes**:
- Invalid JWT tokens
- Expired authentication
- Incorrect user permissions

**Debugging Steps**:
```javascript
// Verify token in browser console
const token = localStorage.getItem('supabase.auth.token');
console.log('Token:', token);

// Check token expiration
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));
```

**Solutions**:
- Refresh authentication tokens
- Verify user is logged in
- Check RLS policies

#### 5. Database Connection Issues

**Issue**: Edge Functions timing out or returning database errors
**Possible Causes**:
- Incorrect connection strings
- Database overload
- Network connectivity

**Debugging Steps**:
```bash
# Test database connectivity
psql -h db.your-project.supabase.co -U postgres -d postgres -c "SELECT NOW();"

# Check connection pool status
SELECT * FROM pg_stat_activity WHERE datname = 'postgres';
```

**Solutions**:
- Verify SUPABASE_URL and SERVICE_ROLE_KEY
- Optimize database queries
- Check Supabase dashboard for issues

### Emergency Procedures

#### 1. Payment System Outage
1. Enable maintenance mode on frontend
2. Redirect users to manual payment page
3. Process payments manually through admin panel
4. Update order status manually once resolved

#### 2. Database Issues
1. Check Supabase status page
2. Enable read-only mode if possible
3. Use database backups if necessary
4. Contact Supabase support for critical issues

#### 3. NowPayments API Issues
1. Check NowPayments status page
2. Switch to backup payment provider if available
3. Process pending payments manually
4. Communicate with customers about delays

### Support Contacts

- **Supabase Support**: https://supabase.com/support
- **NowPayments Support**: support@nowpayments.io
- **System Administrator**: admin@flashfundx.com

---

## Conclusion

This technical documentation provides comprehensive coverage of the FlashFundX backend system, including all Edge Functions, database schema, payment integration, and admin capabilities. The system is designed for scalability, security, and reliability with comprehensive error handling and monitoring capabilities.

For additional support or questions, refer to the troubleshooting guide or contact the system administrator.
```

