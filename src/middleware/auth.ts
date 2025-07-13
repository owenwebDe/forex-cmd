import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { logger } from "../utils/logger"

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
    loginId?: number
  }
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback-secret", (err, decoded) => {
    if (err) {
      logger.warn("Invalid token attempt:", { token: token.substring(0, 20) + "..." })
      return res.status(403).json({ error: "Invalid or expired token" })
    }

    req.user = decoded as any
    next()
  })
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}

export const requireUserOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !["user", "admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "User or admin access required" })
  }
  next()
}
