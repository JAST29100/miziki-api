import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service.js';
import { CreateEventDTO } from './dto/create-event.dto.js';
import { UpdateEventDTO } from './dto/update-event.dto.js';

export interface Event {
  id: string;
  userId: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  asistentes: Array<string>;
}

export interface ServerResponse {
  data: Array<Event>;
  message: string;
  status: number;
}

@Injectable()
export class EventsService {
  private events: Array<Event> = [];
  private newId: number = 1;

  constructor(private readonly userService: UserService) {}

  createEvent(eventDTO: CreateEventDTO): ServerResponse {
    if (this.userService.getUser(eventDTO.userId).status === 404) {
      return { data: this.events, status: 404, message: 'Usuario no encontrado...' };
    }
    const event: Event = {
      id: String(this.newId++),
      userId: eventDTO.userId,
      titulo: eventDTO.titulo,
      descripcion: eventDTO.descripcion,
      fecha: eventDTO.fecha,
      asistentes: [],
    };
    this.events.push(event);
    return { data: this.events, status: 201, message: 'Evento creado!' };
  }

  getEvents(): ServerResponse {
    return { data: this.events, status: 200, message: 'Eventos encontrados!' };
  }

  getEvent(id: string): ServerResponse {
    const event = this.events.find((item) => item.id === id);
    return event
      ? { data: [event], status: 200, message: 'Evento encontrado!' }
      : { data: [], status: 404, message: 'Evento no encontrado...' };
  }

  updateEvent(id: string, eventDTO: UpdateEventDTO): ServerResponse {
    const idx = this.events.findIndex((item) => item.id === id);
    if (idx !== -1) {
      this.events[idx] = {
        ...this.events[idx],
        titulo: eventDTO.titulo ?? this.events[idx].titulo,
        descripcion: eventDTO.descripcion ?? this.events[idx].descripcion,
        fecha: eventDTO.fecha ?? this.events[idx].fecha,
        id: this.events[idx].id,
        userId: this.events[idx].userId,
        asistentes: this.events[idx].asistentes,
      };
    }
    const status = idx !== -1 ? 200 : 404;
    const message = status === 200 ? 'Evento actualizado!' : 'Evento no encontrado...';
    return { data: this.events, status, message };
  }

  attendEvent(id: string, userId: string): ServerResponse {
    const event = this.events.find((item) => item.id === id);
    if (!event) return { data: this.events, status: 404, message: 'Evento no encontrado...' };
    if (this.userService.getUser(userId).status === 404) {
      return { data: this.events, status: 404, message: 'Usuario no encontrado...' };
    }
    if (event.asistentes.includes(userId)) {
      return { data: this.events, status: 409, message: 'El usuario ya está inscrito...' };
    }
    event.asistentes.push(userId);
    return { data: this.events, status: 201, message: 'Asistencia registrada!' };
  }

  cancelAttendance(id: string, userId: string): ServerResponse {
    const event = this.events.find((item) => item.id === id);
    if (!event) return { data: this.events, status: 404, message: 'Evento no encontrado...' };
    if (this.userService.getUser(userId).status === 404) {
      return { data: this.events, status: 404, message: 'Usuario no encontrado...' };
    }
    const attendeeIndex = event.asistentes.indexOf(userId);
    if (attendeeIndex === -1) {
      return { data: this.events, status: 409, message: 'El usuario no está inscrito...' };
    }
    event.asistentes.splice(attendeeIndex, 1);
    return { data: this.events, status: 200, message: 'Asistencia cancelada!' };
  }

  deleteEvent(id: string): ServerResponse {
    const idx = this.events.findIndex((item) => item.id === id);
    if (idx !== -1) this.events.splice(idx, 1);
    const status = idx !== -1 ? 200 : 404;
    const message = status === 200 ? 'Evento eliminado!' : 'Evento no encontrado...';
    return { data: this.events, status, message };
  }
}
