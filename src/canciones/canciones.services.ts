import { Injectable } from '@nestjs/common';
import { CancionDTO } from './dto/create-cancion.dto.js';
import { UpdateCancionDTO } from './dto/update-cancion.dto.js';

export interface Cancion { //Estructura de cada cancion.
  id: string;
  titulo: string;
  artista: string;
  album?: string;
  genero?: string;
  duracion: number;
}

export interface ServerResponse {//define la forma que tiene toda respuesta que devuelve al service.
  data: Array<Cancion>; //la lista de canciones de la respuesta.
  message: string; //"Cancion creada" o "Cancion no encontrada".
  status: number; //codigo resultado como 200 o 400.
}

@Injectable() //Esta clase puede ser inyectada en otras.
export class CancionService {
    private canciones: Array<Cancion> = []; //Se crea el array donde se van a guardar todas las canciones.
    private nextId: number = 1; // contador para los id (1, 2, 3...).

    /* CREATE */ 
    createCancion(cancionDTO: CancionDTO): ServerResponse { //recibe una variable llamada cancionDTO y debe tener la forma de CancionDTO
        const nuevaCancion: Cancion = { id: String(this.nextId), ...cancionDTO }; //transforma el numero en texto y cancionDTO copia dentro del objeto todos los atributos que dio el cliente.
        this.nextId++; //Agrego 1 al id para la siguiente cancion
        this.canciones.push(nuevaCancion); //Mete el objeto que se acaba de crear a la lista canciones

        return { data: [nuevaCancion], status: 200, message: "Canción creada" }; //un arreglo con la cancion recien creada,codigo de exito,texto para mostrar.
    }

    /* Read */
    getCanciones(): ServerResponse { //para ver si existen canciones
        const status = this.canciones.length > 0 ? 200 : 404; //Se guarda 200 si hay canciones o 404 si no hay canciones en la variable status
        const message = status === 200 ? "Canciones encontradas!" : "Canciones no encontradas..."; //Si hay canciones manda exito, si no dice que no hay

        return { data: this.canciones, status, message };
    }

    getCancion(id: string): ServerResponse {
        const cancion: Cancion | undefined = this.canciones.find(i => (i.id === id)); //Recorre el array canciones y por cada cancion (i), pregunta si su id es igual al id que piden. Se queda con la primera que cumple si no undefined.

        const status = cancion !== undefined ? 200 : 404; //Si cancion es diferente a undefined devuelve 200 (lo encontro), sino 404 (no lo encontro).
        const message = status === 200 ? "Cancion encontrada" : "Cancion no encontrada"; //si status igual a 200 encontrada, si no no encontrada.

        return { data: cancion !== undefined ? [cancion] : [], status, message }; //Si existe la cancion devuelve la cancion en un array, si no la encuentra devuelve un array vacio, con status y mensaje.
    }

    /* Update */
    updateParteCancion(id: string, updateCancionDTO: UpdateCancionDTO): ServerResponse {
        const idx: number = this.canciones.findIndex(i => (i.id === id)); //Busca la cancion y devuelve el valor de indice, si no lo encuentra devuelve -1.

        if (idx === -1) {
        return { data: [], status: 404, message: "Cancion no encontrada..." }; //Si idx es -1, devuelve array vacio, status y mensaje.
        }

        this.canciones[idx] = { ...this.canciones[idx], ...updateCancionDTO, id }; //Pasa la cancion y todos los campos que vengan en el update y los campos que no vengan se quedan como estaban.

        return { data: [this.canciones[idx]], status: 200, message: "Cancion actualizada correctamente" }; //Devuelve la cancion de la lista ya actualizada, status y mensaje.
    }

    updateCancion(id: string, cancionDTO: CancionDTO): ServerResponse {
        const idx: number = this.canciones.findIndex(i => (i.id === id)); //Busca la cancion en canciones y devuelve el indice, si no la encuentra -1.

        if (idx === -1) {
        return { data: [], status: 404, message: "Cancion no encontrada..." }; //Si no la encuentra, manda array vacio, satus y mensaje
        }

        this.canciones[idx] = { id, ...cancionDTO }; //El id queda igual y se reemplaza toda la info de la cancion por una nueva.

        return { data: [this.canciones[idx]], status: 200, message: "Canción actualizada correctamente!" }; //Mete la cancion actualizada a la lista, manda satatus y mensaje.
    }

    /* Delete */
    deleteCancion(id: string): ServerResponse {
        const idx: number = this.canciones.findIndex(i => (i.id === id)); //Busca la cancion por id y devuelve el indice.

        if (idx === -1) {
        return { data: [], status: 404, message: "Cancion no encontrada..." }; //Si no la encuentra manda array vacio, status y mensaje.
        }

        const [eliminada] = this.canciones.splice(idx, 1); // Se borra la cancion seleccionada de la lista y se gurda sola sin array gracias a los corchetes en la variable eliminada.

        return { data: [eliminada], status: 200, message: "Cancion eliminada" }; //Devuelve la cancion eliminada para confirmar, status y mensaje.
    }
}
