import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MessageModule } from './message/message.module.js';
import { UserModule } from './users/users.module.js';
import { CancionModule } from './canciones/canciones.module.js';
import { NotificationModule } from './notifications/notifications.module.js';

@Module({
  imports: [UserModule, MessageModule, CancionModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
