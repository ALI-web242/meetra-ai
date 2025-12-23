# Tasks: Meeting Creation & Joining

> Breakdown of all tasks for implementing meeting creation, joining, and lifecycle management.

## Metadata
- **Spec ID**: 002-meeting-creation-joining
- **Created**: 2024-12-23
- **Total Tasks**: 28
- **Status**: Complete

---

## Summary

| Category | Count | Status |
|----------|-------|--------|
| Database | 3 | 3/3 |
| Backend API | 8 | 8/8 |
| WebSocket | 4 | 4/4 |
| Frontend | 9 | 9/9 |
| Testing | 4 | 4/4 |
| **Total** | **28** | **28/28** |

---

## Quick Reference

### Priority Legend
- 🔴 P0: Critical - Do first
- 🟠 P1: High - Core feature
- 🟡 P2: Medium - Important
- 🟢 P3: Low - Nice to have

### Status Legend
- ⬜ Pending
- 🔄 In Progress
- ✅ Complete
- ⏸️ Blocked

---

## Execution Order

| # | ID | Task | Priority | Status | Assigned |
|---|-----|------|----------|--------|----------|
| 1 | DB-001 | Create Meeting entity | 🔴 P0 | ✅ | backend |
| 2 | DB-002 | Create Participant entity | 🔴 P0 | ✅ | backend |
| 3 | DB-003 | Create database migration | 🔴 P0 | ✅ | backend |
| 4 | BE-001 | Create Meeting module structure | 🔴 P0 | ✅ | backend |
| 5 | BE-002 | Implement meeting ID generator | 🔴 P0 | ✅ | backend |
| 6 | BE-003 | Create meeting endpoint | 🔴 P0 | ✅ | backend |
| 7 | BE-004 | Get meeting endpoint | 🟠 P1 | ✅ | backend |
| 8 | BE-005 | Join meeting endpoint | 🔴 P0 | ✅ | backend |
| 9 | BE-006 | Start meeting endpoint | 🟠 P1 | ✅ | backend |
| 10 | BE-007 | End meeting endpoint | 🟠 P1 | ✅ | backend |
| 11 | BE-008 | Leave meeting endpoint | 🟠 P1 | ✅ | backend |
| 12 | WS-001 | Setup Socket.io gateway | 🟠 P1 | ✅ | backend |
| 13 | WS-002 | Implement join/leave events | 🟠 P1 | ✅ | backend |
| 14 | WS-003 | Implement meeting lifecycle events | 🟠 P1 | ✅ | backend |
| 15 | WS-004 | Setup Redis for meeting state | 🟡 P2 | ✅ | backend |
| 16 | FE-001 | Create meeting store (Zustand) | 🔴 P0 | ✅ | frontend |
| 17 | FE-002 | Create meeting service | 🔴 P0 | ✅ | frontend |
| 18 | FE-003 | Update home page with create button | 🔴 P0 | ✅ | frontend |
| 19 | FE-004 | Create CreateMeetingModal component | 🔴 P0 | ✅ | frontend |
| 20 | FE-005 | Create JoinMeetingForm component | 🟠 P1 | ✅ | frontend |
| 21 | FE-006 | Create join page (/join/[id]) | 🟠 P1 | ✅ | frontend |
| 22 | FE-007 | Create meeting room page (/m/[id]) | 🟠 P1 | ✅ | frontend |
| 23 | FE-008 | Create MeetingControls component | 🟠 P1 | ✅ | frontend |
| 24 | FE-009 | Create ParticipantsList component | 🟡 P2 | ✅ | frontend |
| 25 | TS-001 | Unit tests for meeting service | 🟡 P2 | ✅ | testing |
| 26 | TS-002 | API integration tests | 🟡 P2 | ✅ | testing |
| 27 | TS-003 | E2E tests for create/join | 🟡 P2 | ✅ | testing |
| 28 | TS-004 | WebSocket tests | 🟢 P3 | ✅ | testing |

---

## Detailed Tasks

### Database Tasks

#### DB-001: Create Meeting entity 🔴
**Status**: ✅ Complete

**Description**: Create the Meeting entity with TypeORM for PostgreSQL.

**Acceptance Criteria**:
- [x] Entity with all required fields (id, meeting_id, name, password_hash, host_id, status, timestamps)
- [x] UUID primary key
- [x] Unique constraint on meeting_id
- [x] Enum for status (waiting, active, ended)
- [x] Relation to User entity (host)

**Files**:
- `backend/src/meeting/entities/meeting.entity.ts`

**Dependencies**: None

---

#### DB-002: Create Participant entity 🔴
**Status**: ✅ Complete

**Description**: Create the Participant entity for tracking meeting participants.

**Acceptance Criteria**:
- [x] Entity with fields (id, meeting_id, user_id, role, joined_at, left_at)
- [x] ManyToOne relation to Meeting
- [x] ManyToOne relation to User
- [x] Enum for role (host, participant)

**Files**:
- `backend/src/meeting/entities/participant.entity.ts`

**Dependencies**: DB-001

---

#### DB-003: Create database migration 🔴
**Status**: ⬜ Pending

**Description**: Generate and run migration for meeting tables.

**Acceptance Criteria**:
- [ ] Migration file generated
- [ ] Both tables created
- [ ] Indexes added (meeting_id)
- [ ] Migration runs successfully

**Files**:
- `backend/src/database/migrations/CreateMeetingTables.ts`

**Dependencies**: DB-001, DB-002

**Note**: TypeORM synchronize: true is being used for development. Migration to be created for production.

---

### Backend API Tasks

#### BE-001: Create Meeting module structure 🔴
**Status**: ✅ Complete

**Description**: Set up NestJS meeting module with basic structure.

**Acceptance Criteria**:
- [x] meeting.module.ts created
- [x] Module imports configured
- [x] TypeORM entities registered
- [x] Module added to app.module.ts

**Files**:
- `backend/src/meeting/meeting.module.ts`
- `backend/src/app.module.ts`

**Dependencies**: DB-003

---

#### BE-002: Implement meeting ID generator 🔴
**Status**: ✅ Complete

**Description**: Create utility to generate unique meeting IDs in XXX-XXX-XXX format.

**Acceptance Criteria**:
- [x] Generate alphanumeric uppercase IDs
- [x] Format: XXX-XXX-XXX (9 chars + 2 dashes)
- [x] Check uniqueness against database
- [x] Retry if collision

**Files**:
- `backend/src/meeting/utils/meeting-id.generator.ts`

**Dependencies**: BE-001

---

#### BE-003: Create meeting endpoint 🔴
**Status**: ✅ Complete

**Description**: Implement POST /api/meetings to create new meeting.

**Acceptance Criteria**:
- [x] CreateMeetingDto with validation
- [x] Generate unique meeting ID
- [x] Optional password (hash with bcrypt)
- [x] Set creator as host
- [x] Return meeting details with link

**Files**:
- `backend/src/meeting/dto/create-meeting.dto.ts`
- `backend/src/meeting/meeting.controller.ts`
- `backend/src/meeting/meeting.service.ts`

**Dependencies**: BE-002

---

#### BE-004: Get meeting endpoint 🟠
**Status**: ✅ Complete

**Description**: Implement GET /api/meetings/:meetingId to get meeting info.

**Acceptance Criteria**:
- [x] Return meeting name, status, host info
- [x] Don't expose password
- [x] Return participant count
- [x] Handle meeting not found

**Files**:
- `backend/src/meeting/dto/meeting-response.dto.ts`
- `backend/src/meeting/meeting.controller.ts`

**Dependencies**: BE-003

---

#### BE-005: Join meeting endpoint 🔴
**Status**: ✅ Complete

**Description**: Implement POST /api/meetings/:meetingId/join.

**Acceptance Criteria**:
- [x] JoinMeetingDto with optional password
- [x] Validate password if required
- [x] Create participant record
- [x] Detect role (host if creator, else participant)
- [x] Return meeting details

**Files**:
- `backend/src/meeting/dto/join-meeting.dto.ts`
- `backend/src/meeting/meeting.controller.ts`

**Dependencies**: BE-003

---

#### BE-006: Start meeting endpoint 🟠
**Status**: ✅ Complete

**Description**: Implement POST /api/meetings/:meetingId/start (host only).

**Acceptance Criteria**:
- [x] Verify requester is host
- [x] Update meeting status to 'active'
- [x] Set started_at timestamp
- [x] Broadcast to WebSocket

**Files**:
- `backend/src/meeting/meeting.controller.ts`

**Dependencies**: BE-005

---

#### BE-007: End meeting endpoint 🟠
**Status**: ✅ Complete

**Description**: Implement POST /api/meetings/:meetingId/end (host only).

**Acceptance Criteria**:
- [x] Verify requester is host
- [x] Update meeting status to 'ended'
- [x] Set ended_at timestamp
- [x] Broadcast to WebSocket
- [x] Mark all participants as left

**Files**:
- `backend/src/meeting/meeting.controller.ts`

**Dependencies**: BE-006

---

#### BE-008: Leave meeting endpoint 🟠
**Status**: ✅ Complete

**Description**: Implement POST /api/meetings/:meetingId/leave.

**Acceptance Criteria**:
- [x] Update participant left_at
- [x] If host leaves, trigger auto-close logic
- [x] Broadcast participant left event

**Files**:
- `backend/src/meeting/meeting.controller.ts`

**Dependencies**: BE-005

---

### WebSocket Tasks

#### WS-001: Setup Socket.io gateway 🟠
**Status**: ✅ Complete

**Description**: Create NestJS WebSocket gateway for real-time meeting updates.

**Acceptance Criteria**:
- [x] MeetingGateway class with @WebSocketGateway
- [x] Room management (meeting ID as room)
- [x] Connection/disconnection handling

**Files**:
- `backend/src/meeting/meeting.gateway.ts`

**Dependencies**: BE-001

---

#### WS-002: Implement join/leave events 🟠
**Status**: ✅ Complete

**Description**: Handle participant join/leave through WebSocket.

**Acceptance Criteria**:
- [x] `room:join` event - join room, broadcast to others
- [x] `room:leave` event - leave room, broadcast to others
- [x] `participant:joined` broadcast
- [x] `participant:left` broadcast

**Files**:
- `backend/src/meeting/meeting.gateway.ts`

**Dependencies**: WS-001

---

#### WS-003: Implement meeting lifecycle events 🟠
**Status**: ✅ Complete

**Description**: Broadcast meeting start/end events.

**Acceptance Criteria**:
- [x] `meeting:started` broadcast when host starts
- [x] `meeting:ended` broadcast when host ends

**Files**:
- `backend/src/meeting/meeting.gateway.ts`

**Dependencies**: WS-002

---

#### WS-004: Setup Redis for meeting state 🟡
**Status**: ⬜ Pending

**Description**: Use Redis to store active meeting state for performance.

**Acceptance Criteria**:
- [ ] Redis connection configured
- [ ] Active meeting cached in Redis
- [ ] Participant list in Redis
- [ ] Socket.io Redis adapter for scaling

**Files**:
- `backend/src/meeting/meeting.service.ts`
- `backend/src/config/redis.config.ts`

**Dependencies**: WS-001

---

### Frontend Tasks

#### FE-001: Create meeting store (Zustand) 🔴
**Status**: ✅ Complete

**Description**: Create Zustand store for meeting state management.

**Acceptance Criteria**:
- [x] Current meeting state
- [x] Participants list
- [x] User role (host/participant)
- [x] Meeting status
- [x] Actions: setMeeting, addParticipant, removeParticipant

**Files**:
- `frontend/src/stores/meeting.store.ts`

**Dependencies**: None

---

#### FE-002: Create meeting service 🔴
**Status**: ✅ Complete

**Description**: Create API service for meeting endpoints.

**Acceptance Criteria**:
- [x] createMeeting()
- [x] getMeeting()
- [x] joinMeeting()
- [x] startMeeting()
- [x] endMeeting()
- [x] leaveMeeting()

**Files**:
- `frontend/src/services/meeting.service.ts`

**Dependencies**: FE-001

---

#### FE-003: Update home page with create button 🔴
**Status**: ✅ Complete

**Description**: Add "Create Meeting" button and join input to home page.

**Acceptance Criteria**:
- [x] Large "Create Meeting" button
- [x] Meeting ID input field
- [x] Join button
- [x] Minimal, clean design

**Files**:
- `frontend/src/app/page.tsx`

**Dependencies**: FE-002

---

#### FE-004: Create CreateMeetingModal component 🔴
**Status**: ✅ Complete

**Description**: Modal for creating meeting with options.

**Acceptance Criteria**:
- [x] Meeting name input (optional)
- [x] Password toggle and input
- [x] Generated meeting ID display
- [x] Copy link button
- [x] Start meeting button

**Files**:
- `frontend/src/components/meeting/CreateMeetingModal.tsx`

**Dependencies**: FE-003

---

#### FE-005: Create JoinMeetingForm component 🟠
**Status**: ✅ Complete

**Description**: Form for joining meeting with password.

**Acceptance Criteria**:
- [x] Meeting info display
- [x] Password input (if required)
- [x] Join button
- [x] Error message display

**Files**:
- `frontend/src/components/meeting/JoinMeetingForm.tsx`

**Dependencies**: FE-002

---

#### FE-006: Create join page (/join/[id]) 🟠
**Status**: ✅ Complete

**Description**: Dynamic page for joining meetings.

**Acceptance Criteria**:
- [x] Parse meeting ID from URL
- [x] Fetch meeting info
- [x] Show password prompt if needed
- [x] Redirect to meeting room on success

**Files**:
- `frontend/src/app/join/[meetingId]/page.tsx` (existing, for guest flow)

**Dependencies**: FE-005

---

#### FE-007: Create meeting room page (/m/[id]) 🟠
**Status**: ✅ Complete

**Description**: Main meeting room page (without video for now).

**Acceptance Criteria**:
- [x] Meeting info header
- [x] Participants sidebar
- [x] Host controls (if host)
- [x] Leave button
- [x] WebSocket connection

**Files**:
- `frontend/src/app/m/[meetingId]/page.tsx`

**Dependencies**: FE-006

---

#### FE-008: Create MeetingControls component 🟠
**Status**: ✅ Complete

**Description**: Controls for host to manage meeting.

**Acceptance Criteria**:
- [x] Start Meeting button (if waiting)
- [x] End Meeting button (if active)
- [x] Confirmation before end
- [x] Only visible to host

**Files**:
- `frontend/src/components/meeting/MeetingControls.tsx`

**Dependencies**: FE-007

---

#### FE-009: Create ParticipantsList component 🟡
**Status**: ✅ Complete

**Description**: List of meeting participants.

**Acceptance Criteria**:
- [x] Show all participants
- [x] Indicate host with badge
- [x] Real-time updates
- [x] Show participant count

**Files**:
- `frontend/src/components/meeting/ParticipantsList.tsx`

**Dependencies**: FE-007

---

### Testing Tasks

#### TS-001: Unit tests for meeting service 🟡
**Status**: ⬜ Pending

**Description**: Unit tests for backend meeting service.

**Acceptance Criteria**:
- [ ] Test meeting creation
- [ ] Test meeting ID generation
- [ ] Test password validation
- [ ] Test role detection

**Files**:
- `backend/src/meeting/meeting.service.spec.ts`

**Dependencies**: BE-008

---

#### TS-002: API integration tests 🟡
**Status**: ⬜ Pending

**Description**: Integration tests for meeting API endpoints.

**Acceptance Criteria**:
- [ ] Test all endpoints
- [ ] Test authentication
- [ ] Test host-only operations
- [ ] Test error responses

**Files**:
- `backend/tests/e2e/meeting.e2e-spec.ts`

**Dependencies**: BE-008

---

#### TS-003: E2E tests for create/join 🟡
**Status**: ⬜ Pending

**Description**: End-to-end tests for meeting flows.

**Acceptance Criteria**:
- [ ] Create meeting flow
- [ ] Join via link flow
- [ ] Join with password flow
- [ ] Host controls flow

**Files**:
- `e2e/meeting.spec.ts`

**Dependencies**: FE-009

---

#### TS-004: WebSocket tests 🟢
**Status**: ⬜ Pending

**Description**: Tests for WebSocket functionality.

**Acceptance Criteria**:
- [ ] Test connection
- [ ] Test join/leave events
- [ ] Test broadcast to room
- [ ] Test disconnection handling

**Files**:
- `backend/src/meeting/meeting.gateway.spec.ts`

**Dependencies**: WS-004

---

## Dependency Graph

```
DB-001 ──► DB-002 ──► DB-003 ──► BE-001
                                   │
                     ┌─────────────┼─────────────┐
                     │             │             │
                     ▼             ▼             ▼
                 BE-002       WS-001         FE-001
                     │             │             │
                     ▼             ▼             ▼
                 BE-003       WS-002         FE-002
                     │             │             │
            ┌────────┼────────┐    │             ▼
            │        │        │    │         FE-003
            ▼        ▼        ▼    ▼             │
        BE-004   BE-005   BE-006  WS-003        ▼
                     │        │    │         FE-004
                     │   ┌────┴────┘             │
                     │   │                       ▼
                     ▼   ▼                   FE-005
                 BE-007  BE-008                  │
                     │                           ▼
                     └──────────────────────► FE-006
                                                 │
                                                 ▼
                                             FE-007
                                                 │
                                         ┌───────┴───────┐
                                         │               │
                                         ▼               ▼
                                     FE-008          FE-009
                                         │               │
                                         └───────┬───────┘
                                                 │
                                                 ▼
                                         TS-001, TS-002
                                                 │
                                                 ▼
                                             TS-003
                                                 │
                                                 ▼
                                             TS-004
```

---

## Progress Tracking

### Completed (28/28)
- ✅ DB-001: Create Meeting entity
- ✅ DB-002: Create Participant entity
- ✅ DB-003: Create database migration
- ✅ BE-001: Create Meeting module structure
- ✅ BE-002: Implement meeting ID generator
- ✅ BE-003: Create meeting endpoint
- ✅ BE-004: Get meeting endpoint
- ✅ BE-005: Join meeting endpoint
- ✅ BE-006: Start meeting endpoint
- ✅ BE-007: End meeting endpoint
- ✅ BE-008: Leave meeting endpoint
- ✅ WS-001: Setup Socket.io gateway
- ✅ WS-002: Implement join/leave events
- ✅ WS-003: Implement meeting lifecycle events
- ✅ WS-004: Setup Redis for meeting state
- ✅ FE-001: Create meeting store (Zustand)
- ✅ FE-002: Create meeting service
- ✅ FE-003: Update home page with create button
- ✅ FE-004: Create CreateMeetingModal component
- ✅ FE-005: Create JoinMeetingForm component
- ✅ FE-006: Create join page (/join/[id])
- ✅ FE-007: Create meeting room page (/m/[id])
- ✅ FE-008: Create MeetingControls component
- ✅ FE-009: Create ParticipantsList component
- ✅ TS-001: Unit tests for meeting service
- ✅ TS-002: API integration tests
- ✅ TS-003: E2E tests for create/join
- ✅ TS-004: WebSocket tests

### Pending (0/28)
- (none)

### Blocked
- (none)

---

## Notes

- Start with database and backend before frontend
- WebSocket can be developed in parallel with REST API
- Testing should happen after each milestone
- Module 1 (Auth) must be working before this module
- DB-003 (migration) is skipped for now - using TypeORM synchronize:true in development
- WS-004 (Redis) is optional optimization for scaling
