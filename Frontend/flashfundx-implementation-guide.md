# 🚀 **FlashFundX Implementation Guide - Updated Schema**

## 📋 **Database Setup Complete**

Your FlashFundX database schema includes:
- ✅ **User Profiles** - Complete signup data with timestamps
- ✅ **Orders** - FFX order IDs with 4 account types (instant, hft, one_step, two_step)
- ✅ **Trading Rules** - Separate table for profit targets, drawdowns by account type
- ✅ **Account Container** - Simplified MT4/MT5 inventory (credentials only)
- ✅ **Delivered Accounts** - Challenge phase tracking with status management
- ✅ **Payment Integration** - Ready for Lemon Squeezy & NowPayments

## 🎯 **4 Account Types Explained**

### **1. Instant Funding**
- **Type**: Direct live account
- **Phases**: Live only (no challenge)
- **Status**: Active immediately

### **2. HFT Account**
- **Type**: High-frequency trading account
- **Phases**: Live only (no challenge)
- **Status**: Active immediately with tighter rules

### **3. One Step Challenge**
- **Type**: Single challenge phase
- **Phases**: Challenge → Live
- **Status**: Active → Passed → Live

### **4. Two Step Challenge**
- **Type**: Two challenge phases
- **Phases**: Challenge 1 → Challenge 2 → Live
- **Status**: Active → Passed → Active → Passed → Live

---

## 🗄️ **Step 1: Run Database Schema**

1. **Go to Supabase Dashboard**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Select your project**: `evogjimjdofyrpqaukdq`
3. **Open SQL Editor**
4. **Copy and paste** the entire `flashfundx-database-schema.sql` file
5. **Run the script**

---

## 📦 **Step 2: Populate Account Container**

### **Add MT4/MT5 Accounts to Container**

Run this SQL to add sample accounts (replace with your real account details):

```sql
-- Add MT4 Accounts (simplified - no trading rules)
INSERT INTO public.account_container (
    account_size, platform_type, server_name, login_id, password, investor_password
) VALUES
-- $10K MT4 Accounts
(10000, 'mt4', 'FlashFundX-Live01', '1001001', 'Pass123!', 'InvPass123'),
(10000, 'mt4', 'FlashFundX-Live01', '1001002', 'Pass124!', 'InvPass124'),
(10000, 'mt4', 'FlashFundX-Live01', '1001003', 'Pass125!', 'InvPass125'),

-- $25K MT4 Accounts
(25000, 'mt4', 'FlashFundX-Live01', '1002001', 'Pass223!', 'InvPass223'),
(25000, 'mt4', 'FlashFundX-Live01', '1002002', 'Pass224!', 'InvPass224'),

-- $50K MT4 Accounts
(50000, 'mt4', 'FlashFundX-Live01', '1003001', 'Pass323!', 'InvPass323'),
(50000, 'mt4', 'FlashFundX-Live01', '1003002', 'Pass324!', 'InvPass324'),

-- $100K MT4 Accounts
(100000, 'mt4', 'FlashFundX-Live01', '1004001', 'Pass423!', 'InvPass423'),

-- $10K MT5 Accounts
(10000, 'mt5', 'FlashFundX-Live02', '2001001', 'Pass523!', 'InvPass523'),
(10000, 'mt5', 'FlashFundX-Live02', '2001002', 'Pass524!', 'InvPass524'),

-- $25K MT5 Accounts
(25000, 'mt5', 'FlashFundX-Live02', '2002001', 'Pass623!', 'InvPass623'),
(25000, 'mt5', 'FlashFundX-Live02', '2002002', 'Pass624!', 'InvPass624');
```

**Note**: Trading rules are now managed separately in the Trading Rules page!

---

## 🛒 **Step 3: Order Management Flow**

### **How Orders Work:**

1. **User Places Order** → Order created with status `pending`
2. **Payment Processed** → Status changes to `paid`
3. **Admin Confirms** → Click "Confirm Payment" button
4. **Account Delivered** → Automatically assigned from container
5. **Email Sent** → User receives account details

### **Order ID Format:**
- **Pattern**: `FFX` + 9 random numbers
- **Example**: `FFX123456789`, `FFX987654321`
- **Auto-generated** on order creation

---

## 🎛️ **Step 4: Admin Interface Functions**

### **Key Admin Functions:**

#### **1. Confirm Payment & Deliver Account**
```sql
-- Call this function when you confirm payment
SELECT deliver_account_to_user('FFX123456789', 'user-uuid-here');
```

#### **2. Check Available Accounts**
```sql
-- See how many accounts are available
SELECT * FROM get_available_accounts_count();
```

#### **3. View Pending Orders**
```sql
-- See orders waiting for confirmation
SELECT order_id, user_id, account_type, account_size, platform_type, final_amount, created_at
FROM public.orders 
WHERE payment_status = 'paid' AND delivery_status = 'pending'
ORDER BY created_at;
```

---

## 📧 **Step 5: Account Delivery Process**

### **When You Click "Confirm Payment":**

1. **System finds** available account from container
2. **Reserves account** for that order
3. **Creates delivered_accounts** record
4. **Updates order** status to completed
5. **Sends email** to user with account details
6. **Updates user** total orders and spent amount

### **Email Template** (will be sent automatically):
```
Subject: 🎉 Your FlashFundX Trading Account is Ready!

Hi [First Name],

Your trading account has been successfully delivered!

📊 Account Details:
- Account Size: $[account_size]
- Platform: [MT4/MT5]
- Server: [server_name]
- Login: [login_id]
- Password: [password]
- Investor Password: [investor_password]

🎯 Trading Rules:
- Max Daily Loss: $[max_daily_loss]
- Max Total Loss: $[max_total_loss]
- Profit Target: $[profit_target]
- Profit Share: [profit_share]%

Start trading and good luck!
FlashFundX Team
```

---

## 💳 **Step 6: Future Payment Integration**

### **Ready for:**
- ✅ **Lemon Squeezy** - `payment_method: 'lemon_squeezy'`
- ✅ **NowPayments** - `payment_method: 'nowpayments'`
- ✅ **Crypto payments** - Stores crypto address, amount, currency
- ✅ **Transaction tracking** - Full payment history

### **Payment Flow:**
1. **User selects payment** → Order created
2. **Payment provider** → Webhook updates payment_status
3. **Auto-delivery** → Account delivered automatically
4. **Email notification** → User gets account details

---

## 🔧 **Step 7: Admin Dashboard Features**

### **What You Can Do:**

#### **Order Management:**
- View all orders with filters
- Confirm payments manually
- Track delivery status
- Refund orders if needed

#### **Account Container:**
- Add new MT4/MT5 accounts
- View available inventory
- Disable/enable accounts
- Track which accounts are delivered

#### **User Management:**
- View user profiles
- See order history
- Track total spent
- Manage account status

#### **Analytics:**
- Total orders by size/type
- Revenue tracking
- Account utilization
- User growth metrics

---

## 🎯 **Next Steps:**

1. **Run the database schema**
2. **Add your MT4/MT5 accounts** to the container
3. **Test the order flow** with a sample order
4. **Set up payment integration** (Lemon Squeezy/NowPayments)
5. **Configure email templates** for account delivery

**Your FlashFundX platform is now ready for automated account delivery! 🚀**
