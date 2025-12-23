// Media Device Types
export interface MediaDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'videoinput' | 'audiooutput';
}

export interface MediaDevicesResponse {
  audioInputs: MediaDevice[];
  videoInputs: MediaDevice[];
  audioOutputs: MediaDevice[];
}

// Media Permissions
export interface MediaPermissionsRequest {
  audio: boolean;
  video: boolean;
}

export interface MediaPermissionsResponse {
  audio: boolean;
  video: boolean;
  message: string;
}

// Media Stream
export interface AudioConstraints {
  enabled?: boolean;
  deviceId?: string;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
}

export interface VideoConstraints {
  enabled?: boolean;
  deviceId?: string;
  width?: number;
  height?: number;
  frameRate?: number;
}

export interface MediaConstraints {
  audio?: AudioConstraints;
  video?: VideoConstraints;
}

export interface StartStreamRequest {
  meetingId: string;
  constraints: MediaConstraints;
}

export interface StreamResponse {
  streamId: string;
  meetingId: string;
  constraints: MediaConstraints;
  startedAt: string;
}

export interface StopStreamRequest {
  streamId: string;
}

// Media State (for frontend store)
export interface MediaState {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  selectedAudioDevice: string | null;
  selectedVideoDevice: string | null;
  availableDevices: MediaDevicesResponse | null;
  permissionsGranted: {
    audio: boolean;
    video: boolean;
  };
}
