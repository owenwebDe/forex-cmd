import type { Request, Response, NextFunction } from "express"
import { logger } from "../utils/logger"

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error("Error occurred:", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  })

  // Default error
  let status = 500
  let message = "Internal server error"

  // Handle specific error types
  if (error.name === "ValidationError") {
    status = 400
    message = error.message
  } else if (error.name === "UnauthorizedError") {
    status = 401
    message = "Unauthorized"
  } else if (error.code === "ECONNREFUSED") {
    status = 503
    message = "Service temporarily unavailable"
  } else if (error.response?.status) {
    status = error.response.status
    message = error.response.data?.message || error.message
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
}
