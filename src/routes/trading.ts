import { Router } from "express"
import { body, param, validationResult } from "express-validator"
import { authenticateToken, requireUserOrAdmin, type AuthRequest } from "../middleware/auth"
import { mt5Service } from "../services/mt5Service"
import { logger } from "../utils/logger"

const router = Router()

// Get position by login ID
router.get(
  "/position/:loginId",
  [authenticateToken, requireUserOrAdmin, param("loginId").isNumeric()],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { loginId } = req.params

      // Check if user can access this login ID
      if (req.user?.role !== "admin" && req.user?.loginId !== Number.parseInt(loginId)) {
        return res.status(403).json({ error: "Access denied" })
      }

      const position = await mt5Service.getPosition(Number.parseInt(loginId))
      res.json(position)
    } catch (error) {
      logger.error("Get position error:", error)
      res.status(500).json({ error: "Failed to get position" })
    }
  },
)

// Get positions by group
router.get(
  "/position/group/:groupName",
  [authenticateToken, requireUserOrAdmin, param("groupName").trim().isLength({ min: 1 })],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { groupName } = req.params
      const positions = await mt5Service.getPositionByGroup(groupName)
      res.json(positions)
    } catch (error) {
      logger.error("Get positions by group error:", error)
      res.status(500).json({ error: "Failed to get positions" })
    }
  },
)

// Get positions by symbol
router.get(
  "/position/group/:groupName/symbol/:symbolName",
  [
    authenticateToken,
    requireUserOrAdmin,
    param("groupName").trim().isLength({ min: 1 }),
    param("symbolName").trim().isLength({ min: 1 }),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { groupName, symbolName } = req.params
      const positions = await mt5Service.getPositionBySymbol(groupName, symbolName)
      res.json(positions)
    } catch (error) {
      logger.error("Get positions by symbol error:", error)
      res.status(500).json({ error: "Failed to get positions" })
    }
  },
)

// Get symbol info
router.get(
  "/symbol/:symbol",
  [authenticateToken, requireUserOrAdmin, param("symbol").trim().isLength({ min: 1 })],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { symbol } = req.params
      const symbolInfo = await mt5Service.getSymbolInfo(symbol)
      res.json(symbolInfo)
    } catch (error) {
      logger.error("Get symbol info error:", error)
      res.status(500).json({ error: "Failed to get symbol info" })
    }
  },
)

// Get journal
router.get("/journal", [authenticateToken, requireUserOrAdmin], async (req: AuthRequest, res) => {
  try {
    const journal = await mt5Service.getJournal()
    res.json(journal)
  } catch (error) {
    logger.error("Get journal error:", error)
    res.status(500).json({ error: "Failed to get journal" })
  }
})

// Get trade history
router.post(
  "/history",
  [
    authenticateToken,
    requireUserOrAdmin,
    body("loginId").optional().isNumeric(),
    body("from").optional().isISO8601(),
    body("to").optional().isISO8601(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const historyData = req.body

      // Check if user can access this login ID
      if (req.user?.role !== "admin" && historyData.loginId && req.user?.loginId !== historyData.loginId) {
        return res.status(403).json({ error: "Access denied" })
      }

      const history = await mt5Service.getTradeHistory(historyData)
      res.json(history)
    } catch (error) {
      logger.error("Get trade history error:", error)
      res.status(500).json({ error: "Failed to get trade history" })
    }
  },
)

// Get chart data
router.post(
  "/chart",
  [
    authenticateToken,
    requireUserOrAdmin,
    body("symbol").trim().isLength({ min: 1 }),
    body("timeframe").isNumeric(),
    body("from").optional().isISO8601(),
    body("to").optional().isISO8601(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const chartData = req.body
      const chart = await mt5Service.getChart(chartData)
      res.json(chart)
    } catch (error) {
      logger.error("Get chart error:", error)
      res.status(500).json({ error: "Failed to get chart data" })
    }
  },
)

export { router as tradingRoutes }
