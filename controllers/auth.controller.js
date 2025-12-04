import AuthService from "../services/auth.service.js";

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const { user, accessToken, refreshToken } =
        await AuthService.register({ username, email, password });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: { user: user.toSafeObject() }
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } =
        await AuthService.login({ email, password });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        message: "Login successful",
        data: { user: user.toSafeObject() }
      });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  }

  static async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.json({ success: true, message: "Logout successful" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { accessToken, newRefreshToken } =
        await AuthService.refresh(refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ success: true, message: "Session refreshed" });
    } catch (err) {
      res.status(403).json({ success: false, message: err.message });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
      }

      res.json({
        success: true,
        data: { user: req.user }
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
      }

      const { username, email } = req.body;
      const user = await AuthService.updateProfile(req.user.id, { username, email });

      res.json({
        success: true,
        message: "Profile updated",
        data: { user: user.toSafeObject() }
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

export default AuthController;
