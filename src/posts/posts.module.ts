import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';
import { UserModule } from '../users/users.module.js';

@Module({
  imports: [UserModule],
  controllers: [PostsController],
  providers: [PostsService],
})

export class PostsModule { }
