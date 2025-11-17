#!/bin/bash

# Comprehensive KiyuMart Feature Verification Script
# Tests all critical features and endpoints

BASE_URL="http://localhost:5000"
PASSED=0
FAILED=0

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "KiyuMart Comprehensive Feature Test Suite"
echo "=========================================="
echo ""

# Helper function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local expected_status=$4
    local data=$5
    
    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Status: $status_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $status_code)"
        echo "  Response: $body"
        ((FAILED++))
        return 1
    fi
}

# ============ Phase 1: Core API Endpoints ============
echo "Phase 1: Core API Endpoints"
echo "----------------------------"

test_endpoint "Platform Settings" "GET" "/api/platform-settings" "200"
test_endpoint "Categories List" "GET" "/api/categories" "200"
test_endpoint "Products List" "GET" "/api/products" "200"
test_endpoint "Hero Banners" "GET" "/api/hero-banners" "200"
test_endpoint "Footer Pages" "GET" "/api/footer-pages" "200"
test_endpoint "Settings" "GET" "/api/settings" "200"
test_endpoint "Currency Rates" "GET" "/api/currency/rates" "200"

echo ""

# ============ Phase 2: Authentication ============
echo "Phase 2: Authentication System"
echo "------------------------------"

# Test unauthenticated access
test_endpoint "Auth Me (Unauthenticated)" "GET" "/api/auth/me" "401"

# Test login with test credentials
LOGIN_DATA='{"email":"superadmin@kiyumart.com","password":"superadmin123"}'
echo -n "Testing Admin Login... "
login_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")

login_status=$(echo "$login_response" | tail -n1)
login_body=$(echo "$login_response" | head -n-1)

if [ "$login_status" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Status: 200)"
    TOKEN=$(echo "$login_body" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    if [ -n "$TOKEN" ]; then
        echo "  Token received: ${TOKEN:0:20}..."
        ((PASSED++))
        
        # Test authenticated endpoints
        echo -n "Testing Auth Me (Authenticated)... "
        auth_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/auth/me" \
            -H "Authorization: Bearer $TOKEN")
        auth_status=$(echo "$auth_response" | tail -n1)
        if [ "$auth_status" = "200" ]; then
            echo -e "${GREEN}✓ PASS${NC} (Status: 200)"
            ((PASSED++))
        else
            echo -e "${RED}✗ FAIL${NC} (Status: $auth_status)"
            ((FAILED++))
        fi
    else
        echo -e "${YELLOW}⚠ WARNING${NC} - Login succeeded but no token extracted"
    fi
else
    echo -e "${RED}✗ FAIL${NC} (Status: $login_status)"
    echo "  Response: $login_body"
    ((FAILED++))
fi

echo ""

# ============ Phase 3: Database Schema Verification ============
echo "Phase 3: Database Schema Verification"
echo "--------------------------------------"

echo -n "Checking audit_logs table... "
audit_table=$(docker exec kiyumart-postgres psql -U kiyumart -d kiyumart -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs');" 2>/dev/null | xargs)
if [ "$audit_table" = "t" ]; then
    echo -e "${GREEN}✓ EXISTS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ MISSING${NC}"
    ((FAILED++))
fi

echo -n "Checking webhook_events table... "
webhook_table=$(docker exec kiyumart-postgres psql -U kiyumart -d kiyumart -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'webhook_events');" 2>/dev/null | xargs)
if [ "$webhook_table" = "t" ]; then
    echo -e "${GREEN}✓ EXISTS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ MISSING${NC}"
    ((FAILED++))
fi

echo -n "Checking users.deleted_at column... "
users_deleted=$(docker exec kiyumart-postgres psql -U kiyumart -d kiyumart -t -c "SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'deleted_at');" 2>/dev/null | xargs)
if [ "$users_deleted" = "t" ]; then
    echo -e "${GREEN}✓ EXISTS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ MISSING${NC}"
    ((FAILED++))
fi

echo -n "Checking products.deleted_at column... "
products_deleted=$(docker exec kiyumart-postgres psql -U kiyumart -d kiyumart -t -c "SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'deleted_at');" 2>/dev/null | xargs)
if [ "$products_deleted" = "t" ]; then
    echo -e "${GREEN}✓ EXISTS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ MISSING${NC}"
    ((FAILED++))
fi

echo -n "Checking stores.deleted_at column... "
stores_deleted=$(docker exec kiyumart-postgres psql -U kiyumart -d kiyumart -t -c "SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'deleted_at');" 2>/dev/null | xargs)
if [ "$stores_deleted" = "t" ]; then
    echo -e "${GREEN}✓ EXISTS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ MISSING${NC}"
    ((FAILED++))
fi

echo ""

# ============ Phase 4: Security Features ============
echo "Phase 4: Security Features"
echo "--------------------------"

# Test rate limiting (would need multiple requests)
echo -n "Testing CSRF Protection Enabled... "
csrf_check=$(grep -r "csurf" /workspaces/KiyuMart/server/index.ts 2>/dev/null)
if [ -n "$csrf_check" ]; then
    echo -e "${GREEN}✓ ENABLED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ NOT FOUND${NC}"
    ((FAILED++))
fi

echo -n "Testing XSS Protection (DOMPurify)... "
dompurify_check=$(grep -r "DOMPurify" /workspaces/KiyuMart/client/src 2>/dev/null | head -n1)
if [ -n "$dompurify_check" ]; then
    echo -e "${GREEN}✓ ENABLED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ NOT FOUND${NC}"
    ((FAILED++))
fi

echo -n "Testing Environment Validation... "
env_validation=$(grep -r "validateEnv" /workspaces/KiyuMart/server/index.ts 2>/dev/null)
if [ -n "$env_validation" ]; then
    echo -e "${GREEN}✓ ENABLED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ NOT FOUND${NC}"
    ((FAILED++))
fi

echo ""

# ============ Phase 5: Ghana-Specific Features ============
echo "Phase 5: Ghana-Specific Features"
echo "---------------------------------"

echo -n "Checking Paystack Integration... "
paystack_check=$(grep -r "getGhanaBanks" /workspaces/KiyuMart/server 2>/dev/null | head -n1)
if [ -n "$paystack_check" ]; then
    echo -e "${GREEN}✓ IMPLEMENTED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ NOT FOUND${NC}"
    ((FAILED++))
fi

echo -n "Checking Ghana Card Fields... "
ghana_card=$(docker exec kiyumart-postgres psql -U kiyumart -d kiyumart -t -c "SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'ghana_card_front');" 2>/dev/null | xargs)
if [ "$ghana_card" = "t" ]; then
    echo -e "${GREEN}✓ EXISTS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ MISSING${NC}"
    ((FAILED++))
fi

echo -n "Checking GHS Currency Support... "
currency_check=$(curl -s "$BASE_URL/api/platform-settings" | grep -o "GHS" | head -n1)
if [ "$currency_check" = "GHS" ]; then
    echo -e "${GREEN}✓ CONFIGURED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ NOT CONFIGURED${NC}"
    ((FAILED++))
fi

echo -n "Checking Delivery Tracking (No Geofence)... "
geofence_check=$(grep -A5 "delivery-tracking" /workspaces/KiyuMart/server/routes.ts | grep "GHANA GEOFENCE" 2>/dev/null)
if [ -z "$geofence_check" ]; then
    echo -e "${GREEN}✓ NO RESTRICTIONS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ GEOFENCE FOUND${NC}"
    ((FAILED++))
fi

echo ""

# ============ Summary ============
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    exit 1
fi
