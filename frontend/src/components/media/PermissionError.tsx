'use client';

import { AlertCircle, Video, Mic } from 'lucide-react';

interface PermissionErrorProps {
  type: 'camera' | 'microphone' | 'both';
  onRetry?: () => void;
  onContinueWithout?: () => void;
}

export default function PermissionError({
  type,
  onRetry,
  onContinueWithout
}: PermissionErrorProps) {
  const getTitle = () => {
    switch (type) {
      case 'camera':
        return 'Camera Permission Required';
      case 'microphone':
        return 'Microphone Permission Required';
      case 'both':
        return 'Camera & Microphone Permission Required';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'camera':
        return 'We need access to your camera to show your video in the meeting.';
      case 'microphone':
        return 'We need access to your microphone so others can hear you.';
      case 'both':
        return 'We need access to your camera and microphone to participate in the meeting.';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'camera':
        return <Video className="w-12 h-12 text-yellow-600" />;
      case 'microphone':
        return <Mic className="w-12 h-12 text-yellow-600" />;
      case 'both':
        return <AlertCircle className="w-12 h-12 text-yellow-600" />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gray-900 rounded-lg p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          {getIcon()}
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          {getTitle()}
        </h2>

        <p className="text-gray-300 mb-6">
          {getDescription()}
        </p>

        <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-400 font-medium mb-2">
            How to enable permissions:
          </p>
          <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
            <li>Click the camera/microphone icon in your browser&apos;s address bar</li>
            <li>Select &quot;Allow&quot; for camera and microphone access</li>
            <li>Refresh the page or click &quot;Retry&quot; below</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          )}

          {onContinueWithout && type !== 'both' && (
            <button
              onClick={onContinueWithout}
              className="flex-1 py-3 px-6 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Without {type === 'camera' ? 'Video' : 'Audio'}
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Your privacy is important. We only use your camera and microphone during meetings.
        </p>
      </div>
    </div>
  );
}
