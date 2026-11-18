import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller.js';
import { UserService } from './users.service.js';
import { Usuario, UsuarioSchema } from './user.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})

export class UserModule { }