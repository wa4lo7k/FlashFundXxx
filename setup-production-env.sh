#!/bin/bash

# FlashFundX Production Environment Setup Script
# This script guides you through setting up all required environment variables

echo "🔧 FlashFundX Production Environment Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Environment file
ENV_FILE=".env"
ENV_EXAMPLE=".env.example"

echo -e "\n${BLUE}Step 1: Checking existing environment setup${NC}"
echo "--------------------------------------------"

if [ -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  Existing .env file found. Creating backup...${NC}"
    cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}✅ Backup created${NC}"
fi

if [ ! -f "$ENV_EXAMPLE" ]; then
    echo -e "${RED}❌ .env.example file not found. Creating template...${NC}"
    cat > "$ENV_EXAMPLE" << 'EOF'
# FlashFundX Backend Environment Variables
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_ANON_KEY=your-anon-key-here
NOWPAYMENTS_API_KEY=your-nowpayments-api-key
NOWPAYMENTS_IPN_SECRET=your-nowpayments-ipn-secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=production
DEBUG=false
EOF
    echo -e "${GREEN}✅ Template created${NC}"
fi

echo -e "\n${BLUE}Step 2: Supabase Configuration${NC}"
echo "-------------------------------"

echo -e "${YELLOW}Please provide your Supabase project details:${NC}"
echo "You can find these at: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api"

read -p "Enter your Supabase Project URL: " SUPABASE_URL
read -p "Enter your Supabase Service Role Key: " SUPABASE_SERVICE_ROLE_KEY
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY

# Validate Supabase URL format
if [[ ! "$SUPABASE_URL" =~ ^https://[a-zA-Z0-9-]+\.supabase\.co$ ]]; then
    echo -e "${RED}❌ Invalid Supabase URL format. Should be: https://your-project-id.supabase.co${NC}"
    exit 1
fi

# Test Supabase connection
echo -e "\n${BLUE}Testing Supabase connection...${NC}"
SUPABASE_TEST=$(curl -s -o /dev/null -w "%{http_code}" -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_URL/rest/v1/")

if [ "$SUPABASE_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Supabase connection successful${NC}"
else
    echo -e "${RED}❌ Supabase connection failed (HTTP $SUPABASE_TEST)${NC}"
    echo -e "${YELLOW}Please verify your URL and Service Role Key${NC}"
    exit 1
fi

echo -e "\n${BLUE}Step 3: NowPayments Configuration${NC}"
echo "----------------------------------"

echo -e "${YELLOW}Please provide your NowPayments API details:${NC}"
echo "You can find these at: https://nowpayments.io/app/settings/api"

read -p "Enter your NowPayments API Key: " NOWPAYMENTS_API_KEY
read -p "Enter your NowPayments IPN Secret: " NOWPAYMENTS_IPN_SECRET

# Test NowPayments API
echo -e "\n${BLUE}Testing NowPayments API connection...${NC}"
NOWPAYMENTS_TEST=$(curl -s -o /dev/null -w "%{http_code}" -H "x-api-key: $NOWPAYMENTS_API_KEY" "https://api.nowpayments.io/v1/status")

if [ "$NOWPAYMENTS_TEST" = "200" ]; then
    echo -e "${GREEN}✅ NowPayments API connection successful${NC}"
else
    echo -e "${RED}❌ NowPayments API connection failed (HTTP $NOWPAYMENTS_TEST)${NC}"
    echo -e "${YELLOW}Please verify your API key${NC}"
    exit 1
fi

echo -e "\n${BLUE}Step 4: Frontend Configuration${NC}"
echo "-------------------------------"

echo -e "${YELLOW}Please provide your frontend URL:${NC}"
read -p "Enter your Frontend URL (e.g., https://yourdomain.com): " FRONTEND_URL

# Validate Frontend URL format
if [[ ! "$FRONTEND_URL" =~ ^https?://[a-zA-Z0-9.-]+(:[0-9]+)?$ ]]; then
    echo -e "${RED}❌ Invalid Frontend URL format. Should be: https://yourdomain.com${NC}"
    exit 1
fi

echo -e "\n${BLUE}Step 5: Additional Configuration${NC}"
echo "--------------------------------"

read -p "Environment (production/development) [production]: " NODE_ENV
NODE_ENV=${NODE_ENV:-production}

read -p "Enable debug logging? (true/false) [false]: " DEBUG
DEBUG=${DEBUG:-false}

echo -e "\n${BLUE}Step 6: Creating .env file${NC}"
echo "----------------------------"

cat > "$ENV_FILE" << EOF
# FlashFundX Backend Environment Variables
# Generated on $(date)

# Supabase Configuration
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# NowPayments Configuration
NOWPAYMENTS_API_KEY=$NOWPAYMENTS_API_KEY
NOWPAYMENTS_IPN_SECRET=$NOWPAYMENTS_IPN_SECRET

# Frontend Configuration
FRONTEND_URL=$FRONTEND_URL

# Application Configuration
NODE_ENV=$NODE_ENV
DEBUG=$DEBUG

# Security (Generate secure values for production)
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

echo -e "${GREEN}✅ .env file created successfully${NC}"

echo -e "\n${BLUE}Step 7: Validation${NC}"
echo "------------------"

echo -e "${GREEN}✅ Environment setup complete!${NC}"
echo -e "\n${BLUE}Configuration Summary:${NC}"
echo "- Supabase URL: $SUPABASE_URL"
echo "- NowPayments API: Connected"
echo "- Frontend URL: $FRONTEND_URL"
echo "- Environment: $NODE_ENV"
echo "- Debug Mode: $DEBUG"

echo -e "\n${YELLOW}⚠️  Security Reminders:${NC}"
echo "1. Never commit .env file to version control"
echo "2. Use different API keys for development and production"
echo "3. Regularly rotate your API keys"
echo "4. Monitor API usage and set up alerts"

echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Install Supabase CLI: npm install -g supabase"
echo "2. Deploy Edge Functions: ./deploy-edge-functions.sh"
echo "3. Initialize database: supabase db push"
echo "4. Test API endpoints: ./test-api-endpoints.sh"

echo -e "\n${GREEN}🎉 Production environment setup complete!${NC}"
