import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { MeetingGateway } from './meeting.gateway';
import { MeetingService } from './meeting.service';

describe('MeetingGateway', () => {
  let app: INestApplication;
  let gateway: MeetingGateway;
  let mockMeetingService: jest.Mocked<MeetingService>;

  const mockParticipants = [
    {
      id: 'p1',
      odentifikasi: 'user-1',
      user: { email: 'user1@test.com' },
      role: 'host',
      joinedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockMeetingService = {
      getParticipants: jest.fn().mockResolvedValue(mockParticipants),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingGateway,
        { provide: MeetingService, useValue: mockMeetingService },
      ],
    }).compile();

    gateway = module.get<MeetingGateway>(MeetingGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should log client connection', () => {
      const mockClient = { id: 'socket-123' } as any;
      const logSpy = jest.spyOn(gateway['logger'], 'log');

      gateway.handleConnection(mockClient);

      expect(logSpy).toHaveBeenCalledWith('Client connected: socket-123');
    });
  });

  describe('handleDisconnect', () => {
    it('should log client disconnection', async () => {
      const mockClient = { id: 'socket-123' } as any;
      const logSpy = jest.spyOn(gateway['logger'], 'log');

      await gateway.handleDisconnect(mockClient);

      expect(logSpy).toHaveBeenCalledWith('Client disconnected: socket-123');
    });

    it('should notify room when tracked user disconnects', async () => {
      const mockServer = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      };
      gateway['server'] = mockServer as any;

      // Track user
      gateway['socketUserMap'].set('socket-123', {
        meetingId: 'ABC-DEF-GHI',
        odentifikasi: 'user-1',
      });

      const mockClient = { id: 'socket-123' } as any;

      await gateway.handleDisconnect(mockClient);

      expect(mockServer.to).toHaveBeenCalledWith('ABC-DEF-GHI');
      expect(mockServer.emit).toHaveBeenCalledWith('participant:disconnected', {
        odentifikasi: 'user-1',
      });
    });
  });

  describe('handleJoinRoom', () => {
    it('should join socket room and return participants', async () => {
      const mockClient = {
        id: 'socket-123',
        join: jest.fn(),
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      } as any;

      const payload = {
        meetingId: 'ABC-DEF-GHI',
        odentifikasi: 'user-1',
        userName: 'Test User',
      };

      const result = await gateway.handleJoinRoom(mockClient, payload);

      expect(mockClient.join).toHaveBeenCalledWith('ABC-DEF-GHI');
      expect(gateway['socketUserMap'].get('socket-123')).toEqual({
        meetingId: 'ABC-DEF-GHI',
        odentifikasi: 'user-1',
      });
      expect(result.success).toBe(true);
      expect(result.participants).toBeDefined();
    });

    it('should notify others in room when user joins', async () => {
      const mockClient = {
        id: 'socket-123',
        join: jest.fn(),
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      } as any;

      const payload = {
        meetingId: 'ABC-DEF-GHI',
        odentifikasi: 'user-1',
        userName: 'Test User',
      };

      await gateway.handleJoinRoom(mockClient, payload);

      expect(mockClient.to).toHaveBeenCalledWith('ABC-DEF-GHI');
      expect(mockClient.emit).toHaveBeenCalledWith(
        'participant:joined',
        expect.objectContaining({
          odentifikasi: 'user-1',
          userName: 'Test User',
        })
      );
    });
  });

  describe('handleLeaveRoom', () => {
    it('should leave socket room', async () => {
      const mockClient = {
        id: 'socket-123',
        leave: jest.fn(),
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      } as any;

      gateway['socketUserMap'].set('socket-123', {
        meetingId: 'ABC-DEF-GHI',
        odentifikasi: 'user-1',
      });

      const payload = {
        meetingId: 'ABC-DEF-GHI',
        odentifikasi: 'user-1',
      };

      const result = await gateway.handleLeaveRoom(mockClient, payload);

      expect(mockClient.leave).toHaveBeenCalledWith('ABC-DEF-GHI');
      expect(gateway['socketUserMap'].has('socket-123')).toBe(false);
      expect(result.success).toBe(true);
    });

    it('should notify others when user leaves', async () => {
      const mockClient = {
        id: 'socket-123',
        leave: jest.fn(),
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      } as any;

      const payload = {
        meetingId: 'ABC-DEF-GHI',
        odentifikasi: 'user-1',
      };

      await gateway.handleLeaveRoom(mockClient, payload);

      expect(mockClient.to).toHaveBeenCalledWith('ABC-DEF-GHI');
      expect(mockClient.emit).toHaveBeenCalledWith(
        'participant:left',
        expect.objectContaining({
          odentifikasi: 'user-1',
        })
      );
    });
  });

  describe('broadcastMeetingStarted', () => {
    it('should broadcast meeting started event to room', () => {
      const mockServer = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      };
      gateway['server'] = mockServer as any;

      gateway.broadcastMeetingStarted('ABC-DEF-GHI');

      expect(mockServer.to).toHaveBeenCalledWith('ABC-DEF-GHI');
      expect(mockServer.emit).toHaveBeenCalledWith(
        'meeting:started',
        expect.objectContaining({ startedAt: expect.any(String) })
      );
    });
  });

  describe('broadcastMeetingEnded', () => {
    it('should broadcast meeting ended event to room', () => {
      const mockServer = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      };
      gateway['server'] = mockServer as any;

      gateway.broadcastMeetingEnded('ABC-DEF-GHI');

      expect(mockServer.to).toHaveBeenCalledWith('ABC-DEF-GHI');
      expect(mockServer.emit).toHaveBeenCalledWith(
        'meeting:ended',
        expect.objectContaining({ endedAt: expect.any(String) })
      );
    });
  });

  describe('broadcastParticipantCount', () => {
    it('should broadcast participant count to room', () => {
      const mockServer = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      };
      gateway['server'] = mockServer as any;

      gateway.broadcastParticipantCount('ABC-DEF-GHI', 5);

      expect(mockServer.to).toHaveBeenCalledWith('ABC-DEF-GHI');
      expect(mockServer.emit).toHaveBeenCalledWith('participants:count', { count: 5 });
    });
  });
});

// Integration test with actual socket connection
describe('MeetingGateway Integration', () => {
  let app: INestApplication;
  let clientSocket: Socket;
  let clientSocket2: Socket;

  // Skip these tests if not running integration tests
  const itIf = (condition: boolean) => (condition ? it : it.skip);

  beforeAll(async () => {
    // This would need actual app setup with WebSocket adapter
    // Skipping for unit test purposes
  });

  afterAll(async () => {
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
    if (clientSocket2?.connected) {
      clientSocket2.disconnect();
    }
    if (app) {
      await app.close();
    }
  });

  itIf(false)('should allow multiple clients to join same room', async () => {
    // Integration test placeholder
    // Would test actual socket connections
  });

  itIf(false)('should broadcast events to all room participants', async () => {
    // Integration test placeholder
  });
});
