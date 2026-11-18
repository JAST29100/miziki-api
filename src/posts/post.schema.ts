import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type PublicacionDocument = HydratedDocument<Publicacion>;

@Schema()
export class Publicacion {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) contenido: string;
  @Prop({ required: true }) fecha: string;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
