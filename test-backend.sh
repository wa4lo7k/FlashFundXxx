#!/bin/bash

# FlashFundX Backend Testing Script
# This script tests all Edge Functions and identifies issues

echo "🧪 FlashFundX Backend Testing Suite"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
CRITICAL_ISSUES=()
WARNINGS=()

# Function to log test results
log_test() {
    local test_name="$1"
    local status="$2"
    local message="$3"
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ $test_name: PASSED${NC}"
        ((TESTS_PASSED++))
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ $test_name: FAILED${NC}"
        echo -e "${RED}   $message${NC}"
        CRITICAL_ISSUES+=("$test_name: $message")
        ((TESTS_FAILED++))
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  $test_name: WARNING${NC}"
        echo -e "${YELLOW}   $message${NC}"
        WARNINGS+=("$test_name: $message")
    fi
}

# Check if Deno is installed
echo -e "\n${BLUE}1. Environment Setup Tests${NC}"
echo "----------------------------"

if command -v deno &> /dev/null; then
    DENO_VERSION=$(deno --version | head -n1)
    log_test "Deno Installation" "PASS" "Found: $DENO_VERSION"
else
    log_test "Deno Installation" "FAIL" "Deno not found in PATH"
fi

# Check TypeScript compilation
echo -e "\n${BLUE}2. TypeScript Compilation Tests${NC}"
echo "--------------------------------"

cd supabase/functions

# Test shared modules
for module in shared/types.ts shared/database.ts shared/nowpayments.ts; do
    if deno check "$module" &>/dev/null; then
        log_test "TypeScript: $module" "PASS" ""
    else
        log_test "TypeScript: $module" "FAIL" "Compilation errors found"
    fi
done

# Test Edge Functions
for func in create-crypto-payment payment-webhook check-payment-status test-delivery webhook-debug; do
    if [ -f "$func/index.ts" ]; then
        if deno check "$func/index.ts" &>/dev/null; then
            log_test "TypeScript: $func" "PASS" ""
        else
            log_test "TypeScript: $func" "FAIL" "Compilation errors found"
        fi
    else
        log_test "TypeScript: $func" "WARN" "Function file not found"
    fi
done

# Test environment variables
echo -e "\n${BLUE}3. Environment Configuration Tests${NC}"
echo "-----------------------------------"

ENV_VARS=("SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY" "NOWPAYMENTS_API_KEY" "FRONTEND_URL")
for var in "${ENV_VARS[@]}"; do
    if [ -n "${!var}" ]; then
        log_test "Environment: $var" "PASS" "Set"
    else
        log_test "Environment: $var" "WARN" "Not set - required for production"
    fi
done

# Test database schema files
echo -e "\n${BLUE}4. Database Schema Tests${NC}"
echo "-------------------------"

cd ../../

if [ -f "Frontend/flashfundx-database-schema.sql" ]; then
    log_test "Database Schema" "PASS" "Schema file found"
    
    # Check for critical tables
    TABLES=("user_profiles" "orders" "trading_rules" "account_container" "delivered_accounts" "payment_transactions")
    for table in "${TABLES[@]}"; do
        if grep -q "CREATE TABLE.*$table" Frontend/flashfundx-database-schema.sql; then
            log_test "Table: $table" "PASS" "Definition found"
        else
            log_test "Table: $table" "FAIL" "Table definition missing"
        fi
    done
else
    log_test "Database Schema" "FAIL" "Schema file not found"
fi

# Test function imports and dependencies
echo -e "\n${BLUE}5. Dependency Tests${NC}"
echo "--------------------"

cd supabase/functions

# Check if all imports can be resolved
IMPORT_ERRORS=0
for func_dir in */; do
    if [ -f "$func_dir/index.ts" ]; then
        func_name=${func_dir%/}
        # Try to resolve imports without running
        if deno info "$func_dir/index.ts" &>/dev/null; then
            log_test "Dependencies: $func_name" "PASS" ""
        else
            log_test "Dependencies: $func_name" "WARN" "Some dependencies may not resolve"
            ((IMPORT_ERRORS++))
        fi
    fi
done

# Test configuration files
echo -e "\n${BLUE}6. Configuration Tests${NC}"
echo "-----------------------"

cd ../../

if [ -f "supabase/config.toml" ]; then
    log_test "Supabase Config" "PASS" "Configuration file found"
    
    # Check critical config sections
    if grep -q "\[edge_runtime\]" supabase/config.toml; then
        log_test "Edge Runtime Config" "PASS" "Edge runtime enabled"
    else
        log_test "Edge Runtime Config" "WARN" "Edge runtime configuration missing"
    fi
else
    log_test "Supabase Config" "FAIL" "Configuration file missing"
fi

# Summary
echo -e "\n${BLUE}📊 Test Summary${NC}"
echo "==============="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Warnings: ${YELLOW}${#WARNINGS[@]}${NC}"

if [ ${#CRITICAL_ISSUES[@]} -gt 0 ]; then
    echo -e "\n${RED}🚨 Critical Issues Found:${NC}"
    for issue in "${CRITICAL_ISSUES[@]}"; do
        echo -e "${RED}  • $issue${NC}"
    done
fi

if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo -e "\n${YELLOW}⚠️  Warnings:${NC}"
    for warning in "${WARNINGS[@]}"; do
        echo -e "${YELLOW}  • $warning${NC}"
    done
fi

# Recommendations
echo -e "\n${BLUE}💡 Recommendations${NC}"
echo "==================="

if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}HIGH PRIORITY:${NC}"
    echo "1. Fix all critical TypeScript compilation errors"
    echo "2. Ensure all required database tables exist"
    echo "3. Install missing dependencies"
fi

if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo -e "${YELLOW}MEDIUM PRIORITY:${NC}"
    echo "1. Set up environment variables for production"
    echo "2. Install Supabase CLI for local development"
    echo "3. Configure webhook endpoints"
fi

echo -e "\n${GREEN}NEXT STEPS:${NC}"
echo "1. Run: chmod +x test-backend.sh && ./test-backend.sh"
echo "2. Install Supabase CLI: https://supabase.com/docs/guides/cli"
echo "3. Set environment variables in .env file"
echo "4. Test API endpoints with curl or Postman"

exit $TESTS_FAILED
