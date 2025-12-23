import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuestSession } from './guest-session.entity';
import { JoinGuestDto } from './dto/join-guest.dto';

export interface GuestJoinResponse {
  guestSessionId: string;
  accessToken: string;
  expiresAt: Date;
}

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(GuestSession)
    private guestSessionRepository: Repository<GuestSession>,
    private jwtService: JwtService,
  ) {}

  async joinMeeting(joinGuestDto: JoinGuestDto): Promise<GuestJoinResponse> {
    const { meetingId, inviteCode } = joinGuestDto;

    // In a real app, validate the meeting exists and invite code is valid
    // For now, we'll just create the session
    if (!meetingId) {
      throw new BadRequestException('Meeting ID is required');
    }

    // Create guest session that expires in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const guestSession = this.guestSessionRepository.create({
      meetingId,
      expiresAt,
    });

    await this.guestSessionRepository.save(guestSession);

    // Generate JWT for guest
    const payload = {
      sub: guestSession.id,
      email: `guest-${guestSession.id}@meetra.local`,
      type: 'guest',
      meetingId,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });

    return {
      guestSessionId: guestSession.id,
      accessToken,
      expiresAt: guestSession.expiresAt,
    };
  }

  async getSession(sessionId: string): Promise<GuestSession | null> {
    return this.guestSessionRepository.findOne({
      where: { id: sessionId },
    });
  }

  async endSession(sessionId: string): Promise<void> {
    await this.guestSessionRepository.delete({ id: sessionId });
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.guestSessionRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}
