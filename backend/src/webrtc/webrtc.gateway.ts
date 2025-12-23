import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WebRTCService } from './webrtc.service';
import { WebRTCOfferDto, WebRTCAnswerDto, ICECandidateDto } from './dto/webrtc-signal.dto';

@WebSocketGateway({ cors: true, namespace: '/webrtc' })
export class WebRTCGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebRTCGateway.name);
  private connectedUsers: Map<string, Socket> = new Map();

  constructor(private readonly webrtcService: WebRTCService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId || client.id;
    this.connectedUsers.set(userId, client);
    this.logger.log(`Client connected to WebRTC: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth?.userId || client.id;
    this.connectedUsers.delete(userId);
    this.logger.log(`Client disconnected from WebRTC: ${userId}`);
  }

  @SubscribeMessage('webrtc:offer')
  async handleOffer(
    @MessageBody() data: WebRTCOfferDto & { to: string; from: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received offer from ${data.from} to ${data.to}`);

    const targetClient = this.connectedUsers.get(data.to);
    if (targetClient) {
      targetClient.emit('webrtc:offer', {
        from: data.from,
        offer: data.offer,
        meetingId: data.meetingId,
      });

      return { success: true, message: 'Offer sent', meetingId: data.meetingId };
    }

    return { success: false, message: 'Target user not connected' };
  }

  @SubscribeMessage('webrtc:answer')
  async handleAnswer(
    @MessageBody() data: WebRTCAnswerDto & { to: string; from: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received answer from ${data.from} to ${data.to}`);

    const targetClient = this.connectedUsers.get(data.to);
    if (targetClient) {
      targetClient.emit('webrtc:answer', {
        from: data.from,
        answer: data.answer,
        meetingId: data.meetingId,
      });

      return { success: true, message: 'Answer sent', meetingId: data.meetingId };
    }

    return { success: false, message: 'Target user not connected' };
  }

  @SubscribeMessage('webrtc:ice-candidate')
  async handleIceCandidate(
    @MessageBody() data: ICECandidateDto & { to: string; from: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received ICE candidate from ${data.from} to ${data.to}`);

    const targetClient = this.connectedUsers.get(data.to);
    if (targetClient) {
      targetClient.emit('webrtc:ice-candidate', {
        from: data.from,
        candidate: data.candidate,
        meetingId: data.meetingId,
      });

      return { success: true, message: 'ICE candidate sent' };
    }

    return { success: false, message: 'Target user not connected' };
  }

  @SubscribeMessage('webrtc:connection-state')
  async handleConnectionState(
    @MessageBody() data: { meetingId: string; state: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Connection state update: ${data.userId} - ${data.state}`);

    this.server.to(data.meetingId).emit('webrtc:connection-state', {
      userId: data.userId,
      state: data.state,
    });

    return { success: true };
  }

  @SubscribeMessage('webrtc:join-room')
  async handleJoinRoom(
    @MessageBody() data: { meetingId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.meetingId);
    this.logger.log(`User ${data.userId} joined WebRTC room ${data.meetingId}`);

    client.to(data.meetingId).emit('webrtc:user-joined', {
      userId: data.userId,
    });

    return { success: true, message: 'Joined WebRTC room' };
  }

  @SubscribeMessage('webrtc:leave-room')
  async handleLeaveRoom(
    @MessageBody() data: { meetingId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.meetingId);
    this.logger.log(`User ${data.userId} left WebRTC room ${data.meetingId}`);

    client.to(data.meetingId).emit('webrtc:user-left', {
      userId: data.userId,
    });

    return { success: true, message: 'Left WebRTC room' };
  }
}
