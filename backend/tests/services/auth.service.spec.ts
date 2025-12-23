import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { User } from '../../src/user/user.entity';
import { PasswordUtils } from '../../src/utils/password.utils';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'StrongPassword123!',
    };

    it('should successfully register a new user', async () => {
      const mockUser = {
        id: 'user-uuid',
        email: registerDto.email,
        passwordHash: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken', 'access-token');
      expect(result).toHaveProperty('refreshToken', 'refresh-token');
      expect(result).toHaveProperty('expiresIn', 3600);
      expect(result.user).toHaveProperty('id', 'user-uuid');
      expect(result.user).toHaveProperty('email', registerDto.email);
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'existing-user' });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should hash the password before saving', async () => {
      const mockUser = {
        id: 'user-uuid',
        email: registerDto.email,
        passwordHash: 'hashed-password',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('token');

      await service.register(registerDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          passwordHash: expect.any(String),
        }),
      );
      // Password should not be stored as plain text
      expect(mockUserRepository.create).not.toHaveBeenCalledWith(
        expect.objectContaining({
          passwordHash: registerDto.password,
        }),
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'StrongPassword123!',
    };

    it('should successfully login with valid credentials', async () => {
      const hashedPassword = await PasswordUtils.hashPassword(loginDto.password);
      const mockUser = {
        id: 'user-uuid',
        email: loginDto.email,
        passwordHash: hashedPassword,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken', 'access-token');
      expect(result).toHaveProperty('refreshToken', 'refresh-token');
      expect(result.user).toHaveProperty('email', loginDto.email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: 'user-uuid',
        email: loginDto.email,
        passwordHash: 'different-hashed-password',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateGoogleUser', () => {
    const googleUser = {
      googleId: 'google-123',
      email: 'google@example.com',
    };

    it('should return tokens for existing Google user', async () => {
      const mockUser = {
        id: 'user-uuid',
        email: googleUser.email,
        googleOAuthId: googleUser.googleId,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.validateGoogleUser(googleUser);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should create new user for new Google user', async () => {
      const mockUser = {
        id: 'new-user-uuid',
        email: googleUser.email,
        googleOAuthId: googleUser.googleId,
        passwordHash: '',
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(null) // No user with googleOAuthId
        .mockResolvedValueOnce(null); // No user with email
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.validateGoogleUser(googleUser);

      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
    });

    it('should link Google account to existing email user', async () => {
      const existingUser = {
        id: 'existing-uuid',
        email: googleUser.email,
        passwordHash: 'some-hash',
        googleOAuthId: null,
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(null) // No user with googleOAuthId
        .mockResolvedValueOnce(existingUser); // User exists with email
      mockUserRepository.save.mockResolvedValue({
        ...existingUser,
        googleOAuthId: googleUser.googleId,
      });
      mockJwtService.signAsync.mockResolvedValue('token');

      await service.validateGoogleUser(googleUser);

      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          googleOAuthId: googleUser.googleId,
        }),
      );
    });
  });
});
