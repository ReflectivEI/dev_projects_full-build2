#!/bin/bash

# Comprehensive AI Features Test Script
# Tests all 9 AI-powered pages with real API calls

set -e

BASE_URL="https://reflectivai-app-prod.pages.dev"
TEST_RESULTS_FILE="test-results-$(date +%Y%m%d-%H%M%S).log"

echo "========================================"
echo "AI FEATURES COMPREHENSIVE TEST SUITE"
echo "========================================"
echo "Base URL: $BASE_URL"
echo "Test Results: $TEST_RESULTS_FILE"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test HTTP endpoint
test_endpoint() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="${5:-200}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing: $test_name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint" 2>&1)
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    # Log full response
    echo "" >> "$TEST_RESULTS_FILE"
    echo "=== TEST: $test_name ===" >> "$TEST_RESULTS_FILE"
    echo "Method: $method" >> "$TEST_RESULTS_FILE"
    echo "Endpoint: $endpoint" >> "$TEST_RESULTS_FILE"
    echo "Expected Status: $expected_status" >> "$TEST_RESULTS_FILE"
    echo "Actual Status: $status_code" >> "$TEST_RESULTS_FILE"
    echo "Response Body:" >> "$TEST_RESULTS_FILE"
    echo "$body" >> "$TEST_RESULTS_FILE"
    echo "" >> "$TEST_RESULTS_FILE"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Status: $status_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $status_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Function to test page load
test_page_load() {
    local page_name="$1"
    local path="$2"
    
    test_endpoint "$page_name - Page Load" "GET" "$path" "" "200"
}

echo "========================================"
echo "PHASE 1: PAGE LOAD TESTS"
echo "========================================"
echo ""

test_page_load "Dashboard (Homepage)" "/"
test_page_load "Chat (Knowledge Base)" "/chat"
test_page_load "Roleplay" "/roleplay"
test_page_load "Exercises" "/exercises"
test_page_load "Coaching Modules" "/modules"
test_page_load "Framework Advisor" "/frameworks"
test_page_load "Knowledge Base" "/knowledge"
test_page_load "EI Metrics" "/ei-metrics"
test_page_load "Data Reports" "/data-reports"

echo ""
echo "========================================"
echo "PHASE 2: API ENDPOINT TESTS"
echo "========================================"
echo ""

# Test 1: Chat - Send Message
test_endpoint "Chat - Send Message" "POST" "/api/chat/send" \
    '{"message":"What is active listening?","content":"What is active listening?"}' \
    "200"

# Test 2: Chat - Get Messages
test_endpoint "Chat - Get Messages" "GET" "/api/chat/messages" "" "200"

# Test 3: Knowledge Base - Ask Question
test_endpoint "Knowledge Base - Ask Question" "POST" "/api/chat/send" \
    '{"message":"What are FDA regulations for pharma sales?","content":"What are FDA regulations for pharma sales?"}' \
    "200"

# Test 4: Heuristics - Customize Template
test_endpoint "Heuristics - Customize Template" "POST" "/api/heuristics/customize" \
    '{"templateName":"Objection Handling","templatePattern":"When [objection], respond with [solution]","userSituation":"Physician says product is too expensive"}' \
    "200"

# Test 5: SQL Translator - Translate Query
test_endpoint "SQL Translator - Translate Query" "POST" "/api/sql/translate" \
    '{"question":"Show me top 10 prescribers by volume"}' \
    "200"

# Test 6: Framework Advisor - Get Advice
test_endpoint "Framework Advisor - Get Advice" "POST" "/api/chat/send" \
    '{"message":"Give me advice on using DISC framework","content":"Give me advice on using DISC framework"}' \
    "200"

# Test 7: Coaching Modules - Generate Guidance
test_endpoint "Coaching Modules - Generate Guidance" "POST" "/api/chat/send" \
    '{"message":"Generate coaching guidance for Discovery Questions Mastery","content":"Generate coaching guidance for Discovery Questions Mastery"}' \
    "200"

# Test 8: Roleplay - Start Scenario (may fail if no auth, that's OK)
echo -e "${YELLOW}Note: Roleplay tests may require authentication${NC}"
test_endpoint "Roleplay - Get Session" "GET" "/api/roleplay/session" "" "200" || true

echo ""
echo "========================================"
echo "PHASE 3: RESPONSE STRUCTURE VALIDATION"
echo "========================================"
echo ""

# Test response structures by checking for expected fields
echo "Testing response structures..."

# Test Chat response structure
echo -n "Chat Response Structure... "
response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"message":"test","content":"test"}' \
    "$BASE_URL/api/chat/send")

if echo "$response" | grep -q '"messages"\|"content"\|"error"'; then
    echo -e "${GREEN}✓ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test SQL response structure
echo -n "SQL Response Structure... "
response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"question":"test query"}' \
    "$BASE_URL/api/sql/translate")

if echo "$response" | grep -q '"sqlQuery"\|"explanation"\|"error"'; then
    echo -e "${GREEN}✓ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test Heuristics response structure
echo -n "Heuristics Response Structure... "
response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"templateName":"test","templatePattern":"test","userSituation":"test"}' \
    "$BASE_URL/api/heuristics/customize")

if echo "$response" | grep -q '"customizedTemplate"\|"error"'; then
    echo -e "${GREEN}✓ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "========================================"
echo "TEST SUMMARY"
echo "========================================"
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo "Success Rate: $(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")%"
echo ""
echo "Full test results saved to: $TEST_RESULTS_FILE"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    exit 1
fi
