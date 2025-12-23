import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { MeetingGateway } from './meeting.gateway';
import { MeetingCacheService } from './meeting-cache.service';
import { Meeting } from './entities/meeting.entity';
import { Participant } from './entities/participant.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, Participant, User])],
  controllers: [MeetingController],
  providers: [MeetingService, MeetingGateway, MeetingCacheService],
  exports: [MeetingService, MeetingGateway, MeetingCacheService],
})
export class MeetingModule {}
