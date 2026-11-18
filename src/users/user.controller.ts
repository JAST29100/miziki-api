import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UserService, type ServerResponse } from './users.service.js';
import { UserDTO } from './dto/create-user-item.dto.js';
import { UpdateUserDTO } from './dto/update-user-item.dto.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<ServerResponse> {
    return this.userService.getUsers();
  }

  @Post()
  createUser(@Body() userDTO: UserDTO): Promise<ServerResponse> {
    return this.userService.createUser(userDTO);
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string): Promise<ServerResponse> {
    return this.userService.getUser(userId);
  }

  @Patch(':userId')
  updateUser(@Param('userId') userId: string, @Body() updateUserDTO: UpdateUserDTO): Promise<ServerResponse> {
    return this.userService.updateUser(userId, updateUserDTO);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: string): Promise<ServerResponse> {
    return this.userService.deleteUser(userId);
  }

  @Post(':followerId/follow/:followedId')
  followUser(@Param('followerId') followerId: string, @Param('followedId') followedId: string): Promise<ServerResponse> {
    return this.userService.followUser(followerId, followedId);
  }

  @Delete(':followerId/follow/:followedId')
  unfollowUser(@Param('followerId') followerId: string, @Param('followedId') followedId: string): Promise<ServerResponse> {
    return this.userService.unfollowUser(followerId, followedId);
  }
}