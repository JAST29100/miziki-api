import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TodoItemModule } from './todo-item/todo-item.module.js';
import { MessageModule } from './message/message.module.js';

@Module({
  imports: [TodoItemModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
