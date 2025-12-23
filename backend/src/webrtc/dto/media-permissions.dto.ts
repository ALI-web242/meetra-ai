import { IsBoolean } from 'class-validator';

export class MediaPermissionsDto {
  @IsBoolean()
  audio: boolean;

  @IsBoolean()
  video: boolean;
}
