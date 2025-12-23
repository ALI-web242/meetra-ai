# Meeting Creation & Joining - Quickstart Guide

> Quick guide to implementing and using the Meeting module for Meetra AI.

## Overview

This module enables users to:
- Create meetings with unique IDs
- Join meetings via link or ID
- Manage meeting lifecycle (start/end)

---

## Prerequisites

- Module 1 (Auth) implemented and working
- PostgreSQL database running
- Redis (optional, for real-time state)

---

## Quick Start Implementation

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io

# Frontend
cd frontend
npm install socket.io-client
```

### 2. Create Database Tables

Run migration or execute SQL:
```sql
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id VARCHAR(12) UNIQUE NOT NULL,
    name VARCHAR(255) DEFAULT 'Meeting',
    password_hash VARCHAR(255),
    host_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    ended_at TIMESTAMP
);

CREATE TABLE meeting_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'participant',
    joined_at TIMESTAMP DEFAULT NOW(),
    left_at TIMESTAMP
);
```

### 3. Start Backend

```bash
cd backend
npm run start:dev
```

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

---

## API Quick Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| Create Meeting | POST | `/api/meetings` |
| Get Meeting | GET | `/api/meetings/:id` |
| Join Meeting | POST | `/api/meetings/:id/join` |
| Start Meeting | POST | `/api/meetings/:id/start` |
| End Meeting | POST | `/api/meetings/:id/end` |
| Leave Meeting | POST | `/api/meetings/:id/leave` |

---

## User Flows

### Create Meeting
```
1. Click "Create Meeting" on home page
2. (Optional) Set meeting name
3. (Optional) Enable password
4. Click "Create"
5. Copy link or click "Start Meeting"
```

### Join Meeting
```
1. Click meeting link OR enter meeting ID
2. Enter password (if required)
3. Click "Join"
4. Wait for host to start (if waiting)
```

### Host Controls
```
- Start Meeting: Begin the session
- End Meeting: Close for all participants
- Leave: Auto-closes after 30 seconds
```

---

## Files to Create

### Backend
```
backend/src/meeting/
├── meeting.module.ts
├── meeting.controller.ts
├── meeting.service.ts
├── meeting.gateway.ts
├── dto/
│   ├── create-meeting.dto.ts
│   └── join-meeting.dto.ts
└── entities/
    ├── meeting.entity.ts
    └── participant.entity.ts
```

### Frontend
```
frontend/src/
├── app/
│   ├── join/[meetingId]/page.tsx
│   └── m/[meetingId]/page.tsx
├── components/meeting/
│   ├── CreateMeetingModal.tsx
│   ├── JoinMeetingForm.tsx
│   └── MeetingControls.tsx
├── stores/meetingStore.ts
└── services/meetingService.ts
```

---

## Next Steps

After implementing this module:
1. **Module 3**: WebRTC video/audio
2. **Module 4**: In-meeting chat
3. **Module 5**: Screen sharing
