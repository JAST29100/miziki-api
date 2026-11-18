import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CancionController } from './canciones.controller.js';
import { CancionService } from './canciones.services.js';
import { Cancion, CancionSchema } from './cancion.schema.js';

@Module({
    imports: [MongooseModule.forFeature([{ name: Cancion.name, schema: CancionSchema }])],
    controllers: [CancionController],
    providers: [CancionService],
})

export class CancionModule { }