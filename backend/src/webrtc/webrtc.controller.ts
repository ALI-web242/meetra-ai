import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { WebRTCService } from './webrtc.service';
import { StartStreamDto } from './dto/start-stream.dto';
import { StopStreamDto } from './dto/stop-stream.dto';
import { MediaPermissionsDto } from './dto/media-permissions.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class WebRTCController {
  constructor(private readonly webrtcService: WebRTCService) {}

  @Get('devices')
  async getMediaDevices() {
    return {
      audioInputs: [],
      videoInputs: [],
      audioOutputs: [],
    };
  }

  @Post('permissions')
  @HttpCode(HttpStatus.OK)
  async requestMediaPermissions(@Body() dto: MediaPermissionsDto) {
    return {
      audio: dto.audio,
      video: dto.video,
      message: 'Permissions request processed',
    };
  }

  @Post('stream/start')
  @HttpCode(HttpStatus.OK)
  async startMediaStream(@Request() req: any, @Body() dto: StartStreamDto) {
    const userId = req.user.id;
    return this.webrtcService.startStream(userId, dto);
  }

  @Post('stream/stop')
  @HttpCode(HttpStatus.OK)
  async stopMediaStream(@Body() dto: StopStreamDto) {
    await this.webrtcService.stopStream(dto);
    return { message: 'Stream stopped successfully' };
  }

  @Get('connection/status')
  async getConnectionStatus(@Query('meetingId') meetingId: string) {
    return this.webrtcService.getConnectionStatus(meetingId);
  }
}
