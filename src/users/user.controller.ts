import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UserService, type ServerResponse } from './users.service.js';
import { UserDTO } from './dto/create-user-item.dto.js';
import { UpdateUserDTO } from './dto/update-user-item.dto.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): ServerResponse {
    return this.userService.getUsers();
  }

  @Post()
  createUser(@Body() userDTO: UserDTO): ServerResponse {
    return this.userService.createUser(userDTO);
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string): ServerResponse {
    return this.userService.getUser(userId);
  }

  @Patch(':userId')
  updateUser(@Param('userId') userId: string, @Body() updateUserDTO: UpdateUserDTO): ServerResponse {
    return this.userService.updateUser(userId, updateUserDTO);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: string): ServerResponse {
    return this.userService.deleteUser(userId);
  }
}
