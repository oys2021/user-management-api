import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { authenticateJWT, authenticateSession, authenticate, authorize } from '../middlewares/auth.js';
import { registerValidation, loginValidation, validateRequest } from '../middlewares/validate.js';
import { User } from '../models/index.js';

const router = express.Router();

router.post(
  '/register',
  registerValidation,
  validateRequest,
  AuthController.register
);

router.post(
  '/login',
  loginValidation,
  validateRequest,
  AuthController.login
);

router.post(
  '/refresh-token',
  AuthController.refreshToken
);

router.post(
  '/logout',
  AuthController.logout
);

router.get(
  '/me/session',
  authenticateSession,
  AuthController.getCurrentUser
);

router.get(
  '/me/jwt',
  authenticateJWT,
  AuthController.getProfile
);

router.get(
  '/me',
  authenticate,
  (req, res) => {
    res.json({
      success: true,
      data: {
        user: req.user,
        authType: req.authType || 'jwt'
      }
    });
  }
);

router.put(
  '/profile',
  authenticate,
  AuthController.updateProfile
);

router.get(
  '/admin/users',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'isActive', 'createdAt']
    });

    res.json({
      success: true,
      data: { users }
    });
  }
);

export default router;