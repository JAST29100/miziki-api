import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<NotificationRecord>;

@Schema()
export class NotificationRecord {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) message: string;
  @Prop({ default: false }) read: boolean;
}
export const NotificationSchema = SchemaFactory.createForClass(NotificationRecord);
