import { Injectable } from '@nestjs/common';
import { UserDTO } from './dto/create-user-item.dto.js';
import { UpdateUserDTO } from './dto/update-user-item.dto.js';

interface User {
  id?: string;
  username?: string;
  email?: string;
  creadoEn?: string;
}

export interface ServerResponse {
  data: Array<User>;
  message: string;
  status: number;
}

@Injectable()
export class UserService {

  private users: Array<User> = [];

  /* Create */
  createUser(userDTO: UserDTO): ServerResponse {
    const newId: number = this.users.length + 1;
    this.users.push({id: String(newId), ...userDTO});

    const status = this.users.length === newId ? 200 : 400;
    const message = status === 200 ? "Perfil creado!" : "Perfil no creado...";

    return { data: this.users, status, message };
  }

  /* Read */
  getUsers(): ServerResponse {
    const status = this.users.length > 0 ? 200 : 404;
    const message = status === 200 ? "Usuarios encontrados!" : "Usuarios no encontrados...";

    return { data: this.users, status, message };
  }

  getUser(id: string): ServerResponse {
    const user: User | undefined = this.users.find(i => (i.id === id));

    const status = user !== undefined ? 200 : 404;
    const message = status === 200 ? "Usuario encontrado!" : "Usuario no encontrado...";

    return { data: user !== undefined ? [user] : [], status, message };
  }

  /* Update */
  updatePartialUser(updateUserDTO: UpdateUserDTO): ServerResponse {
    const idx: number = this.users.findIndex(i => (i.id === updateUserDTO.id));

    const status: number = idx !== -1 ? 200 : 404;
    const message: string = status === 200 ? "Usuario actualizado correctamente!" : "Usuario no encontrado...";

    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updateUserDTO };
    }

    return { data: this.users, status, message };
  }

  updateUser(id: string, updateUserDTO: UpdateUserDTO): ServerResponse {
    const idx: number = this.users.findIndex(i => (i.id === updateUserDTO.id));

    const status: number = idx !== - 1 ? 200 : 404;
    const message: string = status === 200 ? "Usuario actualizado correctamente!" : "Usuario no encontrado...";

    if (idx !== -1) {
      this.users[idx] = { ...updateUserDTO };
    }

    return { data: this.users, status, message };
  }
}
