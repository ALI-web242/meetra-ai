# Implementation Plan: Video & Audio Engine (WebRTC)

> Implementation plan for Module 3 - Real-time video/audio communication with WebRTC

## Metadata
- **Spec ID**: 003-video-audio-engine
- **Created**: 2025-12-23
- **Status**: Implemented
- **Implementation Date**: 2025-12-23

---

## System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                     │
├──────────────────────────────────────────────────────────────┤
│  Meeting Page  │  Media Components  │  Hooks  │  Store       │
│  - VideoCall   │  - VideoPreview    │ - Media │ - WebRTC     │
│    Room        │  - MediaControls   │ - WebRTC│   State      │
│                │  - ConnectionStatus│ - Devices│              │
└──────────────┬───────────────────────────────────────────────┘
               │
               │ REST API / WebSocket
               │
┌──────────────▼───────────────────────────────────────────────┐
│                       BACKEND (NestJS)                        │
├──────────────────────────────────────────────────────────────┤
│  WebRTC Module                                                │
│  - Controller (REST endpoints)                                │
│  - Gateway (WebSocket signaling)                              │
│  - Service (Stream management)                                │
└──────────────┬───────────────────────────────────────────────┘
               │
               │ WebRTC Signaling
               │
┌──────────────▼───────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                          │
│  - STUN Server (Google: stun.l.google.com)                   │
│  - TURN Server (Optional - for NAT traversal)                │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### Frontend Components

| Component | Responsibility | Location | Status |
|-----------|---------------|----------|--------|
| VideoCallRoom | Orchestrates entire video call | `frontend/src/components/media/` | ✅ |
| VideoPreview | Displays local/remote video | `frontend/src/components/media/` | ✅ |
| MediaControls | Mic/Camera/End call buttons | `frontend/src/components/media/` | ✅ |
| ConnectionStatus | Shows connection quality | `frontend/src/components/media/` | ✅ |
| DeviceSelector | Audio/video device picker | `frontend/src/components/media/` | ✅ |
| MediaSettings | Settings modal for devices | `frontend/src/components/media/` | ✅ |
| PermissionError | Permission denied screen | `frontend/src/components/media/` | ✅ |

### Custom Hooks

| Hook | Responsibility | Location | Status |
|------|---------------|----------|--------|
| useMediaStream | Manage getUserMedia streams | `frontend/src/hooks/` | ✅ |
| useMediaDevices | Enumerate devices | `frontend/src/hooks/` | ✅ |
| useWebRTC | WebRTC peer connection | `frontend/src/hooks/` | ✅ |

### Zustand Store

| Store | State Managed | Location | Status |
|-------|--------------|----------|--------|
| webrtcStore | Media & connection state | `frontend/src/stores/` | ✅ |

### Backend Modules

| Module | Responsibility | Location | Status |
|--------|---------------|----------|--------|
| WebRTCModule | Video/audio management | `backend/src/webrtc/` | ✅ |
| WebRTCController | REST API endpoints | `backend/src/webrtc/` | ✅ |
| WebRTCGateway | WebSocket signaling | `backend/src/webrtc/` | ✅ |
| WebRTCService | Business logic | `backend/src/webrtc/` | ✅ |

### DTOs

| DTO | Purpose | Location | Status |
|-----|---------|----------|--------|
| MediaPermissionsDto | Permission requests | `backend/src/webrtc/dto/` | ✅ |
| StartStreamDto | Stream configuration | `backend/src/webrtc/dto/` | ✅ |
| StopStreamDto | Stop stream | `backend/src/webrtc/dto/` | ✅ |
| WebRTCOfferDto | SDP offer | `backend/src/webrtc/dto/` | ✅ |
| WebRTCAnswerDto | SDP answer | `backend/src/webrtc/dto/` | ✅ |
| ICECandidateDto | ICE candidate | `backend/src/webrtc/dto/` | ✅ |

---

## Data Flow

### Media Stream Initialization Flow

```
1. User joins meeting room
2. VideoCallRoom component mounts
3. useMediaStream.startStream() called
   - Requests camera/microphone permissions
   - getUserMedia() with HD constraints (720p, 30fps)
   - Applies echo cancellation & noise suppression
4. If successful:
   - Local stream stored in state
   - WebRTC peer connection initialized
   - Socket.io connection established
   - Local stream added to peer connection
5. If failed:
   - Error captured
   - PermissionError component shown
   - Retry option available
```

### WebRTC Signaling Flow (Peer-to-Peer Connection)

```
User A (Caller)                Backend (Signaling)           User B (Callee)
     │                                │                             │
     ├─── Join WebRTC Room ──────────►│                             │
     │                                ├─── Notify User B ──────────►│
     │                                │                             │
     ├─── Create Offer (SDP) ────────►│                             │
     │                                ├─── Forward Offer ──────────►│
     │                                │                             │
     │                                │◄─── Create Answer (SDP) ────┤
     │◄─── Forward Answer ────────────┤                             │
     │                                │                             │
     ├─── ICE Candidate ─────────────►│                             │
     │                                ├─── Forward Candidate ──────►│
     │                                │                             │
     │◄─── ICE Candidate ─────────────┤◄─── ICE Candidate ──────────┤
     │                                │                             │
     └────────────── Direct P2P Media Stream ────────────────────────┘
```

### Device Selection Flow

```
1. User clicks Settings button
2. MediaSettings modal opens
3. useMediaDevices hook:
   - Calls navigator.mediaDevices.enumerateDevices()
   - Returns available audio/video devices
4. User selects different device
5. useMediaStream.switchDevice() called:
   - Stops current stream
   - Calls getUserMedia() with new deviceId
   - Restarts stream with selected device
6. Peer connection updated with new stream
```

### Reconnection Flow

```
1. Connection state becomes 'disconnected' or 'failed'
2. useWebRTC detects state change
3. Reconnection logic triggered:
   - Check if already reconnecting (prevent duplicate)
   - Check reconnect attempts < 5 (max limit)
   - Wait 2 seconds
   - Call peerConnection.restartIce()
4. If successful:
   - Reset reconnect attempts
   - State becomes 'connected'
5. If all attempts fail:
   - User sees connection failed status
   - Manual retry required
```

---

## API Endpoints Summary

### REST API Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/media/devices` | Get available devices | Required |
| POST | `/media/permissions` | Request permissions | Required |
| POST | `/media/stream/start` | Start media stream | Required |
| POST | `/media/stream/stop` | Stop media stream | Required |
| GET | `/media/connection/status` | Get connection metrics | Required |

### WebSocket Events

| Event | Direction | Purpose | Data |
|-------|-----------|---------|------|
| `webrtc:join-room` | Client → Server | Join WebRTC room | meetingId, userId |
| `webrtc:leave-room` | Client → Server | Leave WebRTC room | meetingId, userId |
| `webrtc:offer` | Client ↔ Server | Send SDP offer | from, to, offer |
| `webrtc:answer` | Client ↔ Server | Send SDP answer | from, to, answer |
| `webrtc:ice-candidate` | Client ↔ Server | Exchange ICE candidates | from, to, candidate |
| `webrtc:user-joined` | Server → Client | User joined notification | userId |
| `webrtc:user-left` | Server → Client | User left notification | userId |
| `webrtc:connection-state` | Client ↔ Server | Connection state update | userId, state |

---

## Technology Decisions

### Decision 1: WebRTC Implementation Approach

**Context**: Need to implement real-time video/audio communication

**Options Considered**:
1. **Native WebRTC (Browser API)** - Direct browser APIs, P2P connection
   - Pros: No external library, full control, peer-to-peer (lower latency)
   - Cons: Complex signaling required, manual ICE handling
2. **SimpleWebRTC/PeerJS** - Abstraction library over WebRTC
   - Pros: Simpler API, built-in signaling
   - Cons: Less control, additional dependency
3. **Third-party service (Twilio/Agora)** - Managed WebRTC service
   - Pros: Production-ready, managed infrastructure
   - Cons: Cost, vendor lock-in, limited customization

**Decision**: Native WebRTC (Browser API)

**Rationale**:
- Full control over implementation
- No additional costs
- Learning opportunity
- Meets all requirements

**Consequences**:
- Need custom signaling server (Socket.io)
- Manual ICE candidate handling
- Custom reconnection logic required

### Decision 2: Signaling Method

**Context**: WebRTC requires signaling to exchange connection info

**Options Considered**:
1. **WebSocket (Socket.io)** - Bidirectional, real-time
   - Pros: Real-time, already using for meetings, bidirectional
   - Cons: Need separate namespace
2. **HTTP Polling** - Regular REST calls
   - Pros: Simple, REST-based
   - Cons: Higher latency, not real-time
3. **Server-Sent Events (SSE)** - Unidirectional push
   - Pros: Simple, server push
   - Cons: Unidirectional only

**Decision**: WebSocket (Socket.io)

**Rationale**:
- Real-time bidirectional communication
- Already integrated in project
- Best for signaling (offer/answer/ICE)

**Consequences**:
- Need separate `/webrtc` namespace
- Handle socket disconnections
- Manage socket lifecycle

### Decision 3: STUN/TURN Server

**Context**: Need ICE servers for NAT traversal

**Options Considered**:
1. **Google Public STUN** - Free public STUN servers
   - Pros: Free, reliable, no setup
   - Cons: STUN only (no TURN), no guaranteed SLA
2. **Self-hosted coturn** - Open-source TURN server
   - Pros: Full control, TURN support
   - Cons: Infrastructure cost, maintenance
3. **Cloud service (Twilio STUN/TURN)** - Managed service
   - Pros: Reliable, both STUN/TURN
   - Cons: Cost

**Decision**: Google Public STUN (with future TURN option)

**Rationale**:
- Free for development/testing
- STUN sufficient for most connections
- Can add TURN later if needed

**Consequences**:
- May fail in restrictive NAT environments
- Plan to add TURN server for production

### Decision 4: Media Constraints

**Context**: Need to define video/audio quality

**Options Considered**:
1. **HD (720p @ 30fps)** - High quality
   - Pros: Clear video, professional quality
   - Cons: Higher bandwidth (1.5 Mbps)
2. **SD (480p @ 24fps)** - Standard quality
   - Pros: Lower bandwidth, works on slow networks
   - Cons: Lower quality
3. **Adaptive** - Dynamic quality adjustment
   - Pros: Best for all networks
   - Cons: Complex implementation

**Decision**: HD (720p @ 30fps) with manual fallback

**Rationale**:
- Spec requirement (NFR-002)
- Modern networks support HD
- User can disable video if needed

**Consequences**:
- Minimum 1.5 Mbps bandwidth required
- May not work on slow connections

---

## Security Considerations

### Media Permissions
- Request permissions explicitly on meeting join
- Handle denied permissions gracefully
- Show clear instructions for enabling
- Privacy message displayed

### WebRTC Security
- ICE candidates validated before use
- Peer connections isolated per meeting
- DTLS for media encryption (built-in WebRTC)
- SRTP for media stream encryption

### Authentication
- All API endpoints require JWT
- WebSocket connections authenticated
- User identity verified before signaling

### Rate Limiting
- Prevent signaling spam
- Limit reconnection attempts (max 5)
- Throttle device enumeration calls

---

## Performance Considerations

### Optimization Strategies

1. **Stream Management**
   - Stop tracks when leaving meeting
   - Release camera/mic when not in use
   - Clean up peer connections properly

2. **Connection Quality**
   - Target latency: <300ms (NFR-001)
   - Monitor packet loss
   - Display quality metrics to user

3. **Device Switching**
   - Target: <2 seconds (NFR-007)
   - Smooth transition between devices
   - No audio/video interruption

4. **Reconnection**
   - Max 5 attempts (prevent infinite loops)
   - 2-second delay (avoid rapid reconnects)
   - ICE restart for connection recovery

---

## Error Handling

### Permission Errors
- `NotAllowedError` - User denied permission
- `NotFoundError` - No devices available
- Show PermissionError component with instructions

### Connection Errors
- `failed` - Connection failed, trigger reconnect
- `disconnected` - Connection lost, trigger reconnect
- Show visual indicator during reconnection

### Device Errors
- Device switch failure - Revert to previous device
- Device unplugged - Fallback to default device
- Show error toast notification

---

## Testing Strategy

### Unit Tests
- Media hooks (useMediaStream, useMediaDevices, useWebRTC)
- WebRTC service methods
- DTO validation

### Integration Tests
- REST API endpoints
- WebSocket signaling flow
- Device enumeration

### E2E Tests (Manual)
- [ ] Join meeting with camera/mic
- [ ] Toggle audio on/off
- [ ] Toggle video on/off
- [ ] Switch audio device
- [ ] Switch video device
- [ ] Test keyboard shortcuts (Ctrl+D, Ctrl+E)
- [ ] Deny permissions and retry
- [ ] Disconnect network and reconnect
- [ ] Multiple participants (2+ users)

---

## Scalability Considerations

### Current Architecture (P2P)
- **Limitation**: Mesh topology, N*(N-1) connections
- **Max participants**: 4-6 (browser limitations)
- **Bandwidth**: Linear increase with participants

### Future Architecture (SFU)
- **Solution**: Selective Forwarding Unit
- **Benefits**: Single upload, server manages distribution
- **Max participants**: 50-100+
- **Bandwidth**: Constant upload, scales better

### Migration Path
1. Current: P2P for MVP (≤6 participants)
2. Future: Add SFU server (mediasoup/Janus)
3. Fallback: P2P for small meetings, SFU for large

---

## Implementation Status

### ✅ Completed

**Backend**
- [x] WebRTC module with REST API
- [x] WebSocket gateway for signaling
- [x] Stream management service
- [x] DTOs for all operations

**Frontend**
- [x] Custom hooks (useMediaStream, useMediaDevices, useWebRTC)
- [x] Zustand store for state management
- [x] UI components (7 components)
- [x] Meeting page integration
- [x] Keyboard shortcuts
- [x] Permission error handling
- [x] Device selection settings
- [x] Auto-reconnection logic

**Features**
- [x] Audio/video toggle
- [x] Device selection
- [x] HD video (720p @ 30fps)
- [x] WebRTC P2P connection
- [x] Connection quality display
- [x] Auto-reconnect (5 attempts, 2s delay)

### 🔄 Future Enhancements

- [ ] SFU architecture for >6 participants
- [ ] TURN server for restrictive NATs
- [ ] Adaptive bitrate (dynamic quality)
- [ ] Audio/video recording
- [ ] Virtual backgrounds
- [ ] Noise cancellation (AI-powered)
- [ ] Screen sharing
- [ ] Picture-in-picture mode
- [ ] Mobile app support

---

## Deployment Checklist

- [x] Frontend build successful
- [x] Backend build successful
- [x] Environment variables configured
- [ ] STUN/TURN servers configured
- [x] WebSocket CORS enabled
- [x] JWT authentication working
- [x] Error logging configured
- [ ] SSL certificates (for production)
- [ ] Load testing completed
- [ ] Browser compatibility verified

---

## Documentation

### API Documentation
- OpenAPI spec: `specs/003-video-audio-engine/contracts/webrtc.yaml`
- Type definitions: `specs/003-video-audio-engine/contracts/types/`

### Code Documentation
- Inline comments in complex functions
- Hook usage examples in components
- WebRTC flow diagrams in this plan

### User Documentation
- Keyboard shortcuts in settings modal
- Permission instructions in error screen
- Connection quality indicators

---

**Status**: ✅ Implementation Complete
**Next Module**: Module 4 (TBD)
