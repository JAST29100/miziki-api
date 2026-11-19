import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MessageController } from "./message.controller.js";
import { MessageService } from "./message.service.js";
import { Conversacion, ConversacionSchema, Mensaje, MensajeSchema } from "./message.schema.js";
import { NotificationModule } from "../notifications/notifications.module.js";

@Module({
  imports: [
    NotificationModule,
    MongooseModule.forFeature([
      { name: Conversacion.name, schema: ConversacionSchema },
      { name: Mensaje.name, schema: MensajeSchema },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
