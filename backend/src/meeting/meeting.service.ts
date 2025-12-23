import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Meeting, MeetingStatus } from './entities/meeting.entity';
import { Participant, ParticipantRole } from './entities/participant.entity';
import { User } from '../user/user.entity';
import { CreateMeetingDto, JoinMeetingDto } from './dto';
import {
  generateMeetingId,
  normalizeMeetingId,
} from './utils/meeting-id.generator';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new meeting
   */
  async createMeeting(userId: string, dto: CreateMeetingDto): Promise<Meeting> {
    // Generate unique meeting ID
    let meetingId: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      meetingId = generateMeetingId();
      const existing = await this.meetingRepository.findOne({
        where: { meetingId },
      });
      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new ConflictException('Failed to generate unique meeting ID');
    }

    // Hash password if provided
    let passwordHash: string | null = null;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    // Create meeting
    const meeting = this.meetingRepository.create({
      meetingId,
      name: dto.name || 'Meeting',
      passwordHash,
      hostId: userId,
      status: MeetingStatus.WAITING,
    });

    const savedMeeting = await this.meetingRepository.save(meeting);

    // Add host as participant
    const participant = this.participantRepository.create({
      meetingId: savedMeeting.id,
      userId,
      role: ParticipantRole.HOST,
    });
    await this.participantRepository.save(participant);

    // Return with relations
    return this.getMeetingById(savedMeeting.id);
  }

  /**
   * Get meeting by internal ID
   */
  async getMeetingById(id: string): Promise<Meeting> {
    const meeting = await this.meetingRepository.findOne({
      where: { id },
      relations: ['host', 'participants', 'participants.user'],
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return meeting;
  }

  /**
   * Get meeting by public meeting ID (XXX-XXX-XXX)
   */
  async getMeetingByMeetingId(meetingId: string): Promise<Meeting> {
    const normalizedId = normalizeMeetingId(meetingId);

    const meeting = await this.meetingRepository.findOne({
      where: { meetingId: normalizedId },
      relations: ['host', 'participants', 'participants.user'],
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return meeting;
  }

  /**
   * Join a meeting
   */
  async joinMeeting(
    meetingId: string,
    userId: string,
    dto: JoinMeetingDto,
  ): Promise<{ meeting: Meeting; participant: Participant }> {
    const meeting = await this.getMeetingByMeetingId(meetingId);

    // Check if meeting has ended
    if (meeting.status === MeetingStatus.ENDED) {
      throw new ForbiddenException('Meeting has ended');
    }

    // Validate password if required
    if (meeting.passwordHash) {
      if (!dto.password) {
        throw new ForbiddenException('Password required');
      }

      const isValid = await bcrypt.compare(dto.password, meeting.passwordHash);
      if (!isValid) {
        throw new ForbiddenException('Invalid password');
      }
    }

    // Check if user is already a participant
    let participant = await this.participantRepository.findOne({
      where: { meetingId: meeting.id, userId },
      relations: ['user'],
    });

    if (participant) {
      // User is rejoining - update leftAt to null
      participant.leftAt = null;
      participant = await this.participantRepository.save(participant);
    } else {
      // New participant
      const role =
        meeting.hostId === userId
          ? ParticipantRole.HOST
          : ParticipantRole.PARTICIPANT;

      participant = this.participantRepository.create({
        meetingId: meeting.id,
        userId,
        role,
      });
      participant = await this.participantRepository.save(participant);

      // Reload with user relation
      participant = await this.participantRepository.findOne({
        where: { id: participant.id },
        relations: ['user'],
      });
    }

    // Reload meeting with updated participants
    const updatedMeeting = await this.getMeetingById(meeting.id);

    return { meeting: updatedMeeting, participant: participant! };
  }

  /**
   * Start meeting (host only)
   */
  async startMeeting(meetingId: string, userId: string): Promise<Meeting> {
    const meeting = await this.getMeetingByMeetingId(meetingId);

    // Verify host
    if (meeting.hostId !== userId) {
      throw new ForbiddenException('Only host can start the meeting');
    }

    // Check status
    if (meeting.status !== MeetingStatus.WAITING) {
      throw new ForbiddenException('Meeting already started or ended');
    }

    // Update status
    meeting.status = MeetingStatus.ACTIVE;
    meeting.startedAt = new Date();

    return this.meetingRepository.save(meeting);
  }

  /**
   * End meeting (host only)
   */
  async endMeeting(meetingId: string, userId: string): Promise<Meeting> {
    const meeting = await this.getMeetingByMeetingId(meetingId);

    // Verify host
    if (meeting.hostId !== userId) {
      throw new ForbiddenException('Only host can end the meeting');
    }

    // Check status
    if (meeting.status === MeetingStatus.ENDED) {
      throw new ForbiddenException('Meeting already ended');
    }

    // Update status
    meeting.status = MeetingStatus.ENDED;
    meeting.endedAt = new Date();

    // Mark all participants as left
    await this.participantRepository.update(
      { meetingId: meeting.id, leftAt: IsNull() },
      { leftAt: new Date() },
    );

    return this.meetingRepository.save(meeting);
  }

  /**
   * Leave meeting
   */
  async leaveMeeting(
    meetingId: string,
    userId: string,
  ): Promise<{ isHost: boolean; meeting: Meeting }> {
    const meeting = await this.getMeetingByMeetingId(meetingId);

    // Update participant
    await this.participantRepository.update(
      { meetingId: meeting.id, userId },
      { leftAt: new Date() },
    );

    const isHost = meeting.hostId === userId;

    // If host leaves and meeting is active, end the meeting
    if (isHost && meeting.status === MeetingStatus.ACTIVE) {
      meeting.status = MeetingStatus.ENDED;
      meeting.endedAt = new Date();

      // Mark all participants as left
      await this.participantRepository.update(
        { meetingId: meeting.id, leftAt: IsNull() },
        { leftAt: new Date() },
      );

      await this.meetingRepository.save(meeting);
    }

    return { isHost, meeting };
  }

  /**
   * Get active participants
   */
  async getParticipants(meetingId: string): Promise<Participant[]> {
    const meeting = await this.getMeetingByMeetingId(meetingId);

    return this.participantRepository.find({
      where: { meetingId: meeting.id, leftAt: IsNull() },
      relations: ['user'],
      order: { joinedAt: 'ASC' },
    });
  }

  /**
   * Get participant count
   */
  async getParticipantCount(meetingId: string): Promise<number> {
    const meeting = await this.getMeetingByMeetingId(meetingId);

    return this.participantRepository.count({
      where: { meetingId: meeting.id, leftAt: IsNull() },
    });
  }
}
