import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TodoItemService } from './todo-item.service.js';
import type { ServerResponse } from './todo-item.service.js';
import { TodoItemDTO } from './dto/create-todo-item.dto.js';
import { UpdateTodoItemDTO } from './dto/update-todo-item.dto.js';

@Controller('items')
export class TodoItemController {
  constructor(private readonly todoItemsService: TodoItemService) {}

  @Get()
  getTodoItems(): ServerResponse {
    return this.todoItemsService.getTodoItems();
  }

  @Get('id')
  getTodoItemById(@Param('id') id: string) { }

  @Post()
  createTodoItem(@Body() todoItemDTO: TodoItemDTO): ServerResponse {
    return this.todoItemsService.createTodoItem(todoItemDTO);
  }

  @Put()
  updateTodoItem(@Body() todoItemDTO: UpdateTodoItemDTO): ServerResponse {
    return this.todoItemsService.updateTodoItem(todoItemDTO);
  }

  @Delete(':id')
  deleteTodoItem(@Param('id') id: string): ServerResponse {
    return this.todoItemsService.deleteTodoItem(id);
  }
}
