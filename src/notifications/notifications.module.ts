import { Module } from '@nestjs/common';
import { NotificationController } from './notifications.controller.js';
import { NotificationService } from './notifications.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationRecord, NotificationSchema } from './notification.schema.js';

@Module({
  controllers: [NotificationController],
  imports: [MongooseModule.forFeature([{ name: NotificationRecord.name, schema: NotificationSchema }])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
