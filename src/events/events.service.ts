import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { UserService } from '../users/users.service.js';
import { Evento } from './event.schema.js';
import type { EventoDocument } from './event.schema.js';
import { CreateEventDTO } from './dto/create-event.dto.js';
import { UpdateEventDTO } from './dto/update-event.dto.js';

export interface Event { id: string; userId: string; titulo: string; descripcion: string; fecha: string; asistentes: string[]; }
export interface ServerResponse { data: Event[]; message: string; status: number; }

@Injectable()
export class EventsService {
  constructor(private readonly userService: UserService, @InjectModel(Evento.name) private readonly eventModel: Model<EventoDocument>) {}

  private format(event: EventoDocument): Event {
    return { id: event._id.toString(), userId: event.userId, titulo: event.titulo, descripcion: event.descripcion, fecha: event.fecha, asistentes: [...event.asistentes] };
  }

  private async all(): Promise<Event[]> { return (await this.eventModel.find()).map(event => this.format(event)); }

  async createEvent(dto: CreateEventDTO): Promise<ServerResponse> {
    if ((await this.userService.getUser(dto.userId)).status === 404) return { data: await this.all(), status: 404, message: 'Usuario no encontrado...' };
    const event = await this.eventModel.create({ ...dto, asistentes: [] });
    return { data: [this.format(event)], status: 201, message: 'Evento creado!' };
  }

  async getEvents(): Promise<ServerResponse> { return { data: await this.all(), status: 200, message: 'Eventos encontrados!' }; }

  async getEvent(id: string): Promise<ServerResponse> {
    const event = /^[a-f\d]{24}$/i.test(id) ? await this.eventModel.findById(id) : null;
    return event ? { data: [this.format(event)], status: 200, message: 'Evento encontrado!' } : { data: [], status: 404, message: 'Evento no encontrado...' };
  }

  async updateEvent(id: string, dto: UpdateEventDTO): Promise<ServerResponse> {
    const event = /^[a-f\d]{24}$/i.test(id) ? await this.eventModel.findByIdAndUpdate(id, dto, { new: true }) : null;
    return event ? { data: [this.format(event)], status: 200, message: 'Evento actualizado!' } : { data: [], status: 404, message: 'Evento no encontrado...' };
  }

  async attendEvent(id: string, userId: string): Promise<ServerResponse> {
    const event = /^[a-f\d]{24}$/i.test(id) ? await this.eventModel.findById(id) : null;
    if (!event) return { data: [], status: 404, message: 'Evento no encontrado...' };
    if ((await this.userService.getUser(userId)).status === 404) return { data: [], status: 404, message: 'Usuario no encontrado...' };
    if (event.asistentes.includes(userId)) return { data: [this.format(event)], status: 409, message: 'El usuario ya está inscrito...' };
    event.asistentes.push(userId);
    await event.save();
    return { data: [this.format(event)], status: 201, message: 'Asistencia registrada!' };
  }

  async cancelAttendance(id: string, userId: string): Promise<ServerResponse> {
    const event = /^[a-f\d]{24}$/i.test(id) ? await this.eventModel.findById(id) : null;
    if (!event) return { data: [], status: 404, message: 'Evento no encontrado...' };
    if ((await this.userService.getUser(userId)).status === 404) return { data: [this.format(event)], status: 404, message: 'Usuario no encontrado...' };
    const index = event.asistentes.indexOf(userId);
    if (index < 0) return { data: [this.format(event)], status: 409, message: 'El usuario no está inscrito...' };
    event.asistentes.splice(index, 1);
    await event.save();
    return { data: [this.format(event)], status: 200, message: 'Asistencia cancelada!' };
  }

  async deleteEvent(id: string): Promise<ServerResponse> {
    const event = /^[a-f\d]{24}$/i.test(id) ? await this.eventModel.findByIdAndDelete(id) : null;
    return event ? { data: [this.format(event)], status: 200, message: 'Evento eliminado!' } : { data: [], status: 404, message: 'Evento no encontrado...' };
  }
}
