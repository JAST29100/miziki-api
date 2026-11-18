import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';
import { UserModule } from '../users/users.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './post.schema.js';

@Module({
  imports: [UserModule, MongooseModule.forFeature([{ name: Publicacion.name, schema: PublicacionSchema }])],
  controllers: [PostsController],
  providers: [PostsService],
})

export class PostsModule { }
