import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MessageModule } from './message/message.module.js';
import { UserModule } from './users/users.module.js';

@Module({
  imports: [UserModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
