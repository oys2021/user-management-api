import { User, RefreshToken } from "../models/index.js";
import JWTService from "../config/jwt.js";

class AuthService {
  static async register({ username, email, password }) {
    const existingUserEmail = await User.findOne({ where: { email } });
    if (existingUserEmail) throw new Error("User already exists");

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) throw new Error("Username already taken");

    const user = await User.create({ username, email, password });

    const accessToken = JWTService.generateAccessToken(user);
    const refreshToken = JWTService.generateRefreshToken(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      token: refreshToken,
      expiresAt,
      userId: user.id
    });

    return { user, accessToken, refreshToken };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Invalid credentials");
    if (!user.isActive) throw new Error("Account is deactivated");

    const valid = await user.checkPassword(password);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = JWTService.generateAccessToken(user);
    const refreshToken = JWTService.generateRefreshToken(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      token: refreshToken,
      expiresAt,
      userId: user.id
    });

    return { user, accessToken, refreshToken };
  }

  static async logout(refreshToken) {
    if (refreshToken) {
      await RefreshToken.destroy({ where: { token: refreshToken } });
    }
    return true;
  }

  static async refresh(refreshToken) {
    const decoded = JWTService.verifyRefreshToken(refreshToken);

    const tokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email", "role", "isActive"]
        }
      ]
    });

    if (!tokenRecord) throw new Error("Invalid refresh token");
    if (tokenRecord.isExpired()) throw new Error("Refresh token expired");
    if (!tokenRecord.user || !tokenRecord.user.isActive)
      throw new Error("User not found or inactive");

    const newAccessToken = JWTService.generateAccessToken(tokenRecord.user);
    const newRefreshToken = JWTService.generateRefreshToken(tokenRecord.user);

    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    await tokenRecord.update({
      token: newRefreshToken,
      expiresAt: newExpiresAt
    });

    return { accessToken: newAccessToken, newRefreshToken };
  }

  static async getCurrentUser(userId) {
    return User.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });
  }

  static async updateProfile(userId, updates) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    await user.update(updates);
    return user;
  }
}

export default AuthService;
