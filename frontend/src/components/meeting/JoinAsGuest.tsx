'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

interface FormErrors {
  general?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface JoinAsGuestProps {
  meetingId: string;
  inviteCode?: string;
}

export default function JoinAsGuest({ meetingId, inviteCode }: JoinAsGuestProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/guest/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meetingId, inviteCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message[0]
          : data.message;
        setErrors({ general: message || 'Failed to join meeting' });
        return;
      }

      // Store guest session token
      if (typeof window !== 'undefined') {
        localStorage.setItem('guestSessionId', data.guestSessionId);
        localStorage.setItem('accessToken', data.accessToken);
      }

      setIsJoined(true);
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isJoined) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-green-600">
          Successfully Joined!
        </h2>
        <p className="text-gray-600">
          You have joined the meeting as a guest.
        </p>
        <p className="text-sm text-gray-500">
          Your session will expire in 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">Join Meeting</h1>
      <p className="text-center text-gray-600">
        You&apos;re joining as a guest. No account required.
      </p>

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-sm text-gray-600">Meeting ID:</p>
        <p className="font-mono text-sm break-all">{meetingId}</p>
      </div>

      <form onSubmit={handleJoin}>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Joining...' : 'Join as Guest'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Want more features?
        </p>
        <Link
          href="/register"
          className="text-blue-600 hover:text-blue-800"
        >
          Create an account
        </Link>
        {' or '}
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-800"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
