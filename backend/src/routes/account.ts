import express from "express"
import { mt5Service, type CreateAccountRequest } from "../services/mt5Service.js"

const router = express.Router()

// Test MT5 connection
router.get("/test-connection", async (req, res) => {
  try {
    const isConnected = await mt5Service.testConnection()
    res.json({
      success: isConnected,
      message: isConnected ? "MT5 connection successful" : "MT5 connection failed",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Connection test failed",
      error: error.message,
    })
  }
})

// Create new MT5 account
router.post("/create-live-account", async (req, res) => {
  try {
    const { name, email, phone, country, city, address, zipCode, leverage, accountType, initialDeposit } = req.body

    // Validate required fields
    if (!name || !email || !phone || !country) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, phone, country",
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      })
    }

    // Validate leverage
    const validLeverages = [1, 10, 20, 50, 100, 200, 300, 400, 500, 1000]
    if (!validLeverages.includes(leverage)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leverage value",
      })
    }

    const createRequest: CreateAccountRequest = {
      name,
      email,
      phone,
      country,
      city: city || "",
      address: address || "",
      zipCode: zipCode || "",
      leverage,
      accountType: accountType || "demo",
      initialDeposit,
    }

    const account = await mt5Service.createAccount(createRequest)

    res.json({
      success: true,
      message: "MT5 account created successfully",
      data: {
        login: account.login,
        password: account.password,
        server: account.server,
        name: account.name,
        email: account.email,
        leverage: account.leverage,
        balance: account.balance,
        group: account.group,
      },
    })
  } catch (error: any) {
    console.error("Create Account Error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create MT5 account",
      error: error.message,
    })
  }
})

// Get account information
router.get("/info/:login", async (req, res) => {
  try {
    const login = Number.parseInt(req.params.login)
    if (isNaN(login)) {
      return res.status(400).json({
        success: false,
        message: "Invalid login number",
      })
    }

    const account = await mt5Service.getAccount(login)
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      })
    }

    res.json({
      success: true,
      data: account,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to get account information",
      error: error.message,
    })
  }
})

// Get account positions
router.get("/positions/:login", async (req, res) => {
  try {
    const login = Number.parseInt(req.params.login)
    if (isNaN(login)) {
      return res.status(400).json({
        success: false,
        message: "Invalid login number",
      })
    }

    const positions = await mt5Service.getPositions(login)
    res.json({
      success: true,
      data: positions,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to get positions",
      error: error.message,
    })
  }
})

// Perform balance operation (deposit/withdrawal)
router.post("/balance-operation", async (req, res) => {
  try {
    const { login, amount, comment, type } = req.body

    if (!login || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: login, amount, type",
      })
    }

    if (!["deposit", "withdrawal"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation type. Must be "deposit" or "withdrawal"',
      })
    }

    const success = await mt5Service.performBalanceOperation({
      login: Number.parseInt(login),
      amount: Number.parseFloat(amount),
      comment: comment || `${type} via CRM`,
      type,
    })

    if (success) {
      res.json({
        success: true,
        message: `${type} operation completed successfully`,
      })
    } else {
      res.status(500).json({
        success: false,
        message: `${type} operation failed`,
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Balance operation failed",
      error: error.message,
    })
  }
})

export default router
