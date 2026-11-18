import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Cancion } from './cancion.schema.js';
import type { CancionDocument } from './cancion.schema.js';
import { CancionDTO } from './dto/create-cancion.dto.js';
import { UpdateCancionDTO } from './dto/update-cancion.dto.js';

//Moldes
export interface CancionRespuesta { //Estructura de cada cancion que se devuelve al cliente (con id en vez de _id).
  id: string;
  titulo: string;
  artista: string;
  album?: string;
  genero?: string;
  duracion: number;
}

export interface ServerResponse {//define la forma que tiene toda respuesta que devuelve el service.
  data: Array<CancionRespuesta>; //la lista de canciones de la respuesta.
  message: string; //"Cancion creada" o "Cancion no encontrada".
  status: number; //codigo resultado como 200 o 404.
}

@Injectable() //Esta clase puede ser inyectada en otras.
export class CancionService {
    constructor(@InjectModel(Cancion.name) private cancionModel: Model<CancionDocument>) { } //Nest nos da el modelo de Mongo para hablar con la coleccion de canciones.

    //Convierte la cancion de Mongo (que trae _id) en el objeto que devolvemos (con id en texto).
    private formatear(c: CancionDocument): CancionRespuesta {
        return { id: c._id.toString(), titulo: c.titulo, artista: c.artista, album: c.album, genero: c.genero, duracion: c.duracion };
    }

    //Los id de Mongo son texto de 24 caracteres hexadecimales. Si llega otro formato, Mongo da error, asi que lo revisamos antes.
    private idValido(id: string): boolean {
        return /^[a-f\d]{24}$/i.test(id);
    }

    /* CREATE */
    async createCancion(cancionDTO: CancionDTO): Promise<ServerResponse> { //async porque hablar con Mongo toma tiempo, devuelve una promesa.
        const nueva = await this.cancionModel.create(cancionDTO); //Guarda la cancion en Mongo, y Mongo le asigna el _id solo.

        return { data: [this.formatear(nueva)], status: 200, message: "Canción creada" };
    }

    /* Read */
    async getCanciones(): Promise<ServerResponse> {
        const canciones = await this.cancionModel.find(); //Trae todas las canciones de la coleccion.

        const status = canciones.length > 0 ? 200 : 404; //200 si hay canciones o 404 si no hay.
        const message = status === 200 ? "Canciones encontradas" : "Canciones no encontradas";

        return { data: canciones.map(c => this.formatear(c)), status, message }; //map convierte cada cancion de Mongo al formato con id.
    }

    async getCancion(id: string): Promise<ServerResponse> {
        const cancion = this.idValido(id) ? await this.cancionModel.findById(id) : null; //Si el id tiene formato raro ni siquiera busca. Si no la encuentra devuelve null.

        if (cancion === null) {
            return { data: [], status: 404, message: "Cancion no encontrada" };
        }

        return { data: [this.formatear(cancion)], status: 200, message: "Cancion encontrada" };
    }

    /* Update */
    async updateParteCancion(id: string, updateCancionDTO: UpdateCancionDTO): Promise<ServerResponse> {
        const cancion = this.idValido(id) ? await this.cancionModel.findByIdAndUpdate(id, updateCancionDTO, { new: true }) : null; //Busca y cambia solo los campos que vengan. new: true hace que devuelva la cancion ya actualizada.

        if (cancion === null) {
            return { data: [], status: 404, message: "Cancion no encontrada..." };
        }

        return { data: [this.formatear(cancion)], status: 200, message: "Cancion actualizada correctamente" };
    }

    async updateCancion(id: string, cancionDTO: CancionDTO): Promise<ServerResponse> {
        const cancion = this.idValido(id) ? await this.cancionModel.findOneAndReplace({ _id: id }, cancionDTO, { new: true }) : null; //Reemplaza toda la cancion por la nueva, el _id queda igual.

        if (cancion === null) {
            return { data: [], status: 404, message: "Cancion no encontrada..." };
        }

        return { data: [this.formatear(cancion)], status: 200, message: "Canción actualizada correctamente!" };
    }

    /* Delete */
    async deleteCancion(id: string): Promise<ServerResponse> {
        const eliminada = this.idValido(id) ? await this.cancionModel.findByIdAndDelete(id) : null; //Borra la cancion y devuelve la que borro (o null si no existia).

        if (eliminada === null) {
            return { data: [], status: 404, message: "Cancion no encontrada..." };
        }

        return { data: [this.formatear(eliminada)], status: 200, message: "Cancion eliminada" };
    }
}