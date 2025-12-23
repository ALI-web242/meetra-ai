import { Module } from '@nestjs/common';
import { WebRTCController } from './webrtc.controller';
import { WebRTCService } from './webrtc.service';
import { WebRTCGateway } from './webrtc.gateway';

@Module({
  controllers: [WebRTCController],
  providers: [WebRTCService, WebRTCGateway],
  exports: [WebRTCService],
})
export class WebRTCModule {}
