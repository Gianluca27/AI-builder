import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

/**
 * Middleware para proteger rutas - requiere autenticación
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si hay token en headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Agregar usuario a request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      plan: user.plan,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

/**
 * Middleware para verificar roles específicos
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

/**
 * Middleware para verificar plan de usuario
 */
export const requirePlan = (...plans) => {
  return (req, res, next) => {
    if (!plans.includes(req.user.plan)) {
      return res.status(403).json({
        success: false,
        message: "This feature requires a higher plan",
        requiredPlans: plans,
        currentPlan: req.user.plan,
      });
    }
    next();
  };
};

export default {
  protect,
  authorize,
  requirePlan,
};
