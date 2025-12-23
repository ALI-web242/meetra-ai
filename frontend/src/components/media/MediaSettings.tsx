'use client';

import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import DeviceSelector from './DeviceSelector';

interface MediaSettingsProps {
  onAudioDeviceChange: (deviceId: string) => void;
  onVideoDeviceChange: (deviceId: string) => void;
}

export default function MediaSettings({
  onAudioDeviceChange,
  onVideoDeviceChange,
}: MediaSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
        title="Settings"
      >
        <Settings className="w-5 h-5 text-white" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Media Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <DeviceSelector
                type="audio"
                onDeviceChange={onAudioDeviceChange}
              />

              <DeviceSelector
                type="video"
                onDeviceChange={onVideoDeviceChange}
              />

              <div className="pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 space-y-2">
                  <p className="font-medium">Keyboard Shortcuts:</p>
                  <div className="space-y-1">
                    <p><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+D</kbd> Toggle Microphone</p>
                    <p><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+E</kbd> Toggle Camera</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
