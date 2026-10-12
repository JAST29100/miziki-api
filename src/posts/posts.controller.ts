import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { PostsService, type ServerResponse } from './posts.service.js';
import { PostDTO } from './dto/create-post-item.js';
import { UpdatePostDTO } from './dto/update-post-item.dto.js';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  getPosts(): ServerResponse { return this.postService.getPosts(); }

  @Post()
  createPost(@Body() postDTO: PostDTO): ServerResponse { return this.postService.createPost(postDTO); }

  @Get(':id')
  getPost(@Param('id') id: string): ServerResponse { return this.postService.getPost(id); }

  @Patch(':id')
  updatePost(@Param('id') id: string, @Body() updatePostDTO: UpdatePostDTO): ServerResponse {
    return this.postService.editPost(id, updatePostDTO);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): ServerResponse { return this.postService.deletePost(id); }
}
