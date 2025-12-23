'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMeetingStore } from '../../../stores/meeting.store';
import { JoinMeetingForm } from '../../../components/meeting/JoinMeetingForm';
import { MeetingControls } from '../../../components/meeting/MeetingControls';
import { ParticipantsList } from '../../../components/meeting/ParticipantsList';
import VideoCallRoom from '../../../components/media/VideoCallRoom';
import { authService } from '../../../services/auth.service';
import Link from 'next/link';

type PageState = 'loading' | 'not-found' | 'preview' | 'joining' | 'room' | 'ended';

export default function MeetingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.meetingId as string;

  const [pageState, setPageState] = useState<PageState>('loading');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    currentMeeting,
    myRole,
    myParticipant,
    error,
    isConnected,
    getMeeting,
    connectSocket,
    disconnectSocket,
    reset,
    clearError,
  } = useMeetingStore();

  // Check authentication
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  // Load meeting info on mount
  useEffect(() => {
    const loadMeeting = async () => {
      try {
        const meeting = await getMeeting(meetingId);
        if (meeting.status === 'ended') {
          setPageState('ended');
        } else {
          setPageState('preview');
        }
      } catch {
        setPageState('not-found');
      }
    };

    loadMeeting();

    return () => {
      disconnectSocket();
      reset();
    };
  }, [meetingId]);

  // Connect socket after joining
  useEffect(() => {
    if (pageState === 'room' && myParticipant && currentMeeting) {
      connectSocket(
        currentMeeting.meetingId,
        myParticipant.user.id,
        myParticipant.user.name
      );
    }
  }, [pageState, myParticipant, currentMeeting]);

  const handleJoined = () => {
    setPageState('room');
  };

  const handleLeave = () => {
    router.push('/');
  };

  // Loading state
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading meeting...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (pageState === 'not-found') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Meeting Not Found</h1>
          <p className="text-gray-600 mb-6">
            The meeting you&apos;re looking for doesn&apos;t exist or may have been deleted.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Meeting ended state
  if (pageState === 'ended') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Meeting Has Ended</h1>
          <p className="text-gray-600 mb-6">
            This meeting has already ended.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Preview/Join state
  if (pageState === 'preview' && currentMeeting) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Meeting info */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {currentMeeting.name}
              </h1>
              <p className="text-gray-500 text-sm">
                Meeting ID: <code className="bg-gray-100 px-2 py-0.5 rounded">{currentMeeting.meetingId}</code>
              </p>
            </div>

            {/* Meeting details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Host</span>
                <span className="font-medium text-gray-900">{currentMeeting.host.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${
                  currentMeeting.status === 'waiting' ? 'text-yellow-600' :
                  currentMeeting.status === 'active' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {currentMeeting.status === 'waiting' ? 'Waiting to start' :
                   currentMeeting.status === 'active' ? 'In progress' : 'Ended'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Participants</span>
                <span className="font-medium text-gray-900">{currentMeeting.participantCount}</span>
              </div>
              {currentMeeting.hasPassword && (
                <div className="flex items-center gap-1 text-sm mt-2 text-yellow-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password protected
                </div>
              )}
            </div>

            {/* Auth check */}
            {!isAuthenticated ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Please sign in to join this meeting
                </p>
                <Link
                  href={`/login?redirect=/m/${meetingId}`}
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign In to Join
                </Link>
                <p className="text-sm text-gray-500 mt-3">
                  Or <Link href={`/join/${meetingId}`} className="text-blue-600 hover:underline">join as guest</Link>
                </p>
              </div>
            ) : (
              <JoinMeetingForm
                meetingId={meetingId}
                hasPassword={currentMeeting.hasPassword}
                onJoined={handleJoined}
              />
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
                <button onClick={clearError} className="ml-2 underline">Dismiss</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Meeting room state
  if (pageState === 'room' && currentMeeting) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currentMeeting.name}</h1>
              <p className="text-sm text-gray-500">
                ID: {currentMeeting.meetingId}
                {isConnected && (
                  <span className="ml-2 inline-flex items-center gap-1 text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Connected
                  </span>
                )}
              </p>
            </div>
            <MeetingControls onLeave={handleLeave} />
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main area - video call */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 rounded-xl aspect-video overflow-hidden">
                {myParticipant && currentMeeting.status === 'active' ? (
                  <VideoCallRoom
                    meetingId={currentMeeting.meetingId}
                    userId={myParticipant.user.id}
                    username={myParticipant.user.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400">Video will appear here</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentMeeting.status === 'waiting'
                          ? 'Waiting for host to start the meeting'
                          : 'Meeting in progress'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Meeting status banner */}
              {currentMeeting.status === 'waiting' && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-yellow-800">Waiting for meeting to start</p>
                    <p className="text-sm text-yellow-700">
                      {myRole === 'host'
                        ? 'Click "Start Meeting" when you\'re ready to begin.'
                        : 'The host will start the meeting shortly.'}
                    </p>
                  </div>
                </div>
              )}

              {currentMeeting.status === 'ended' && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-800">Meeting has ended</p>
                    <p className="text-sm text-gray-600">
                      This meeting has concluded.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ParticipantsList />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
