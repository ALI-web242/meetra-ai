import { IsString, IsOptional, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AudioConstraintsDto {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsBoolean()
  @IsOptional()
  echoCancellation?: boolean;

  @IsBoolean()
  @IsOptional()
  noiseSuppression?: boolean;
}

export class VideoConstraintsDto {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  frameRate?: number;
}

export class MediaConstraintsDto {
  @ValidateNested()
  @Type(() => AudioConstraintsDto)
  @IsOptional()
  audio?: AudioConstraintsDto;

  @ValidateNested()
  @Type(() => VideoConstraintsDto)
  @IsOptional()
  video?: VideoConstraintsDto;
}

export class StartStreamDto {
  @IsString()
  meetingId: string;

  @ValidateNested()
  @Type(() => MediaConstraintsDto)
  constraints: MediaConstraintsDto;
}
