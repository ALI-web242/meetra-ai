# Testing Guide - Spec 002

## 🚀 Quick Start

### Dono servers chal rahe hain:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:3001

---

## 🔍 Login Issue Troubleshooting

### Agar "Network Error" aa raha hai:

#### Step 1: Browser Console Check karein
1. Browser mein F12 press karein (Developer Tools)
2. Console tab mein dekhen
3. Error message screenshot lein

#### Step 2: Backend Check karein
Terminal mein yeh command run karein:
```bash
curl http://localhost:3000/api/v1/auth/login/email \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123456"}'
```

Agar yeh kaam karta hai to backend theek hai.

#### Step 3: CORS Issue Fix (Agar zaroori ho)
Backend file check karein: `/home/ali/spec-project/backend/src/main.ts`

CORS enabled hona chahiye:
```typescript
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true
});
```

---

## 🧪 Test Spec 002 (Without Frontend)

### Option 1: Automated Test Script
```bash
cd /home/ali/spec-project
./test-spec-002.sh
```

### Option 2: Manual cURL Commands

#### 1. Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"mytest@example.com","password":"Test@123456"}'
```

Copy the `accessToken` from response.

#### 2. Create Meeting
```bash
TOKEN="PASTE_YOUR_TOKEN_HERE"

curl -X POST http://localhost:3000/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"My Test Meeting"}'
```

Copy the `meetingId` from response.

#### 3. Get Meeting Details
```bash
MEETING_ID="PASTE_MEETING_ID_HERE"

curl http://localhost:3000/meetings/$MEETING_ID
```

#### 4. Start Meeting
```bash
curl -X POST http://localhost:3000/meetings/$MEETING_ID/start \
  -H "Authorization: Bearer $TOKEN"
```

#### 5. Get Participants
```bash
curl http://localhost:3000/meetings/$MEETING_ID/participants \
  -H "Authorization: Bearer $TOKEN"
```

#### 6. End Meeting
```bash
curl -X POST http://localhost:3000/meetings/$MEETING_ID/end \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎯 Test Password-Protected Meeting

```bash
# Create meeting with password
curl -X POST http://localhost:3000/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Secret Meeting","password":"Test123"}'

# Try to join without password (should fail)
curl -X POST http://localhost:3000/meetings/$MEETING_ID/join \
  -H "Authorization: Bearer $TOKEN"

# Join with correct password (should work)
curl -X POST http://localhost:3000/meetings/$MEETING_ID/join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"password":"Test123"}'
```

---

## 📱 Frontend Testing (When Working)

1. Open http://localhost:3001
2. Click "Register"
3. Create account
4. Login
5. Click "Create Meeting"
6. Copy meeting link
7. Open in new tab to join

---

## ⚠️ Common Issues

### Issue 1: "Network Error" on Login
**Cause**: CORS not enabled or frontend can't reach backend
**Fix**: Check backend logs, ensure CORS enabled

### Issue 2: Backend not starting
**Cause**: Database connection issue
**Fix**: Check `.env` file has correct `DATABASE_URL`

### Issue 3: Frontend build error
**Cause**: Login page Suspense boundary issue
**Fix**: This is Module 1 issue, doesn't affect Module 2 testing

### Issue 4: "Meeting not found"
**Cause**: Meeting ID incorrect or meeting expired
**Fix**: Create new meeting and use exact meeting ID

---

## ✅ Expected Results

All these should work:
- ✅ Create meeting → Returns unique ID (XXX-XXX-XXX)
- ✅ Get meeting → Shows status, host, participant count
- ✅ Start meeting → Status changes to "active"
- ✅ End meeting → Status changes to "ended"
- ✅ Password protected → hasPassword: true
- ✅ Participants list → Shows all joined users

---

## 🔄 Restart Servers

If anything stops working:

```bash
# Kill all processes
pkill -f "next dev"
pkill -f "nest start"

# Start backend
cd /home/ali/spec-project/backend
npm run start:dev

# Start frontend (in new terminal)
cd /home/ali/spec-project/frontend
npm run dev
```

---

## 📊 Check Server Status

```bash
# Check if servers are running
lsof -i :3000  # Backend
lsof -i :3001  # Frontend

# Check backend logs
tail -f /tmp/claude/-home-ali-spec-project/tasks/b3fdf27.output

# Check frontend logs
tail -f /tmp/claude/-home-ali-spec-project/tasks/ba3c1e7.output
```

---

## 🎉 Success Criteria

Spec 002 is working if:
1. ✅ Backend starts without errors
2. ✅ All API endpoints respond correctly
3. ✅ Meeting IDs are unique
4. ✅ Password protection works
5. ✅ Role detection (host vs participant) works
6. ✅ Meeting lifecycle (waiting → active → ended) works

