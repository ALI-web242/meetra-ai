import { useState, useEffect, useCallback } from 'react';

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

export function useMediaDevices() {
  const [devices, setDevices] = useState<MediaDevices>({
    audioInputs: [],
    videoInputs: [],
    audioOutputs: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();

      const audioInputs: MediaDevice[] = [];
      const videoInputs: MediaDevice[] = [];
      const audioOutputs: MediaDevice[] = [];

      deviceList.forEach((device) => {
        const mediaDevice: MediaDevice = {
          deviceId: device.deviceId,
          label: device.label || `${device.kind} (${device.deviceId.slice(0, 8)})`,
          kind: device.kind as 'audioinput' | 'videoinput' | 'audiooutput',
        };

        if (device.kind === 'audioinput') {
          audioInputs.push(mediaDevice);
        } else if (device.kind === 'videoinput') {
          videoInputs.push(mediaDevice);
        } else if (device.kind === 'audiooutput') {
          audioOutputs.push(mediaDevice);
        }
      });

      setDevices({ audioInputs, videoInputs, audioOutputs });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();

    navigator.mediaDevices.addEventListener('devicechange', fetchDevices);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', fetchDevices);
    };
  }, [fetchDevices]);

  return { devices, loading, error, refetch: fetchDevices };
}
