import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MessageModule } from './message/message.module.js';
import { UserModule } from './users/users.module.js';
import { CancionModule } from './canciones/canciones.module.js';
import { PostsModule } from './posts/posts.module.js';
import { EventsModule } from './events/events.module.js';
import { NotificationModule } from './notifications/notifications.module.js';
import { MatchModule } from './matches/matches.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    uri: config.get<string>('MONGODB_URI'),
  }),
}), UserModule, MessageModule, CancionModule, NotificationModule, MatchModule, EventsModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
