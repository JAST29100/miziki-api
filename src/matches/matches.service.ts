import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service.js';
import type { User } from '../users/users.service.js';

//Moldes
export interface Like{ //Dice quien da el like y para quien.
    de: string;
    para: string;
}

export interface Rechazo{ //Dice quien rechazo y para quien fue el rechazo.
    de: string;
    para: string;
}

export interface Match{ //Union de dos usuarios que se dieron match, id y lista.
    id: string;
    usuariosMatch: Array<string>; //los ids de los dos usuarios del match.
}

export interface ServerResponse{
    data: Array<User | Match>;
    message: string;
    status: number;
}

@Injectable()
export class MatchService {
    constructor(private readonly userService: UserService) { } //pide el service de users para poder buscar usuarios.

    private likes: Array<Like> = []; //quien le dio like a quien.
    private rechazos: Array<Rechazo> = []; //a quien rechazo cada usuario.
    private matches: Array<Match> = []; //los matches creados.
    private nextId: number = 1; // contador para los id de los matches (1, 2, 3...).
    private existeUsuario(id: string): boolean { //pregunta al service de users si existe ese usuario
        return this.userService.getUser(id).status === 200;
    }

    /* Recomendaciones de usuarios */
    discoverMatches(miId: string): ServerResponse { //miId es el usuario al que se le esta recomendando otros usuarios.
        const candidatos: Array<User> = this.userService.getUsers().data.filter(i => (i.id !== miId)); //Guarda todos los usuarios en un array menos el usuario que se esta examinando.
        
        const status = candidatos.length > 0 ? 200 : 404;
    
        const message = status === 200 ? "Usuarios encontrados" : "Usuarios no encontrados";

        return { data: candidatos, status, message }; //Devuelve la lista de todos los usuarios, status y mensaje.
    }

    /* Like */
    likeUsuario(miId: string, otroId: string): ServerResponse {
        if (miId === otroId){
            return {data: [], status : 400, message : "No se puede dar like a si mismo"}
        }

        if (!this.existeUsuario(otroId)) {
            return { data: [], status: 404, message: "Usuario no encontrado..." };
        }

        const yaLikeado: boolean = this.likes.some(i => (i.de === miId && i.para === otroId)); //Revisa si ya le di like a este usuario. some devuelve true si algún like tiene mi id en "de" y el del otro en "para".
        if (yaLikeado) {
            return { data: [], status: 409, message: "Ya le diste like a este usuario..." };
        }

        this.likes.push({ de: miId, para: otroId }); //Crea un objeto con mi id (de) y el id del otro (para) y lo guarda en el array likes.
        const meLikeo: boolean = this.likes.some(i => (i.de === otroId && i.para === miId)); //Revisa si se dieron like mutuamente. busca un like donde de sea el otro usuario y para sea yo y devuelve true.

        if (meLikeo) {
            const nuevoMatch: Match = { id: String(this.nextId), usuariosMatch: [miId, otroId] }; //En nuevoMatch se guarda el id del match que comienza en 1 y el id de los dos usuarios.
            this.nextId++; //Suma uno para la creacion del proximo match
            this.matches.push(nuevoMatch); //Mete el objeto con id y los usuarios a la lista de matches
       
            return { data: [nuevoMatch], status: 201, message: "Like registrado. Es un match" }; 
        }

        return { data: [], status: 201, message: "Like registrado" };
    }

    /* Rechazo */
    rechazoUsuario(miId: string, otroId: string): ServerResponse {
        if (!this.existeUsuario(otroId)) { //Busca si no existe en los usuarios.
            return { data: [], status: 404, message: "Usuario no encontrado..." };
        }
 
        const yaRechazado: boolean = this.rechazos.some(i => (i.de === miId && i.para === otroId)); //Revisa si ya se rechazo a este usuario. some devuelve true si algún rechazo tiene mi id en "de" y el del otro en "para".
        if (!yaRechazado) { //si ya lo habia rechazado no se repite el rechazo.
            this.rechazos.push({ de: miId, para: otroId }); //Si no lo ha rechazado se crea el objeto y se mete al array.
        }
 
        return { data: [], status: 204, message: "Usuario rechazado" };
    }

    /* Leer */
    getMatches(miId: string): ServerResponse {
        const misMatches: Array<Match> = this.matches.filter(i => (i.usuariosMatch.includes(miId))); //Crea un array y mete solo los matches donde estoy yo.
 
        const message = misMatches.length > 0 ? "Matches encontrados!" : "Matches no encontrados...";
 
        return { data: misMatches, status: 200, message };
    }
 
    /* Borrar */
    deleteMatch(miId: string, matchId: string): ServerResponse {
        const match: Match | undefined = this.matches.find(i => (i.id === matchId)); //Busca el match que el id sea el matchId de la ruta, si no hay ninguno devuelve undefined.
 
        if (match === undefined) {
            return { data: [], status: 404, message: "Match no encontrado..." };
        }
 
        if (!match.usuariosMatch.includes(miId)) { //el match existe pero no es mio.
            return { data: [], status: 403, message: "No tienes permiso para eliminar este match" };
        }
 
        this.matches.splice(this.matches.indexOf(match), 1); //indexOf busca la posicion del match en el array y splice borra ese match de la lista.
 
        return { data: [match], status: 204, message: "Match eliminado!" };
    }


}

