import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service.js';
import { PostDTO } from './dto/create-post-item.js';
import { UpdatePostDTO } from './dto/update-post-item.dto.js';

export interface Post {
  id: string;
  userId: string;
  numberId: string;
  contenido: string;
  fecha: string;
}

export interface ServerResponse {
  data: Array<Post>;
  message: string;
  status: number;
}

@Injectable()
export class PostsService {
  private posts: Array<Post> = [];
  private newId: number = 1;

  constructor(private readonly userService: UserService) {}

  createPost(postDTO: PostDTO): ServerResponse {
    if (this.userService.getUser(postDTO.userId).status === 404) {
      return { data: this.posts, status: 404, message: 'Usuario no encontrado...' };
    }
    const post: Post = {
      id: String(this.newId++),
      userId: postDTO.userId,
      numberId: postDTO.numberId,
      contenido: postDTO.contenido,
      fecha: postDTO.fecha,
    };
    this.posts.push(post);
    return { data: this.posts, status: 201, message: 'Publicacion creada!' };
  }

  getPosts(): ServerResponse {
    return { data: this.posts, status: 200, message: 'Publicaciones encontradas!' };
  }

  getPost(id: string): ServerResponse {
    const post = this.posts.find((item) => item.id === id);
    return post
      ? { data: [post], status: 200, message: 'Publicacion encontrada!' }
      : { data: [], status: 404, message: 'Publicacion no encontrada...' };
  }

  editPost(id: string, updatePostDTO: UpdatePostDTO): ServerResponse {
    const idx = this.posts.findIndex((item) => item.id === id);
    if (idx !== -1) {
      this.posts[idx] = {
        ...this.posts[idx],
        numberId: updatePostDTO.numberId ?? this.posts[idx].numberId,
        contenido: updatePostDTO.contenido ?? this.posts[idx].contenido,
        fecha: updatePostDTO.fecha ?? this.posts[idx].fecha,
        id: this.posts[idx].id,
        userId: this.posts[idx].userId,
      };
    }
    const status = idx !== -1 ? 200 : 404;
    const message = status === 200 ? 'Publicacion editada correctamente!' : 'Publicacion no encontrada...';
    return { data: this.posts, status, message };
  }

  deletePost(id: string): ServerResponse {
    const idx = this.posts.findIndex((item) => item.id === id);
    if (idx !== -1) this.posts.splice(idx, 1);
    const status = idx !== -1 ? 200 : 404;
    const message = status === 200 ? 'Publicacion eliminada correctamente!' : 'Publicacion no encontrada...';
    return { data: this.posts, status, message };
  }
}
