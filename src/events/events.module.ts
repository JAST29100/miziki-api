import { Module } from '@nestjs/common';
import { UserModule } from '../users/users.module.js';
import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';

@Module({
  imports: [UserModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
