import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type LikeDocument = HydratedDocument<LikeRecord>;
export type RejectionDocument = HydratedDocument<RejectionRecord>;
export type MatchDocument = HydratedDocument<MatchRecord>;

@Schema() export class LikeRecord {
  @Prop({ required: true }) de: string;
  @Prop({ required: true }) para: string;
}
@Schema() export class RejectionRecord {
  @Prop({ required: true }) de: string;
  @Prop({ required: true }) para: string;
}
@Schema() export class MatchRecord {
  @Prop({ type: [String], required: true }) usuariosMatch: string[];
}
export const LikeSchema = SchemaFactory.createForClass(LikeRecord);
export const RejectionSchema = SchemaFactory.createForClass(RejectionRecord);
export const MatchSchema = SchemaFactory.createForClass(MatchRecord);
