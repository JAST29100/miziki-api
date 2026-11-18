import { Module } from '@nestjs/common';
import { MatchController } from './matches.controller.js';
import { MatchService } from './matches.service.js';
import { UserModule } from '../users/users.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeRecord, LikeSchema, MatchRecord, MatchSchema, RejectionRecord, RejectionSchema } from './match.schema.js';

@Module({
    imports: [UserModule, MongooseModule.forFeature([
        { name: LikeRecord.name, schema: LikeSchema },
        { name: RejectionRecord.name, schema: RejectionSchema },
        { name: MatchRecord.name, schema: MatchSchema },
    ])],
  controllers: [MatchController],
  providers: [MatchService],
})

export class MatchModule { }
