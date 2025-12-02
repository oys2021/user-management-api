import AuthService from '../services/auth.service.js';

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const { user, accessToken, refreshToken } =
        await AuthService.register({ username, email, password });

      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: user.toSafeObject(),
          tokens: { accessToken, refreshToken }
        }
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = req.user; 
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } =
        await AuthService.login({ email, password });

      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.toSafeObject(),
          tokens: { accessToken, refreshToken }
        }
      });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  }

  static async logout(req, res) {
    try {
      await AuthService.logout(req.body.refreshToken);

      req.session.destroy(() => {
        res.clearCookie('session_id');
        res.json({ success: true, message: 'Logout successful' });
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async refreshToken(req, res) {
    try {
      const result = await AuthService.refresh(req.body.refreshToken);
      res.json({ success: false, data: result });
    } catch (err) {
      res.status(403).json({ success: false, message: err.message });
    }
  }

  static async getCurrentUser(req, res) {
    const userId = req.session.userId;
    if (!userId)
      return res.status(401).json({ success: false, message: 'Not authenticated' });

    const user = await AuthService.getCurrentUser(userId);
    if (!user) {
      req.session.destroy();
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: { user } });
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user?.id || req.session.userId;
      if (!userId)
        return res.status(401).json({ success: false, message: 'Not authenticated' });

      const { username, email } = req.body;
      const user = await AuthService.updateProfile(userId, { username, email });

      if (username && req.session) {
        req.session.username = user.username;
      }

      res.json({
        success: true,
        message: 'Profile updated',
        data: { user: user.toSafeObject() }
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

export default AuthController;