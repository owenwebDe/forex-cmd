import { Router } from "express"
import { body, validationResult } from "express-validator"
import { authenticateToken, requireUserOrAdmin, type AuthRequest } from "../middleware/auth"
import { mt5Service } from "../services/mt5Service"
import { logger } from "../utils/logger"

const router = Router()

// Get user's MT5 account info
router.get("/info", [authenticateToken, requireUserOrAdmin], async (req: AuthRequest, res) => {
  try {
    const user = req.user
    if (!user?.loginId) {
      return res.status(404).json({ error: "No MT5 account found" })
    }

    const accountInfo = await mt5Service.getUserInfo(user.loginId)
    res.json(accountInfo)
  } catch (error) {
    logger.error("Get account info error:", error)
    res.status(500).json({ error: "Failed to get account information" })
  }
})

// Create live MT5 account
router.post(
  "/create-live",
  [
    authenticateToken,
    requireUserOrAdmin,
    body("name").trim().isLength({ min: 1 }),
    body("phone").trim().isLength({ min: 1 }),
    body("country").trim().isLength({ min: 1 }),
    body("city").trim().isLength({ min: 1 }),
    body("address").trim().isLength({ min: 1 }),
    body("leverage").isInt({ min: 1, max: 1000 }),
    body("groupName").trim().isLength({ min: 1 }),
    body("mPassword").isLength({ min: 6 }),
    body("iPassword").isLength({ min: 6 }),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const user = req.user
      if (!user) {
        return res.status(401).json({ error: "User not authenticated" })
      }

      // Check if user already has an MT5 account
      if (user.loginId) {
        return res.status(400).json({ error: "User already has an MT5 account" })
      }

      const { name, phone, country, city, address, leverage, groupName, mPassword, iPassword } = req.body

      const accountData = {
        type: 0, // Live account
        groupName,
        name,
        email: user.email,
        phone,
        country,
        city,
        address,
        leverage,
        balance: 0,
        mPassword,
        iPassword,
      }

      logger.info("Creating live MT5 account:", { userId: user.id, email: user.email, groupName })

      const mt5Account = await mt5Service.createAccount(accountData)

      if (!mt5Account || !mt5Account.loginId) {
        throw new Error("Failed to create MT5 account - no login ID returned")
      }

      // TODO: Update user record in database with loginId
      // In production, you would update your user database here
      // await updateUserLoginId(user.id, mt5Account.loginId)

      logger.info("Live MT5 account created successfully:", {
        userId: user.id,
        loginId: mt5Account.loginId,
        groupName,
      })

      res.status(201).json({
        message: "Live MT5 account created successfully",
        account: {
          loginId: mt5Account.loginId,
          groupName,
          leverage,
          server: "86.104.251.148:443",
          platform: "MetaTrader 5",
        },
      })
    } catch (error) {
      logger.error("Create live account error:", error)
      res.status(500).json({ error: "Failed to create live MT5 account" })
    }
  },
)

// Update account settings
router.put(
  "/update",
  [
    authenticateToken,
    requireUserOrAdmin,
    body("leverage").optional().isInt({ min: 1, max: 1000 }),
    body("mPassword").optional().isLength({ min: 6 }),
    body("iPassword").optional().isLength({ min: 6 }),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const user = req.user
      if (!user?.loginId) {
        return res.status(404).json({ error: "No MT5 account found" })
      }

      const updateData = {
        loginId: user.loginId,
        ...req.body,
      }

      const result = await mt5Service.updateAccount(updateData)

      logger.info("Account updated:", { userId: user.id, loginId: user.loginId })

      res.json({
        message: "Account updated successfully",
        result,
      })
    } catch (error) {
      logger.error("Update account error:", error)
      res.status(500).json({ error: "Failed to update account" })
    }
  },
)

// Disable account
router.post("/disable", [authenticateToken, requireUserOrAdmin], async (req: AuthRequest, res) => {
  try {
    const user = req.user
    if (!user?.loginId) {
      return res.status(404).json({ error: "No MT5 account found" })
    }

    const disableData = {
      loginId: user.loginId,
      disable: true,
    }

    await mt5Service.disableUser(disableData)

    logger.info("Account disabled:", { userId: user.id, loginId: user.loginId })

    res.json({ message: "Account disabled successfully" })
  } catch (error) {
    logger.error("Disable account error:", error)
    res.status(500).json({ error: "Failed to disable account" })
  }
})

export { router as accountRoutes }
