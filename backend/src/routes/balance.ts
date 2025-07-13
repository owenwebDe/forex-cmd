import { Router } from "express"
import { body, query, validationResult } from "express-validator"
import { authenticateToken, requireUserOrAdmin, type AuthRequest } from "../middleware/auth"
import { mt5Service } from "../services/mt5Service"
import { logger } from "../utils/logger"

const router = Router()

// Deposit funds (called after successful Stripe payment)
router.post(
  "/deposit",
  [
    authenticateToken,
    requireUserOrAdmin,
    body("amount").isFloat({ min: 0.01 }),
    body("paymentIntentId").trim().isLength({ min: 1 }),
    body("description").optional().trim(),
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

      const { amount, paymentIntentId, description } = req.body

      const balanceData = {
        loginid: user.loginId,
        amount: Math.abs(amount),
        txnType: 1, // Deposit
        description: description || "Stripe deposit",
        comment: `Stripe Payment - ${paymentIntentId}`,
      }

      const result = await mt5Service.balanceOperation(balanceData)

      logger.info("Deposit processed:", {
        userId: user.id,
        loginId: user.loginId,
        amount,
        paymentIntentId,
      })

      res.json({
        message: "Deposit processed successfully",
        result,
        transaction: {
          type: "deposit",
          amount,
          timestamp: new Date().toISOString(),
          status: "completed",
        },
      })
    } catch (error) {
      logger.error("Deposit error:", error)
      res.status(500).json({ error: "Failed to process deposit" })
    }
  },
)

// Request withdrawal
router.post(
  "/withdrawal-request",
  [
    authenticateToken,
    requireUserOrAdmin,
    body("amount").isFloat({ min: 0.01 }),
    body("method").isIn(["bank_transfer", "card", "crypto"]),
    body("details").isObject(),
    body("reason").optional().trim(),
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

      const { amount, method, details, reason } = req.body

      // Get current account balance to validate withdrawal
      const accountInfo = await mt5Service.getUserInfo(user.loginId)
      if (accountInfo.balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" })
      }

      // Create withdrawal request (in production, store in database)
      const withdrawalRequest = {
        id: Date.now().toString(),
        userId: user.id,
        loginId: user.loginId,
        amount,
        method,
        details,
        reason,
        status: "pending",
        requestedAt: new Date().toISOString(),
      }

      // TODO: Store in database
      // await createWithdrawalRequest(withdrawalRequest)

      logger.info("Withdrawal request created:", {
        userId: user.id,
        loginId: user.loginId,
        amount,
        method,
      })

      res.status(201).json({
        message: "Withdrawal request submitted successfully",
        request: withdrawalRequest,
      })
    } catch (error) {
      logger.error("Withdrawal request error:", error)
      res.status(500).json({ error: "Failed to create withdrawal request" })
    }
  },
)

// Get transaction history
router.get(
  "/history",
  [
    authenticateToken,
    requireUserOrAdmin,
    query("from").optional().isISO8601(),
    query("to").optional().isISO8601(),
    query("type").optional().isIn(["deposit", "withdrawal", "all"]),
  ],
  async (req: AuthRequest, res) => {
    try {
      const user = req.user
      if (!user?.loginId) {
        return res.status(404).json({ error: "No MT5 account found" })
      }

      const { from, to, type } = req.query

      // Get trade history from MT5 (includes balance operations)
      const historyData = {
        loginId: user.loginId,
        from: from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        to: to || new Date().toISOString(),
      }

      const history = await mt5Service.getTradeHistory(historyData)

      // Filter balance operations only
      const transactions = history.filter((item: any) => {
        if (type === "deposit") return item.type === "DEAL_TYPE_BALANCE" && item.profit > 0
        if (type === "withdrawal") return item.type === "DEAL_TYPE_BALANCE" && item.profit < 0
        return item.type === "DEAL_TYPE_BALANCE"
      })

      res.json(transactions)
    } catch (error) {
      logger.error("Get transaction history error:", error)
      res.status(500).json({ error: "Failed to get transaction history" })
    }
  },
)

// Get withdrawal requests
router.get("/withdrawal-requests", [authenticateToken, requireUserOrAdmin], async (req: AuthRequest, res) => {
  try {
    const user = req.user

    // TODO: Get from database
    // const requests = await getWithdrawalRequestsByUser(user.id)

    // Mock data for now
    const requests = []

    res.json(requests)
  } catch (error) {
    logger.error("Get withdrawal requests error:", error)
    res.status(500).json({ error: "Failed to get withdrawal requests" })
  }
})

export { router as balanceRoutes }
