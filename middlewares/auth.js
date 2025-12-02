import JWTService from '../utils/jwt.js';
import { User } from '../models/index.js';

export const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = JWTService.verifyAccessToken(token);

    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = user.toSafeObject();
    req.token = token;
    next();
  } catch (error) {
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const authenticateSession = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Not authenticated. Please login.'
  });
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

export const authenticate = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findByPk(req.session.userId);
      if (user && user.isActive) {
        req.user = user.toSafeObject();
        req.authType = 'session';
        return next();
      }
    } catch (error) {}
  }

  return authenticateJWT(req, res, next);
};
