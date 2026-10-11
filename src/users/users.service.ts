import { Injectable } from '@nestjs/common';
import { UserDTO } from './dto/create-user-item.dto.js';
import { UpdateUserDTO } from './dto/update-user-item.dto.js';

export interface User {
  id: string;
  username: string;
  email: string;
  seguidores: Array<string>;
  seguidos: Array<string>;
}

export interface ServerResponse {
  data: Array<User>;
  message: string;
  status: number;
}

@Injectable()
export class UserService {

  private users: Array<User> = [];
  private newId: number = 1;

  /* Create */
  createUser(userDTO: UserDTO): ServerResponse {
    this.users.push({id: String(this.newId++), ...userDTO});

    return { data: this.users, status: 201, message: "Perfil creado!" };
  }

  followUser(followerId: string, followedId: string): ServerResponse {
    if (followerId == followedId) {
      return { data: this.users, status: 400, message: "El usuario no puede seguirse a si mismo..." };
    }
    const followedIndex: number = this.users.findIndex(i => (i.id === followedId));
    const followerIndex: number = this.users.findIndex(i => (i.id === followerId));

    if (followedIndex != -1 && followerIndex != -1) {
      const alreadyFollowing: boolean = this.users[followedIndex].seguidores.includes(followerId);
      const alreadyFollowed: boolean = this.users[followerIndex].seguidos.includes(followedId);
      if (!alreadyFollowed && !alreadyFollowing) {
        this.users[followedIndex].seguidores.push(this.users[followerIndex].id);
        this.users[followerIndex].seguidos.push(this.users[followedIndex].id);

        return { data: this.users, status: 200, message: "Usuario seguido correctamente!" };
      }

      return { data: this.users, status: 400, message: "El usuario ya estaba siendo seguido..." }
    }

    return { data: this.users, status: 404, message: "Usuarios no encontrados..." };
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
  updateUser(userId: string, updateUserDTO: UpdateUserDTO): ServerResponse {
    const idx: number = this.users.findIndex(i => (i.id === userId));

    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updateUserDTO };
    }

    const status: number = idx !== -1 ? 200 : 404;
    const message: string = status === 200 ? "Usuario actualizado correctamente!" : "Usuario no encontrado...";

    return { data: this.users, status, message };
  }

  /* Delete */
  deleteUser(id: string): ServerResponse {
    const idx: number = this.users.findIndex(i => (i.id === id));

    if (idx != -1) {
      for (const user of this.users) {
        user.seguidores = user.seguidores.filter(
          followerId => followerId !== id,
        );

        user.seguidos = user.seguidos.filter(
          followedId => followedId !== id,
        );
      }

      this.users.splice(idx, 1);
    }

    const status: number = idx != -1 ? 200 : 404;
    const message: string = status === 200 ? "Usuario eliminado correctamente!" : "Usuario no encontrado...";

    return { data: this.users, status, message };
  }

  unfollowUser(followerId: string, followedId: string): ServerResponse {
    const follower: User | undefined = this.users.find(i => (i.id === followerId));
    const followed: User | undefined = this.users.find(i => (i.id === followedId));
    const followerIndex: number = this.users.findIndex(i => (i.id === followerId));
    const followedIndex: number = this.users.findIndex(i => (i.id === followedId));

    if (followed != undefined && follower != undefined) {
      const followerInternalIndex: number = this.users[followedIndex].seguidores.findIndex(i => (i == follower.id));
      const followedInternalIndex: number = this.users[followerIndex].seguidos.findIndex(i => (i == followed.id));
      if (followerInternalIndex != -1 && followedInternalIndex != -1) {
        this.users[followedIndex].seguidores.splice(followerInternalIndex, 1);
        this.users[followerIndex].seguidos.splice(followedInternalIndex, 1);

        return { data: this.users, status: 200, message: "Usuario dejado de seguir correctamente!" };
      }
      return { data: this.users, status: 404, message: "Un usuario no se ha encontrado..." };
    }

    return { data: this.users, status: 404, message: "Usuarios no encontrados..." };
  }
}
