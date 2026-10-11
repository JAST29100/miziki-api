import { Module } from '@nestjs/common';
import { CancionController } from './canciones.controller.js';
import { CancionService } from './canciones.services.js';

@Module({
    imports: [],
    controllers: [CancionController],
    providers: [CancionService],
})

export class CancionModule { }