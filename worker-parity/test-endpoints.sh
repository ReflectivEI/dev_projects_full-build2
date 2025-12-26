#!/bin/bash

# Worker Endpoint Verification Script
# Tests critical endpoints to ensure the worker is functioning correctly
#
# Usage: ./test-endpoints.sh [WORKER_URL] [ORIGIN]
#   WORKER_URL: Worker URL to test (default: http://localhost:8787)
#   ORIGIN: Origin for CORS testing (default: https://reflectivai-app-prod.pages.dev)
#
# Example:
#   ./test-endpoints.sh https://your-worker.workers.dev https://your-app.pages.dev

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get worker URL from argument or use default
WORKER_URL="${1:-http://localhost:8787}"
CORS_ORIGIN="${2:-https://reflectivai-app-prod.pages.dev}"

echo "Testing Worker: $WORKER_URL"
echo "================================"
echo ""

# Test 1: Health endpoint
echo -n "Testing /health endpoint... "
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$WORKER_URL/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "  Response: $BODY"
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $HTTP_CODE)"
    echo "  Response: $BODY"
    exit 1
fi
echo ""

# Test 2: API Status endpoint
echo -n "Testing /api/status endpoint... "
STATUS_RESPONSE=$(curl -s -w "\n%{http_code}" "$WORKER_URL/api/status")
HTTP_CODE=$(echo "$STATUS_RESPONSE" | tail -n1)
BODY=$(echo "$STATUS_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "  Response: $BODY"
    
    # Check for required fields
    if echo "$BODY" | grep -q '"openaiConfigured"'; then
        echo -e "  ${GREEN}✓${NC} Contains 'openaiConfigured' field"
    else
        echo -e "  ${RED}✗${NC} Missing 'openaiConfigured' field"
    fi
    
    if echo "$BODY" | grep -q '"message"'; then
        echo -e "  ${GREEN}✓${NC} Contains 'message' field"
    else
        echo -e "  ${RED}✗${NC} Missing 'message' field"
    fi
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $HTTP_CODE)"
    echo "  Response: $BODY"
    exit 1
fi
echo ""

# Test 3: CORS preflight
echo -n "Testing CORS preflight (OPTIONS)... "
CORS_RESPONSE=$(curl -s -w "\n%{http_code}" -X OPTIONS \
    -H "Origin: $CORS_ORIGIN" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" \
    "$WORKER_URL/api/chat/send")
HTTP_CODE=$(echo "$CORS_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test 4: Check session header handling
echo -n "Testing session ID handling... "
SESSION_RESPONSE=$(curl -s -i "$WORKER_URL/health" | grep -i "x-session-id")

if [ -n "$SESSION_RESPONSE" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "  $SESSION_RESPONSE"
else
    echo -e "${YELLOW}⚠ WARNING${NC} - No x-session-id header returned"
fi
echo ""

# Test 5: Roleplay session endpoint
echo -n "Testing /api/roleplay/session endpoint... "
ROLEPLAY_RESPONSE=$(curl -s -w "\n%{http_code}" "$WORKER_URL/api/roleplay/session")
HTTP_CODE=$(echo "$ROLEPLAY_RESPONSE" | tail -n1)
BODY=$(echo "$ROLEPLAY_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "  Response: $BODY"
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $HTTP_CODE)"
    echo "  Response: $BODY"
    exit 1
fi
echo ""

echo "================================"
echo -e "${GREEN}All tests passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Deploy worker to Cloudflare: cd worker-parity && npx wrangler deploy"
echo "2. Set VITE_WORKER_URL in Cloudflare Pages environment variables"
echo "3. Redeploy frontend to Cloudflare Pages"
echo "4. Run this script against production:"
echo "   $0 https://your-worker.workers.dev https://your-app.pages.dev"
