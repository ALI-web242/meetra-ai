'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '../services/auth.service';
import { CreateMeetingModal, MeetingLinkShare } from '../components/meeting';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdMeeting, setCreatedMeeting] = useState<{ meetingId: string; link: string } | null>(null);
  const [joinMeetingId, setJoinMeetingId] = useState('');

  useEffect(() => {
      const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      // Check if user just logged in and wants to create a meeting
      const action = searchParams.get('action');
      if (action === 'create-meeting' && authenticated) {
        // Small delay to ensure state is ready
        setTimeout(() => {
          setShowCreateModal(true);
          // Clean up URL parameter
          router.replace('/', { scroll: false });
        }, 100);
      }
    };
    
    checkAuth();
    
    // Re-check auth state after a short delay (in case tokens were just set)
    const timeoutId = setTimeout(checkAuth, 200);
    
    return () => clearTimeout(timeoutId);
  }, [searchParams, router]);

  const handleMeetingCreated = (meetingId: string, link: string) => {
    setCreatedMeeting({ meetingId, link });
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinMeetingId.trim()) {
      // Normalize the meeting ID (remove dashes if entered)
      const normalizedId = joinMeetingId.trim().toUpperCase().replace(/-/g, '');
      // Format as XXX-XXX-XXX if it's 9 characters
      const formattedId = normalizedId.length === 9
        ? `${normalizedId.slice(0, 3)}-${normalizedId.slice(3, 6)}-${normalizedId.slice(6, 9)}`
        : joinMeetingId.trim();
      router.push(`/m/${formattedId}`);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meetra AI
          </h1>
          <p className="text-xl text-gray-600">
            Video conferencing made simple
          </p>
        </div>

        {/* Auth Status */}
        {isAuthenticated && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        )}

        {/* Created Meeting Info */}
        {createdMeeting && (
          <div className="mb-8">
            <MeetingLinkShare
              meetingId={createdMeeting.meetingId}
              link={createdMeeting.link}
            />
            <div className="mt-4 flex gap-3">
              <Link
                href={`/m/${createdMeeting.meetingId}`}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Join Your Meeting
              </Link>
              <button
                onClick={() => setCreatedMeeting(null)}
                className="py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Meeting Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Create Meeting Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Meeting</h2>
            <p className="text-gray-600 mb-6">
              Start a new meeting and invite participants with a link.
            </p>
            {isAuthenticated ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                New Meeting
              </button>
            ) : (
              <Link
                href="/login?redirect=/&action=create-meeting"
                className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In to Create
              </Link>
            )}
          </div>

          {/* Join Meeting Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Join Meeting</h2>
            <p className="text-gray-600 mb-4">
              Enter a meeting ID to join an existing meeting.
            </p>
            <form onSubmit={handleJoinMeeting}>
              <input
                type="text"
                value={joinMeetingId}
                onChange={(e) => setJoinMeetingId(e.target.value)}
                placeholder="XXX-XXX-XXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow uppercase tracking-wider text-center font-mono"
                maxLength={11}
              />
              <button
                type="submit"
                disabled={!joinMeetingId.trim()}
                className="inline-flex items-center justify-center w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Meeting
              </button>
            </form>
          </div>
        </div>

        {/* Auth Cards (if not authenticated) */}
        {!isAuthenticated && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Register Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Register</h2>
              <p className="text-gray-600 mb-6">
                Create an account to host meetings and access all features.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Create Account
              </Link>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600 mb-6">
                Sign in with email/password or Google OAuth.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>Meetra AI - Meeting Creation & Joining Module (spec 002)</p>
        </footer>
      </main>

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleMeetingCreated}
      />
    </div>
  );
}
