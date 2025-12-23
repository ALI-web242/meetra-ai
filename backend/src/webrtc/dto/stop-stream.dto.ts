import { IsString } from 'class-validator';

export class StopStreamDto {
  @IsString()
  streamId: string;
}
