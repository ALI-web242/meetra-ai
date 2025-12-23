'use client';

import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useWebRTCStore } from '@/stores/webrtcStore';

interface MediaControlsProps {
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall?: () => void;
}

export default function MediaControls({
  onToggleAudio,
  onToggleVideo,
  onEndCall,
}: MediaControlsProps) {
  const isAudioEnabled = useWebRTCStore((state) => state.isAudioEnabled);
  const isVideoEnabled = useWebRTCStore((state) => state.isVideoEnabled);

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-gray-900/80 rounded-lg">
      <button
        onClick={onToggleAudio}
        className={`p-4 rounded-full transition-all ${
          isAudioEnabled
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-red-600 hover:bg-red-700'
        }`}
        title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
      >
        {isAudioEnabled ? (
          <Mic className="w-6 h-6 text-white" />
        ) : (
          <MicOff className="w-6 h-6 text-white" />
        )}
      </button>

      <button
        onClick={onToggleVideo}
        className={`p-4 rounded-full transition-all ${
          isVideoEnabled
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-red-600 hover:bg-red-700'
        }`}
        title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {isVideoEnabled ? (
          <Video className="w-6 h-6 text-white" />
        ) : (
          <VideoOff className="w-6 h-6 text-white" />
        )}
      </button>

      {onEndCall && (
        <button
          onClick={onEndCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
          title="End call"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}
