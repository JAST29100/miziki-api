import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Conversacion, Mensaje } from './message.schema.js';
import type { ConversacionDocument, MensajeDocument } from './message.schema.js';
import { NotificationService } from '../notifications/notifications.service.js';
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
  constructor(
    @InjectModel(Conversacion.name) private conversacionModel: Model<ConversacionDocument>,
    @InjectModel(Mensaje.name) private mensajeModel: Model<MensajeDocument>,
    private readonly notificationService: NotificationService,
  ) { }

  // Convierte lo que devuelve Mongo (con _id) en el objeto que devolvemos (con id en texto).
  private formatearConversacion(c: ConversacionDocument): Conversation {
    return { id: c._id.toString(), userId: c.userId, otherUserId: c.otherUserId };
  }

  private formatearMensaje(m: MensajeDocument): Message {
    return { id: m._id.toString(), conversationId: m.conversationId, senderId: m.senderId, content: m.content };
  }

  // Los id de Mongo son texto de 24 caracteres hexadecimales. Si llega otro formato, lo descartamos antes de preguntarle a Mongo.
  private idValido(id: string): boolean {
    return /^[a-f\d]{24}$/i.test(id);
  }

  // Revisa que la conversacion exista. Si no, lanza el 404.
  private async verificarConversacion(conversationId: string): Promise<ConversacionDocument> {
    const conversation = this.idValido(conversationId)
      ? await this.conversacionModel.findById(conversationId)
      : null;

    if (conversation === null) {
      throw new NotFoundException('Conversación no encontrada');
    }
    return conversation;
  }

  async getConversations(): Promise<Array<Conversation>> {
    const conversations = await this.conversacionModel.find();
    return conversations.map(c => this.formatearConversacion(c));
  }

  async createConversation(dto: CreateConversationDTO): Promise<Conversation> {
    const conversation = await this.conversacionModel.create({
      userId: dto.userId,
      otherUserId: dto.otherUserId,
    });
    return this.formatearConversacion(conversation);
  }

  async sendMessage(conversationId: string, dto: CreateMessageDTO): Promise<Message> {
    const conversation = await this.verificarConversacion(conversationId);

    const message = await this.mensajeModel.create({
      conversationId: conversationId,
      senderId: dto.senderId,
      content: dto.content,
    });
    const recipientId = dto.senderId === conversation.userId
      ? conversation.otherUserId
      : conversation.userId;
    await this.notificationService.createNotification(
      recipientId,
      `Tienes un nuevo mensaje de ${dto.senderId}.`,
    );
    return this.formatearMensaje(message);
  }

  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Array<Message>> {
    await this.verificarConversacion(conversationId);

    const start = (page - 1) * limit;
    const messages = await this.mensajeModel
      .find({ conversationId: conversationId })
      .sort({ _id: 1 }) // del mas viejo al mas nuevo
      .skip(start)
      .limit(limit);

    return messages.map(m => this.formatearMensaje(m));
  }

  async deleteMessage(messageId: string): Promise<void> {
    const eliminado = this.idValido(messageId)
      ? await this.mensajeModel.findByIdAndDelete(messageId)
      : null;

    if (eliminado === null) {
      throw new NotFoundException('Mensaje no encontrado');
    }
  }
}
