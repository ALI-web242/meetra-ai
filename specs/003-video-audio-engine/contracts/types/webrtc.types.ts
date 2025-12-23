// WebRTC Signaling Types
export interface RTCSessionDescription {
  type: 'offer' | 'answer';
  sdp: string;
}

export interface RTCIceCandidate {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
}

export interface WebRTCOfferRequest {
  meetingId: string;
  offer: RTCSessionDescription;
}

export interface WebRTCAnswerRequest {
  meetingId: string;
  answer: RTCSessionDescription;
}

export interface ICECandidateRequest {
  meetingId: string;
  candidate: RTCIceCandidate;
}

export interface WebRTCSignalResponse {
  success: boolean;
  message: string;
  meetingId: string;
}

// Connection Status
export type ConnectionState = 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';
export type IceConnectionState = 'new' | 'checking' | 'connected' | 'completed' | 'failed' | 'disconnected' | 'closed';
export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor';

export interface ConnectionMetrics {
  latency: number; // milliseconds
  bitrate: {
    video: number; // kbps
    audio: number; // kbps
  };
  packetLoss: number; // percentage
  jitter: number; // milliseconds
  quality: ConnectionQuality;
}

export interface ConnectionStatusResponse {
  meetingId: string;
  connectionState: ConnectionState;
  iceConnectionState: IceConnectionState;
  metrics: ConnectionMetrics;
}

// WebRTC Configuration
export interface ICEServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface RTCConfiguration {
  iceServers: ICEServerConfig[];
  iceTransportPolicy?: 'all' | 'relay';
  bundlePolicy?: 'balanced' | 'max-compat' | 'max-bundle';
  rtcpMuxPolicy?: 'negotiate' | 'require';
}

// Peer Connection State (for frontend store)
export interface PeerConnectionState {
  peerConnection: RTCPeerConnection | null;
  connectionState: ConnectionState;
  iceConnectionState: IceConnectionState;
  isReconnecting: boolean;
  reconnectAttempts: number;
  metrics: ConnectionMetrics | null;
}

// WebRTC Events (Socket.io)
export interface WebRTCEvents {
  'webrtc:offer': (data: { from: string; offer: RTCSessionDescription }) => void;
  'webrtc:answer': (data: { from: string; answer: RTCSessionDescription }) => void;
  'webrtc:ice-candidate': (data: { from: string; candidate: RTCIceCandidate }) => void;
  'webrtc:connection-state': (data: { userId: string; state: ConnectionState }) => void;
}
