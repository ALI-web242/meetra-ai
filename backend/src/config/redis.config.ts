import { Redis } from 'ioredis';

export function createRedisClient(): Redis | null {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log('REDIS_URL not configured - Redis features disabled');
    return null;
  }

  try {
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redis.on('connect', () => {
      console.log('Redis connected successfully');
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err.message);
    });

    return redis;
  } catch (error) {
    console.error('Failed to create Redis client:', error);
    return null;
  }
}

// Redis keys for meeting state
export const REDIS_KEYS = {
  MEETING_STATE: (meetingId: string) => `meeting:${meetingId}:state`,
  MEETING_PARTICIPANTS: (meetingId: string) => `meeting:${meetingId}:participants`,
  PARTICIPANT_SOCKET: (meetingId: string, odentifikasi: string) =>
    `meeting:${meetingId}:socket:${odentifikasi}`,
};

// TTL for meeting data (24 hours)
export const MEETING_TTL = 86400;
