import { Controller, Get, Post, Body, Param, Query, HttpCode, Delete } from '@nestjs/common';
import { MessageService } from './message.service.js';
import { CreateMessageDTO } from './dto/create-message.dto.js';

import { CreateConversationDTO } from './dto/create-conversation.dto.js';
@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) { }
  @Get('conversations')
  getConversations() {
    return this.messageService.getConversations();
  }
  @Post('conversations')
  createConversation(@Body() dto: CreateConversationDTO) {
    return this.messageService.createConversation(dto);
  }
  @Post('conversations/:conversationId/messages')
  sendMessage(
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDTO,
  ) {
    return this.messageService.sendMessage(conversationId, dto)
  }
  @Get('conversations/:conversationId/messages')
  getMessages(
    @Param('conversationId') conversationId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messageService.getMessages(
      conversationId,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }
  @Delete('messages/:messageId')
  @HttpCode(204)
  deleteMessage(@Param('messageId') messageId: string) {
    return this.messageService.deleteMessage(messageId);
  }
}
