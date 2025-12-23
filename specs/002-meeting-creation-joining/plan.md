# Implementation Plan: Meeting Creation & Joining

> Implement meeting creation, joining, and lifecycle management for Meetra AI video conferencing platform.

## Metadata
- **Spec ID**: 002-meeting-creation-joining
- **Created**: 2024-12-23
- **Status**: Draft

---

## 1. Overview

### 1.1 Summary
Implement the core meeting management functionality that allows users to create meetings with unique IDs, join via links or ID input, and manage meeting lifecycle. This follows Meetra's "1-click action" philosophy for minimal user friction.

### 1.2 Approach
- **Backend First**: Create meeting APIs and database schema
- **Real-time**: Use WebSockets for live meeting state
- **Stateless JWT**: Continue auth pattern from Module 1
- **Redis Cache**: Store active meeting state for performance

### 1.3 Tech Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js (App Router) | 14.x |
| Backend | NestJS | 10.x |
| Database | PostgreSQL (Neon) | 15.x |
| Cache | Redis | 7.x |
| Styling | Tailwind CSS | 3.x |
| State | Zustand | 4.x |
| Real-time | WebSocket (Socket.io) | 4.x |

---

## 2. Architecture

### 2.1 System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                      (Next.js 14)                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Home Page   │  │ Create Modal │  │  Join Page   │          │
│  │  /           │  │              │  │  /join/[id]  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                           │                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Meeting Room │  │Meeting Store │  │Meeting Service│         │
│  │  /m/[id]     │  │  (Zustand)   │  │  (API calls) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                    REST API + WebSocket
                              │
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│                        (NestJS)                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Meeting    │  │   Meeting    │  │   Meeting    │          │
│  │  Controller  │  │   Service    │  │   Gateway    │          │
│  │  (REST)      │  │   (Logic)    │  │  (WebSocket) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                           │                                     │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   Meeting    │  │ Participant  │                            │
│  │   Entity     │  │   Entity     │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
┌─────────────────────┐         ┌─────────────────────┐
│     PostgreSQL      │         │       Redis         │
│   (Neon - Primary)  │         │  (Active Meetings)  │
│                     │         │                     │
│  - meetings         │         │  - meeting:ABC123   │
│  - participants     │         │  - participants     │
└─────────────────────┘         └─────────────────────┘
```

### 2.2 Component Structure

#### Frontend
```
frontend/src/
├── app/
│   ├── page.tsx                    # Home with Create/Join
│   ├── join/
│   │   └── [meetingId]/
│   │       └── page.tsx            # Join meeting page
│   └── m/
│       └── [meetingId]/
│           ├── page.tsx            # Meeting room
│           └── layout.tsx          # Meeting layout
├── components/
│   └── meeting/
│       ├── CreateMeetingModal.tsx
│       ├── JoinMeetingForm.tsx
│       ├── MeetingControls.tsx
│       ├── ParticipantsList.tsx
│       └── MeetingInfo.tsx
├── stores/
│   └── meetingStore.ts
├── services/
│   └── meetingService.ts
└── hooks/
    └── useMeeting.ts
```

#### Backend
```
backend/src/
├── meeting/
│   ├── meeting.module.ts
│   ├── meeting.controller.ts
│   ├── meeting.service.ts
│   ├── meeting.gateway.ts          # WebSocket
│   ├── dto/
│   │   ├── create-meeting.dto.ts
│   │   ├── join-meeting.dto.ts
│   │   └── meeting-response.dto.ts
│   └── entities/
│       ├── meeting.entity.ts
│       └── participant.entity.ts
└── common/
    └── guards/
        └── meeting-host.guard.ts
```

### 2.3 Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                         meetings                                │
├─────────────────────────────────────────────────────────────────┤
│  id              UUID PRIMARY KEY                               │
│  meeting_id      VARCHAR(12) UNIQUE    -- ABC-123-XYZ          │
│  name            VARCHAR(255)                                   │
│  password_hash   VARCHAR(255) NULL                              │
│  host_id         UUID → users(id)                              │
│  status          ENUM(waiting,active,ended)                    │
│  created_at      TIMESTAMP                                      │
│  started_at      TIMESTAMP NULL                                 │
│  ended_at        TIMESTAMP NULL                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    meeting_participants                         │
├─────────────────────────────────────────────────────────────────┤
│  id              UUID PRIMARY KEY                               │
│  meeting_id      UUID → meetings(id)                           │
│  user_id         UUID → users(id)                              │
│  role            ENUM(host,participant)                        │
│  joined_at       TIMESTAMP                                      │
│  left_at         TIMESTAMP NULL                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/meetings` | Required | Create meeting |
| GET | `/api/meetings/:meetingId` | Optional | Get meeting info |
| POST | `/api/meetings/:meetingId/join` | Required | Join meeting |
| POST | `/api/meetings/:meetingId/start` | Host only | Start meeting |
| POST | `/api/meetings/:meetingId/end` | Host only | End meeting |
| POST | `/api/meetings/:meetingId/leave` | Required | Leave meeting |
| GET | `/api/meetings/:meetingId/participants` | Required | List participants |

### 2.5 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `meeting:join` | Client → Server | User joins meeting |
| `meeting:leave` | Client → Server | User leaves meeting |
| `meeting:started` | Server → Client | Meeting started by host |
| `meeting:ended` | Server → Client | Meeting ended |
| `participant:joined` | Server → Client | New participant |
| `participant:left` | Server → Client | Participant left |
| `host:changed` | Server → Client | Host changed |

---

## 3. Milestones

### Milestone 1: Database & Entities
**Goal**: Set up database schema and TypeORM entities

**Deliverables**:
- [ ] Meeting entity with all fields
- [ ] Participant entity with relations
- [ ] Database migration
- [ ] Entity validation

**Success Criteria**:
- Entities created and migrated
- Relations working correctly

**Files**:
- `backend/src/meeting/entities/meeting.entity.ts`
- `backend/src/meeting/entities/participant.entity.ts`
- `backend/src/database/migrations/`

---

### Milestone 2: Meeting API (REST)
**Goal**: Implement meeting CRUD operations

**Deliverables**:
- [ ] Create meeting endpoint
- [ ] Get meeting endpoint
- [ ] Join meeting endpoint
- [ ] Leave meeting endpoint
- [ ] Start/End meeting endpoints
- [ ] DTOs with validation
- [ ] Host-only guard

**Success Criteria**:
- All endpoints working
- Proper validation
- Role-based access control

**Files**:
- `backend/src/meeting/meeting.controller.ts`
- `backend/src/meeting/meeting.service.ts`
- `backend/src/meeting/dto/`

---

### Milestone 3: Real-time (WebSocket)
**Goal**: Implement real-time meeting state with WebSocket

**Deliverables**:
- [ ] Meeting gateway (Socket.io)
- [ ] Join/leave events
- [ ] Participant updates broadcast
- [ ] Meeting lifecycle events
- [ ] Redis integration for state

**Success Criteria**:
- Real-time updates working
- Multiple clients sync correctly
- Auto-cleanup on disconnect

**Files**:
- `backend/src/meeting/meeting.gateway.ts`
- Redis configuration

---

### Milestone 4: Frontend - Create Meeting
**Goal**: Implement meeting creation UI

**Deliverables**:
- [ ] Home page with Create button
- [ ] Create Meeting modal
- [ ] Meeting ID generation display
- [ ] Copy link functionality
- [ ] Optional password toggle
- [ ] Meeting store (Zustand)

**Success Criteria**:
- 1-click meeting creation
- Link copied easily
- Clean, minimal UI

**Files**:
- `frontend/src/app/page.tsx`
- `frontend/src/components/meeting/CreateMeetingModal.tsx`
- `frontend/src/stores/meetingStore.ts`

---

### Milestone 5: Frontend - Join Meeting
**Goal**: Implement meeting joining flow

**Deliverables**:
- [ ] Join page (`/join/[id]`)
- [ ] Join via ID input on home
- [ ] Password prompt (if required)
- [ ] Error handling UI
- [ ] Redirect to meeting room

**Success Criteria**:
- Join via link works
- Join via ID works
- Password validation works
- Clear error messages

**Files**:
- `frontend/src/app/join/[meetingId]/page.tsx`
- `frontend/src/components/meeting/JoinMeetingForm.tsx`

---

### Milestone 6: Frontend - Meeting Room
**Goal**: Implement meeting room page (without video yet)

**Deliverables**:
- [ ] Meeting room page (`/m/[id]`)
- [ ] Meeting info display
- [ ] Participants list
- [ ] Host controls (start/end)
- [ ] Leave meeting button
- [ ] WebSocket integration

**Success Criteria**:
- Meeting state synced real-time
- Host controls visible only to host
- Participants list updates live

**Files**:
- `frontend/src/app/m/[meetingId]/page.tsx`
- `frontend/src/components/meeting/MeetingControls.tsx`
- `frontend/src/components/meeting/ParticipantsList.tsx`

---

### Milestone 7: Testing
**Goal**: Comprehensive testing

**Deliverables**:
- [ ] Unit tests for meeting service
- [ ] API integration tests
- [ ] E2E tests for create/join flow
- [ ] WebSocket tests

**Success Criteria**:
- 80%+ coverage
- All critical paths tested
- E2E flows passing

**Files**:
- `backend/src/meeting/*.spec.ts`
- `e2e/meeting.spec.ts`

---

## 4. Technical Decisions

### Decision 1: Meeting ID Format
- **Context**: Need unique, shareable meeting IDs
- **Decision**: Use `XXX-XXX-XXX` format (alphanumeric, uppercase)
- **Rationale**: Easy to read/share verbally, unique enough (36^9 combinations)

### Decision 2: Real-time Technology
- **Context**: Need real-time meeting state updates
- **Decision**: Socket.io over NestJS WebSocket Gateway
- **Rationale**: Built-in room support, reconnection handling, wide compatibility

### Decision 3: Meeting State Storage
- **Context**: Active meeting state needs fast access
- **Decision**: Redis for active meetings, PostgreSQL for persistence
- **Rationale**: Fast reads for real-time, reliable storage for history

### Decision 4: Auto-close Behavior
- **Context**: What happens when host leaves?
- **Decision**: 30-second grace period, then auto-close
- **Rationale**: Allows host to reconnect from brief disconnection

---

## 5. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Meeting ID collision | High | Check uniqueness, retry generation |
| WebSocket disconnection | Medium | Reconnection logic, state sync on reconnect |
| Redis failure | Medium | Fallback to PostgreSQL, graceful degradation |
| Host detection failure | High | Store host_id in JWT, verify on every action |
| Race conditions in join | Medium | Database transactions, Redis locks |

---

## 6. Dependencies

### External Dependencies
- PostgreSQL (Neon) - already set up
- Redis - needs setup
- Socket.io - needs installation

### Internal Dependencies
- **Module 1 (Auth)**: User authentication, JWT validation
- **User Entity**: Host-user relationship

### Package Dependencies
```bash
# Backend
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
npm install ioredis @nestjs/cache-manager cache-manager-ioredis-yet

# Frontend
npm install socket.io-client
```

---

## 7. Testing Strategy

### Unit Tests
- Meeting service methods
- Meeting ID generation
- Password hashing/validation
- Role detection logic

### Integration Tests
- Create meeting API
- Join meeting API
- Start/End meeting APIs
- Host-only operations

### E2E Tests
- Complete create → join → leave flow
- Password-protected meeting flow
- Host controls flow
- Auto-close on host leave

---

## 8. Deployment Considerations

- **Environment Variables**:
  - `REDIS_URL` - Redis connection
  - `MEETING_ID_LENGTH` - Configurable ID length

- **WebSocket Scaling**:
  - Use Redis adapter for Socket.io in production
  - Sticky sessions if load balanced

- **Monitoring**:
  - Track active meetings count
  - Track join latency
  - Alert on meeting creation failures
