import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';

describe('users, posts, and events (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => app.close());

  it('creates users and author-linked posts through the registered routes', async () => {
    const user = await request(app.getHttpServer()).post('/users')
      .send({ username: 'ana', email: 'ana@example.com', id: '999' }).expect(201);
    expect(user.body.status).toBe(201);
    expect(user.body.data[0].id).toBe('1');
    expect(user.body.data[0].seguidores).toEqual([]);

    const missingAuthor = await request(app.getHttpServer()).post('/posts')
      .send({ userId: '404', numberId: '1', contenido: 'Hola', fecha: 'hoy' }).expect(201);
    expect(missingAuthor.body.status).toBe(404);

    const post = await request(app.getHttpServer()).post('/posts')
      .send({ userId: '1', numberId: '1', contenido: 'Hola', fecha: 'hoy', id: '999' }).expect(201);
    expect(post.body.status).toBe(201);
    expect(post.body.data[0].id).toBe('1');
    expect(post.body.data[0].userId).toBe('1');
    expect((await request(app.getHttpServer()).get('/posts').expect(200)).body.data).toHaveLength(1);
    const updated = await request(app.getHttpServer()).patch('/posts/1')
      .send({ id: '500', userId: '404', contenido: 'Actualizado' }).expect(200);
    expect(updated.body.data[0].id).toBe('1');
    expect(updated.body.data[0].userId).toBe('1');
    expect((await request(app.getHttpServer()).get('/posts/missing').expect(200)).body.status).toBe(404);
  });

  it('supports event creation, retrieval, updates, attendance, and deletion', async () => {
    await request(app.getHttpServer()).post('/users').send({ username: 'ana', email: 'ana@example.com' }).expect(201);
    await request(app.getHttpServer()).post('/users').send({ username: 'leo', email: 'leo@example.com' }).expect(201);

    const invalidCreator = await request(app.getHttpServer()).post('/events')
      .send({ userId: '404', titulo: 'Evento', descripcion: 'Detalle', fecha: '2026-10-13' }).expect(201);
    expect(invalidCreator.body.status).toBe(404);

    const created = await request(app.getHttpServer()).post('/events')
      .send({ userId: '1', titulo: 'Evento', descripcion: 'Detalle', fecha: '2026-10-13', id: '900', asistentes: ['2'] }).expect(201);
    expect(created.body.data[0].id).toBe('1');
    expect(created.body.data[0].asistentes).toEqual([]);
    expect((await request(app.getHttpServer()).get('/events').expect(200)).body.data).toHaveLength(1);
    expect((await request(app.getHttpServer()).get('/events/1').expect(200)).body.status).toBe(200);
    const updated = await request(app.getHttpServer()).patch('/events/1')
      .send({ titulo: 'Nuevo', userId: '404', asistentes: ['404'], id: '700' }).expect(200);
    expect(updated.body.data[0].titulo).toBe('Nuevo');
    expect(updated.body.data[0].userId).toBe('1');
    expect(updated.body.data[0].asistentes).toEqual([]);
    expect(updated.body.data[0].id).toBe('1');

    const attendance = await request(app.getHttpServer()).post('/events/1/attend').send({ userId: '2' }).expect(201);
    expect(attendance.body.status).toBe(201);
    expect((await request(app.getHttpServer()).post('/events/1/attend').send({ userId: '2' }).expect(201)).body.status).toBe(409);
    expect((await request(app.getHttpServer()).delete('/events/1/attend').send({ userId: '2' }).expect(200)).body.status).toBe(200);
    expect((await request(app.getHttpServer()).delete('/events/1').expect(200)).body.status).toBe(200);
    expect((await request(app.getHttpServer()).get('/events/1').expect(200)).body.status).toBe(404);
  });
});
