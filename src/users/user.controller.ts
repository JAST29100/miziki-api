import { Controller, Get, Post, Patch, Delete, Put, Param, Body} from '@nestjs/common';
import { UserService } from './users.service.js';
import type { ServerResponse } from './users.service.js'
import { UserDTO } from './dto/create-user-item.dto.js';
import { UpdateUserDTO } from './dto/update-user-item.dto.js';

@Controller('users') // /items/id
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  getUsers(): ServerResponse {
    return this.userService.getUsers();
  }

  @Post()
  createUser(@Body('userDTO') userDTO: UserDTO) {
    return this.userService.createUser(userDTO);
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string): ServerResponse {
    return this.userService.getUser(userId);
  }

  @Patch(':userId')
  updatePartialUser(@Param('userId') userId: string, @Body('updateUserDTO') updateUserDTO: UpdateUserDTO): ServerResponse {
    return this.userService.updatePartialUser(updateUserDTO)
  }

  @Put(':userId')
  updateUser(@Param('userId') userId: string, @Body('updateUserDTO') updateUserDTO: UpdateUserDTO): ServerResponse {
    return this.userService.updateUser(userId, updateUserDTO);
  }
}
