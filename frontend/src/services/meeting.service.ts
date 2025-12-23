import { authService } from './auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
}

export interface Meeting {
  id: string;
  meetingId: string;
  name: string;
  hasPassword: boolean;
  status: 'waiting' | 'active' | 'ended';
  host: UserSummary;
  participantCount: number;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
}

export interface MeetingCreated extends Meeting {
  link: string;
}

export interface Participant {
  id: string;
  user: UserSummary;
  role: 'host' | 'participant';
  joinedAt: string;
  leftAt: string | null;
}

export interface JoinMeetingResponse {
  meeting: Meeting;
  role: 'host' | 'participant';
  participant: Participant;
}

export interface CreateMeetingParams {
  name?: string;
  password?: string;
}

export interface JoinMeetingParams {
  password?: string;
}

class MeetingService {
  async createMeeting(params: CreateMeetingParams = {}): Promise<MeetingCreated> {
    const response = await authService.authenticatedFetch(
      `${API_BASE_URL}/meetings`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create meeting');
    }

    return response.json();
  }

  async getMeeting(meetingId: string): Promise<Meeting> {
    // Public endpoint - no auth required
    const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Meeting not found');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to get meeting');
    }

    return response.json();
  }

  async joinMeeting(meetingId: string, params: JoinMeetingParams = {}): Promise<JoinMeetingResponse> {
    const response = await authService.authenticatedFetch(
      `${API_BASE_URL}/meetings/${meetingId}/join`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to join meeting');
    }

    return response.json();
  }

  async startMeeting(meetingId: string): Promise<Meeting> {
    const response = await authService.authenticatedFetch(
      `${API_BASE_URL}/meetings/${meetingId}/start`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to start meeting');
    }

    return response.json();
  }

  async endMeeting(meetingId: string): Promise<Meeting> {
    const response = await authService.authenticatedFetch(
      `${API_BASE_URL}/meetings/${meetingId}/end`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to end meeting');
    }

    return response.json();
  }

  async leaveMeeting(meetingId: string): Promise<{ success: boolean; message: string }> {
    const response = await authService.authenticatedFetch(
      `${API_BASE_URL}/meetings/${meetingId}/leave`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to leave meeting');
    }

    return response.json();
  }

  async getParticipants(meetingId: string): Promise<{ participants: Participant[]; count: number }> {
    const response = await authService.authenticatedFetch(
      `${API_BASE_URL}/meetings/${meetingId}/participants`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get participants');
    }

    return response.json();
  }
}

export const meetingService = new MeetingService();
export default meetingService;
