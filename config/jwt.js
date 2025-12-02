import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Log environment variables to debug
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET ? 'SET' : 'NOT SET');

class JWTService {
  static generateAccessToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const secret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || process.env.JWT_EXPIRES_IN || '15m'
    });
  }

  static generateRefreshToken(user) {
    const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('REFRESH_TOKEN_SECRET environment variable is not set');
    }

    return jwt.sign(
      { id: user.id },
      secret,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || process.env.JWT_REFRESH_EXPIRY || '7d' }
    );
  }

  static verifyAccessToken(token) {
    try {
      const secret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
      }
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      }
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token) {
    try {
      const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET;
      if (!secret) {
        throw new Error('REFRESH_TOKEN_SECRET environment variable is not set');
      }
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      }
      throw new Error('Invalid refresh token');
    }
  }

  static decodeToken(token) {
    return jwt.decode(token);
  }
}

export default JWTService;