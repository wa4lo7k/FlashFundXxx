# 🚀 NowPayments Integration Guide for FlashFundX

## 📋 **Overview**

This guide explains how to integrate NowPayments with your FlashFundX prop firm platform using Supabase Edge Functions. The integration supports multiple account types with automatic payment processing and account delivery.

## 🏗️ **Architecture**

```
Frontend (Next.js) → Supabase Edge Functions → NowPayments API → Webhook → Account Delivery
```

### **Components Created:**
1. **Supabase Edge Functions** (3 functions)
2. **Frontend Service** (NowPayments client)
3. **Database Integration** (Payment tracking)
4. **Webhook Handler** (Automatic processing)

## 📁 **Files Created**

### **Supabase Edge Functions:**
```
supabase/functions/
├── shared/
│   ├── types.ts              # TypeScript interfaces
│   ├── nowpayments.ts        # NowPayments API client
│   └── database.ts           # Database helpers
├── create-crypto-payment/    # Create payment endpoint
├── payment-webhook/          # Handle webhooks
└── check-payment-status/     # Check payment status
```

### **Frontend Integration:**
```
Frontend/lib/nowpayments.ts   # Frontend service
```

## 🔧 **Setup Instructions**

### **Step 1: NowPayments Account Setup**

1. **Register at NowPayments:**
   - Go to https://nowpayments.io/
   - Create business account
   - Complete KYC verification

2. **Get API Credentials:**
   - API Key (for production)
   - Sandbox API Key (for testing)
   - IPN Secret (for webhook verification)

3. **Configure Supported Currencies:**
   - Bitcoin (BTC)
   - Ethereum (ETH) 
   - Tether (USDT)
   - Binance Coin (BNB)
   - Tron (TRX)
   - Others as needed

### **Step 2: Supabase Environment Variables**

Add these to your Supabase project settings:

```bash
# NowPayments Configuration
NOWPAYMENTS_API_KEY=your_production_api_key
NOWPAYMENTS_SANDBOX_API_KEY=your_sandbox_api_key
NOWPAYMENTS_SANDBOX=true  # Set to false for production
NOWPAYMENTS_IPN_SECRET=your_ipn_secret

# Frontend URL for redirects
FRONTEND_URL=https://your-domain.com  # or http://localhost:3000 for dev
```

### **Step 3: Deploy Edge Functions**

```bash
# Deploy all functions
supabase functions deploy create-crypto-payment
supabase functions deploy payment-webhook  
supabase functions deploy check-payment-status

# Or deploy all at once
supabase functions deploy
```

### **Step 4: Configure Webhooks in NowPayments**

1. **Login to NowPayments Dashboard**
2. **Go to Settings → IPN Settings**
3. **Add Webhook URL:**
   ```
   https://your-project.supabase.co/functions/v1/payment-webhook
   ```
4. **Select Events:**
   - Payment status updates
   - Payment confirmations
   - Payment failures

### **Step 5: Update Frontend Code**

Update your buy challenge page to use the new NowPayments integration:

```typescript
// In your buy challenge page
import { nowPaymentsService } from '@/lib/nowpayments'

const handlePlaceOrder = async () => {
  // Create order in database first
  const order = await createOrderInDatabase(orderData)
  
  // Create NowPayments payment
  const paymentResponse = await nowPaymentsService.createPayment({
    orderId: order.order_id,
    userId: user.id,
    accountType: orderData.challengeType,
    accountSize: parseAccountSize(orderData.accountSize),
    platformType: orderData.platform,
    cryptoCurrency: orderData.cryptoCurrency,
    amount: orderData.amount,
    finalAmount: calculatePrice()
  })
  
  if (paymentResponse.success) {
    // Redirect to payment page with payment details
    router.push(`/dashboard/payment/crypto?order=${order.order_id}`)
  }
}
```

## 🔄 **Payment Flow**

### **1. Order Creation**
```typescript
User selects account → Frontend creates order → Database stores order
```

### **2. Payment Creation**
```typescript
Frontend calls create-crypto-payment → NowPayments creates payment → Returns payment details
```

### **3. Payment Display**
```typescript
Frontend shows QR code + address → User sends crypto → NowPayments detects payment
```

### **4. Webhook Processing**
```typescript
NowPayments sends webhook → payment-webhook function → Updates order status → Triggers delivery
```

### **5. Account Delivery**
```typescript
deliver_account() function → Account assigned → User receives credentials
```

## 📊 **Payment Status Flow**

```
pending → waiting → confirming → confirmed → finished
                                      ↓
                              Account Delivered
```

**Status Meanings:**
- **pending**: Order created, payment not yet initiated
- **waiting**: Payment created, waiting for user to send crypto
- **confirming**: Payment received, waiting for blockchain confirmations
- **confirmed**: Payment confirmed on blockchain
- **finished**: Payment fully processed, account delivered

## 🎯 **Account Type Support**

The integration supports all FlashFundX account types:

### **Instant Account**
- Direct live trading account
- No evaluation required
- Immediate activation

### **HFT Account**
- Single challenge phase
- High-frequency trading optimized
- Ultra-low latency

### **1-Step Evaluation**
- Single challenge phase
- 8% profit target
- Competitive pricing

### **2-Step Evaluation**
- Two-phase evaluation
- 8%/5% targets
- Highest profit splits

## 🔒 **Security Features**

### **Webhook Verification**
- Validates webhook signatures
- Prevents unauthorized requests
- Logs all payment events

### **Order Validation**
- Verifies order ownership
- Checks payment amounts
- Prevents duplicate processing

### **Database Security**
- Row Level Security (RLS) enabled
- Service role for backend operations
- Audit logging for all transactions

## 🧪 **Testing**

### **Sandbox Mode**
1. Set `NOWPAYMENTS_SANDBOX=true`
2. Use sandbox API key
3. Test with small amounts
4. Verify webhook delivery

### **Test Scenarios**
- ✅ Successful payment
- ✅ Insufficient payment
- ✅ Payment timeout/expiry
- ✅ Payment failure
- ✅ Webhook delivery
- ✅ Account delivery

## 📈 **Monitoring**

### **Payment Tracking**
- All payments logged in `payment_transactions` table
- Real-time status updates
- Error tracking and alerts

### **Admin Dashboard**
- View all orders and payments
- Manual payment confirmation
- Account delivery status

## 🚨 **Error Handling**

### **Common Issues**
1. **Webhook not received**: Check URL and firewall
2. **Payment not confirmed**: Verify blockchain confirmations
3. **Account not delivered**: Check account availability
4. **API errors**: Verify credentials and limits

### **Troubleshooting**
- Check Supabase function logs
- Verify NowPayments dashboard
- Review database transaction logs
- Test webhook delivery manually

## 🎉 **Go Live Checklist**

- [ ] NowPayments account verified
- [ ] Production API keys configured
- [ ] Webhook URL configured
- [ ] Edge functions deployed
- [ ] Frontend integration complete
- [ ] Testing completed
- [ ] Monitoring setup
- [ ] Error handling tested
- [ ] Documentation updated

## 📞 **Support**

- **NowPayments**: support@nowpayments.io
- **Supabase**: https://supabase.com/support
- **FlashFundX**: Your internal support team

---

**🎯 Ready to process crypto payments automatically!** 🚀
