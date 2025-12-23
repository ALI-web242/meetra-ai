import { create } from 'zustand';

export interface MediaDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'videoinput' | 'audiooutput';
}

export interface MediaDevices {
  audioInputs: MediaDevice[];
  videoInputs: MediaDevice[];
  audioOutputs: MediaDevice[];
}

export type ConnectionState = 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';

export interface ConnectionMetrics {
  latency: number;
  bitrate: {
    video: number;
    audio: number;
  };
  packetLoss: number;
  jitter: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface WebRTCState {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  selectedAudioDevice: string | null;
  selectedVideoDevice: string | null;
  availableDevices: MediaDevices | null;
  permissionsGranted: {
    audio: boolean;
    video: boolean;
  };
  peerConnection: RTCPeerConnection | null;
  connectionState: ConnectionState;
  isReconnecting: boolean;
  reconnectAttempts: number;
  metrics: ConnectionMetrics | null;

  setLocalStream: (stream: MediaStream | null) => void;
  addRemoteStream: (userId: string, stream: MediaStream) => void;
  removeRemoteStream: (userId: string) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setVideoEnabled: (enabled: boolean) => void;
  setSelectedAudioDevice: (deviceId: string) => void;
  setSelectedVideoDevice: (deviceId: string) => void;
  setAvailableDevices: (devices: MediaDevices) => void;
  setPermissionsGranted: (audio: boolean, video: boolean) => void;
  setPeerConnection: (pc: RTCPeerConnection | null) => void;
  setConnectionState: (state: ConnectionState) => void;
  setReconnecting: (isReconnecting: boolean) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
  setMetrics: (metrics: ConnectionMetrics) => void;
  reset: () => void;
}

const initialState = {
  localStream: null,
  remoteStreams: new Map(),
  isAudioEnabled: true,
  isVideoEnabled: true,
  selectedAudioDevice: null,
  selectedVideoDevice: null,
  availableDevices: null,
  permissionsGranted: {
    audio: false,
    video: false,
  },
  peerConnection: null,
  connectionState: 'new' as ConnectionState,
  isReconnecting: false,
  reconnectAttempts: 0,
  metrics: null,
};

export const useWebRTCStore = create<WebRTCState>((set) => ({
  ...initialState,

  setLocalStream: (stream) => set({ localStream: stream }),

  addRemoteStream: (userId, stream) =>
    set((state) => {
      const newMap = new Map(state.remoteStreams);
      newMap.set(userId, stream);
      return { remoteStreams: newMap };
    }),

  removeRemoteStream: (userId) =>
    set((state) => {
      const newMap = new Map(state.remoteStreams);
      newMap.delete(userId);
      return { remoteStreams: newMap };
    }),

  setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),

  setVideoEnabled: (enabled) => set({ isVideoEnabled: enabled }),

  setSelectedAudioDevice: (deviceId) => set({ selectedAudioDevice: deviceId }),

  setSelectedVideoDevice: (deviceId) => set({ selectedVideoDevice: deviceId }),

  setAvailableDevices: (devices) => set({ availableDevices: devices }),

  setPermissionsGranted: (audio, video) =>
    set({ permissionsGranted: { audio, video } }),

  setPeerConnection: (pc) => set({ peerConnection: pc }),

  setConnectionState: (state) => set({ connectionState: state }),

  setReconnecting: (isReconnecting) => set({ isReconnecting }),

  incrementReconnectAttempts: () =>
    set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),

  resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),

  setMetrics: (metrics) => set({ metrics }),

  reset: () => set(initialState),
}));
