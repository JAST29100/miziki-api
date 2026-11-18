import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CancionDocument = HydratedDocument<Cancion>;

@Schema() // le dice a Mongoose que esta clase es una colección
export class Cancion {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  artista: string;

  @Prop()
  album?: string;

  @Prop()
  genero?: string;

  @Prop({ required: true })
  duracion: number; // en segundos
}

export const CancionSchema = SchemaFactory.createForClass(Cancion);