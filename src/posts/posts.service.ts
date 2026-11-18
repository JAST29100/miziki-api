import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { UserService } from '../users/users.service.js';
import { Publicacion } from './post.schema.js';
import type { PublicacionDocument } from './post.schema.js';
import { PostDTO } from './dto/create-post-item.js';
import { UpdatePostDTO } from './dto/update-post-item.dto.js';

export interface Post { id: string; userId: string; contenido: string; fecha: string; }
export interface ServerResponse { data: Post[]; message: string; status: number; }

@Injectable()
export class PostsService {
  constructor(private readonly userService: UserService, @InjectModel(Publicacion.name) private readonly postModel: Model<PublicacionDocument>) {}
  private format(post: PublicacionDocument): Post { return { id: post._id.toString(), userId: post.userId, contenido: post.contenido, fecha: post.fecha }; }
  private async all(): Promise<Post[]> { return (await this.postModel.find()).map(post => this.format(post)); }

  async createPost(dto: PostDTO): Promise<ServerResponse> {
    if ((await this.userService.getUser(dto.userId)).status === 404) return { data: await this.all(), status: 404, message: 'Usuario no encontrado...' };
    const post = await this.postModel.create(dto);
    return { data: [this.format(post)], status: 201, message: 'Publicacion creada!' };
  }
  async getPosts(): Promise<ServerResponse> { return { data: await this.all(), status: 200, message: 'Publicaciones encontradas!' }; }
  async getPost(id: string): Promise<ServerResponse> {
    const post = /^[a-f\d]{24}$/i.test(id) ? await this.postModel.findById(id) : null;
    return post ? { data: [this.format(post)], status: 200, message: 'Publicacion encontrada!' } : { data: [], status: 404, message: 'Publicacion no encontrada...' };
  }
  async editPost(id: string, dto: UpdatePostDTO): Promise<ServerResponse> {
    const post = /^[a-f\d]{24}$/i.test(id) ? await this.postModel.findByIdAndUpdate(id, dto, { new: true }) : null;
    return post ? { data: [this.format(post)], status: 200, message: 'Publicacion editada correctamente!' } : { data: [], status: 404, message: 'Publicacion no encontrada...' };
  }
  async deletePost(id: string): Promise<ServerResponse> {
    const post = /^[a-f\d]{24}$/i.test(id) ? await this.postModel.findByIdAndDelete(id) : null;
    return post ? { data: [this.format(post)], status: 200, message: 'Publicacion eliminada correctamente!' } : { data: [], status: 404, message: 'Publicacion no encontrada...' };
  }
}
