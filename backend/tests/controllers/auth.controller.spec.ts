import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    validateGoogleUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
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

    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    const validRegisterDto = {
      email: 'test@example.com',
      password: 'StrongPassword123!',
    };

    it('should register a new user successfully', async () => {
      const expectedResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
        user: {
          id: 'user-uuid',
          email: validRegisterDto.email,
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(validRegisterDto)
        .expect(201);

      expect(response.body).toEqual(expectedResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(validRegisterDto);
    });

    it('should return 400 for invalid email', async () => {
      const invalidDto = {
        email: 'invalid-email',
        password: 'StrongPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain(
        'Please provide a valid email address',
      );
    });

    it('should return 400 for weak password', async () => {
      const invalidDto = {
        email: 'test@example.com',
        password: 'weak',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain(
        'Password must be at least 8 characters long',
      );
    });

    it('should return 400 for password without uppercase', async () => {
      const invalidDto = {
        email: 'test@example.com',
        password: 'weakpassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(invalidDto)
        .expect(400);

      // Check that the error message mentions uppercase requirement
      const messages = Array.isArray(response.body.message)
        ? response.body.message
        : [response.body.message];
      expect(messages.some((msg: string) => msg.includes('uppercase'))).toBe(true);
    });

    it('should return 400 for missing email', async () => {
      const invalidDto = {
        password: 'StrongPassword123!',
      };

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 for missing password', async () => {
      const invalidDto = {
        email: 'test@example.com',
      };

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login/email', () => {
    const validLoginDto = {
      email: 'test@example.com',
      password: 'StrongPassword123!',
    };

    it('should login successfully with valid credentials', async () => {
      const expectedResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
        user: {
          id: 'user-uuid',
          email: validLoginDto.email,
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login/email')
        .send(validLoginDto)
        .expect(200);

      expect(response.body).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(validLoginDto);
    });

    it('should return 400 for invalid email format', async () => {
      const invalidDto = {
        email: 'not-an-email',
        password: 'SomePassword123!',
      };

      await request(app.getHttpServer())
        .post('/api/v1/auth/login/email')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 for missing credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login/email')
        .send({})
        .expect(400);
    });
  });
});
