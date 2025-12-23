import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    // Use dummy values if not configured (Google OAuth will be disabled)
    const isConfigured =
      clientID &&
      clientSecret &&
      callbackURL &&
      !clientID.includes('your_') &&
      !clientSecret.includes('your_');

    super({
      clientID: isConfigured ? clientID : 'not-configured',
      clientSecret: isConfigured ? clientSecret : 'not-configured',
      callbackURL: callbackURL || 'http://localhost:3000/api/v1/auth/login/google/callback',
      scope: ['email', 'profile'],
    });

    if (!isConfigured) {
      this.logger.warn(
        'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable it.',
      );
    }
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, emails } = profile;
    const user = {
      googleId: id,
      email: emails?.[0]?.value,
      accessToken,
    };
    done(null, user);
  }
}
