import JWTService from "../config/jwt.js";
import { User } from "../models/index.js";

export const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Access token required" });
    }

    const decoded = JWTService.verifyAccessToken(token);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "User not found or inactive" });
    }

    req.user = user.toSafeObject();
    req.token = token;
    next();
  } catch (error) {
    if (error.message.includes("expired")) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export const authenticateSession = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = JWTService.verifyAccessToken(token);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "User not found or inactive" });
    }

    req.user = user.toSafeObject();
    next();
  } catch (err) {
    if (err.message.includes("expired")) {
      return res.status(401).json({ success: false, message: "Session expired" });
    }
    return res.status(403).json({ success: false, message: "Invalid session" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Insufficient permissions" });
    }

    next();
  };
};

export const authenticate = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (token) {
    try {
      const decoded = JWTService.verifyAccessToken(token);
      const user = await User.findByPk(decoded.id);

      if (user && user.isActive) {
        req.user = user.toSafeObject();
        req.authType = "session";
        return next();
      }
    } catch (err) {}
  }

  return authenticateJWT(req, res, next);
};
