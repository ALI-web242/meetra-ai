import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { PasswordUtils } from '../utils/password.utils';
import { RegisterDto, LoginDto } from './dto';
import { JwtPayload } from './jwt.strategy';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse extends AuthTokens {
  user: {
    id: string;
    email: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await PasswordUtils.hashPassword(password);

    // Create user
    const user = this.userRepository.create({
      email,
      passwordHash,
    });

    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const { email, password } = loginDto;

      // Find user
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user has a password (Google OAuth users might not have one)
      if (!user.passwordHash || user.passwordHash.trim() === '') {
        throw new UnauthorizedException(
          'This account was created with Google OAuth. Please use Google login.',
        );
      }

      // Verify password
      const isPasswordValid = await PasswordUtils.comparePassword(
        password,
        user.passwordHash,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      // Re-throw HTTP exceptions as-is
      if (error instanceof UnauthorizedException || error instanceof ConflictException) {
        throw error;
      }
      // Log and re-throw other errors
      console.error('Login error:', error);
      throw new UnauthorizedException('Login failed. Please try again.');
    }
  }

  async validateGoogleUser(googleUser: {
    googleId: string;
    email: string;
  }): Promise<AuthResponse> {
    let user = await this.userRepository.findOne({
      where: { googleOAuthId: googleUser.googleId },
    });

    if (!user) {
      // Check if user exists with this email (registered via email/password)
      user = await this.userRepository.findOne({
        where: { email: googleUser.email },
      });

      if (user) {
        // Link Google account to existing user
        user.googleOAuthId = googleUser.googleId;
        await this.userRepository.save(user);
      } else {
        // Create new user
        user = this.userRepository.create({
          email: googleUser.email,
          googleOAuthId: googleUser.googleId,
          passwordHash: '', // No password for Google OAuth users
        });
        await this.userRepository.save(user);
      }
    }

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'user',
    };

    const expiresIn = 3600; // 1 hour in seconds

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1h' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
