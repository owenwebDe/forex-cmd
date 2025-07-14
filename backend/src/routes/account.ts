import express from "express"
import { mt5Service } from "../services/mt5Service"
import { logger } from "../utils/logger"
import { ACCOUNT_GROUPS, LEVERAGE_OPTIONS } from "../config/mt5"

const router = express.Router()

// Create Live MT5 Account
router.post("/create-live-account", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      country,
      city,
      state,
      zipCode,
      address,
      accountType = "demo",
      leverage = 100,
      initialDeposit = 10000,
    } = req.body

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      })
    }

    // Validate leverage
    if (!LEVERAGE_OPTIONS.includes(leverage)) {
      return res.status(400).json({
        success: false,
        error: `Invalid leverage. Must be one of: ${LEVERAGE_OPTIONS.join(", ")}`,
      })
    }

    // Generate secure passwords
    const generatePassword = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
      let password = ""
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return password
    }

    const mPassword = generatePassword() // Master password
    const iPassword = generatePassword() // Investor password

    // Determine account group based on type
    let group = ACCOUNT_GROUPS.DEMO
    if (accountType === "live") {
      group = ACCOUNT_GROUPS.LIVE_STANDARD
    }

    const accountData = {
      name,
      email,
      phone: phone || "",
      country: country || "",
      city: city || "",
      state: state || "",
      zipCode: zipCode || "",
      address: address || "",
      group,
      leverage,
      balance: initialDeposit,
      mPassword,
      iPassword,
    }

    logger.info("Creating MT5 account for:", { email, name, accountType, leverage })

    const result = await mt5Service.createAccount(accountData)

    if (result.success) {
      // Log successful account creation
      logger.info("MT5 account created successfully:", {
        loginId: result.loginId,
        email,
        name,
        group: result.groupName,
      })

      res.json({
        success: true,
        data: {
          loginId: result.loginId,
          login: result.login,
          server: result.server,
          mPassword: result.mPassword,
          iPassword: result.iPassword,
          name: result.name,
          email: result.email,
          group: result.groupName,
          leverage: result.leverage,
          balance: result.balance,
          accountType: accountType,
          message: "MT5 account created successfully",
        },
      })
    } else {
      logger.error("Failed to create MT5 account:", result.error)
      res.status(400).json({
        success: false,
        error: result.error || "Failed to create MT5 account",
      })
    }
  } catch (error: any) {
    logger.error("Error in create-live-account:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Get Account Information
router.get("/info/:loginId", async (req, res) => {
  try {
    const { loginId } = req.params

    if (!loginId || isNaN(Number(loginId))) {
      return res.status(400).json({
        success: false,
        error: "Valid login ID is required",
      })
    }

    const result = await mt5Service.getAccountInfo(Number(loginId))

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
      })
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      })
    }
  } catch (error: any) {
    logger.error("Error in get account info:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Get Account Balance
router.get("/balance/:loginId", async (req, res) => {
  try {
    const { loginId } = req.params

    if (!loginId || isNaN(Number(loginId))) {
      return res.status(400).json({
        success: false,
        error: "Valid login ID is required",
      })
    }

    const result = await mt5Service.getBalance(Number(loginId))

    if (result.success) {
      res.json({
        success: true,
        data: {
          balance: result.balance,
          equity: result.equity,
          margin: result.margin,
          freeMargin: result.freeMargin,
          marginLevel: result.marginLevel,
          credit: result.credit,
          profit: result.profit,
          currency: result.currency,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      })
    }
  } catch (error: any) {
    logger.error("Error in get balance:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Perform Balance Operation (Deposit/Withdrawal)
router.post("/balance-operation", async (req, res) => {
  try {
    const { loginId, type, amount, comment } = req.body

    if (!loginId || !type || !amount) {
      return res.status(400).json({
        success: false,
        error: "Login ID, type, and amount are required",
      })
    }

    if (!["DEPOSIT", "WITHDRAWAL"].includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: "Type must be either DEPOSIT or WITHDRAWAL",
      })
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be greater than 0",
      })
    }

    const result = await mt5Service.performBalanceOperation(
      Number(loginId),
      type.toUpperCase(),
      Number(amount),
      comment || `${type} operation`,
    )

    if (result.success) {
      logger.info("Balance operation completed:", {
        loginId,
        type,
        amount,
        newBalance: result.newBalance,
      })

      res.json({
        success: true,
        data: {
          transactionId: result.transactionId,
          newBalance: result.newBalance,
          type,
          amount,
          message: `${type} operation completed successfully`,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      })
    }
  } catch (error: any) {
    logger.error("Error in balance operation:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Get Account Positions
router.get("/positions/:loginId", async (req, res) => {
  try {
    const { loginId } = req.params

    if (!loginId || isNaN(Number(loginId))) {
      return res.status(400).json({
        success: false,
        error: "Valid login ID is required",
      })
    }

    const result = await mt5Service.getPositions(Number(loginId))

    if (result.success) {
      res.json({
        success: true,
        data: {
          positions: result.positions,
          count: result.positions.length,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      })
    }
  } catch (error: any) {
    logger.error("Error in get positions:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Get Trade History
router.get("/history/:loginId", async (req, res) => {
  try {
    const { loginId } = req.params
    const { from, to } = req.query

    if (!loginId || isNaN(Number(loginId))) {
      return res.status(400).json({
        success: false,
        error: "Valid login ID is required",
      })
    }

    // Default to last 30 days if no dates provided
    const fromDate = (from as string) || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const toDate = (to as string) || new Date().toISOString()

    const result = await mt5Service.getTradeHistory(Number(loginId), fromDate, toDate)

    if (result.success) {
      res.json({
        success: true,
        data: {
          trades: result.trades,
          count: result.trades.length,
          from: fromDate,
          to: toDate,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      })
    }
  } catch (error: any) {
    logger.error("Error in get trade history:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Test MT5 Connection
router.get("/test-connection", async (req, res) => {
  try {
    const result = await mt5Service.testConnection()

    res.json({
      success: result.success,
      status: result.status,
      server: result.server,
      timestamp: new Date().toISOString(),
      data: result.data,
    })
  } catch (error: any) {
    logger.error("Error testing MT5 connection:", error)
    res.status(500).json({
      success: false,
      status: "Error",
      error: "Failed to test connection",
    })
  }
})

// Get Available Account Groups and Leverage Options
router.get("/config", (req, res) => {
  res.json({
    success: true,
    data: {
      accountGroups: ACCOUNT_GROUPS,
      leverageOptions: LEVERAGE_OPTIONS,
      serverInfo: {
        ip: process.env.MT5_SERVER_IP,
        name: process.env.MT5_SERVER_NAME,
      },
    },
  })
})

export default router
