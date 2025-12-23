import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MeetingService } from './meeting.service';

interface JoinRoomPayload {
  meetingId: string;
  userId: string;
  userName: string;
}

interface LeaveRoomPayload {
  meetingId: string;
  userId: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/meetings',
})
export class MeetingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MeetingGateway.name);

  // Track socket -> user mapping
  private socketUserMap = new Map<string, { meetingId: string; userId: string }>();

  constructor(private readonly meetingService: MeetingService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Get user info from map
    const userInfo = this.socketUserMap.get(client.id);
    if (userInfo) {
      // Notify room that user disconnected
      this.server.to(userInfo.meetingId).emit('participant:disconnected', {
        userId: userInfo.userId,
      });

      this.socketUserMap.delete(client.id);
    }
  }

  @SubscribeMessage('room:join')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ) {
    const { meetingId, userId, userName } = payload;

    // Join the socket room
    client.join(meetingId);

    // Track this socket
    this.socketUserMap.set(client.id, { meetingId, userId });

    this.logger.log(`User ${userName} (${userId}) joined room ${meetingId}`);

    // Notify others in the room
    client.to(meetingId).emit('participant:joined', {
      userId,
      userName,
      joinedAt: new Date().toISOString(),
    });

    // Get current participants
    try {
      const participants = await this.meetingService.getParticipants(meetingId);
      return {
        success: true,
        participants: participants.map((p) => ({
          id: p.id,
          userId: p.userId,
          userName: p.user?.email?.split('@')[0] || 'Unknown',
          role: p.role,
          joinedAt: p.joinedAt,
        })),
      };
    } catch (error) {
      this.logger.error(`Error getting participants: ${error.message}`);
      return { success: true, participants: [] };
    }
  }

  @SubscribeMessage('room:leave')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LeaveRoomPayload,
  ) {
    const { meetingId, userId } = payload;

    // Leave the socket room
    client.leave(meetingId);

    // Remove from tracking
    this.socketUserMap.delete(client.id);

    this.logger.log(`User ${userId} left room ${meetingId}`);

    // Notify others
    client.to(meetingId).emit('participant:left', {
      userId,
      leftAt: new Date().toISOString(),
    });

    return { success: true };
  }

  // Method to broadcast meeting started
  broadcastMeetingStarted(meetingId: string) {
    this.server.to(meetingId).emit('meeting:started', {
      startedAt: new Date().toISOString(),
    });
  }

  // Method to broadcast meeting ended
  broadcastMeetingEnded(meetingId: string) {
    this.server.to(meetingId).emit('meeting:ended', {
      endedAt: new Date().toISOString(),
    });
  }

  // Method to broadcast participant count update
  broadcastParticipantCount(meetingId: string, count: number) {
    this.server.to(meetingId).emit('participants:count', { count });
  }
}
