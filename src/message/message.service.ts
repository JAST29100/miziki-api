import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversationDTO } from './dto/create-conversation.dto.js';
import { CreateMessageDTO } from './dto/create-message.dto.js';

export interface Conversation {
  id: string;
  userId: string;
  otherUserId: string;
}
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
}

@Injectable()
export class MessageService {
  private conversations: Array<Conversation> = [];
  private messages: Array<Message> = [];
  getConversations(): Array<Conversation> {
    return this.conversations;
  }
  createConversation(dto: CreateConversationDTO): Conversation{
    const conversation: Conversation = {
      id: `${this.conversations.length + 1}`,
      userId: '1',
      otherUserId: dto.userId,
    };
    this.conversations.push(conversation);
    return conversation;
  }
  sendMessage(conversationId: string, dto: CreateMessageDTO): Message {
    const conversation = this.conversations.find(
      (c) => c.id === conversationId,
    );
    if (conversation === undefined) {
      throw new NotFoundException('Conversación no encontrada');
    }
    const message: Message = {
      id: `${this.messages.length + 1}`,
      conversationId: conversationId,
      senderId: dto.senderId,
      content: dto.content,
    };
    this.messages.push(message);
    return message;
  }
  getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 10,
  ): Array<Message> {
    const conversation = this.conversations.find((c) => c.id === conversationId,);
    if (conversation == undefined) {
      throw new NotFoundException('Conversación no encontrada');
    }
    const conversationMessages = this.messages.filter((m) => m.conversationId === conversationId);
    const start = (page - 1) * limit;
    return conversationMessages.slice(start, start + limit);
  }
  deleteMessage(messageId: string): void {
    const index = this.messages.findIndex((m) => m.id === messageId);
    if (index === -1) {
      throw new NotFoundException('Mensaje no encontrado');
    }
    this.messages.splice(index, 1);
  }
}
