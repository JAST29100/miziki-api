import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { AttendEventDTO } from './dto/attend-event.dto.js';
import { CreateEventDTO } from './dto/create-event.dto.js';
import { UpdateEventDTO } from './dto/update-event.dto.js';
import { EventsService, type ServerResponse } from './events.service.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  getEvents(): ServerResponse { return this.eventService.getEvents(); }

  @Post()
  createEvent(@Body() eventDTO: CreateEventDTO): ServerResponse { return this.eventService.createEvent(eventDTO); }

  @Get(':id')
  getEvent(@Param('id') id: string): ServerResponse { return this.eventService.getEvent(id); }

  @Patch(':id')
  updateEvent(@Param('id') id: string, @Body() eventDTO: UpdateEventDTO): ServerResponse {
    return this.eventService.updateEvent(id, eventDTO);
  }

  @Post(':id/attend')
  attendEvent(@Param('id') id: string, @Body() dto: AttendEventDTO): ServerResponse {
    return this.eventService.attendEvent(id, dto.userId);
  }

  @Delete(':id/attend')
  cancelAttendance(@Param('id') id: string, @Body() dto: AttendEventDTO): ServerResponse {
    return this.eventService.cancelAttendance(id, dto.userId);
  }

  @Delete(':id')
  deleteEvent(@Param('id') id: string): ServerResponse { return this.eventService.deleteEvent(id); }
}
