import { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { body, validationResult } from "express-validator"
import User, { IUser } from "../models/User.js"

const router = Router()

// Simple logger for backend
const logger = {
  info: (message: string, data?: any) => console.log(`[INFO] ${message}`, data || ''),
  error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error || '')
}

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

      // Check if user already exists
      const existingUser = await User.findByEmail(email)
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create new user
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: "user"
      })

      await user.save()

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id.toString(), 
          email: user.email, 
          role: user.role 
        }, 
        process.env.JWT_SECRET || "fallback-secret", 
        { expiresIn: "24h" }
      )

      logger.info("User registered:", { email, userId: user._id })

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      })
    } catch (error: any) {
      logger.error("Registration error:", error)
      
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" })
      }
      
      res.status(500).json({ error: "Registration failed" })
    }
  },
)

// Login endpoint
router.post(
  "/login", 
  [
    body("email").isEmail().normalizeEmail(), 
    body("password").exists()
  ], 
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Find user by email
      const user = await User.findByEmail(email)
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Update last login time
      await user.updateLastLogin()

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id.toString(), 
          email: user.email, 
          role: user.role, 
          loginId: user.loginId 
        },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "24h" }
      )

      logger.info("User logged in:", { email, userId: user._id })

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          loginId: user.loginId,
          mt5Accounts: user.mt5Accounts,
          lastLoginAt: user.lastLoginAt
        },
      })
    } catch (error) {
      logger.error("Login error:", error)
      res.status(500).json({ error: "Login failed" })
    }
  }
)

// Get user profile
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Access token required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        mt5Accounts: user.mt5Accounts,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    })
  } catch (error) {
    logger.error("Get profile error:", error)
    res.status(500).json({ error: "Failed to get user profile" })
  }
})

// Change password
router.post(
  "/change-password",
  [
    body("currentPassword").exists(),
    body("newPassword").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(" ")[1]

      if (!token) {
        return res.status(401).json({ error: "Access token required" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
      const user = await User.findById(decoded.id)

      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      const { currentPassword, newPassword } = req.body

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: "Current password is incorrect" })
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12)
      user.password = hashedNewPassword
      await user.save()

      logger.info("Password changed:", { userId: user._id, email: user.email })

      res.json({ message: "Password changed successfully" })
    } catch (error) {
      logger.error("Change password error:", error)
      res.status(500).json({ error: "Failed to change password" })
    }
  }
)

export default router