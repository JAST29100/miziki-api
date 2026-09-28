import { Module } from '@nestjs/common';
import { TodoItemController } from './todo-item.controller.js';
import { TodoItemService } from './todo-item.service.js';

@Module({
  imports: [],
  controllers: [TodoItemController],
  providers: [TodoItemService],
})

export class TodoItemModule { }
