import { Module } from '@nestjs/common';
import { UserModule } from '../users/users.module.js';
import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Evento, EventoSchema } from './event.schema.js';

@Module({
  imports: [UserModule, MongooseModule.forFeature([{ name: Evento.name, schema: EventoSchema }])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
