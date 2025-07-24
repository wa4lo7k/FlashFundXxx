# FlashFundX Technical Implementation Deep Dive

## Overview

This document provides comprehensive technical details about the FlashFundX backend implementation, including database functions, security policies, environment configuration, integration architecture, and deployment procedures.

## Database Functions and Stored Procedures

### 1. Order ID Generation System

#### `generate_order_id()` Function
Generates unique FFX order IDs with collision detection.

```sql
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate FFX + 9 random numbers (e.g., FFX123456789)
        new_id := 'FFX' || LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0');
        
        -- Check if ID already exists
        SELECT COUNT(*) INTO exists_check FROM public.orders WHERE order_id = new_id;
        
        -- If unique, break the loop
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;
```

#### `set_order_id()` Trigger Function
Automatically assigns order IDs on insert.

```sql
CREATE OR REPLACE FUNCTION set_order_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_id IS NULL OR NEW.order_id = '' THEN
        NEW.order_id := generate_order_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger application
CREATE TRIGGER trigger_set_order_id
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_id();
```

### 2. Timestamp Management

#### `update_updated_at_column()` Function
Automatically updates the `updated_at` timestamp on record changes.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applied to all relevant tables
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Additional triggers for other tables...
```

### 3. User Profile Management

#### `handle_new_user()` Function
Creates user profile automatically when user signs up.

```sql
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

-- Trigger on auth.users table
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. Account Delivery System

#### `deliver_account_to_user()` Function
Core function for automated account delivery with comprehensive business logic.

```sql
CREATE OR REPLACE FUNCTION deliver_account_to_user(
    p_order_id TEXT,
    p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_account RECORD;
    v_trading_rules RECORD;
    v_delivered_account_id UUID;
    v_initial_phase TEXT;
    v_initial_status TEXT;
    result JSONB;
BEGIN
    -- Get order details
    SELECT * INTO v_order FROM public.orders WHERE order_id = p_order_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not found');
    END IF;

    -- Validate order is paid
    IF v_order.payment_status != 'paid' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not paid');
    END IF;

    -- Check if already delivered
    IF v_order.delivery_status = 'delivered' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order already delivered');
    END IF;

    -- Get trading rules
    SELECT * INTO v_trading_rules
    FROM public.trading_rules
    WHERE account_type = v_order.account_type
    AND account_size = v_order.account_size;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'No trading rules found');
    END IF;

    -- Find available account
    SELECT * INTO v_account
    FROM public.account_container
    WHERE account_size = v_order.account_size
    AND platform_type = v_order.platform_type
    AND status = 'available'
    ORDER BY created_at ASC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'No available accounts');
    END IF;

    -- Determine initial phase based on account type
    IF v_order.account_type = 'instant' THEN
        v_initial_phase := 'live';
        v_initial_status := 'active';
    ELSIF v_order.account_type = 'hft' OR v_order.account_type = 'one_step' THEN
        v_initial_phase := 'challenge';
        v_initial_status := 'active';
    ELSE -- two_step
        v_initial_phase := 'phase_1';
        v_initial_status := 'active';
    END IF;

    -- Reserve the account
    UPDATE public.account_container
    SET status = 'delivered',
        reserved_for_order_id = p_order_id,
        reserved_at = NOW()
    WHERE id = v_account.id;

    -- Create delivered account record
    INSERT INTO public.delivered_accounts (
        user_id, order_id, container_account_id, trading_rules_id,
        account_type, account_size, platform_type, server_name, 
        login_id, password, investor_password,
        current_phase, phase_status,
        challenge_status, phase_1_status, phase_2_status, live_status
    ) VALUES (
        p_user_id, p_order_id, v_account.id, v_trading_rules.id,
        v_order.account_type, v_account.account_size, v_account.platform_type, 
        v_account.server_name, v_account.login_id, v_account.password, 
        v_account.investor_password, v_initial_phase, v_initial_status,
        CASE WHEN v_order.account_type IN ('hft', 'one_step') THEN 'active' ELSE 'pending' END,
        CASE WHEN v_order.account_type = 'two_step' THEN 'active' ELSE 'pending' END,
        CASE WHEN v_order.account_type = 'two_step' THEN 'pending' ELSE 'pending' END,
        CASE WHEN v_order.account_type = 'instant' THEN 'active' ELSE 'pending' END
    ) RETURNING id INTO v_delivered_account_id;

    -- Update order status
    UPDATE public.orders
    SET delivery_status = 'delivered',
        order_status = 'completed',
        delivered_at = NOW()
    WHERE order_id = p_order_id;

    -- Update user statistics
    UPDATE public.user_profiles
    SET total_orders = total_orders + 1,
        total_spent = total_spent + v_order.final_amount
    WHERE id = p_user_id;

    -- Return success with account details
    SELECT jsonb_build_object(
        'success', true,
        'delivered_account_id', v_delivered_account_id,
        'account_details', jsonb_build_object(
            'login_id', v_account.login_id,
            'password', v_account.password,
            'investor_password', v_account.investor_password,
            'server_name', v_account.server_name,
            'platform_type', v_account.platform_type,
            'account_size', v_account.account_size,
            'account_type', v_order.account_type,
            'current_phase', v_initial_phase,
            'trading_rules', v_trading_rules
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5. Inventory Management

#### `get_available_accounts_count()` Function
Returns available account inventory for admin monitoring.

```sql
CREATE OR REPLACE FUNCTION get_available_accounts_count()
RETURNS TABLE(
    account_size DECIMAL(15,2),
    platform_type TEXT,
    available_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ac.account_size,
        ac.platform_type,
        COUNT(*) as available_count
    FROM public.account_container ac
    WHERE ac.status = 'available'
    GROUP BY ac.account_size, ac.platform_type
    ORDER BY ac.account_size, ac.platform_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Row Level Security (RLS) Policies

### User Data Protection

#### User Profile Access
```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);
```

#### Order Access Control
```sql
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create orders for themselves
CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### Delivered Accounts Access
```sql
-- Users can view their own delivered accounts
CREATE POLICY "Users can view own delivered accounts" ON public.delivered_accounts
    FOR SELECT USING (auth.uid() = user_id);
```

#### Payment Transactions Access
```sql
-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON public.payment_transactions
    FOR SELECT USING (auth.uid() = user_id);
```

### Admin Access Control

#### Universal Admin Access
```sql
-- Admin can access all user profiles
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );

-- Admin can access all orders
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );

-- Admin can manage account container
CREATE POLICY "Admins can manage account container" ON public.account_container
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );

-- Admin can manage delivered accounts
CREATE POLICY "Admins can manage all delivered accounts" ON public.delivered_accounts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );

-- Admin can view all transactions
CREATE POLICY "Admins can view all transactions" ON public.payment_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );

-- Admin can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );
```

### Security Considerations

#### RLS Policy Best Practices
1. **Principle of Least Privilege**: Users can only access their own data
2. **Admin Verification**: Admin access requires specific email verification
3. **Function Security**: Use `SECURITY DEFINER` for admin functions
4. **Audit Trail**: All admin actions are logged
5. **Data Isolation**: Complete separation between user data

#### Policy Testing
```sql
-- Test user access (should return only user's data)
SET ROLE authenticated;
SELECT * FROM orders; -- Should only show user's orders

-- Test admin access (should return all data)
SET ROLE authenticated;
-- Simulate admin user context
SELECT * FROM orders; -- Should show all orders if admin
```

## Environment Variables Configuration

### Required Production Variables

#### Supabase Configuration
```bash
# Core Supabase settings
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database connection (automatically configured by Supabase)
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
```

#### NowPayments Integration
```bash
# NowPayments API configuration
NOWPAYMENTS_API_KEY=your-nowpayments-api-key
NOWPAYMENTS_IPN_SECRET=your-ipn-secret-for-webhook-validation

# NowPayments sandbox (for testing)
NOWPAYMENTS_SANDBOX_API_KEY=sandbox-api-key-for-testing
NOWPAYMENTS_SANDBOX_MODE=false  # Set to true for testing
```

#### Frontend Configuration
```bash
# Frontend URL for redirects and CORS
FRONTEND_URL=https://your-domain.com

# Success/Cancel URLs for payment redirects
PAYMENT_SUCCESS_URL=https://your-domain.com/payment/success
PAYMENT_CANCEL_URL=https://your-domain.com/payment/cancel
```

#### Email Configuration (Optional)
```bash
# SMTP settings for email notifications
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
SMTP_FROM=noreply@flashfundx.com
```

### Environment Variable Security

#### Security Best Practices
1. **Never commit secrets to version control**
2. **Use different keys for staging/production**
3. **Rotate API keys regularly**
4. **Monitor API key usage**
5. **Use environment-specific configurations**

#### Supabase Environment Setup
```bash
# Set environment variables in Supabase Dashboard
# Navigate to: Project Settings → Edge Functions → Environment Variables

# Or use Supabase CLI
supabase secrets set NOWPAYMENTS_API_KEY=your-api-key
supabase secrets set NOWPAYMENTS_IPN_SECRET=your-ipn-secret
supabase secrets set FRONTEND_URL=https://your-domain.com
```

#### Local Development Setup
```bash
# Create .env.local file (never commit this)
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
NOWPAYMENTS_API_KEY=sandbox-api-key
NOWPAYMENTS_SANDBOX_MODE=true
FRONTEND_URL=http://localhost:3000
```

### Environment Validation

#### Edge Function Environment Check
```typescript
// Environment validation in Edge Functions
const validateEnvironment = () => {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NOWPAYMENTS_API_KEY',
    'FRONTEND_URL'
  ];

  const missing = required.filter(key => !Deno.env.get(key));

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};
```

## Integration Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FlashFundX System                        │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)                                            │
│  ├── Authentication (Supabase Auth)                            │
│  ├── Payment UI (Crypto selection)                             │
│  ├── Order Management                                          │
│  └── Account Dashboard                                         │
├─────────────────────────────────────────────────────────────────┤
│  Supabase Backend                                              │
│  ├── Edge Functions (Deno Runtime)                             │
│  │   ├── create-crypto-payment                                 │
│  │   ├── payment-webhook                                       │
│  │   ├── check-payment-status                                  │
│  │   ├── test-delivery                                         │
│  │   └── webhook-debug                                         │
│  ├── PostgreSQL Database                                       │
│  │   ├── User Profiles                                         │
│  │   ├── Orders                                                │
│  │   ├── Account Container                                     │
│  │   ├── Delivered Accounts                                    │
│  │   └── Payment Transactions                                  │
│  ├── Row Level Security                                        │
│  └── Real-time Subscriptions                                  │
├─────────────────────────────────────────────────────────────────┤
│  External Integrations                                         │
│  ├── NowPayments API                                           │
│  │   ├── Payment Creation                                      │
│  │   ├── Status Checking                                       │
│  │   └── Webhook Notifications                                 │
│  └── MT4/MT5 Account Providers                                 │
│      ├── Account Inventory                                     │
│      └── Login Credentials                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

#### 1. Order Creation Flow
```
User → Frontend → Supabase Auth → Database (orders table)
                                ↓
                         Generate FFX Order ID
                                ↓
                         Return Order Details
```

#### 2. Payment Processing Flow
```
User → create-crypto-payment → NowPayments API → Hosted Checkout
                    ↓                                    ↓
            Update Order Status                   User Pays Crypto
                    ↓                                    ↓
            Return Invoice URL ← ← ← ← ← ← ← ← ← ← ← ← ← ←
                                                         ↓
NowPayments → payment-webhook → Update Payment Status → Trigger Delivery
                    ↓                                    ↓
            Log Payment Event                   deliver_account_to_user()
                    ↓                                    ↓
            Return Success                      Update Order Complete
```

#### 3. Account Delivery Flow
```
Payment Confirmed → deliver_account_to_user() → Find Available Account
                                ↓                        ↓
                        Get Trading Rules        Reserve Account
                                ↓                        ↓
                        Create Delivered Record  Update Container
                                ↓                        ↓
                        Update Order Status      Update User Stats
                                ↓
                        Return Account Details
```

### Component Integration Details

#### Supabase Components

**Database (PostgreSQL)**
- Primary data store with ACID compliance
- Row Level Security for data isolation
- Automatic backups and point-in-time recovery
- Connection pooling and performance optimization

**Authentication**
- JWT-based authentication system
- User registration and login management
- Session management and token refresh
- Integration with frontend and Edge Functions

**Edge Functions (Deno Runtime)**
- Serverless function execution
- TypeScript support with Deno runtime
- Automatic scaling and load balancing
- Environment variable management

**Real-time**
- WebSocket connections for live updates
- Database change subscriptions
- Real-time payment status updates
- Live order tracking

#### NowPayments Integration

**API Client Implementation**
```typescript
class NowPaymentsClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.nowpayments.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createPaymentForHostedCheckout(paymentData: PaymentRequest) {
    const response = await fetch(`${this.baseUrl}/invoice`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error(`NowPayments API error: ${response.status}`);
    }

    return response.json();
  }

  async getPaymentStatus(paymentId: string) {
    const response = await fetch(`${this.baseUrl}/payment/${paymentId}`, {
      headers: { 'x-api-key': this.apiKey }
    });

    return response.json();
  }
}
```

**Webhook Processing**
- Signature validation for security
- Idempotent processing to handle duplicates
- Comprehensive error handling and logging
- Automatic retry mechanism for failed deliveries

**Currency Mapping**
```typescript
const currencyMap: Record<string, string> = {
  'usdt_bsc': 'usdtbsc',
  'usdt_polygon': 'usdtmatic',
  'usdt_trc20': 'usdttrc20',
  'bnb': 'bnbbsc',
  'btc': 'btc',
  'trx': 'trx'
};
```

### Error Handling Strategy

#### Graceful Degradation
1. **Payment Service Outage**: Fall back to manual payment processing
2. **Database Issues**: Cache critical data and queue operations
3. **External API Failures**: Retry with exponential backoff
4. **Network Issues**: Store operations locally and sync when available

#### Retry Logic Implementation
```typescript
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }

  throw new Error('Max retries exceeded');
}
```

#### Comprehensive Logging
```typescript
interface LogEvent {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  service: string;
  event: string;
  data?: any;
  error?: string;
}

const logger = {
  info: (service: string, event: string, data?: any) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      service,
      event,
      data
    }));
  },

  error: (service: string, event: string, error: Error, data?: any) => {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      service,
      event,
      error: error.message,
      stack: error.stack,
      data
    }));
  }
};
```

## Deployment Procedures

### Automated Deployment

#### Edge Function Deployment Script
```bash
#!/bin/bash
# deploy-edge-functions.sh

set -e  # Exit on any error

echo "🚀 Deploying FlashFundX Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first."
    echo "   npm install -g supabase"
    exit 1
fi

# Check if logged in to Supabase
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run: supabase login"
    exit 1
fi

# Deploy all Edge Functions
echo "📦 Deploying create-crypto-payment..."
supabase functions deploy create-crypto-payment --no-verify-jwt

echo "📦 Deploying payment-webhook..."
supabase functions deploy payment-webhook --no-verify-jwt

echo "📦 Deploying check-payment-status..."
supabase functions deploy check-payment-status

echo "📦 Deploying test-delivery..."
supabase functions deploy test-delivery

echo "📦 Deploying webhook-debug..."
supabase functions deploy webhook-debug --no-verify-jwt

echo ""
echo "✅ All Edge Functions deployed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Set environment variables in Supabase Dashboard"
echo "2. Configure webhook URL in NowPayments dashboard"
echo "3. Test the integration with small amounts"
echo ""
echo "🔗 Your Edge Function URLs:"
echo "   - Create Payment: https://your-project.supabase.co/functions/v1/create-crypto-payment"
echo "   - Payment Webhook: https://your-project.supabase.co/functions/v1/payment-webhook"
echo "   - Check Status: https://your-project.supabase.co/functions/v1/check-payment-status"
echo "   - Test Delivery: https://your-project.supabase.co/functions/v1/test-delivery"
echo "   - Webhook Debug: https://your-project.supabase.co/functions/v1/webhook-debug"
```

#### Database Schema Deployment
```bash
#!/bin/bash
# deploy-database-schema.sh

set -e

echo "🗄️ Deploying FlashFundX Database Schema..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client (psql) not found."
    exit 1
fi

# Database connection details
DB_HOST="db.your-project.supabase.co"
DB_USER="postgres"
DB_NAME="postgres"

echo "📋 Applying database schema..."
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f flashfundx-database-schema.sql

echo "✅ Database schema deployed successfully!"

# Run post-deployment checks
echo "🔍 Running post-deployment checks..."
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
"

echo "✅ Deployment complete!"
```

### Production Environment Setup

#### Environment Variable Configuration
```bash
#!/bin/bash
# setup-production-env.sh

echo "🔧 Setting up FlashFundX Production Environment..."

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found."
    exit 1
fi

# Set production environment variables
echo "📝 Setting environment variables..."

# Prompt for sensitive values
read -p "Enter NowPayments API Key: " NOWPAYMENTS_API_KEY
read -p "Enter NowPayments IPN Secret: " NOWPAYMENTS_IPN_SECRET
read -p "Enter Frontend URL: " FRONTEND_URL

# Set the secrets
supabase secrets set NOWPAYMENTS_API_KEY="$NOWPAYMENTS_API_KEY"
supabase secrets set NOWPAYMENTS_IPN_SECRET="$NOWPAYMENTS_IPN_SECRET"
supabase secrets set FRONTEND_URL="$FRONTEND_URL"

echo "✅ Environment variables configured!"

# Verify deployment
echo "🔍 Verifying Edge Function deployment..."
curl -X POST "https://your-project.supabase.co/functions/v1/webhook-debug" \
     -H "Content-Type: application/json" \
     -d '{"test": "deployment_verification"}' \
     --silent --output /dev/null --write-out "HTTP Status: %{http_code}\n"

echo "✅ Production environment setup complete!"
```

### CI/CD Pipeline Configuration

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy FlashFundX Backend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.37.x

      - name: Run TypeScript checks
        run: |
          deno check supabase/functions/*/index.ts
          deno check supabase/functions/shared/*.ts

      - name: Run tests
        run: |
          chmod +x test-backend.sh
          ./test-backend.sh

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Deploy Edge Functions
        run: |
          supabase login --token ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          supabase functions deploy --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}

      - name: Run deployment tests
        run: |
          # Test deployed functions
          curl -f "https://${{ secrets.SUPABASE_PROJECT_REF }}.supabase.co/functions/v1/webhook-debug" \
               -X POST -H "Content-Type: application/json" -d '{"test": "ci_deployment"}'
```

### Monitoring and Observability

#### Health Check Endpoints
```typescript
// Health check implementation in Edge Functions
export const healthCheck = {
  async database(): Promise<boolean> {
    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase.from('user_profiles').select('count').limit(1);
      return !error;
    } catch {
      return false;
    }
  },

  async nowpayments(): Promise<boolean> {
    try {
      const apiKey = Deno.env.get('NOWPAYMENTS_API_KEY');
      if (!apiKey) return false;

      const response = await fetch('https://api.nowpayments.io/v1/status', {
        headers: { 'x-api-key': apiKey }
      });

      return response.ok;
    } catch {
      return false;
    }
  },

  async environment(): Promise<Record<string, boolean>> {
    return {
      supabase_url: !!Deno.env.get('SUPABASE_URL'),
      service_key: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      nowpayments_key: !!Deno.env.get('NOWPAYMENTS_API_KEY'),
      frontend_url: !!Deno.env.get('FRONTEND_URL')
    };
  }
};
```

#### Logging and Metrics
```typescript
// Structured logging for monitoring
interface MetricEvent {
  timestamp: string;
  service: string;
  metric: string;
  value: number;
  tags?: Record<string, string>;
}

const metrics = {
  counter: (service: string, metric: string, tags?: Record<string, string>) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      service,
      metric,
      value: 1,
      tags
    }));
  },

  gauge: (service: string, metric: string, value: number, tags?: Record<string, string>) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      service,
      metric,
      value,
      tags
    }));
  },

  timer: (service: string, metric: string, duration: number, tags?: Record<string, string>) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      service,
      metric: `${metric}_duration_ms`,
      value: duration,
      tags
    }));
  }
};

// Usage in Edge Functions
const startTime = Date.now();
// ... operation ...
metrics.timer('create-crypto-payment', 'payment_creation', Date.now() - startTime);
metrics.counter('create-crypto-payment', 'payment_created', { currency: 'btc' });
```

#### Performance Monitoring
```sql
-- Database performance queries
-- Monitor slow queries
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
WHERE mean_time > 1000  -- Queries taking more than 1 second
ORDER BY mean_time DESC;

-- Monitor connection usage
SELECT
    count(*) as active_connections,
    max(now() - query_start) as longest_query_time
FROM pg_stat_activity
WHERE state = 'active';

-- Monitor table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Backup and Recovery

#### Database Backup Strategy
```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/flashfundx"
DB_HOST="db.your-project.supabase.co"
DB_USER="postgres"
DB_NAME="postgres"

mkdir -p $BACKUP_DIR

echo "🔄 Creating database backup..."

# Full database backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
        --no-password --verbose --clean --no-owner --no-privileges \
        --file="$BACKUP_DIR/flashfundx_full_$DATE.sql"

# Schema-only backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
        --no-password --schema-only --clean --no-owner --no-privileges \
        --file="$BACKUP_DIR/flashfundx_schema_$DATE.sql"

# Data-only backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
        --no-password --data-only --no-owner --no-privileges \
        --file="$BACKUP_DIR/flashfundx_data_$DATE.sql"

echo "✅ Backup completed: $BACKUP_DIR/flashfundx_*_$DATE.sql"

# Cleanup old backups (keep last 30 days)
find $BACKUP_DIR -name "flashfundx_*.sql" -mtime +30 -delete

echo "🧹 Old backups cleaned up"
```

#### Recovery Procedures
```bash
#!/bin/bash
# restore-database.sh

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

BACKUP_FILE=$1
DB_HOST="db.your-project.supabase.co"
DB_USER="postgres"
DB_NAME="postgres"

echo "⚠️  WARNING: This will restore the database from backup."
echo "   Backup file: $BACKUP_FILE"
echo "   Target database: $DB_HOST/$DB_NAME"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Restore cancelled"
    exit 1
fi

echo "🔄 Restoring database from backup..."

psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f $BACKUP_FILE

echo "✅ Database restore completed"
echo "🔍 Running post-restore verification..."

# Verify critical tables exist
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
SELECT
    tablename,
    schemaname
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'orders', 'account_container', 'delivered_accounts')
ORDER BY tablename;
"

echo "✅ Restore verification completed"
```
```
```
