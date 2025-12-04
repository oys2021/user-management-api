import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.routes';
import * as AuthService from '../services/auth.service';

jest.mock('../services/auth.service');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.session = {
    userId: null,
    username: null,
    role: null,
    destroy: (callback) => callback(),
  };
  next();
});

app.use('/api/auth', authRoutes);

describe('Auth Routes Integration Tests', () => {
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    isActive: true,
    toSafeObject: function() {
      return {
        id: this.id,
        username: this.username,
        email: this.email,
        role: this.role,
        isActive: this.isActive,
      };
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      AuthService.register.mockResolvedValue({
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      });

      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration successful');
      expect(response.body.data.user.username).toBe('testuser');
      expect(response.body.data.tokens).toHaveProperty('accessToken');
      expect(response.body.data.tokens).toHaveProperty('refreshToken');
      expect(AuthService.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!'
      });
    });

    test('should return 400 for invalid registration data', async () => {
      const invalidData = {
        username: 'ab',
        email: 'invalid-email',
        password: '123',
        confirmPassword: '456'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login user successfully', async () => {
      AuthService.login.mockResolvedValue({
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      });

      const loginData = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!'
      });
    });

    test('should return 401 for invalid credentials', async () => {
      AuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    test('should return current user when authenticated', async () => {
      const mockReq = {
        session: {
          userId: 1,
          username: 'testuser',
          role: 'user'
        }
      };

      AuthService.getCurrentUser.mockResolvedValue(mockUser);

      const authApp = express();
      authApp.use(express.json());
      authApp.use((req, res, next) => {
        req.session = mockReq.session;
        next();
      });
      authApp.use('/api/auth', authRoutes);

      const response = await request(authApp)
        .get('/api/auth/me');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.username).toBe('testuser');
    });

    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not authenticated');
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should logout user successfully', async () => {
      AuthService.logout.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: 'mock-refresh-token' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
      expect(AuthService.logout).toHaveBeenCalledWith('mock-refresh-token');
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    test('should refresh token successfully', async () => {
      AuthService.refresh.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      });

      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'old-refresh-token' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    test('should return 403 for invalid refresh token', async () => {
      AuthService.refresh.mockRejectedValue(new Error('Invalid refresh token'));

      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});