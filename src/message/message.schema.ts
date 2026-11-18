import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversacionDocument = HydratedDocument<Conversacion>;
export type MensajeDocument = HydratedDocument<Mensaje>;

@Schema() // una conversacion entre dos usuarios
export class Conversacion {
  @Prop({ required: true })
  userId: string; // id del usuario que crea la conversacion

  @Prop({ required: true })
  otherUserId: string; // id del otro usuario
}

@Schema() // un mensaje dentro de una conversacion
export class Mensaje {
  @Prop({ required: true })
  conversationId: string;

  @Prop({ required: true })
  senderId: string; // id de quien lo envia

  @Prop({ required: true })
  content: string;
}

export const ConversacionSchema = SchemaFactory.createForClass(Conversacion);
export const MensajeSchema = SchemaFactory.createForClass(Mensaje);