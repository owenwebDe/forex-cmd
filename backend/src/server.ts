import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import { logger } from "./utils/logger"
import { errorHandler } from "./middleware/errorHandler"
import { authRoutes } from "./routes/auth"
import { tradingRoutes } from "./routes/trading"
import { accountRoutes } from "./routes/account"
import { balanceRoutes } from "./routes/balance"
import { paymentRoutes } from "./routes/payment"
import { adminRoutes } from "./routes/admin"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000", process.env.ADMIN_URL || "http://localhost:3002"],
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "MT5 CRM Backend API",
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/trading", tradingRoutes)
app.use("/api/account", accountRoutes)
app.use("/api/balance", balanceRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/admin", adminRoutes)

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  logger.info(`MT5 CRM Backend API Server running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`)
})

export default app
