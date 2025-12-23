import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MeetingService } from './meeting.service';
import { Meeting, MeetingStatus } from './entities/meeting.entity';
import { Participant, ParticipantRole } from './entities/participant.entity';
import { User } from '../user/user.entity';

// Mock bcrypt
jest.mock('bcrypt');

describe('MeetingService', () => {
  let service: MeetingService;
  let meetingRepository: jest.Mocked<Repository<Meeting>>;
  let participantRepository: jest.Mocked<Repository<Participant>>;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    passwordHash: 'hashed',
    googleId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMeeting: Meeting = {
    id: 'meeting-uuid-123',
    meetingId: 'ABC-DEF-GHI',
    name: 'Test Meeting',
    passwordHash: null,
    hostId: 'user-123',
    host: mockUser,
    status: MeetingStatus.WAITING,
    participants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    startedAt: null,
    endedAt: null,
  };

  const mockParticipant: Participant = {
    id: 'participant-123',
    meetingId: 'meeting-uuid-123',
    meeting: mockMeeting,
    userId: 'user-123',
    user: mockUser,
    role: ParticipantRole.HOST,
    joinedAt: new Date(),
    leftAt: null,
  };

  beforeEach(async () => {
    const mockMeetingRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockParticipantRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    };

    const mockUserRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingService,
        { provide: getRepositoryToken(Meeting), useValue: mockMeetingRepo },
        { provide: getRepositoryToken(Participant), useValue: mockParticipantRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<MeetingService>(MeetingService);
    meetingRepository = module.get(getRepositoryToken(Meeting));
    participantRepository = module.get(getRepositoryToken(Participant));
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMeeting', () => {
    it('should create a meeting without password', async () => {
      meetingRepository.findOne.mockResolvedValue(null); // No collision
      meetingRepository.create.mockReturnValue(mockMeeting);
      meetingRepository.save.mockResolvedValue(mockMeeting);
      participantRepository.create.mockReturnValue(mockParticipant);
      participantRepository.save.mockResolvedValue(mockParticipant);

      // Mock getMeetingById
      const meetingWithRelations = { ...mockMeeting, host: mockUser, participants: [mockParticipant] };
      meetingRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(meetingWithRelations);

      const result = await service.createMeeting('user-123', { name: 'Test Meeting' });

      expect(result).toBeDefined();
      expect(meetingRepository.create).toHaveBeenCalled();
      expect(participantRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: ParticipantRole.HOST })
      );
    });

    it('should create a meeting with password', async () => {
      const hashedPassword = 'hashed-password';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      meetingRepository.findOne.mockResolvedValue(null);
      meetingRepository.create.mockReturnValue({ ...mockMeeting, passwordHash: hashedPassword });
      meetingRepository.save.mockResolvedValue({ ...mockMeeting, passwordHash: hashedPassword });
      participantRepository.create.mockReturnValue(mockParticipant);
      participantRepository.save.mockResolvedValue(mockParticipant);

      const meetingWithRelations = { ...mockMeeting, passwordHash: hashedPassword, host: mockUser, participants: [mockParticipant] };
      meetingRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(meetingWithRelations);

      const result = await service.createMeeting('user-123', { name: 'Test', password: 'secret' });

      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
      expect(result).toBeDefined();
    });

    it('should throw ConflictException after max attempts', async () => {
      // Always return existing meeting (collision)
      meetingRepository.findOne.mockResolvedValue(mockMeeting);

      await expect(service.createMeeting('user-123', {})).rejects.toThrow(ConflictException);
    });
  });

  describe('getMeetingByMeetingId', () => {
    it('should return meeting by meetingId', async () => {
      const meetingWithRelations = { ...mockMeeting, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(meetingWithRelations);

      const result = await service.getMeetingByMeetingId('ABC-DEF-GHI');

      expect(result).toEqual(meetingWithRelations);
      expect(meetingRepository.findOne).toHaveBeenCalledWith({
        where: { meetingId: 'ABC-DEF-GHI' },
        relations: ['host', 'participants', 'participants.user'],
      });
    });

    it('should normalize meeting ID (remove dashes)', async () => {
      const meetingWithRelations = { ...mockMeeting, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(meetingWithRelations);

      await service.getMeetingByMeetingId('abcdefghi');

      expect(meetingRepository.findOne).toHaveBeenCalledWith({
        where: { meetingId: 'ABC-DEF-GHI' },
        relations: ['host', 'participants', 'participants.user'],
      });
    });

    it('should throw NotFoundException if meeting not found', async () => {
      meetingRepository.findOne.mockResolvedValue(null);

      await expect(service.getMeetingByMeetingId('XXX-XXX-XXX')).rejects.toThrow(NotFoundException);
    });
  });

  describe('joinMeeting', () => {
    it('should allow user to join meeting without password', async () => {
      const meetingWithRelations = { ...mockMeeting, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(meetingWithRelations);
      participantRepository.findOne.mockResolvedValue(null); // Not already a participant
      participantRepository.create.mockReturnValue(mockParticipant);
      participantRepository.save.mockResolvedValue(mockParticipant);

      const result = await service.joinMeeting('ABC-DEF-GHI', 'user-456', {});

      expect(result.meeting).toBeDefined();
      expect(result.participant).toBeDefined();
    });

    it('should validate password if meeting has password', async () => {
      const meetingWithPassword = { ...mockMeeting, passwordHash: 'hashed', host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(meetingWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      participantRepository.findOne.mockResolvedValue(null);
      participantRepository.create.mockReturnValue(mockParticipant);
      participantRepository.save.mockResolvedValue(mockParticipant);

      const result = await service.joinMeeting('ABC-DEF-GHI', 'user-456', { password: 'secret' });

      expect(bcrypt.compare).toHaveBeenCalledWith('secret', 'hashed');
      expect(result).toBeDefined();
    });

    it('should throw ForbiddenException for wrong password', async () => {
      const meetingWithPassword = { ...mockMeeting, passwordHash: 'hashed', host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(meetingWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.joinMeeting('ABC-DEF-GHI', 'user-456', { password: 'wrong' })
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if meeting has ended', async () => {
      const endedMeeting = { ...mockMeeting, status: MeetingStatus.ENDED, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(endedMeeting);

      await expect(service.joinMeeting('ABC-DEF-GHI', 'user-456', {})).rejects.toThrow(ForbiddenException);
    });

    it('should rejoin if user was already a participant', async () => {
      const meetingWithRelations = { ...mockMeeting, host: mockUser, participants: [] };
      const leftParticipant = { ...mockParticipant, leftAt: new Date() };

      meetingRepository.findOne.mockResolvedValue(meetingWithRelations);
      participantRepository.findOne.mockResolvedValue(leftParticipant);
      participantRepository.save.mockResolvedValue({ ...leftParticipant, leftAt: null });

      const result = await service.joinMeeting('ABC-DEF-GHI', 'user-123', {});

      expect(result.participant.leftAt).toBeNull();
    });
  });

  describe('startMeeting', () => {
    it('should allow host to start meeting', async () => {
      const waitingMeeting = { ...mockMeeting, status: MeetingStatus.WAITING, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(waitingMeeting);
      meetingRepository.save.mockResolvedValue({ ...waitingMeeting, status: MeetingStatus.ACTIVE });

      const result = await service.startMeeting('ABC-DEF-GHI', 'user-123');

      expect(result.status).toBe(MeetingStatus.ACTIVE);
      expect(result.startedAt).toBeDefined();
    });

    it('should throw ForbiddenException if not host', async () => {
      const meetingWithRelations = { ...mockMeeting, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(meetingWithRelations);

      await expect(service.startMeeting('ABC-DEF-GHI', 'other-user')).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if meeting already started', async () => {
      const activeMeeting = { ...mockMeeting, status: MeetingStatus.ACTIVE, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(activeMeeting);

      await expect(service.startMeeting('ABC-DEF-GHI', 'user-123')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('endMeeting', () => {
    it('should allow host to end meeting', async () => {
      const activeMeeting = { ...mockMeeting, status: MeetingStatus.ACTIVE, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(activeMeeting);
      meetingRepository.save.mockResolvedValue({ ...activeMeeting, status: MeetingStatus.ENDED });
      participantRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.endMeeting('ABC-DEF-GHI', 'user-123');

      expect(result.status).toBe(MeetingStatus.ENDED);
      expect(participantRepository.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if not host', async () => {
      const meetingWithRelations = { ...mockMeeting, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(meetingWithRelations);

      await expect(service.endMeeting('ABC-DEF-GHI', 'other-user')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('leaveMeeting', () => {
    it('should allow participant to leave', async () => {
      const meetingWithRelations = { ...mockMeeting, status: MeetingStatus.ACTIVE, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(meetingWithRelations);
      participantRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.leaveMeeting('ABC-DEF-GHI', 'user-456');

      expect(result.isHost).toBe(false);
      expect(participantRepository.update).toHaveBeenCalled();
    });

    it('should end meeting if host leaves', async () => {
      const activeMeeting = { ...mockMeeting, status: MeetingStatus.ACTIVE, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(activeMeeting);
      participantRepository.update.mockResolvedValue({ affected: 1 } as any);
      meetingRepository.save.mockResolvedValue({ ...activeMeeting, status: MeetingStatus.ENDED });

      const result = await service.leaveMeeting('ABC-DEF-GHI', 'user-123');

      expect(result.isHost).toBe(true);
      expect(meetingRepository.save).toHaveBeenCalled();
    });
  });

  describe('getParticipants', () => {
    it('should return active participants', async () => {
      const meetingWithRelations = { ...mockMeeting, host: mockUser, participants: [] };
      meetingRepository.findOne.mockResolvedValue(meetingWithRelations);
      participantRepository.find.mockResolvedValue([mockParticipant]);

      const result = await service.getParticipants('ABC-DEF-GHI');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockParticipant);
    });
  });
});
