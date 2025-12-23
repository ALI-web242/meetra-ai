import { IsUUID, IsString, IsOptional } from 'class-validator';

export class JoinGuestDto {
  @IsUUID('4', { message: 'Meeting ID must be a valid UUID' })
  meetingId: string;

  @IsString()
  @IsOptional()
  inviteCode?: string;
}
