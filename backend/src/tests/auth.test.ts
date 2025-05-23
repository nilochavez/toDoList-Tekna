import request from 'supertest';
import app from '../app';


describe('Auth API', () => {
  const testUser = {
    email: `test${Date.now()}@mail.com`,
    password: '123456'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  it('should log in and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send(testUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
