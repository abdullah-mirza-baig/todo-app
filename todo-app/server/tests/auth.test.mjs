import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../models/User.js';

describe('User Auth', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;

  it('should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: "Test",
      email: testEmail,
      password: "123456"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it('should login a user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: "123456"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await new Promise(resolve => setTimeout(resolve, 500));
});
