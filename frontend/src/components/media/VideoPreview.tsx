'use client';

import { useEffect, useRef } from 'react';
import { UserCircle } from 'lucide-react';

interface VideoPreviewProps {
  stream: MediaStream | null;
  username?: string;
  isLocal?: boolean;
  muted?: boolean;
}

export default function VideoPreview({
  stream,
  username = 'User',
  isLocal = false,
  muted = false,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const hasVideo = stream?.getVideoTracks().some((track) => track.enabled);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <UserCircle className="w-24 h-24 text-gray-600" />
        </div>
      )}

      <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 rounded-full">
        <p className="text-white text-sm font-medium">
          {isLocal ? `${username} (You)` : username}
        </p>
      </div>

      {isLocal && (
        <div className="absolute top-4 left-4 px-2 py-1 bg-blue-600 rounded text-xs text-white font-medium">
          LOCAL
        </div>
      )}
    </div>
  );
}
