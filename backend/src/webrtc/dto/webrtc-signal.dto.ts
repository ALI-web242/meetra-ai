import { IsString, IsObject, IsEnum, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class RTCSessionDescriptionDto {
  @IsEnum(['offer', 'answer'])
  type: 'offer' | 'answer';

  @IsString()
  sdp: string;
}

export class RTCIceCandidateDto {
  @IsString()
  candidate: string;

  @IsString()
  @IsOptional()
  sdpMid: string | null;

  @IsNumber()
  @IsOptional()
  sdpMLineIndex: number | null;
}

export class WebRTCOfferDto {
  @IsString()
  meetingId: string;

  @ValidateNested()
  @Type(() => RTCSessionDescriptionDto)
  offer: RTCSessionDescriptionDto;
}

export class WebRTCAnswerDto {
  @IsString()
  meetingId: string;

  @ValidateNested()
  @Type(() => RTCSessionDescriptionDto)
  answer: RTCSessionDescriptionDto;
}

export class ICECandidateDto {
  @IsString()
  meetingId: string;

  @ValidateNested()
  @Type(() => RTCIceCandidateDto)
  candidate: RTCIceCandidateDto;
}
