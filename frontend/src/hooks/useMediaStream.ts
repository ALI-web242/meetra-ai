import { useState, useCallback, useRef, useEffect } from 'react';

export interface MediaConstraints {
  audio?: {
    enabled?: boolean;
    deviceId?: string;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
  };
  video?: {
    enabled?: boolean;
    deviceId?: string;
    width?: number;
    height?: number;
    frameRate?: number;
  };
}

export function useMediaStream() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startStream = useCallback(async (constraints: MediaConstraints = {}) => {
    setLoading(true);
    setError(null);

    try {
      const audioConstraints = constraints.audio?.enabled !== false ? {
        echoCancellation: constraints.audio?.echoCancellation ?? true,
        noiseSuppression: constraints.audio?.noiseSuppression ?? true,
        ...(constraints.audio?.deviceId && { deviceId: { exact: constraints.audio.deviceId } }),
      } : false;

      const videoConstraints = constraints.video?.enabled !== false ? {
        width: { ideal: constraints.video?.width ?? 1280 },
        height: { ideal: constraints.video?.height ?? 720 },
        frameRate: { ideal: constraints.video?.frameRate ?? 30 },
        ...(constraints.video?.deviceId && { deviceId: { exact: constraints.video.deviceId } }),
      } : false;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: videoConstraints,
      });

      streamRef.current = stream;
      setLocalStream(stream);
      setIsAudioEnabled(constraints.audio?.enabled !== false);
      setIsVideoEnabled(constraints.video?.enabled !== false);

      return stream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start media stream';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setLocalStream(null);
      setIsAudioEnabled(false);
      setIsVideoEnabled(false);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled((prev) => !prev);
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled((prev) => !prev);
    }
  }, []);

  const switchDevice = useCallback(async (
    deviceType: 'audio' | 'video',
    deviceId: string
  ) => {
    if (!streamRef.current) return;

    try {
      const constraints: MediaConstraints = {
        audio: deviceType === 'audio' ? { deviceId, enabled: true } : { enabled: isAudioEnabled },
        video: deviceType === 'video' ? { deviceId, enabled: true } : { enabled: isVideoEnabled },
      };

      stopStream();
      await startStream(constraints);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch device');
      throw err;
    }
  }, [isAudioEnabled, isVideoEnabled, startStream, stopStream]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    localStream,
    isAudioEnabled,
    isVideoEnabled,
    loading,
    error,
    startStream,
    stopStream,
    toggleAudio,
    toggleVideo,
    switchDevice,
  };
}
