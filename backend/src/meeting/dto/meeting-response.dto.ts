import { MeetingStatus } from '../entities/meeting.entity';
import { ParticipantRole } from '../entities/participant.entity';

export class UserSummaryDto {
  id: string;
  name: string;
  email: string;
}

export class MeetingResponseDto {
  id: string;
  meetingId: string;
  name: string;
  hasPassword: boolean;
  status: MeetingStatus;
  host: UserSummaryDto;
  participantCount: number;
  createdAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
}

export class MeetingCreatedResponseDto extends MeetingResponseDto {
  link: string;
}

export class ParticipantDto {
  id: string;
  user: UserSummaryDto;
  role: ParticipantRole;
  joinedAt: Date;
  leftAt: Date | null;
}

export class JoinMeetingResponseDto {
  meeting: MeetingResponseDto;
  role: ParticipantRole;
  participant: ParticipantDto;
}

export class ParticipantsResponseDto {
  participants: ParticipantDto[];
  count: number;
}
