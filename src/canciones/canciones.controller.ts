import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { CancionService } from './canciones.services.js';
import type { ServerResponse } from './canciones.services.js';
import { CancionDTO } from './dto/create-cancion.dto.js';
import { UpdateCancionDTO } from './dto/update-cancion.dto.js';

@Controller('songs') // /songs/id
export class CancionController {
        
    constructor(private readonly cancionService: CancionService) { }

    @Get() // GET /songs
    getCanciones(): ServerResponse {
        return this.cancionService.getCanciones();
    }

    @Post() // POST /songs, el body va directo: { "titulo": "...", "artista": "...", "duracion": 200 }
    createCancion(@Body() cancionDTO: CancionDTO): ServerResponse {
        return this.cancionService.createCancion(cancionDTO);
    }

    @Get(':songId') // GET /songs/1
    getCancion(@Param('songId') songId: string): ServerResponse {
        return this.cancionService.getCancion(songId);
    }

    @Patch(':songId') // PATCH /songs/1, cambia solo los campos que manden
    updateParteCancion(@Param('songId') songId: string, @Body() updateCancionDTO: UpdateCancionDTO): ServerResponse {
        return this.cancionService.updateParteCancion(songId, updateCancionDTO);
    }

    @Delete(':songId') // DELETE /songs/1
    deleteCancion(@Param('songId') songId: string): ServerResponse {
        return this.cancionService.deleteCancion(songId);
    }
}  