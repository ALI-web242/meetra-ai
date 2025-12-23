import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { createRedisClient, REDIS_KEYS, MEETING_TTL } from '../config/redis.config';

interface CachedMeetingState {
  id: string;
  meetingId: string;
  status: string;
  participantCount: number;
}

interface CachedParticipant {
  odentifikasi: string;
  userName: string;
  role: string;
  socketId?: string;
}

@Injectable()
export class MeetingCacheService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis | null = null;

  async onModuleInit() {
    this.redis = createRedisClient();
    if (this.redis) {
      try {
        await this.redis.connect();
      } catch (error) {
        console.error('Failed to connect to Redis:', error);
        this.redis = null;
      }
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }

  isEnabled(): boolean {
    return this.redis !== null;
  }

  async cacheMeetingState(meetingId: string, state: CachedMeetingState): Promise<void> {
    if (!this.redis) return;
    const key = REDIS_KEYS.MEETING_STATE(meetingId);
    await this.redis.setex(key, MEETING_TTL, JSON.stringify(state));
  }

  async getMeetingState(meetingId: string): Promise<CachedMeetingState | null> {
    if (!this.redis) return null;
    const key = REDIS_KEYS.MEETING_STATE(meetingId);
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async invalidateMeetingState(meetingId: string): Promise<void> {
    if (!this.redis) return;
    const key = REDIS_KEYS.MEETING_STATE(meetingId);
    await this.redis.del(key);
  }

  async addParticipant(meetingId: string, participant: CachedParticipant): Promise<void> {
    if (!this.redis) return;
    const key = REDIS_KEYS.MEETING_PARTICIPANTS(meetingId);
    await this.redis.hset(key, participant.odentifikasi, JSON.stringify(participant));
    await this.redis.expire(key, MEETING_TTL);
  }

  async removeParticipant(meetingId: string, odentifikasi: string): Promise<void> {
    if (!this.redis) return;
    const key = REDIS_KEYS.MEETING_PARTICIPANTS(meetingId);
    await this.redis.hdel(key, odentifikasi);
  }

  async getParticipants(meetingId: string): Promise<CachedParticipant[]> {
    if (!this.redis) return [];
    const key = REDIS_KEYS.MEETING_PARTICIPANTS(meetingId);
    const data = await this.redis.hgetall(key);
    return Object.values(data).map((p) => JSON.parse(p));
  }

  async getParticipantCount(meetingId: string): Promise<number> {
    if (!this.redis) return 0;
    const key = REDIS_KEYS.MEETING_PARTICIPANTS(meetingId);
    return this.redis.hlen(key);
  }

  async setParticipantSocket(meetingId: string, odentifikasi: string, socketId: string): Promise<void> {
    if (!this.redis) return;
    const key = REDIS_KEYS.PARTICIPANT_SOCKET(meetingId, odentifikasi);
    await this.redis.setex(key, MEETING_TTL, socketId);
  }

  async getParticipantSocket(meetingId: string, odentifikasi: string): Promise<string | null> {
    if (!this.redis) return null;
    const key = REDIS_KEYS.PARTICIPANT_SOCKET(meetingId, odentifikasi);
    return this.redis.get(key);
  }

  async removeParticipantSocket(meetingId: string, odentifikasi: string): Promise<void> {
    if (!this.redis) return;
    const key = REDIS_KEYS.PARTICIPANT_SOCKET(meetingId, odentifikasi);
    await this.redis.del(key);
  }

  async clearMeetingData(meetingId: string): Promise<void> {
    if (!this.redis) return;
    const stateKey = REDIS_KEYS.MEETING_STATE(meetingId);
    const participantsKey = REDIS_KEYS.MEETING_PARTICIPANTS(meetingId);
    const pattern = 'meeting:' + meetingId + ':socket:*';
    const socketKeys = await this.redis.keys(pattern);
    const allKeys = [stateKey, participantsKey, ...socketKeys];
    if (allKeys.length > 0) {
      await this.redis.del(...allKeys);
    }
  }
}
