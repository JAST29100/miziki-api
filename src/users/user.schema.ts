import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema() // le dice a Mongoose que esta clase es una colección
export class Usuario {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  creadoEn?: string;

  @Prop({ type: [String], default: [] })
  seguidores: Array<string>; // ids de los usuarios que lo siguen

  @Prop({ type: [String], default: [] })
  seguidos: Array<string>; // ids de los usuarios que él sigue
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);