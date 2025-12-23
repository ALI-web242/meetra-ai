import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/user/user.entity';
import { Meeting } from '../../src/meeting/entities/meeting.entity';
import { Participant } from '../../src/meeting/entities/participant.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('MeetingController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let meetingRepository: Repository<Meeting>;
  let participantRepository: Repository<Participant>;
  let jwtService: JwtService;
  let testUser: User;
  let testUser2: User;
  let authToken: string;
  let authToken2: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    userRepository = moduleFixture.get(getRepositoryToken(User));
    meetingRepository = moduleFixture.get(getRepositoryToken(Meeting));
    participantRepository = moduleFixture.get(getRepositoryToken(Participant));
    jwtService = moduleFixture.get(JwtService);

    // Create test users
    const passwordHash = await bcrypt.hash('password123', 10);

    testUser = await userRepository.save({
      email: 'test-meeting@example.com',
      passwordHash,
    });

    testUser2 = await userRepository.save({
      email: 'test-meeting2@example.com',
      passwordHash,
    });

    // Generate JWT tokens
    authToken = jwtService.sign({ sub: testUser.id, email: testUser.email });
    authToken2 = jwtService.sign({ sub: testUser2.id, email: testUser2.email });
  });

  afterAll(async () => {
    // Cleanup
    await participantRepository.delete({});
    await meetingRepository.delete({});
    await userRepository.delete({ id: testUser.id });
    await userRepository.delete({ id: testUser2.id });
    await app.close();
  });

  describe('POST /api/meetings', () => {
    it('should create a meeting without password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'My Test Meeting' })
        .expect(201);

      expect(response.body).toHaveProperty('meetingId');
      expect(response.body).toHaveProperty('link');
      expect(response.body.name).toBe('My Test Meeting');
      expect(response.body.hasPassword).toBe(false);
      expect(response.body.status).toBe('waiting');
      expect(response.body.host.id).toBe(testUser.id);
    });

    it('should create a meeting with password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Protected Meeting', password: 'secret123' })
        .expect(201);

      expect(response.body.hasPassword).toBe(true);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .post('/api/meetings')
        .send({ name: 'Test' })
        .expect(401);
    });
  });

  describe('GET /api/meetings/:meetingId', () => {
    let createdMeetingId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Get Test Meeting' });

      createdMeetingId = response.body.meetingId;
    });

    it('should get meeting info (public endpoint)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/meetings/${createdMeetingId}`)
        .expect(200);

      expect(response.body.meetingId).toBe(createdMeetingId);
      expect(response.body.name).toBe('Get Test Meeting');
    });

    it('should return 404 for non-existent meeting', async () => {
      await request(app.getHttpServer())
        .get('/api/meetings/XXX-XXX-XXX')
        .expect(404);
    });
  });

  describe('POST /api/meetings/:meetingId/join', () => {
    let meetingId: string;
    let protectedMeetingId: string;

    beforeAll(async () => {
      // Create meetings for testing
      const response1 = await request(app.getHttpServer())
        .post('/api/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Join Test Meeting' });
      meetingId = response1.body.meetingId;

      const response2 = await request(app.getHttpServer())
        .post('/api/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Protected Join Test', password: 'secret' });
      protectedMeetingId = response2.body.meetingId;
    });

    it('should allow user to join meeting', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/meetings/${meetingId}/join`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send({})
        .expect(200);

      expect(response.body.meeting).toBeDefined();
      expect(response.body.role).toBe('participant');
      expect(response.body.participant).toBeDefined();
    });

    it('should require password for protected meeting', async () => {
      await request(app.getHttpServer())
        .post(`/api/meetings/${protectedMeetingId}/join`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send({})
        .expect(403);
    });

    it('should allow join with correct password', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/meetings/${protectedMeetingId}/join`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send({ password: 'secret' })
        .expect(200);

      expect(response.body.meeting).toBeDefined();
    });

    it('should reject wrong password', async () => {
      // Create new user for this test
      const passwordHash = await bcrypt.hash('password123', 10);
      const newUser = await userRepository.save({
        email: 'temp-user@example.com',
        passwordHash,
      });
      const newToken = jwtService.sign({ sub: newUser.id, email: newUser.email });

      await request(app.getHttpServer())
        .post(`/api/meetings/${protectedMeetingId}/join`)
        .set('Authorization', `Bearer ${newToken}`)
        .send({ password: 'wrongpassword' })
        .expect(403);

      await userRepository.delete({ id: newUser.id });
    });
  });

  describe('POST /api/meetings/:meetingId/start', () => {
    let meetingId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Start Test Meeting' });
      meetingId = response.body.meetingId;
    });

    it('should allow host to start meeting', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/meetings/${meetingId}/start`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('active');
      expect(response.body.startedAt).toBeDefined();
    });

    it('should not allow non-host to start meeting', async () => {
      // Create new meeting
      const createResponse = await request(app.getHttpServer())
        .post('/api/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Another Meeting' });

      await request(app.getHttpServer())
        .post(`/api/meetings/${createResponse.body.meetingId}/start`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(403);
    });
  });

  describe('POST /api/meetings/:meetingId/end', () => {
    let meetingId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'End Test Meeting' });
      meetingId = response.body.meetingId;

      // Start the meeting first
      await request(app.getHttpServer())
        .post(`/api/meetings/${meetingId}/start`)
        .set('Authorization', `Bearer ${authToken}`);
    });

    it('should allow host to end meeting', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/meetings/${meetingId}/end`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('ended');
      expect(response.body.endedAt).toBeDefined();
    });
  });

  describe('POST /api/meetings/:meetingId/leave', () => {
    let meetingId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Leave Test Meeting' });
      meetingId = response.body.meetingId;

      // Join as second user
      await request(app.getHttpServer())
        .post(`/api/meetings/${meetingId}/join`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send({});
    });

    it('should allow participant to leave meeting', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/meetings/${meetingId}/leave`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/meetings/:meetingId/participants', () => {
    let meetingId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/meetings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Participants Test Meeting' });
      meetingId = response.body.meetingId;

      // Join the meeting as host
      await request(app.getHttpServer())
        .post(`/api/meetings/${meetingId}/join`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
    });

    it('should return participants list', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/meetings/${meetingId}/participants`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.participants).toBeDefined();
      expect(Array.isArray(response.body.participants)).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(1);
    });
  });
});
