import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Usuario } from './user.schema.js';
import type { UsuarioDocument } from './user.schema.js';
import { UserDTO } from './dto/create-user-item.dto.js';
import { UpdateUserDTO } from './dto/update-user-item.dto.js';

export interface User { // Forma del usuario que se devuelve al cliente (con id en vez de _id).
  id: string;
  username: string;
  email: string;
  creadoEn?: string;
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

  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>) { } // Nest nos da el modelo de Mongo para la coleccion de usuarios.

  // Convierte el usuario de Mongo (que trae _id) en el objeto que devolvemos (con id en texto).
  private formatear(u: UsuarioDocument): User {
    return {
      id: u._id.toString(),
      username: u.username,
      email: u.email,
      creadoEn: u.creadoEn,
      seguidores: [...u.seguidores], // [...] copia el array de Mongo a un array normal.
      seguidos: [...u.seguidos],
    };
  }

  // Los id de Mongo son texto de 24 caracteres hexadecimales. Si llega otro formato, lo descartamos antes de preguntarle a Mongo.
  private idValido(id: string): boolean {
    return /^[a-f\d]{24}$/i.test(id);
  }

  // Trae todos los usuarios ya formateados (varios metodos devuelven la lista completa).
  private async todos(): Promise<Array<User>> {
    const users = await this.usuarioModel.find();
    return users.map(u => this.formatear(u));
  }

  /* Create */
  async createUser(userDTO: UserDTO): Promise<ServerResponse> {
    await this.usuarioModel.create({
      username: userDTO.username,
      email: userDTO.email,
      creadoEn: userDTO.creadoEn,
      seguidores: [],
      seguidos: [],
    });

    return { data: await this.todos(), status: 201, message: "Perfil creado!" };
  }

  async followUser(followerId: string, followedId: string): Promise<ServerResponse> {
    if (followerId === followedId) {
      return { data: await this.todos(), status: 400, message: "El usuario no puede seguirse a si mismo..." };
    }

    const follower = this.idValido(followerId) ? await this.usuarioModel.findById(followerId) : null;
    const followed = this.idValido(followedId) ? await this.usuarioModel.findById(followedId) : null;

    if (follower === null || followed === null) {
      return { data: await this.todos(), status: 404, message: "Usuarios no encontrados..." };
    }

    const alreadyFollowing: boolean = followed.seguidores.includes(followerId);
    const alreadyFollowed: boolean = follower.seguidos.includes(followedId);

    if (alreadyFollowed || alreadyFollowing) {
      return { data: await this.todos(), status: 400, message: "El usuario ya estaba siendo seguido..." };
    }

    await this.usuarioModel.findByIdAndUpdate(followedId, { $push: { seguidores: followerId } }); // $push agrega un valor al final del array.
    await this.usuarioModel.findByIdAndUpdate(followerId, { $push: { seguidos: followedId } });

    return { data: await this.todos(), status: 200, message: "Usuario seguido correctamente!" };
  }

  /* Read */
  async getUsers(): Promise<ServerResponse> {
    const users = await this.todos();

    const status = users.length > 0 ? 200 : 404;
    const message = status === 200 ? "Usuarios encontrados!" : "Usuarios no encontrados...";

    return { data: users, status, message };
  }

  async getUser(id: string): Promise<ServerResponse> {
    const user = this.idValido(id) ? await this.usuarioModel.findById(id) : null; // Si el id tiene formato raro ni busca. Si no existe devuelve null.

    const status = user !== null ? 200 : 404;
    const message = status === 200 ? "Usuario encontrado!" : "Usuario no encontrado...";

    return { data: user !== null ? [this.formatear(user)] : [], status, message };
  }

  /* Update */
  async updateUser(userId: string, updateUserDTO: UpdateUserDTO): Promise<ServerResponse> {
    // Solo se pueden cambiar estos 3 campos, y solo los que vengan en el body (los undefined se descartan).
    const cambios = Object.fromEntries(
      Object.entries({
        username: updateUserDTO.username,
        email: updateUserDTO.email,
        creadoEn: updateUserDTO.creadoEn,
      }).filter(([, valor]) => valor !== undefined),
    );

    const user = this.idValido(userId) ? await this.usuarioModel.findByIdAndUpdate(userId, cambios) : null;

    const status: number = user !== null ? 200 : 404;
    const message: string = status === 200 ? "Usuario actualizado correctamente!" : "Usuario no encontrado...";

    return { data: await this.todos(), status, message };
  }

  /* Delete */
  async deleteUser(id: string): Promise<ServerResponse> {
    const eliminado = this.idValido(id) ? await this.usuarioModel.findByIdAndDelete(id) : null;

    if (eliminado !== null) {
      // Saca el id borrado de las listas de seguidores y seguidos de todos los demas usuarios. $pull quita un valor de un array.
      await this.usuarioModel.updateMany({}, { $pull: { seguidores: id, seguidos: id } });
    }

    const status: number = eliminado !== null ? 200 : 404;
    const message: string = status === 200 ? "Usuario eliminado correctamente!" : "Usuario no encontrado...";

    return { data: await this.todos(), status, message };
  }

  async unfollowUser(followerId: string, followedId: string): Promise<ServerResponse> {
    const follower = this.idValido(followerId) ? await this.usuarioModel.findById(followerId) : null;
    const followed = this.idValido(followedId) ? await this.usuarioModel.findById(followedId) : null;

    if (follower === null || followed === null) {
      return { data: await this.todos(), status: 404, message: "Usuarios no encontrados..." };
    }

    const loSigue: boolean = followed.seguidores.includes(followerId) && follower.seguidos.includes(followedId);

    if (!loSigue) {
      return { data: await this.todos(), status: 404, message: "Un usuario no se ha encontrado..." };
    }

    await this.usuarioModel.findByIdAndUpdate(followedId, { $pull: { seguidores: followerId } });
    await this.usuarioModel.findByIdAndUpdate(followerId, { $pull: { seguidos: followedId } });

    return { data: await this.todos(), status: 200, message: "Usuario dejado de seguir correctamente!" };
  }
}