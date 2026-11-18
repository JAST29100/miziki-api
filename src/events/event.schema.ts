import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type EventoDocument = HydratedDocument<Evento>;

@Schema()
export class Evento {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) titulo: string;
  @Prop({ required: true }) descripcion: string;
  @Prop({ required: true }) fecha: string;
  @Prop({ type: [String], default: [] }) asistentes: string[];
}

export const EventoSchema = SchemaFactory.createForClass(Evento);
