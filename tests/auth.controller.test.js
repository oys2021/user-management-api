import AuthService from "../services/auth.service";
import request from 'supertest'
import express from 'express'
import router from "../routes/auth.routes";

const app = express()
app.use('/',router)

describe('Auth Routes', () => {
  const mockUser = { id: 1, username: 'test', role: 'user', toSafeObject: () => ({ username: 'test' }) };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /auth/register - success', async () => {
    AuthService.register.mockResolvedValue({
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    });

    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'test', email: 'test@test.com', password: 'Password123' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.username).toBe('test');
    expect(res.body.data.tokens.accessToken).toBe('access-token');
  });

  test('POST /auth/login - success', async () => {
    AuthService.login.mockResolvedValue({
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'Password123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.username).toBe('test');
  });

  test('GET /auth/profile - requires authentication', async () => {
    app.use((req, res, next) => { req.user = mockUser; next(); });

    const res = await request(app).get('/auth/profile');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.username).toBe('test');
  });
});
