-- 🗄️ FlashFundX Prop Firm Database Schema
-- Complete database setup for order management, account delivery, and payment integration
--
-- ⚠️  WARNING: This script will DROP ALL EXISTING DATA and recreate everything from scratch!
-- ⚠️  Only run this on a fresh database or when you want to completely reset everything!

-- ============================================================================
-- 0. CLEAN SLATE - DROP EVERYTHING FIRST
-- ============================================================================

-- Drop all triggers first (to avoid dependency issues)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_set_order_id ON public.orders;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
DROP TRIGGER IF EXISTS update_account_container_updated_at ON public.account_container;
DROP TRIGGER IF EXISTS update_delivered_accounts_updated_at ON public.delivered_accounts;
DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON public.payment_transactions;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS generate_order_id();
DROP FUNCTION IF EXISTS set_order_id();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS deliver_account_to_user(TEXT, UUID);
DROP FUNCTION IF EXISTS get_available_accounts_count();

-- Drop all tables (in reverse dependency order)
DROP TABLE IF EXISTS public.payment_transactions CASCADE;
DROP TABLE IF EXISTS public.admin_audit_log CASCADE;
DROP TABLE IF EXISTS public.email_templates CASCADE;
DROP TABLE IF EXISTS public.delivered_accounts CASCADE;
DROP TABLE IF EXISTS public.crypto_addresses CASCADE;
DROP TABLE IF EXISTS public.account_container CASCADE;
DROP TABLE IF EXISTS public.trading_rules CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- ============================================================================
-- 1. USER PROFILES TABLE - Complete user data with signup details
-- ============================================================================

CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL, -- Store user password for admin portal viewing
    phone TEXT,
    country TEXT,
    marketing_consent BOOLEAN DEFAULT false,
    account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'banned')),
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    signup_ip TEXT,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );

-- ============================================================================
-- 2. ORDERS TABLE - Order management with FFX order IDs
-- ============================================================================

CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL, -- FFX + 9 random numbers
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Order Details
    account_type TEXT NOT NULL CHECK (account_type IN ('instant', 'hft', 'one_step', 'two_step')),
    account_size DECIMAL(15,2) NOT NULL,
    platform_type TEXT NOT NULL CHECK (platform_type IN ('mt4', 'mt5')),
    
    -- Pricing
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    
    -- Order Status
    order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'delivered', 'failed')),
    
    -- Payment Integration (for future use)
    payment_method TEXT CHECK (payment_method IN ('crypto', 'lemon_squeezy', 'nowpayments', 'stripe', 'manual')),
    payment_provider_id TEXT, -- External payment ID
    transaction_id TEXT,
    
    -- Crypto Payment Details (for NowPayments)
    crypto_currency TEXT,
    crypto_amount DECIMAL(20,8),
    crypto_address TEXT,

    -- Payment Proof Upload
    payment_proof TEXT, -- URL/path to uploaded payment proof file

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

-- Policies
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );

-- ============================================================================
-- 3. TRADING RULES - Fixed rules by account type and size
-- ============================================================================

CREATE TABLE public.trading_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Rule Configuration
    account_type TEXT NOT NULL CHECK (account_type IN ('instant', 'hft', 'one_step', 'two_step')),
    account_size DECIMAL(15,2) NOT NULL,

    -- Challenge Rules (for HFT and ONE-STEP single challenge)
    challenge_profit_target DECIMAL(15,2), -- For HFT and ONE-STEP single challenge
    challenge_max_daily_loss DECIMAL(15,2),
    challenge_max_total_loss DECIMAL(15,2),
    challenge_min_trading_days INTEGER,

    -- Phase 1 Rules (for TWO-STEP first phase)
    phase_1_profit_target DECIMAL(15,2), -- For two_step first phase only
    phase_1_max_daily_loss DECIMAL(15,2),
    phase_1_max_total_loss DECIMAL(15,2),
    phase_1_min_trading_days INTEGER,

    -- Phase 2 Rules (for TWO-STEP second phase)
    phase_2_profit_target DECIMAL(15,2), -- For two_step second phase only
    phase_2_max_daily_loss DECIMAL(15,2),
    phase_2_max_total_loss DECIMAL(15,2),
    phase_2_min_trading_days INTEGER,

    -- Live Account Rules (for all types)
    live_max_daily_loss DECIMAL(15,2) NOT NULL,
    live_max_total_loss DECIMAL(15,2) NOT NULL,
    profit_share_percentage INTEGER DEFAULT 80,

    -- Unique constraint to prevent duplicates
    UNIQUE(account_type, account_size),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. ACCOUNT CONTAINER - MT4/MT5 account inventory by size (simplified)
-- ============================================================================

CREATE TABLE public.account_container (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Account Details
    account_size DECIMAL(15,2) NOT NULL,
    platform_type TEXT NOT NULL CHECK (platform_type IN ('mt4', 'mt5')),
    server_name TEXT NOT NULL,
    login_id TEXT NOT NULL,
    password TEXT NOT NULL,
    investor_password TEXT,

    -- Availability Status
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'delivered', 'disabled')),
    reserved_for_order_id TEXT REFERENCES public.orders(order_id),
    reserved_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.account_container ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admins can manage account container" ON public.account_container
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );

-- ============================================================================
-- 5. DELIVERED ACCOUNTS - Accounts delivered to users with challenge tracking
-- ============================================================================

CREATE TABLE public.delivered_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Relationships
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    order_id TEXT REFERENCES public.orders(order_id),
    container_account_id UUID REFERENCES public.account_container(id),
    trading_rules_id UUID REFERENCES public.trading_rules(id),

    -- Account Details (copied from container for historical record)
    account_type TEXT NOT NULL CHECK (account_type IN ('instant', 'hft', 'one_step', 'two_step')),
    account_size DECIMAL(15,2) NOT NULL,
    platform_type TEXT NOT NULL,
    server_name TEXT NOT NULL,
    login_id TEXT NOT NULL,
    password TEXT NOT NULL,
    investor_password TEXT,

    -- Challenge Phase Tracking
    current_phase TEXT DEFAULT 'challenge' CHECK (current_phase IN ('challenge', 'phase_1', 'phase_2', 'live')),
    phase_status TEXT DEFAULT 'active' CHECK (phase_status IN ('active', 'pending', 'passed', 'failed')),

    -- Phase Status for Different Account Types
    -- For HFT and ONE-STEP: single 'challenge' phase
    challenge_status TEXT DEFAULT 'pending' CHECK (challenge_status IN ('active', 'pending', 'passed', 'failed')),
    challenge_completed_at TIMESTAMP WITH TIME ZONE,

    -- For TWO-STEP: phase_1 and phase_2
    phase_1_status TEXT DEFAULT 'pending' CHECK (phase_1_status IN ('active', 'pending', 'passed', 'failed')),
    phase_1_completed_at TIMESTAMP WITH TIME ZONE,

    phase_2_status TEXT DEFAULT 'pending' CHECK (phase_2_status IN ('active', 'pending', 'passed', 'failed')),
    phase_2_completed_at TIMESTAMP WITH TIME ZONE,

    -- For all types: live status
    live_status TEXT DEFAULT 'pending' CHECK (live_status IN ('active', 'pending', 'passed', 'failed')),
    live_activated_at TIMESTAMP WITH TIME ZONE,

    -- Overall Account Status
    account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'closed', 'breached')),

    -- Email Delivery
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.delivered_accounts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own delivered accounts" ON public.delivered_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all delivered accounts" ON public.delivered_accounts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );

-- ============================================================================
-- 6. CRYPTO ADDRESSES - Cryptocurrency payment addresses and QR codes
-- ============================================================================

CREATE TABLE public.crypto_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Cryptocurrency Details
    crypto_name TEXT NOT NULL, -- e.g., 'USDT BEP20', 'Bitcoin', 'Ethereum'
    network TEXT NOT NULL, -- e.g., 'BEP20', 'TRC20', 'Polygon', 'Bitcoin', 'Ethereum'

    -- Address Information
    wallet_address TEXT NOT NULL,
    qr_code_url TEXT, -- URL to uploaded QR code image in Supabase storage

    -- Display Settings
    display_name TEXT NOT NULL, -- e.g., 'USDT (BEP20)', 'Bitcoin (BTC)'
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default crypto addresses (you'll update these with real addresses)
INSERT INTO public.crypto_addresses (
    crypto_name, network, wallet_address, display_name, sort_order
) VALUES
('USDT BEP20', 'BEP20', 'YOUR_USDT_BEP20_ADDRESS_HERE', 'USDT (BEP20)', 1),
('USDT TRC20', 'TRC20', 'YOUR_USDT_TRC20_ADDRESS_HERE', 'USDT (TRC20)', 2),
('USDT Polygon', 'Polygon', 'YOUR_USDT_POLYGON_ADDRESS_HERE', 'USDT (Polygon/Matic)', 3),
('BNB', 'BEP20', 'YOUR_BNB_ADDRESS_HERE', 'BNB (Binance Coin)', 4),
('Ethereum', 'Ethereum', 'YOUR_ETH_ADDRESS_HERE', 'Ethereum (ETH)', 5),
('Bitcoin', 'Bitcoin', 'YOUR_BTC_ADDRESS_HERE', 'Bitcoin (BTC)', 6),
('Solana', 'Solana', 'YOUR_SOL_ADDRESS_HERE', 'Solana (SOL)', 7);

-- ============================================================================
-- 7. EMAIL TEMPLATES - Automated email templates for account delivery
-- ============================================================================

CREATE TABLE public.email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Template Details
    template_name TEXT NOT NULL UNIQUE,
    template_type TEXT NOT NULL CHECK (template_type IN ('account_delivery', 'welcome', 'phase_completion', 'account_breach')),
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,

    -- Template Variables (JSON array of variable names)
    variables JSONB DEFAULT '[]'::jsonb,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default email templates
INSERT INTO public.email_templates (template_name, template_type, subject, html_content, text_content, variables) VALUES
('account_delivery', 'account_delivery', 'Your FlashFundX Trading Account is Ready!',
'<h1>Welcome to FlashFundX!</h1><p>Your {{account_type}} account ({{account_size}}) is now ready.</p><p><strong>Login Details:</strong><br>Login: {{login_id}}<br>Password: {{password}}<br>Server: {{server_name}}</p>',
'Welcome to FlashFundX! Your {{account_type}} account ({{account_size}}) is now ready. Login: {{login_id}}, Password: {{password}}, Server: {{server_name}}',
'["account_type", "account_size", "login_id", "password", "server_name", "first_name"]'::jsonb);

-- ============================================================================
-- 8. ADMIN AUDIT LOG - Track admin actions (optional)
-- ============================================================================

CREATE TABLE public.admin_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Admin Details
    admin_email TEXT NOT NULL,
    admin_ip TEXT,

    -- Action Details
    action_type TEXT NOT NULL, -- 'create', 'update', 'delete', 'deliver_account', etc.
    table_name TEXT NOT NULL,
    record_id TEXT, -- Could be UUID or order_id

    -- Changes Made
    old_values JSONB,
    new_values JSONB,

    -- Context
    description TEXT,

    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );

-- ============================================================================
-- 9. PAYMENT TRANSACTIONS - Future payment integration support
-- ============================================================================

CREATE TABLE public.payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Relationships
    order_id TEXT REFERENCES public.orders(order_id),
    user_id UUID REFERENCES public.user_profiles(id),
    
    -- Transaction Details
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'chargeback')),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Payment Provider Details
    provider TEXT CHECK (provider IN ('lemon_squeezy', 'nowpayments', 'stripe', 'manual')),
    provider_transaction_id TEXT,
    provider_status TEXT,
    provider_response JSONB,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own transactions" ON public.payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.payment_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'admin@flashfundx.com'
        )
    );

-- ============================================================================
-- 10. SAMPLE TRADING RULES DATA
-- ============================================================================

-- Insert trading rules for all account types and sizes
INSERT INTO public.trading_rules (
    account_type, account_size,
    challenge_profit_target, challenge_max_daily_loss, challenge_max_total_loss, challenge_min_trading_days,
    phase_1_profit_target, phase_1_max_daily_loss, phase_1_max_total_loss, phase_1_min_trading_days,
    phase_2_profit_target, phase_2_max_daily_loss, phase_2_max_total_loss, phase_2_min_trading_days,
    live_max_daily_loss, live_max_total_loss, profit_share_percentage
) VALUES
-- INSTANT ACCOUNTS (Direct live accounts - no challenge)
('instant', 10000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 500, 1000, 80),
('instant', 25000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1250, 2500, 80),
('instant', 50000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2500, 5000, 80),
('instant', 100000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5000, 10000, 80),
('instant', 200000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10000, 20000, 80),

-- HFT ACCOUNTS (Single challenge phase for high-frequency trading)
('hft', 10000, 800, 300, 600, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 300, 600, 85),
('hft', 25000, 2000, 750, 1500, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 750, 1500, 85),
('hft', 50000, 4000, 1500, 3000, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1500, 3000, 85),
('hft', 100000, 8000, 3000, 6000, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3000, 6000, 85),
('hft', 200000, 16000, 6000, 12000, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6000, 12000, 85),

-- ONE STEP ACCOUNTS (Single challenge phase)
('one_step', 10000, 800, 500, 1000, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 500, 1000, 80),
('one_step', 25000, 2000, 1250, 2500, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1250, 2500, 80),
('one_step', 50000, 4000, 2500, 5000, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2500, 5000, 80),
('one_step', 100000, 8000, 5000, 10000, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5000, 10000, 80),
('one_step', 200000, 16000, 10000, 20000, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10000, 20000, 80),

-- TWO STEP ACCOUNTS (Two challenge phases)
('two_step', 10000, NULL, NULL, NULL, NULL, 800, 500, 1000, 4, 500, 500, 1000, 4, 500, 1000, 80),
('two_step', 25000, NULL, NULL, NULL, NULL, 2000, 1250, 2500, 4, 1250, 1250, 2500, 4, 1250, 2500, 80),
('two_step', 50000, NULL, NULL, NULL, NULL, 4000, 2500, 5000, 4, 2500, 2500, 5000, 4, 2500, 5000, 80),
('two_step', 100000, NULL, NULL, NULL, NULL, 8000, 5000, 10000, 4, 5000, 5000, 10000, 4, 5000, 10000, 80),
('two_step', 200000, NULL, NULL, NULL, NULL, 16000, 10000, 20000, 4, 10000, 10000, 20000, 4, 10000, 20000, 80);

-- ============================================================================
-- 11. FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to generate FFX order ID
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate FFX + 9 random numbers
        new_id := 'FFX' || LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0');
        
        -- Check if it already exists
        SELECT COUNT(*) INTO exists_check FROM public.orders WHERE order_id = new_id;
        
        -- If unique, break the loop
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order ID
CREATE OR REPLACE FUNCTION set_order_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_id IS NULL OR NEW.order_id = '' THEN
        NEW.order_id := generate_order_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_id
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_id();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to all tables
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_account_container_updated_at
    BEFORE UPDATE ON public.account_container
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivered_accounts_updated_at
    BEFORE UPDATE ON public.delivered_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 12. INDEXES FOR PERFORMANCE
-- ============================================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_created_at ON public.user_profiles(created_at);

-- Orders indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_order_id ON public.orders(order_id);
CREATE INDEX idx_orders_status ON public.orders(order_status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

-- Trading rules indexes
CREATE INDEX idx_trading_rules_type_size ON public.trading_rules(account_type, account_size);

-- Crypto addresses indexes
CREATE INDEX idx_crypto_addresses_active ON public.crypto_addresses(is_active);
CREATE INDEX idx_crypto_addresses_name ON public.crypto_addresses(crypto_name);
CREATE INDEX idx_crypto_addresses_network ON public.crypto_addresses(network);

-- Account container indexes
CREATE INDEX idx_account_container_size_platform ON public.account_container(account_size, platform_type);
CREATE INDEX idx_account_container_status ON public.account_container(status);

-- Delivered accounts indexes
CREATE INDEX idx_delivered_accounts_user_id ON public.delivered_accounts(user_id);
CREATE INDEX idx_delivered_accounts_order_id ON public.delivered_accounts(order_id);
CREATE INDEX idx_delivered_accounts_status ON public.delivered_accounts(account_status);
CREATE INDEX idx_delivered_accounts_phase ON public.delivered_accounts(current_phase, phase_status);

-- Payment transactions indexes
CREATE INDEX idx_payment_transactions_order_id ON public.payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);

-- Email templates indexes
CREATE INDEX idx_email_templates_type ON public.email_templates(template_type);
CREATE INDEX idx_email_templates_active ON public.email_templates(is_active);

-- Admin audit log indexes
CREATE INDEX idx_admin_audit_log_admin_email ON public.admin_audit_log(admin_email);
CREATE INDEX idx_admin_audit_log_action_type ON public.admin_audit_log(action_type);
CREATE INDEX idx_admin_audit_log_table_name ON public.admin_audit_log(table_name);
CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log(created_at);

-- ============================================================================
-- 13. ACCOUNT DELIVERY AUTOMATION FUNCTIONS
-- ============================================================================

-- Function to deliver account to user with trading rules
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

    -- Check if order is paid
    IF v_order.payment_status != 'paid' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not paid');
    END IF;

    -- Check if already delivered
    IF v_order.delivery_status = 'delivered' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order already delivered');
    END IF;

    -- Get trading rules for this account type and size
    SELECT * INTO v_trading_rules
    FROM public.trading_rules
    WHERE account_type = v_order.account_type
    AND account_size = v_order.account_size;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'No trading rules found for this account type and size');
    END IF;

    -- Find available account from container
    SELECT * INTO v_account
    FROM public.account_container
    WHERE account_size = v_order.account_size
    AND platform_type = v_order.platform_type
    AND status = 'available'
    ORDER BY created_at ASC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'No available accounts for this size and platform');
    END IF;

    -- Determine initial phase and status based on account type
    IF v_order.account_type = 'instant' THEN
        v_initial_phase := 'live';
        v_initial_status := 'active';
    ELSIF v_order.account_type = 'hft' OR v_order.account_type = 'one_step' THEN
        v_initial_phase := 'challenge'; -- HFT and one_step use single challenge phase
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

    -- Create delivered account record with proper phase setup
    INSERT INTO public.delivered_accounts (
        user_id, order_id, container_account_id, trading_rules_id,
        account_type, account_size, platform_type, server_name, login_id, password, investor_password,
        current_phase, phase_status,
        challenge_status, phase_1_status, phase_2_status, live_status
    ) VALUES (
        p_user_id, p_order_id, v_account.id, v_trading_rules.id,
        v_order.account_type, v_account.account_size, v_account.platform_type, v_account.server_name,
        v_account.login_id, v_account.password, v_account.investor_password,
        v_initial_phase, v_initial_status,
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

    -- Update user stats
    UPDATE public.user_profiles
    SET total_orders = total_orders + 1,
        total_spent = total_spent + v_order.final_amount
    WHERE id = p_user_id;

    -- Return success with account details and trading rules
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

-- Function to get available account count by size and platform
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

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (
        id, first_name, last_name, email, password, phone, country, marketing_consent
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'password', ''), -- Store password for admin viewing
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'country', ''),
        COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::boolean, false)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
