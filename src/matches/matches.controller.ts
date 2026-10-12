import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { MatchService } from './matches.service.js';
import type { ServerResponse } from './matches.service.js';

@Controller('matches') // /matches/id
export class MatchController {
    constructor(private readonly matchService: MatchService) { }

    @Get(':miId/discover') // GET /matches/1/discover
    discoverMatches(@Param('miId') miId: string): ServerResponse {
        return this.matchService.discoverMatches(miId);
    }

    @Post(':miId/like/:userId') // POST /matches/1/like/2
    likeUsuario(@Param('miId') miId: string, @Param('userId') userId: string): ServerResponse {
        return this.matchService.likeUsuario(miId, userId);
    }

    @Post(':miId/reject/:userId') // POST /matches/1/reject/2
    rechazoUsuario(@Param('miId') miId: string, @Param('userId') userId: string): ServerResponse {
        return this.matchService.rechazoUsuario(miId, userId);
    }

    @Get(':miId') // GET /matches/1
    getMatches(@Param('miId') miId: string): ServerResponse {
        return this.matchService.getMatches(miId);
    }

    @Delete(':miId/:matchId') // DELETE /matches/1/3
    deleteMatch(@Param('miId') miId: string, @Param('matchId') matchId: string): ServerResponse {
        return this.matchService.deleteMatch(miId, matchId);
    }
}