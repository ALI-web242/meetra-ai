import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { StartStreamDto } from './dto/start-stream.dto';
import { StopStreamDto } from './dto/stop-stream.dto';
import { v4 as uuidv4 } from 'uuid';

interface StreamInfo {
  streamId: string;
  meetingId: string;
  userId: string;
  constraints: any;
  startedAt: Date;
}

interface ConnectionMetrics {
  latency: number;
  bitrate: {
    video: number;
    audio: number;
  };
  packetLoss: number;
  jitter: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

@Injectable()
export class WebRTCService {
  private readonly logger = new Logger(WebRTCService.name);
  private activeStreams: Map<string, StreamInfo> = new Map();
  private connectionMetrics: Map<string, ConnectionMetrics> = new Map();

  async startStream(userId: string, dto: StartStreamDto): Promise<any> {
    const streamId = uuidv4();

    const streamInfo: StreamInfo = {
      streamId,
      meetingId: dto.meetingId,
      userId,
      constraints: dto.constraints,
      startedAt: new Date(),
    };

    this.activeStreams.set(streamId, streamInfo);

    this.logger.log(`Stream ${streamId} started for user ${userId} in meeting ${dto.meetingId}`);

    return {
      streamId,
      meetingId: dto.meetingId,
      constraints: dto.constraints,
      startedAt: streamInfo.startedAt.toISOString(),
    };
  }

  async stopStream(dto: StopStreamDto): Promise<void> {
    const streamInfo = this.activeStreams.get(dto.streamId);

    if (!streamInfo) {
      throw new NotFoundException(`Stream with ID ${dto.streamId} not found`);
    }

    this.activeStreams.delete(dto.streamId);
    this.connectionMetrics.delete(dto.streamId);

    this.logger.log(`Stream ${dto.streamId} stopped`);
  }

  async getConnectionStatus(meetingId: string): Promise<any> {
    const streams = Array.from(this.activeStreams.values()).filter(
      (stream) => stream.meetingId === meetingId,
    );

    if (streams.length === 0) {
      throw new NotFoundException(`No active streams found for meeting ${meetingId}`);
    }

    const streamId = streams[0].streamId;
    const metrics = this.connectionMetrics.get(streamId) || this.getDefaultMetrics();

    return {
      meetingId,
      connectionState: 'connected',
      iceConnectionState: 'connected',
      metrics,
    };
  }

  updateConnectionMetrics(streamId: string, metrics: Partial<ConnectionMetrics>): void {
    const existing = this.connectionMetrics.get(streamId) || this.getDefaultMetrics();
    this.connectionMetrics.set(streamId, { ...existing, ...metrics });
  }

  private getDefaultMetrics(): ConnectionMetrics {
    return {
      latency: 45,
      bitrate: {
        video: 1500,
        audio: 128,
      },
      packetLoss: 0.5,
      jitter: 10,
      quality: 'good',
    };
  }

  getActiveStreamsForMeeting(meetingId: string): StreamInfo[] {
    return Array.from(this.activeStreams.values()).filter(
      (stream) => stream.meetingId === meetingId,
    );
  }

  getStreamInfo(streamId: string): StreamInfo | undefined {
    return this.activeStreams.get(streamId);
  }
}
