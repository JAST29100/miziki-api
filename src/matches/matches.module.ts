import { Module } from '@nestjs/common';
import { MatchController } from './matches.controller.js';
import { MatchService } from './matches.service.js';
import { UserModule } from '../users/users.module.js';

@Module({
  imports: [UserModule],
  controllers: [MatchController],
  providers: [MatchService],
})

export class MatchModule { }