import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { GuestController } from '../../src/guest/guest.controller';
import { GuestService } from '../../src/guest/guest.service';

describe('GuestController', () => {
  let app: INestApplication;
  let guestService: GuestService;

  const mockGuestService = {
    joinMeeting: jest.fn(),
    getSession: jest.fn(),
    endSession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestController],
      providers: [
        {
          provide: GuestService,
          useValue: mockGuestService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    guestService = module.get<GuestService>(GuestService);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/guest/join', () => {
    const validJoinDto = {
      meetingId: '550e8400-e29b-41d4-a716-446655440000',
      inviteCode: 'MEETRA-CODE',
    };

    it('should join meeting as guest successfully', async () => {
      const expectedResponse = {
        guestSessionId: 'session-uuid',
        accessToken: 'guest-token',
        expiresAt: new Date().toISOString(),
      };

      mockGuestService.joinMeeting.mockResolvedValue(expectedResponse);

      const response = await request(app.getHttpServer())
        .post('/api/v1/guest/join')
        .send(validJoinDto)
        .expect(200);

      expect(response.body).toHaveProperty('guestSessionId');
      expect(response.body).toHaveProperty('accessToken');
      expect(mockGuestService.joinMeeting).toHaveBeenCalledWith(validJoinDto);
    });

    it('should return 400 for invalid meeting ID', async () => {
      const invalidDto = {
        meetingId: 'not-a-uuid',
        inviteCode: 'MEETRA-CODE',
      };

      await request(app.getHttpServer())
        .post('/api/v1/guest/join')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 for missing meeting ID', async () => {
      const invalidDto = {
        inviteCode: 'MEETRA-CODE',
      };

      await request(app.getHttpServer())
        .post('/api/v1/guest/join')
        .send(invalidDto)
        .expect(400);
    });

    it('should accept request without invite code', async () => {
      const dtoWithoutCode = {
        meetingId: validJoinDto.meetingId,
      };

      const expectedResponse = {
        guestSessionId: 'session-uuid',
        accessToken: 'guest-token',
        expiresAt: new Date().toISOString(),
      };

      mockGuestService.joinMeeting.mockResolvedValue(expectedResponse);

      await request(app.getHttpServer())
        .post('/api/v1/guest/join')
        .send(dtoWithoutCode)
        .expect(200);

      expect(mockGuestService.joinMeeting).toHaveBeenCalledWith(dtoWithoutCode);
    });
  });
});
