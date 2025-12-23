import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GuestService, GuestJoinResponse } from './guest.service';
import { JoinGuestDto } from './dto/join-guest.dto';
import { Public } from '../auth/public.decorator';

@Controller('api/v1/guest')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @Public()
  @Post('join')
  @HttpCode(HttpStatus.OK)
  async joinMeeting(
    @Body() joinGuestDto: JoinGuestDto,
  ): Promise<GuestJoinResponse> {
    return this.guestService.joinMeeting(joinGuestDto);
  }
}
