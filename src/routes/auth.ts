import { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { body, validationResult } from "express-validator"
import { logger } from "../utils/logger"
import { mt5Service } from "../services/mt5Service"

const router = Router()

// In-memory user store (replace with database in production)
const users = new Map()

// Register endpoint
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").trim().isLength({ min: 1 }),
    body("lastName").trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password, firstName, lastName, phone } = req.body

      if (users.has(email)) {
        return res.status(400).json({ error: "User already exists" })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const userId = Date.now().toString()

      const user = {
        id: userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: "user",
        createdAt: new Date(),
        loginId: null, // Will be set when MT5 account is created
      }

      users.set(email, user)

      const token = jwt.sign({ id: userId, email, role: "user" }, process.env.JWT_SECRET || "fallback-secret", {
        expiresIn: "24h",
      })

      logger.info("User registered:", { email, userId })

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: userId,
          email,
          firstName,
          lastName,
          role: "user",
        },
      })
    } catch (error) {
      logger.error("Registration error:", error)
      res.status(500).json({ error: "Registration failed" })
    }
  },
)

// Login endpoint
router.post("/login", [body("email").isEmail().normalizeEmail(), body("password").exists()], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    const user = users.get(email)

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, loginId: user.loginId },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" },
    )

    logger.info("User logged in:", { email, userId: user.id })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        loginId: user.loginId,
      },
    })
  } catch (error) {
    logger.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

// MT5 Token endpoint (for admin use)
router.post("/mt5-token", async (req, res) => {
  try {
    const token = await mt5Service.authenticate()
    res.json({ token, message: "MT5 authentication successful" })
  } catch (error) {
    logger.error("MT5 authentication error:", error)
    res.status(500).json({ error: "MT5 authentication failed" })
  }
})

export { router as authRoutes }
