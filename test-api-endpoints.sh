#!/bin/bash

# FlashFundX API Endpoint Testing Script
# Tests all Edge Functions with mock data

echo "🔌 FlashFundX API Endpoint Testing"
echo "=================================="

# Configuration
BASE_URL="http://localhost:54321/functions/v1"
CONTENT_TYPE="Content-Type: application/json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test API endpoint
test_endpoint() {
    local endpoint="$1"
    local method="$2"
    local data="$3"
    local expected_status="$4"
    local test_name="$5"
    
    echo -e "\n${BLUE}Testing: $test_name${NC}"
    echo "Endpoint: $method $BASE_URL/$endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL/$endpoint$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" -H "$CONTENT_TYPE" -d "$data" "$BASE_URL/$endpoint")
    fi
    
    # Extract status code and body
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    echo "Status Code: $status_code"
    echo "Response: $body"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ $test_name: PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $test_name: FAILED${NC}"
        echo -e "${RED}   Expected: $expected_status, Got: $status_code${NC}"
        ((TESTS_FAILED++))
    fi
}

# Check if local Supabase is running
echo -e "\n${BLUE}Checking Supabase Local Development Server${NC}"
echo "-------------------------------------------"

if curl -s "http://localhost:54321/health" > /dev/null; then
    echo -e "${GREEN}✅ Supabase local server is running${NC}"
else
    echo -e "${RED}❌ Supabase local server is not running${NC}"
    echo -e "${YELLOW}Please run: supabase start${NC}"
    exit 1
fi

# Test 1: Create Crypto Payment
echo -e "\n${BLUE}1. Testing Create Crypto Payment${NC}"
echo "--------------------------------"

CREATE_PAYMENT_DATA='{
  "orderId": "FFX123456789",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "accountType": "one_step",
  "accountSize": 10000,
  "platformType": "mt4",
  "cryptoCurrency": "btc",
  "amount": 649,
  "finalAmount": 649
}'

test_endpoint "create-crypto-payment" "POST" "$CREATE_PAYMENT_DATA" "200" "Create Crypto Payment - Valid Data"

# Test 2: Create Payment with Missing Fields
INVALID_PAYMENT_DATA='{
  "orderId": "FFX123456789",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}'

test_endpoint "create-crypto-payment" "POST" "$INVALID_PAYMENT_DATA" "400" "Create Crypto Payment - Missing Fields"

# Test 3: Check Payment Status
echo -e "\n${BLUE}2. Testing Check Payment Status${NC}"
echo "-------------------------------"

PAYMENT_STATUS_PARAMS="?orderId=FFX123456789&userId=550e8400-e29b-41d4-a716-446655440000"
test_endpoint "check-payment-status" "GET" "$PAYMENT_STATUS_PARAMS" "404" "Check Payment Status - Non-existent Order"

# Test 4: Payment Webhook
echo -e "\n${BLUE}3. Testing Payment Webhook${NC}"
echo "---------------------------"

WEBHOOK_DATA='{
  "payment_id": "12345",
  "payment_status": "confirmed",
  "pay_address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "price_amount": 649,
  "price_currency": "USD",
  "pay_amount": 0.02456789,
  "actually_paid": 0.02456789,
  "pay_currency": "btc",
  "order_id": "FFX123456789",
  "order_description": "FlashFundX 1-Step Challenge - $10K MT4",
  "purchase_id": "67890",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:05:00Z",
  "outcome_amount": 649,
  "outcome_currency": "USD"
}'

test_endpoint "payment-webhook" "POST" "$WEBHOOK_DATA" "404" "Payment Webhook - Non-existent Order"

# Test 5: Test Delivery Function
echo -e "\n${BLUE}4. Testing Delivery Function${NC}"
echo "-----------------------------"

DELIVERY_TEST_DATA='{
  "orderId": "FFX123456789"
}'

test_endpoint "test-delivery" "POST" "$DELIVERY_TEST_DATA" "200" "Test Delivery Function"

# Test 6: Webhook Debug
echo -e "\n${BLUE}5. Testing Webhook Debug${NC}"
echo "--------------------------"

DEBUG_DATA='{
  "test": "debug webhook",
  "timestamp": "2024-01-01T12:00:00Z"
}'

test_endpoint "webhook-debug" "POST" "$DEBUG_DATA" "200" "Webhook Debug Function"

# Test CORS preflight requests
echo -e "\n${BLUE}6. Testing CORS Support${NC}"
echo "------------------------"

for endpoint in "create-crypto-payment" "check-payment-status"; do
    echo -e "\n${BLUE}Testing CORS for $endpoint${NC}"
    cors_response=$(curl -s -w "\n%{http_code}" -X OPTIONS -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" "$BASE_URL/$endpoint")
    cors_status=$(echo "$cors_response" | tail -n1)
    
    if [ "$cors_status" = "200" ]; then
        echo -e "${GREEN}✅ CORS $endpoint: PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ CORS $endpoint: FAILED${NC}"
        ((TESTS_FAILED++))
    fi
done

# Summary
echo -e "\n${BLUE}📊 API Test Summary${NC}"
echo "==================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "\n${RED}🚨 Some tests failed. Check the output above for details.${NC}"
    echo -e "${YELLOW}Common issues:${NC}"
    echo "1. Supabase local server not running (run: supabase start)"
    echo "2. Database not initialized (run: supabase db reset)"
    echo "3. Environment variables not set"
    echo "4. Edge functions not deployed locally"
else
    echo -e "\n${GREEN}🎉 All API tests passed!${NC}"
fi

echo -e "\n${BLUE}💡 Next Steps:${NC}"
echo "1. Set up environment variables in .env file"
echo "2. Initialize database with schema"
echo "3. Test with real NowPayments API keys"
echo "4. Deploy to production Supabase project"

exit $TESTS_FAILED
