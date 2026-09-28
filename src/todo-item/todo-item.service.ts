import { Injectable } from '@nestjs/common';
import { TodoItemDTO } from './dto/create-todo-item.dto.js';
import { UpdateTodoItemDTO } from './dto/update-todo-item.dto.js';

interface TodoItem {
  id?: string;
  name?: string;
  message?: string;
}

export interface ServerResponse {
  data: Array<TodoItem>;
  message: string;
  status: number;
}

@Injectable()
export class TodoItemService {

  private items: Array<TodoItem> = [];

  /* Create */
  createTodoItem(todoItemDTO: TodoItemDTO): ServerResponse {
    const len: number = this.items.length;
    const newId: string = '${len + 1}';
    this.items.push({id: newId, ...todoItemDTO});

    const status: number = this.items.length > len ? 200 : 500;
    const message: string = status === 200 ? "" : "";

    return { data: this.items, status, message };
  }

  /* Update */
  getTodoItems(): ServerResponse {
    const status: number = this.items.length > 0 ? 200 : 404;
    const message: string = status === 200 ? "Items encontrados exitosamente!" : "No se encontraron items...";

    return { data: this.items, status, message };
  }

  getTodoItem(id: string): ServerResponse {
    const item: TodoItem | undefined = this.items.find(i => (i.id === id))
    const status: number = this.items !== undefined ? 200 : 404;
    const message: string = status === 200 ? "Item encontrado exitosamente!" : "No se encontro el item..."

    return { data: item !== undefined ? [item] : [], status, message };
  }



  /* Update */
  updateTodoItem(updateTodoItemDTO: UpdateTodoItemDTO): ServerResponse {
    const items: Array<TodoItem> = this.items;
    const idx: number = this.items.findIndex(i => i.id === updateTodoItemDTO.id);

    const status: number = idx !== -1 ? 200 : 404;
    const message: string = status === 200 ? "No se encontro el item..." : "Item actualizado exitosamente!";

    if (idx != -1) {
      this.items[idx] = { ...this.items[idx], ...updateTodoItemDTO, id: this.items[idx].id };
    }

    return { data: this.items, status, message };
}

  /* Delete */
  deleteTodoItem(id: string): ServerResponse {

  }


}
