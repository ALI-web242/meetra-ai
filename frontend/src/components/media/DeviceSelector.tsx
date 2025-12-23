'use client';

import { useMediaDevices } from '@/hooks/useMediaDevices';
import { useWebRTCStore } from '@/stores/webrtcStore';

interface DeviceSelectorProps {
  type: 'audio' | 'video';
  onDeviceChange: (deviceId: string) => void;
}

export default function DeviceSelector({ type, onDeviceChange }: DeviceSelectorProps) {
  const { devices, loading } = useMediaDevices();
  const selectedAudioDevice = useWebRTCStore((state) => state.selectedAudioDevice);
  const selectedVideoDevice = useWebRTCStore((state) => state.selectedVideoDevice);

  const deviceList = type === 'audio' ? devices.audioInputs : devices.videoInputs;
  const selectedDevice = type === 'audio' ? selectedAudioDevice : selectedVideoDevice;

  if (loading) {
    return <div className="text-sm text-gray-400">Loading devices...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-200">
        {type === 'audio' ? 'Microphone' : 'Camera'}
      </label>
      <select
        value={selectedDevice || ''}
        onChange={(e) => onDeviceChange(e.target.value)}
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Default</option>
        {deviceList.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
    </div>
  );
}
