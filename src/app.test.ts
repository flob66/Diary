import express from 'express';
import request, { Response } from 'supertest';
import app from './app';

describe('Tâches test', () => {
  it('Créer une tâche', async () => {
    const response: Response = await request(app)
      .post('/tasks')
      .send({ title: 'Test tâche', description: 'Tâche description' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test tâche');
    expect(response.body.description).toBe('Tâche description');
    expect(response.body.completed).toBe(false);
  });

  it('Créer une tâche2', async () => {
    const response: Response = await request(app)
      .post('/tasks')
      .send({ title: 'Test tâche2', description: 'Tâche description2' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test tâche2');
    expect(response.body.description).toBe('Tâche description2');
    expect(response.body.completed).toBe(false);
  });

  it('Get all tâches', async () => {
    const response: Response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Get une tâche par ID', async () => {
    const response: Response = await request(app).get('/tasks/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('MAJ tâche', async () => {
    const response: Response = await request(app)
      .put('/tasks/1')
      .send({ title: 'Tâche modifiée', completed: true, description: 'modifications' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Tâche modifiée');
    expect(response.body.description).toBe('modifications');
    expect(response.body.completed).toBe(true);
  });

  it('Supprimer tâche', async () => {
    const response: Response = await request(app).delete('/tasks/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });
});
