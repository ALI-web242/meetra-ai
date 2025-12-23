#!/bin/bash

# Spec 002 - Meeting Creation & Joining Test Script
# This script tests all meeting API endpoints

set -e  # Exit on error

BASE_URL="http://localhost:3000"
API_URL="${BASE_URL}/api/v1"

echo "🧪 Testing Spec 002 - Meeting Creation & Joining"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo "⏳ Checking if backend is running..."
if ! curl -s "$BASE_URL" > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend is not running!${NC}"
    echo "Please start backend first: cd backend && npm run start:dev"
    exit 1
fi
echo -e "${GREEN}✅ Backend is running${NC}"
echo ""

# Test 1: Register a test user
echo "📝 Test 1: Register Test User"
echo "------------------------------"
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test-$(date +%s)@example.com\",\"password\":\"Test@123456\"}")

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Failed to register user${NC}"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
fi
echo -e "${GREEN}✅ User registered successfully${NC}"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Test 2: Create a meeting
echo "📅 Test 2: Create Meeting"
echo "-------------------------"
CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/meetings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test Meeting"}')

MEETING_ID=$(echo $CREATE_RESPONSE | grep -o '"meetingId":"[^"]*' | cut -d'"' -f4)

if [ -z "$MEETING_ID" ]; then
    echo -e "${RED}❌ Failed to create meeting${NC}"
    echo "Response: $CREATE_RESPONSE"
    exit 1
fi
echo -e "${GREEN}✅ Meeting created successfully${NC}"
echo "Meeting ID: $MEETING_ID"
echo ""

# Test 3: Get meeting details
echo "🔍 Test 3: Get Meeting Details"
echo "-------------------------------"
GET_RESPONSE=$(curl -s "${BASE_URL}/meetings/${MEETING_ID}")

STATUS=$(echo $GET_RESPONSE | grep -o '"status":"[^"]*' | cut -d'"' -f4)

if [ "$STATUS" != "waiting" ]; then
    echo -e "${RED}❌ Failed to get meeting details${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Meeting details retrieved${NC}"
echo "Status: $STATUS"
echo ""

# Test 4: Start meeting
echo "▶️  Test 4: Start Meeting"
echo "-------------------------"
START_RESPONSE=$(curl -s -X POST "${BASE_URL}/meetings/${MEETING_ID}/start" \
  -H "Authorization: Bearer $TOKEN")

STATUS=$(echo $START_RESPONSE | grep -o '"status":"[^"]*' | cut -d'"' -f4)

if [ "$STATUS" != "active" ]; then
    echo -e "${RED}❌ Failed to start meeting${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Meeting started successfully${NC}"
echo "Status: $STATUS"
echo ""

# Test 5: Get participants
echo "👥 Test 5: Get Participants"
echo "---------------------------"
PARTICIPANTS_RESPONSE=$(curl -s "${BASE_URL}/meetings/${MEETING_ID}/participants" \
  -H "Authorization: Bearer $TOKEN")

COUNT=$(echo $PARTICIPANTS_RESPONSE | grep -o '"count":[0-9]*' | cut -d':' -f2)

if [ "$COUNT" != "1" ]; then
    echo -e "${RED}❌ Failed to get participants${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Participants retrieved${NC}"
echo "Participant count: $COUNT"
echo ""

# Test 6: Create password-protected meeting
echo "🔒 Test 6: Create Password-Protected Meeting"
echo "---------------------------------------------"
PROTECTED_RESPONSE=$(curl -s -X POST "${BASE_URL}/meetings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Secret Meeting","password":"Test123"}')

PROTECTED_MEETING_ID=$(echo $PROTECTED_RESPONSE | grep -o '"meetingId":"[^"]*' | cut -d'"' -f4)
HAS_PASSWORD=$(echo $PROTECTED_RESPONSE | grep -o '"hasPassword":[^,}]*' | cut -d':' -f2)

if [ "$HAS_PASSWORD" != "true" ]; then
    echo -e "${RED}❌ Failed to create password-protected meeting${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Password-protected meeting created${NC}"
echo "Meeting ID: $PROTECTED_MEETING_ID"
echo ""

# Test 7: End meeting
echo "⏹️  Test 7: End Meeting"
echo "----------------------"
END_RESPONSE=$(curl -s -X POST "${BASE_URL}/meetings/${MEETING_ID}/end" \
  -H "Authorization: Bearer $TOKEN")

STATUS=$(echo $END_RESPONSE | grep -o '"status":"[^"]*' | cut -d'"' -f4)

if [ "$STATUS" != "ended" ]; then
    echo -e "${RED}❌ Failed to end meeting${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Meeting ended successfully${NC}"
echo "Status: $STATUS"
echo ""

# Summary
echo "================================================"
echo -e "${GREEN}🎉 All tests passed successfully!${NC}"
echo "================================================"
echo ""
echo "Summary:"
echo "  ✅ User Registration"
echo "  ✅ Meeting Creation"
echo "  ✅ Get Meeting Details"
echo "  ✅ Start Meeting"
echo "  ✅ Get Participants"
echo "  ✅ Password-Protected Meeting"
echo "  ✅ End Meeting"
echo ""
echo "Meeting IDs created:"
echo "  - Regular: $MEETING_ID"
echo "  - Protected: $PROTECTED_MEETING_ID"
echo ""
