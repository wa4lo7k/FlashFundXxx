#!/bin/bash

# Deploy NowPayments Edge Functions to Supabase
# Make sure you have Supabase CLI installed and logged in

echo "🚀 Deploying NowPayments Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if logged in to Supabase
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please login first:"
    echo "supabase login"
    exit 1
fi

echo "📦 Deploying create-crypto-payment function..."
supabase functions deploy create-crypto-payment

if [ $? -eq 0 ]; then
    echo "✅ create-crypto-payment deployed successfully"
else
    echo "❌ Failed to deploy create-crypto-payment"
    exit 1
fi

echo "📦 Deploying payment-webhook function..."
supabase functions deploy payment-webhook

if [ $? -eq 0 ]; then
    echo "✅ payment-webhook deployed successfully"
else
    echo "❌ Failed to deploy payment-webhook"
    exit 1
fi

echo "📦 Deploying check-payment-status function..."
supabase functions deploy check-payment-status

if [ $? -eq 0 ]; then
    echo "✅ check-payment-status deployed successfully"
else
    echo "❌ Failed to deploy check-payment-status"
    exit 1
fi

echo ""
echo "🎉 All Edge Functions deployed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Set environment variables in Supabase Dashboard:"
echo "   - NOWPAYMENTS_API_KEY=3Y8CGKT-GSCMWP3-PCKE5F4-V9CCWK0"
echo "   - NOWPAYMENTS_IPN_SECRET=SzNZQS6bCjAfpw08/tTBVFf/p9qNaW96"
echo "   - FRONTEND_URL=http://localhost:3000"
echo ""
echo "2. Configure webhook in NowPayments dashboard:"
echo "   - URL: https://your-project.supabase.co/functions/v1/payment-webhook"
echo ""
echo "3. Test the integration with small amounts"
echo ""
echo "🔗 Your Edge Function URLs:"
echo "   - Create Payment: https://your-project.supabase.co/functions/v1/create-crypto-payment"
echo "   - Payment Webhook: https://your-project.supabase.co/functions/v1/payment-webhook"
echo "   - Check Status: https://your-project.supabase.co/functions/v1/check-payment-status"
