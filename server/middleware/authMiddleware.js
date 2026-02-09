import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ msg: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user to get role information
    const user = await User.findById(payload.userId).select("role");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    
    req.user = { userId: payload.userId, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token invalid" });
  }
};

// Middleware to check if user has required role
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

export default authMiddleware;
