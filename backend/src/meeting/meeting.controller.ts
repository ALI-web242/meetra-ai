import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { MeetingService } from './meeting.service';
import { Public } from '../auth/public.decorator';
import {
  CreateMeetingDto,
  JoinMeetingDto,
  MeetingResponseDto,
  MeetingCreatedResponseDto,
  JoinMeetingResponseDto,
  ParticipantsResponseDto,
  UserSummaryDto,
  ParticipantDto,
} from './dto';
import { Meeting } from './entities/meeting.entity';
import { Participant } from './entities/participant.entity';
import { User } from '../user/user.entity';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  /**
   * Create a new meeting
   * POST /api/meetings
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMeeting(
    @Body() dto: CreateMeetingDto,
    @Req() req: Request,
  ): Promise<MeetingCreatedResponseDto> {
    const user = req.user as User;
    const meeting = await this.meetingService.createMeeting(user.id, dto);

    return this.toCreatedResponse(meeting);
  }

  /**
   * Get meeting info (public - no auth required)
   * GET /api/meetings/:meetingId
   */
  @Get(':meetingId')
  @Public()
  async getMeeting(
    @Param('meetingId') meetingId: string,
  ): Promise<MeetingResponseDto> {
    const meeting = await this.meetingService.getMeetingByMeetingId(meetingId);
    return this.toResponse(meeting);
  }

  /**
   * Join a meeting
   * POST /api/meetings/:meetingId/join
   */
  @Post(':meetingId/join')
  @HttpCode(HttpStatus.OK)
  async joinMeeting(
    @Param('meetingId') meetingId: string,
    @Body() dto: JoinMeetingDto,
    @Req() req: Request,
  ): Promise<JoinMeetingResponseDto> {
    const user = req.user as User;
    const { meeting, participant } = await this.meetingService.joinMeeting(
      meetingId,
      user.id,
      dto,
    );

    return {
      meeting: this.toResponse(meeting),
      role: participant.role,
      participant: this.toParticipantDto(participant),
    };
  }

  /**
   * Start meeting (host only)
   * POST /api/meetings/:meetingId/start
   */
  @Post(':meetingId/start')
  @HttpCode(HttpStatus.OK)
  async startMeeting(
    @Param('meetingId') meetingId: string,
    @Req() req: Request,
  ): Promise<MeetingResponseDto> {
    const user = req.user as User;
    const meeting = await this.meetingService.startMeeting(meetingId, user.id);
    return this.toResponse(meeting);
  }

  /**
   * End meeting (host only)
   * POST /api/meetings/:meetingId/end
   */
  @Post(':meetingId/end')
  @HttpCode(HttpStatus.OK)
  async endMeeting(
    @Param('meetingId') meetingId: string,
    @Req() req: Request,
  ): Promise<MeetingResponseDto> {
    const user = req.user as User;
    const meeting = await this.meetingService.endMeeting(meetingId, user.id);
    return this.toResponse(meeting);
  }

  /**
   * Leave meeting
   * POST /api/meetings/:meetingId/leave
   */
  @Post(':meetingId/leave')
  @HttpCode(HttpStatus.OK)
  async leaveMeeting(
    @Param('meetingId') meetingId: string,
    @Req() req: Request,
  ): Promise<{ success: boolean; message: string }> {
    const user = req.user as User;
    const { isHost } = await this.meetingService.leaveMeeting(
      meetingId,
      user.id,
    );

    return {
      success: true,
      message: isHost
        ? 'Left meeting. Meeting has ended.'
        : 'Left meeting successfully',
    };
  }

  /**
   * Get meeting participants
   * GET /api/meetings/:meetingId/participants
   */
  @Get(':meetingId/participants')
  async getParticipants(
    @Param('meetingId') meetingId: string,
  ): Promise<ParticipantsResponseDto> {
    const participants =
      await this.meetingService.getParticipants(meetingId);

    return {
      participants: participants.map((p) => this.toParticipantDto(p)),
      count: participants.length,
    };
  }

  // ============ Helper Methods ============

  private toUserSummary(user: User): UserSummaryDto {
    return {
      id: user.id,
      name: user.email.split('@')[0], // Use email prefix as name for now
      email: user.email,
    };
  }

  private toResponse(meeting: Meeting): MeetingResponseDto {
    const activeParticipants = meeting.participants?.filter(
      (p) => p.leftAt === null,
    );

    return {
      id: meeting.id,
      meetingId: meeting.meetingId,
      name: meeting.name,
      hasPassword: !!meeting.passwordHash,
      status: meeting.status,
      host: this.toUserSummary(meeting.host),
      participantCount: activeParticipants?.length || 0,
      createdAt: meeting.createdAt,
      startedAt: meeting.startedAt,
      endedAt: meeting.endedAt,
    };
  }

  private toCreatedResponse(meeting: Meeting): MeetingCreatedResponseDto {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    return {
      ...this.toResponse(meeting),
      link: `${baseUrl}/m/${meeting.meetingId}`,
    };
  }

  private toParticipantDto(participant: Participant): ParticipantDto {
    return {
      id: participant.id,
      user: this.toUserSummary(participant.user),
      role: participant.role,
      joinedAt: participant.joinedAt,
      leftAt: participant.leftAt,
    };
  }
}
