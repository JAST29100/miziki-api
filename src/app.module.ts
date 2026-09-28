import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TodoItemModule } from './todo-item/todo-item.module.js';

@Module({
  imports: [TodoItemModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
