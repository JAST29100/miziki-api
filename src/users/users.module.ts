import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './users.service.js';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})

export class UserModule { }
