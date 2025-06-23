import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';

let token = '';
let taskId = '';

beforeAll(async () => {
  const res = await request(app).post('/api/auth/login').send({
    email: 'test@example.com',
    password: '123456',
  });
  token = res.body.token;
});

describe('Task API Integration Tests', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Task')
      .field('description', 'This is a test task')
      .field('priority', 'high');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Task');
    taskId = res.body._id;
  });

  it('should get all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update the task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Task' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Task');
  });

  it('should delete the task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await new Promise(resolve => setTimeout(resolve, 500)); // Prevents open handle warning
});
