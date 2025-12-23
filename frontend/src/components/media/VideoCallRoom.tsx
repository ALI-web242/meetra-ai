'use client';

import { useEffect, useState } from 'react';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useWebRTCStore } from '@/stores/webrtcStore';
import VideoPreview from './VideoPreview';
import MediaControls from './MediaControls';
import ConnectionStatus from './ConnectionStatus';
import PermissionError from './PermissionError';
import MediaSettings from './MediaSettings';

interface VideoCallRoomProps {
  meetingId: string;
  userId: string;
  username: string;
}

export default function VideoCallRoom({ meetingId, userId, username }: VideoCallRoomProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionError, setPermissionError] = useState<'camera' | 'microphone' | 'both' | null>(null);

  const {
    localStream,
    isAudioEnabled,
    isVideoEnabled,
    error: streamError,
    startStream,
    stopStream,
    toggleAudio,
    toggleVideo,
    switchDevice,
  } = useMediaStream();

  const {
    remoteStream,
    connectionState,
    reconnectAttempts,
    isReconnecting,
    initializePeerConnection,
    connectSocket,
    addLocalStream,
    disconnect,
  } = useWebRTC(meetingId, userId);

  const setLocalStream = useWebRTCStore((state) => state.setLocalStream);
  const setAudioEnabled = useWebRTCStore((state) => state.setAudioEnabled);
  const setVideoEnabled = useWebRTCStore((state) => state.setVideoEnabled);
  const setConnectionState = useWebRTCStore((state) => state.setConnectionState);
  const setReconnecting = useWebRTCStore((state) => state.setReconnecting);

  useEffect(() => {
    const initialize = async () => {
      try {
        setPermissionError(null);
        const stream = await startStream({
          audio: { enabled: true, echoCancellation: true, noiseSuppression: true },
          video: { enabled: true, width: 1280, height: 720, frameRate: 30 },
        });

        initializePeerConnection();
        connectSocket();
        addLocalStream(stream);
        setIsInitialized(true);
      } catch (error: any) {
        console.error('Failed to initialize media:', error);

        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setPermissionError('both');
        } else if (error.name === 'NotFoundError') {
          setPermissionError('both');
        }
      }
    };

    initialize();

    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleAudio();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        toggleVideo();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      stopStream();
      disconnect();
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [meetingId, userId, toggleAudio, toggleVideo]);

  useEffect(() => {
    setLocalStream(localStream);
  }, [localStream, setLocalStream]);

  useEffect(() => {
    setAudioEnabled(isAudioEnabled);
  }, [isAudioEnabled, setAudioEnabled]);

  useEffect(() => {
    setVideoEnabled(isVideoEnabled);
  }, [isVideoEnabled, setVideoEnabled]);

  useEffect(() => {
    setConnectionState(connectionState);
  }, [connectionState, setConnectionState]);

  useEffect(() => {
    setReconnecting(isReconnecting);
  }, [isReconnecting, setReconnecting]);

  const handleToggleAudio = () => {
    toggleAudio();
  };

  const handleToggleVideo = () => {
    toggleVideo();
  };

  const handleEndCall = () => {
    stopStream();
    disconnect();
  };

  const handleRetryPermissions = () => {
    setPermissionError(null);
    setIsInitialized(false);
    window.location.reload();
  };

  const handleAudioDeviceChange = async (deviceId: string) => {
    try {
      await switchDevice('audio', deviceId);
    } catch (error) {
      console.error('Failed to switch audio device:', error);
    }
  };

  const handleVideoDeviceChange = async (deviceId: string) => {
    try {
      await switchDevice('video', deviceId);
    } catch (error) {
      console.error('Failed to switch video device:', error);
    }
  };

  if (permissionError) {
    return (
      <PermissionError
        type={permissionError}
        onRetry={handleRetryPermissions}
      />
    );
  }

  if (!isInitialized) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Initializing video call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <div className="relative">
          <VideoPreview
            stream={localStream}
            username={username}
            isLocal={true}
            muted={true}
          />
        </div>

        <div className="relative">
          <VideoPreview
            stream={remoteStream}
            username="Remote User"
            isLocal={false}
            muted={false}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <ConnectionStatus />
        <div className="flex items-center gap-4">
          <MediaControls
            onToggleAudio={handleToggleAudio}
            onToggleVideo={handleToggleVideo}
            onEndCall={handleEndCall}
          />
          <MediaSettings
            onAudioDeviceChange={handleAudioDeviceChange}
            onVideoDeviceChange={handleVideoDeviceChange}
          />
        </div>
      </div>
    </div>
  );
}
