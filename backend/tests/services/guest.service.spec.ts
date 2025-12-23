import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { GuestService } from '../../src/guest/guest.service';
import { GuestSession } from '../../src/guest/guest-session.entity';

describe('GuestService', () => {
  let service: GuestService;
  let guestSessionRepository: Repository<GuestSession>;
  let jwtService: JwtService;

  const mockGuestSessionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuestService,
        {
          provide: getRepositoryToken(GuestSession),
          useValue: mockGuestSessionRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<GuestService>(GuestService);
    guestSessionRepository = module.get<Repository<GuestSession>>(
      getRepositoryToken(GuestSession),
    );
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('joinMeeting', () => {
    const validJoinDto = {
      meetingId: '550e8400-e29b-41d4-a716-446655440000',
      inviteCode: 'MEETRA-CODE',
    };

    it('should successfully create a guest session', async () => {
      const mockSession = {
        id: 'session-uuid',
        meetingId: validJoinDto.meetingId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      };

      mockGuestSessionRepository.create.mockReturnValue(mockSession);
      mockGuestSessionRepository.save.mockResolvedValue(mockSession);
      mockJwtService.signAsync.mockResolvedValue('guest-access-token');

      const result = await service.joinMeeting(validJoinDto);

      expect(result).toHaveProperty('guestSessionId', 'session-uuid');
      expect(result).toHaveProperty('accessToken', 'guest-access-token');
      expect(result).toHaveProperty('expiresAt');
    });

    it('should create session with 24 hour expiration', async () => {
      const mockSession = {
        id: 'session-uuid',
        meetingId: validJoinDto.meetingId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      };

      mockGuestSessionRepository.create.mockReturnValue(mockSession);
      mockGuestSessionRepository.save.mockResolvedValue(mockSession);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.joinMeeting(validJoinDto);

      const expiresAt = result.expiresAt;
      const now = new Date();
      const diffHours =
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);

      expect(diffHours).toBeCloseTo(24, 0);
    });

    it('should generate JWT with guest type', async () => {
      const mockSession = {
        id: 'session-uuid',
        meetingId: validJoinDto.meetingId,
        expiresAt: new Date(),
        createdAt: new Date(),
      };

      mockGuestSessionRepository.create.mockReturnValue(mockSession);
      mockGuestSessionRepository.save.mockResolvedValue(mockSession);
      mockJwtService.signAsync.mockResolvedValue('token');

      await service.joinMeeting(validJoinDto);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'guest',
          meetingId: validJoinDto.meetingId,
        }),
        expect.any(Object),
      );
    });

    it('should work without invite code', async () => {
      const dtoWithoutCode = {
        meetingId: validJoinDto.meetingId,
      };

      const mockSession = {
        id: 'session-uuid',
        meetingId: dtoWithoutCode.meetingId,
        expiresAt: new Date(),
        createdAt: new Date(),
      };

      mockGuestSessionRepository.create.mockReturnValue(mockSession);
      mockGuestSessionRepository.save.mockResolvedValue(mockSession);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.joinMeeting(dtoWithoutCode);

      expect(result).toHaveProperty('guestSessionId');
    });
  });

  describe('getSession', () => {
    it('should return session if found', async () => {
      const mockSession = {
        id: 'session-uuid',
        meetingId: 'meeting-uuid',
        expiresAt: new Date(),
      };

      mockGuestSessionRepository.findOne.mockResolvedValue(mockSession);

      const result = await service.getSession('session-uuid');

      expect(result).toEqual(mockSession);
    });

    it('should return null if session not found', async () => {
      mockGuestSessionRepository.findOne.mockResolvedValue(null);

      const result = await service.getSession('nonexistent-uuid');

      expect(result).toBeNull();
    });
  });

  describe('endSession', () => {
    it('should delete the session', async () => {
      mockGuestSessionRepository.delete.mockResolvedValue({ affected: 1 });

      await service.endSession('session-uuid');

      expect(mockGuestSessionRepository.delete).toHaveBeenCalledWith({
        id: 'session-uuid',
      });
    });
  });
});
