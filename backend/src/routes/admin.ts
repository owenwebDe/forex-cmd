import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import {
  authenticateToken,
  requireAdmin,
  type AuthRequest,
} from "../middleware/auth.js";
import { mt5Service } from "../services/mt5Service.js";
import { logger } from "../utils/logger.js";

const router = Router();

// All admin routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard Statistics
router.get("/dashboard-stats", async (req: AuthRequest, res) => {
  try {
    // Get all users and accounts data
    const [allUsers, allAccounts] = await Promise.all([
      // In production, replace with actual database queries
      Promise.resolve([]), // users from database
      mt5Service.getAllAccountInfos(),
    ]);

    const stats = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter((u: any) => u.status === "active").length,
      totalBalance: allAccounts.reduce(
        (sum: number, acc: any) => sum + (acc.balance || 0),
        0
      ),
      totalEquity: allAccounts.reduce(
        (sum: number, acc: any) => sum + (acc.equity || 0),
        0
      ),
      totalProfit: allAccounts.reduce(
        (sum: number, acc: any) => sum + (acc.profit || 0),
        0
      ),
      openPositions: allAccounts.reduce(
        (sum: number, acc: any) => sum + (acc.positions?.length || 0),
        0
      ),
      todayDeposits: 0, // Calculate from payment history
      todayWithdrawals: 0, // Calculate from payment history
      serverStatus: "online" as const,
    };

    res.json(stats);
  } catch (error) {
    logger.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});

// User Management
router.get("/users", async (req: AuthRequest, res) => {
  try {
    // In production, replace with actual database query
    const users = []; // await getUsersFromDatabase()
    res.json(users);
  } catch (error) {
    logger.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post(
  "/users",
  [
    body("firstName").trim().isLength({ min: 1 }),
    body("lastName").trim().isLength({ min: 1 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("createMT5Account").optional().isBoolean(),
    body("mt5Group").optional().trim(),
    body("mt5Leverage").optional().isNumeric(),
    body("initialBalance").optional().isNumeric(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userData = req.body;

      // Create user in database (implement your user creation logic)
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: "user",
        status: "active",
        createdAt: new Date().toISOString(),
      };

      // Create MT5 account if requested
      if (userData.createMT5Account) {
        const mt5AccountData = {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          group: userData.mt5Group || "demo",
          leverage: userData.mt5Leverage || 100,
          balance: userData.initialBalance || 0,
        };

        const mt5Account = await mt5Service.createAccount(mt5AccountData);
        newUser.loginId = mt5Account.loginId;
      }

      logger.info("User created by admin:", {
        userId: newUser.id,
        adminId: req.user?.id,
      });
      res.status(201).json(newUser);
    } catch (error) {
      logger.error("Create user error:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
);

router.post(
  "/users/:userId/disable",
  [param("userId").trim().isLength({ min: 1 })],
  async (req: AuthRequest, res) => {
    try {
      const { userId } = req.params;

      // Disable user in database and MT5
      // Implementation depends on your user storage

      logger.info("User disabled by admin:", { userId, adminId: req.user?.id });
      res.json({ message: "User disabled successfully" });
    } catch (error) {
      logger.error("Disable user error:", error);
      res.status(500).json({ error: "Failed to disable user" });
    }
  }
);

router.post(
  "/users/:userId/enable",
  [param("userId").trim().isLength({ min: 1 })],
  async (req: AuthRequest, res) => {
    try {
      const { userId } = req.params;

      // Enable user in database and MT5
      // Implementation depends on your user storage

      logger.info("User enabled by admin:", { userId, adminId: req.user?.id });
      res.json({ message: "User enabled successfully" });
    } catch (error) {
      logger.error("Enable user error:", error);
      res.status(500).json({ error: "Failed to enable user" });
    }
  }
);

// MT5 Account Management
router.get("/mt5-accounts", async (req: AuthRequest, res) => {
  try {
    const accounts = await mt5Service.getAllAccountInfos();
    res.json(accounts);
  } catch (error) {
    logger.error("Get MT5 accounts error:", error);
    res.status(500).json({ error: "Failed to fetch MT5 accounts" });
  }
});

router.get(
  "/mt5-accounts/:loginId",
  [param("loginId").isNumeric()],
  async (req: AuthRequest, res) => {
    try {
      const { loginId } = req.params;
      const account = await mt5Service.getUserInfo(Number.parseInt(loginId));
      res.json(account);
    } catch (error) {
      logger.error("Get MT5 account error:", error);
      res.status(500).json({ error: "Failed to fetch MT5 account" });
    }
  }
);

// Position Management
router.get("/positions", async (req: AuthRequest, res) => {
  try {
    // Get positions for all accounts
    const accounts = await mt5Service.getAllAccountInfos();
    const allPositions = [];

    for (const account of accounts) {
      try {
        const positions = await mt5Service.getPosition(account.loginId);
        allPositions.push(...positions);
      } catch (error) {
        logger.warn(
          `Failed to get positions for account ${account.loginId}:`,
          error
        );
      }
    }

    res.json(allPositions);
  } catch (error) {
    logger.error("Get all positions error:", error);
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

router.post(
  "/close-position",
  [body("ticket").isNumeric()],
  async (req: AuthRequest, res) => {
    try {
      const { ticket } = req.body;

      const result = await mt5Service.sendCloseTrade({ ticket });

      logger.info("Position closed by admin:", {
        ticket,
        adminId: req.user?.id,
      });
      res.json(result);
    } catch (error) {
      logger.error("Close position error:", error);
      res.status(500).json({ error: "Failed to close position" });
    }
  }
);

// Trading Operations
router.post(
  "/open-trade",
  [
    body("loginId").isNumeric(),
    body("symbol").trim().isLength({ min: 1 }),
    body("type").isIn(["buy", "sell"]),
    body("volume").isNumeric(),
    body("price").optional().isNumeric(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const tradeData = req.body;
      const result = await mt5Service.sendOpenTrade(tradeData);

      logger.info("Trade opened by admin:", {
        tradeData,
        adminId: req.user?.id,
      });
      res.json(result);
    } catch (error) {
      logger.error("Open trade error:", error);
      res.status(500).json({ error: "Failed to open trade" });
    }
  }
);

// Balance Operations
router.post(
  "/balance-operation",
  [
    body("loginId").isNumeric(),
    body("amount").isNumeric(),
    body("type").isIn(["deposit", "withdrawal", "credit", "bonus"]),
    body("description").trim().isLength({ min: 1 }),
  ],
  async (req: AuthRequest, res) => {
    try {
      const { loginId, amount, type, description } = req.body;

      const balanceData = {
        loginid: loginId,
        amount: type === "withdrawal" ? -Math.abs(amount) : Math.abs(amount),
        txnType: type === "deposit" ? 1 : type === "withdrawal" ? 2 : 3,
        description,
        comment: `Admin operation by ${req.user?.email}`,
      };

      const result = await mt5Service.balanceOperation(balanceData);

      logger.info("Balance operation by admin:", {
        loginId,
        amount,
        type,
        adminId: req.user?.id,
      });

      res.json(result);
    } catch (error) {
      logger.error("Balance operation error:", error);
      res.status(500).json({ error: "Failed to perform balance operation" });
    }
  }
);

// System Logs
router.get(
  "/logs",
  [
    query("limit").optional().isNumeric(),
    query("level").optional().isIn(["info", "warning", "error"]),
    query("from").optional().isISO8601(),
    query("to").optional().isISO8601(),
  ],
  async (req: AuthRequest, res) => {
    try {
      // In production, implement proper log querying from your logging system
      const logs = [
        {
          id: "1",
          timestamp: new Date().toISOString(),
          level: "info",
          message: "System started successfully",
          source: "server",
        },
      ];

      res.json(logs);
    } catch (error) {
      logger.error("Get logs error:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  }
);

export { router as adminRoutes };
