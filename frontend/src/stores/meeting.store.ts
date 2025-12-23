import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import {
  meetingService,
  Meeting,
  Participant,
  CreateMeetingParams,
  JoinMeetingParams,
} from '../services/meeting.service';

interface MeetingState {
  // State
  currentMeeting: Meeting | null;
  participants: Participant[];
  myRole: 'host' | 'participant' | null;
  myParticipant: Participant | null;
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;
  isConnected: boolean;

  // Actions
  createMeeting: (params?: CreateMeetingParams) => Promise<string>;
  getMeeting: (meetingId: string) => Promise<Meeting>;
  joinMeeting: (meetingId: string, params?: JoinMeetingParams) => Promise<void>;
  startMeeting: () => Promise<void>;
  endMeeting: () => Promise<void>;
  leaveMeeting: () => Promise<void>;
  refreshParticipants: () => Promise<void>;
  connectSocket: (meetingId: string, userId: string, userName: string) => void;
  disconnectSocket: () => void;
  clearError: () => void;
  reset: () => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const useMeetingStore = create<MeetingState>((set, get) => ({
  // Initial state
  currentMeeting: null,
  participants: [],
  myRole: null,
  myParticipant: null,
  isLoading: false,
  error: null,
  socket: null,
  isConnected: false,

  // Create a new meeting
  createMeeting: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const meeting = await meetingService.createMeeting(params);
      set({ currentMeeting: meeting, isLoading: false });
      return meeting.meetingId;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create meeting';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  // Get meeting info (public)
  getMeeting: async (meetingId: string) => {
    set({ isLoading: true, error: null });
    try {
      const meeting = await meetingService.getMeeting(meetingId);
      set({ currentMeeting: meeting, isLoading: false });
      return meeting;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Meeting not found';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  // Join a meeting
  joinMeeting: async (meetingId: string, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { meeting, role, participant } = await meetingService.joinMeeting(meetingId, params);
      set({
        currentMeeting: meeting,
        myRole: role,
        myParticipant: participant,
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join meeting';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  // Start meeting (host only)
  startMeeting: async () => {
    const { currentMeeting } = get();
    if (!currentMeeting) return;

    set({ isLoading: true, error: null });
    try {
      const meeting = await meetingService.startMeeting(currentMeeting.meetingId);
      set({ currentMeeting: meeting, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start meeting';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  // End meeting (host only)
  endMeeting: async () => {
    const { currentMeeting } = get();
    if (!currentMeeting) return;

    set({ isLoading: true, error: null });
    try {
      const meeting = await meetingService.endMeeting(currentMeeting.meetingId);
      set({ currentMeeting: meeting, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to end meeting';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  // Leave meeting
  leaveMeeting: async () => {
    const { currentMeeting, socket } = get();
    if (!currentMeeting) return;

    set({ isLoading: true, error: null });
    try {
      await meetingService.leaveMeeting(currentMeeting.meetingId);

      // Disconnect socket
      if (socket) {
        socket.disconnect();
      }

      set({
        currentMeeting: null,
        participants: [],
        myRole: null,
        myParticipant: null,
        socket: null,
        isConnected: false,
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to leave meeting';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  // Refresh participants list
  refreshParticipants: async () => {
    const { currentMeeting } = get();
    if (!currentMeeting) return;

    try {
      const { participants } = await meetingService.getParticipants(currentMeeting.meetingId);
      set({ participants });
    } catch (err) {
      console.error('Failed to refresh participants:', err);
    }
  },

  // Connect to WebSocket
  connectSocket: (meetingId: string, userId: string, userName: string) => {
    const { socket: existingSocket } = get();
    if (existingSocket?.connected) {
      return;
    }

    const socket = io(`${SOCKET_URL}/meetings`, {
      withCredentials: true,
    });

    socket.on('connect', () => {
      set({ isConnected: true });

      // Join room
      socket.emit('room:join', { meetingId, userId, userName }, (response: { success: boolean; participants: Participant[] }) => {
        if (response.success) {
          set({ participants: response.participants as Participant[] });
        }
      });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    // Listen for participant events
    socket.on('participant:joined', (data: { userId: string; userName: string; joinedAt: string }) => {
      get().refreshParticipants();
    });

    socket.on('participant:left', () => {
      get().refreshParticipants();
    });

    socket.on('participant:disconnected', () => {
      get().refreshParticipants();
    });

    // Listen for meeting events
    socket.on('meeting:started', (data: { startedAt: string }) => {
      const { currentMeeting } = get();
      if (currentMeeting) {
        set({
          currentMeeting: {
            ...currentMeeting,
            status: 'active',
            startedAt: data.startedAt,
          },
        });
      }
    });

    socket.on('meeting:ended', (data: { endedAt: string }) => {
      const { currentMeeting } = get();
      if (currentMeeting) {
        set({
          currentMeeting: {
            ...currentMeeting,
            status: 'ended',
            endedAt: data.endedAt,
          },
        });
      }
    });

    socket.on('participants:count', (data: { count: number }) => {
      const { currentMeeting } = get();
      if (currentMeeting) {
        set({
          currentMeeting: {
            ...currentMeeting,
            participantCount: data.count,
          },
        });
      }
    });

    set({ socket });
  },

  // Disconnect from WebSocket
  disconnectSocket: () => {
    const { socket, currentMeeting, myParticipant } = get();
    if (socket) {
      if (currentMeeting && myParticipant) {
        socket.emit('room:leave', {
          meetingId: currentMeeting.meetingId,
          userId: myParticipant.user.id,
        });
      }
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({
      currentMeeting: null,
      participants: [],
      myRole: null,
      myParticipant: null,
      isLoading: false,
      error: null,
      socket: null,
      isConnected: false,
    });
  },
}));
