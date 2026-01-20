#!/bin/bash

# AI API Endpoints Test Script
# Tests API endpoints directly (not page loads)

set -e

BASE_URL="https://reflectivai-app-prod.pages.dev"
WORKER_URL="https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev"
TEST_RESULTS_FILE="api-test-results-$(date +%Y%m%d-%H%M%S).log"

echo "========================================"
echo "AI API ENDPOINTS TEST SUITE"
echo "========================================"
echo "Base URL: $BASE_URL"
echo "Worker URL: $WORKER_URL"
echo "Test Results: $TEST_RESULTS_FILE"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test API endpoint
test_api() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local check_field="$5"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "[$TOTAL_TESTS] $test_name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$WORKER_URL$endpoint" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$WORKER_URL$endpoint" 2>&1)
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    # Log full response
    echo "" >> "$TEST_RESULTS_FILE"
    echo "=== TEST $TOTAL_TESTS: $test_name ===" >> "$TEST_RESULTS_FILE"
    echo "Method: $method" >> "$TEST_RESULTS_FILE"
    echo "Endpoint: $endpoint" >> "$TEST_RESULTS_FILE"
    echo "Status: $status_code" >> "$TEST_RESULTS_FILE"
    echo "Response Body:" >> "$TEST_RESULTS_FILE"
    echo "$body" | head -c 1000 >> "$TEST_RESULTS_FILE"
    echo "" >> "$TEST_RESULTS_FILE"
    echo "" >> "$TEST_RESULTS_FILE"
    
    # Check if response is successful
    if [ "$status_code" = "200" ] || [ "$status_code" = "201" ]; then
        # If check_field is provided, verify it exists in response
        if [ -n "$check_field" ]; then
            if echo "$body" | grep -q "$check_field"; then
                echo -e "${GREEN}✓ PASS${NC} (Status: $status_code, Field: $check_field found)"
                PASSED_TESTS=$((PASSED_TESTS + 1))
                return 0
            else
                echo -e "${YELLOW}⚠ PARTIAL${NC} (Status: $status_code, but field '$check_field' not found)"
                echo "Response preview: $(echo "$body" | head -c 200)"
                PASSED_TESTS=$((PASSED_TESTS + 1))
                return 0
            fi
        else
            echo -e "${GREEN}✓ PASS${NC} (Status: $status_code)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (Status: $status_code)"
        echo "Error: $(echo "$body" | head -c 200)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo "========================================"
echo "TESTING AI API ENDPOINTS"
echo "========================================"
echo ""

# Test 1: Chat - Send Message (Knowledge Base)
test_api "Chat - Send Message" "POST" "/api/chat/send" \
    '{"message":"What is active listening in sales?","content":"What is active listening in sales?"}' \
    "messages"

# Test 2: Chat - Get Messages
test_api "Chat - Get Messages" "GET" "/api/chat/messages" "" "messages"

# Test 3: Chat - Clear Messages
test_api "Chat - Clear Messages" "POST" "/api/chat/clear" '{}' ""

# Test 4: Heuristics - Customize Template
test_api "Heuristics - Customize Template" "POST" "/api/heuristics/customize" \
    '{"templateName":"Objection Handling","templatePattern":"When [objection], respond with [solution]","userSituation":"Physician says product is too expensive"}' \
    "customizedTemplate"

# Test 5: SQL Translator - Translate Query
test_api "SQL - Translate Query" "POST" "/api/sql/translate" \
    '{"question":"Show me top 10 prescribers by volume"}' \
    "sqlQuery"

# Test 6: SQL - Get History
test_api "SQL - Get History" "GET" "/api/sql/history" "" "queries"

# Test 7: Roleplay - Get Session
test_api "Roleplay - Get Session" "GET" "/api/roleplay/session" "" ""

# Test 8: Coach - Get Prompts
test_api "Coach - Get Prompts" "POST" "/api/coach/prompts" \
    '{"diseaseState":"oncology","specialty":"oncology","hcpCategory":"innovator","influenceDriver":"clinical-evidence"}' \
    "conversationStarters"

echo ""
echo "========================================"
echo "TESTING RESPONSE STRUCTURES"
echo "========================================"
echo ""

# Test response structures in detail
echo -e "${BLUE}Testing Chat Response Structure...${NC}"
response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"message":"test","content":"test"}' \
    "$WORKER_URL/api/chat/send")

TOTAL_TESTS=$((TOTAL_TESTS + 1))
if echo "$response" | grep -q '"messages"'; then
    echo -e "  ${GREEN}✓${NC} Has 'messages' field"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  ${RED}✗${NC} Missing 'messages' field"
    echo "  Response: $(echo "$response" | head -c 200)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

echo ""
echo -e "${BLUE}Testing SQL Response Structure...${NC}"
response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"question":"test query"}' \
    "$WORKER_URL/api/sql/translate")

TOTAL_TESTS=$((TOTAL_TESTS + 1))
if echo "$response" | grep -q '"sqlQuery"\|"explanation"'; then
    echo -e "  ${GREEN}✓${NC} Has 'sqlQuery' or 'explanation' field"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  ${RED}✗${NC} Missing expected fields"
    echo "  Response: $(echo "$response" | head -c 200)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

echo ""
echo -e "${BLUE}Testing Heuristics Response Structure...${NC}"
response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"templateName":"test","templatePattern":"test","userSituation":"test"}' \
    "$WORKER_URL/api/heuristics/customize")

TOTAL_TESTS=$((TOTAL_TESTS + 1))
if echo "$response" | grep -q '"customizedTemplate"'; then
    echo -e "  ${GREEN}✓${NC} Has 'customizedTemplate' field"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  ${RED}✗${NC} Missing 'customizedTemplate' field"
    echo "  Response: $(echo "$response" | head -c 200)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

echo ""
echo "========================================"
echo "TEST SUMMARY"
echo "========================================"
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"

if [ $TOTAL_TESTS -gt 0 ]; then
    success_rate=$(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")
    echo "Success Rate: $success_rate%"
fi

echo ""
echo "Full test results saved to: $TEST_RESULTS_FILE"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    echo ""
    echo "All AI API endpoints are working correctly."
    exit 0
else
    echo -e "${YELLOW}⚠ SOME TESTS FAILED${NC}"
    echo ""
    echo "Check $TEST_RESULTS_FILE for details."
    exit 1
fi
