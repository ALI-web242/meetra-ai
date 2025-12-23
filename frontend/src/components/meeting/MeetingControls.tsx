'use client';

import { useMeetingStore } from '../../stores/meeting.store';

interface MeetingControlsProps {
  onLeave: () => void;
}

export function MeetingControls({ onLeave }: MeetingControlsProps) {
  const { currentMeeting, myRole, startMeeting, endMeeting, leaveMeeting, isLoading } =
    useMeetingStore();

  if (!currentMeeting) return null;

  const isHost = myRole === 'host';
  const isWaiting = currentMeeting.status === 'waiting';
  const isActive = currentMeeting.status === 'active';
  const isEnded = currentMeeting.status === 'ended';

  const handleStart = async () => {
    try {
      await startMeeting();
    } catch {
      // Error handled by store
    }
  };

  const handleEnd = async () => {
    if (confirm('Are you sure you want to end this meeting for everyone?')) {
      try {
        await endMeeting();
      } catch {
        // Error handled by store
      }
    }
  };

  const handleLeave = async () => {
    const message = isHost
      ? 'As the host, leaving will end the meeting for everyone. Continue?'
      : 'Are you sure you want to leave the meeting?';

    if (confirm(message)) {
      try {
        await leaveMeeting();
        onLeave();
      } catch {
        // Error handled by store
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Start Meeting Button (Host only, waiting status) */}
      {isHost && isWaiting && (
        <button
          onClick={handleStart}
          disabled={isLoading}
          className="py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Start Meeting
        </button>
      )}

      {/* End Meeting Button (Host only, active status) */}
      {isHost && isActive && (
        <button
          onClick={handleEnd}
          disabled={isLoading}
          className="py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
            />
          </svg>
          End Meeting
        </button>
      )}

      {/* Leave Meeting Button */}
      {!isEnded && (
        <button
          onClick={handleLeave}
          disabled={isLoading}
          className="py-2 px-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Leave
        </button>
      )}

      {/* Meeting ended message */}
      {isEnded && (
        <div className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg">
          Meeting has ended
        </div>
      )}
    </div>
  );
}
