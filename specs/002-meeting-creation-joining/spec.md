# Meeting Creation & Joining

> Enable users to create, join, and manage video meetings with unique IDs, password protection, and role-based access.

## Metadata
- **Spec ID**: 002-meeting-creation-joining
- **Created**: 2024-12-23
- **Status**: Draft
- **Author**: AI Assistant
- **Module**: Module 2 (from modules.pdf)
- **Project**: Meetra AI

---

## 1. Overview

### 1.1 Problem Statement
Users need a simple, secure way to create and join video meetings. The system must generate unique meeting identifiers, support optional password protection, and properly assign roles (host vs participant) to ensure smooth meeting experiences.

### 1.2 Goals
- Allow users to create meetings with unique IDs
- Enable joining meetings via link or meeting ID
- Support optional password protection for meetings
- Automatically assign and detect user roles (host/participant)
- Manage meeting lifecycle (start, end, auto-close)
- Provide "1-click action" experience (per Meetra Constitution)

### 1.3 Non-Goals
- WebRTC video/audio implementation (separate module)
- Chat functionality (separate module)
- AI meeting summaries (separate module)
- Recording functionality (future scope)
- Breakout rooms (future scope)

---

## 2. Requirements

### 2.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | Generate unique meeting ID (8-10 alphanumeric) | High | Draft |
| FR-002 | Create meeting with custom name | High | Draft |
| FR-003 | Set optional password for meeting | Medium | Draft |
| FR-004 | Assign host role to meeting creator | High | Draft |
| FR-005 | Generate shareable meeting link | High | Draft |
| FR-006 | Join meeting via link | High | Draft |
| FR-007 | Join meeting via meeting ID input | High | Draft |
| FR-008 | Validate meeting password on join | Medium | Draft |
| FR-009 | Detect and assign participant role | High | Draft |
| FR-010 | Start meeting (host only) | High | Draft |
| FR-011 | End meeting (host only) | High | Draft |
| FR-012 | Auto-close meeting when host leaves | Medium | Draft |
| FR-013 | Show waiting room before meeting starts | Low | Draft |
| FR-014 | Display meeting info (name, participants count) | Medium | Draft |
| FR-015 | Copy meeting link to clipboard | Medium | Draft |

### 2.2 Non-Functional Requirements

| ID | Requirement | Target | Status |
|----|-------------|--------|--------|
| NFR-001 | Meeting creation time | < 500ms | Draft |
| NFR-002 | Join meeting latency | < 300ms (per constitution) | Draft |
| NFR-003 | Meeting ID uniqueness | 100% unique | Draft |
| NFR-004 | Concurrent meetings | 10,000+ | Draft |
| NFR-005 | Password encryption | bcrypt hashed | Draft |
| NFR-006 | Meeting link validity | Until meeting ends | Draft |

---

## 3. User Stories

### US-001: Create Meeting
**As a** registered user
**I want to** create a new meeting with one click
**So that** I can start a video call quickly

**Acceptance Criteria**:
- [ ] Click "Create Meeting" button
- [ ] Unique meeting ID generated automatically
- [ ] Meeting name optional (default: "User's Meeting")
- [ ] Password optional (toggle to enable)
- [ ] Shareable link displayed immediately
- [ ] Copy link button available

---

### US-002: Join via Link
**As a** user with meeting link
**I want to** join a meeting by clicking the link
**So that** I can participate without manual ID entry

**Acceptance Criteria**:
- [ ] Click meeting link opens join page
- [ ] If password required, show password input
- [ ] If no password, proceed to meeting
- [ ] Role automatically set to participant
- [ ] Show error if meeting doesn't exist

---

### US-003: Join via Meeting ID
**As a** user
**I want to** join a meeting by entering the meeting ID
**So that** I can join when I only have the ID (not full link)

**Acceptance Criteria**:
- [ ] Input field for meeting ID
- [ ] "Join" button to submit
- [ ] Validate meeting exists
- [ ] Prompt for password if required
- [ ] Show clear error messages

---

### US-004: Host Controls
**As a** meeting host
**I want to** control the meeting lifecycle
**So that** I can manage when the meeting starts and ends

**Acceptance Criteria**:
- [ ] "Start Meeting" button visible only to host
- [ ] "End Meeting" button visible only to host
- [ ] Confirmation before ending meeting
- [ ] All participants notified when meeting ends
- [ ] Auto-redirect to home after meeting ends

---

### US-005: Auto-Close on Host Leave
**As a** system
**I want to** automatically close the meeting when host leaves
**So that** meetings don't remain open indefinitely

**Acceptance Criteria**:
- [ ] Detect when host disconnects
- [ ] Show warning to participants
- [ ] Grace period (30 seconds) for host to rejoin
- [ ] Close meeting if host doesn't return
- [ ] Redirect participants to home

---

## 4. Technical Considerations

### 4.1 Constraints
- Must follow Meetra Constitution principles
- UI must be minimal and "1-click action"
- Latency must be < 300ms
- Must work with JWT authentication (from Module 1)
- Must integrate with WebRTC module (future)

### 4.2 Dependencies
- **Module 1 (Auth)**: User authentication required
- **WebSocket Server**: Real-time meeting state updates
- **Database**: Meeting storage and retrieval

### 4.3 Assumptions
- Users are authenticated before creating meetings
- Guest users can join meetings (from Module 1 guest feature)
- Meeting IDs are case-insensitive
- Meetings expire after 24 hours of inactivity

### 4.4 Tech Stack (per Constitution)
- **Frontend**: Next.js (App Router), Tailwind CSS, Zustand
- **Backend**: NestJS, WebSockets
- **Database**: PostgreSQL (Neon)
- **Caching**: Redis (for active meetings)

---

## 5. Success Criteria

How do we know this spec is successfully implemented?

- [ ] User can create meeting in < 3 seconds
- [ ] Meeting ID is unique across all meetings
- [ ] Join via link works without friction
- [ ] Password protection prevents unauthorized access
- [ ] Host can start/end meeting
- [ ] Meeting auto-closes when host leaves
- [ ] All actions feel "1-click" simple
- [ ] Latency requirements met (< 300ms)

---

## 6. Out of Scope

The following items are explicitly out of scope for this spec:

- WebRTC video/audio streaming (Module 3)
- In-meeting chat (Module 4)
- Screen sharing (Module 5)
- AI meeting summaries (Module 6)
- Meeting recording
- Breakout rooms
- Virtual backgrounds
- Waiting room approval by host

---

## 7. Open Questions

| # | Question | Answer | Status |
|---|----------|--------|--------|
| 1 | Should meetings have a max participant limit? | No limit for MVP | Closed |
| 2 | Should host be able to transfer host role? | Future feature | Closed |
| 3 | What happens if host's connection drops briefly? | 30 sec grace period | Closed |
| 4 | Should meeting ID be readable (like "happy-blue-dog")? | Alphanumeric for security | Closed |
| 5 | Guest users - can they create meetings? | No, only join | Closed |

---

## 8. UI/UX Mockup

### Create Meeting Flow
```
┌─────────────────────────────────────────────────────────┐
│                     MEETRA                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    ┌─────────────────────────────────────────────┐     │
│    │                                             │     │
│    │         [  Create Meeting  ]               │     │
│    │              (Big Button)                   │     │
│    │                                             │     │
│    └─────────────────────────────────────────────┘     │
│                                                         │
│    ───────────── OR ─────────────                      │
│                                                         │
│    Meeting ID: [_______________] [Join]                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Meeting Created Modal
```
┌─────────────────────────────────────────────────────────┐
│                  Meeting Created! ✓                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    Meeting ID: ABC-123-XYZ                             │
│                                                         │
│    Meeting Link:                                        │
│    ┌─────────────────────────────────────────────┐     │
│    │ https://meetra.app/m/ABC-123-XYZ      [📋] │     │
│    └─────────────────────────────────────────────┘     │
│                                                         │
│    ☐ Add Password (optional)                           │
│                                                         │
│    ┌─────────────────────────────────────────────┐     │
│    │           [ Start Meeting ]                 │     │
│    └─────────────────────────────────────────────┘     │
│                                                         │
│    [ Share via Email ]  [ Share via WhatsApp ]         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Join Meeting Page
```
┌─────────────────────────────────────────────────────────┐
│                   Join Meeting                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    Meeting: "Ali's Meeting"                            │
│    Host: Ali Ahmed                                      │
│                                                         │
│    Password Required:                                   │
│    ┌─────────────────────────────────────────────┐     │
│    │ [••••••••]                                  │     │
│    └─────────────────────────────────────────────┘     │
│                                                         │
│    ┌─────────────────────────────────────────────┐     │
│    │              [ Join Meeting ]               │     │
│    └─────────────────────────────────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Database Schema (Preview)

```sql
-- meetings table
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id VARCHAR(12) UNIQUE NOT NULL,  -- ABC-123-XYZ
    name VARCHAR(255) DEFAULT 'Meeting',
    password_hash VARCHAR(255),  -- NULL if no password
    host_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'waiting',  -- waiting, active, ended
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    CONSTRAINT valid_status CHECK (status IN ('waiting', 'active', 'ended'))
);

-- meeting_participants table
CREATE TABLE meeting_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'participant',  -- host, participant
    joined_at TIMESTAMP DEFAULT NOW(),
    left_at TIMESTAMP,
    CONSTRAINT valid_role CHECK (role IN ('host', 'participant'))
);
```

---

## 10. API Endpoints (Preview)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/meetings` | Create new meeting |
| GET | `/api/meetings/:meetingId` | Get meeting details |
| POST | `/api/meetings/:meetingId/join` | Join meeting |
| POST | `/api/meetings/:meetingId/start` | Start meeting (host) |
| POST | `/api/meetings/:meetingId/end` | End meeting (host) |
| DELETE | `/api/meetings/:meetingId/leave` | Leave meeting |
| GET | `/api/meetings/:meetingId/participants` | List participants |

---

## 11. References

- Module 2 specification from modules.pdf
- Meetra AI Constitution (`.specify/memory/constitution.md`)
- Module 1: Authentication & User Access (prerequisite)
