import { IsString, IsOptional, MaxLength } from 'class-validator';

export class JoinMeetingDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  password?: string;
}
