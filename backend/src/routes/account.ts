import express from "express";
import {
  mt5Service,
  type CreateAccountRequest,
} from "../services/mt5Service.js";

const router = express.Router();

interface AuthRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
    loginId?: number;
  };
}

// Simple auth middleware for backend routes
const authenticateToken = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  // For now, we'll simulate token validation since JWT is in the other routes file
  // In production, you'd import and use the proper JWT validation
  try {
    // Basic token validation - should be replaced with proper JWT verification
    req.user = { id: "user123", email: "user@example.com", role: "user" };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// In-memory store for user-account mapping (replace with database in production)
const userMT5Accounts = new Map<string, number[]>(); // userId -> MT5 account logins
const mt5AccountOwners = new Map<number, string>(); // MT5 login -> userId

// Test MT5 connection
router.get("/test-connection", async (req, res) => {
  try {
    const isConnected = await mt5Service.testConnection();
    res.json({
      success: isConnected,
      message: isConnected
        ? "MT5 connection successful"
        : "MT5 connection failed",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Connection test failed",
      error: error.message,
    });
  }
});

// Get user's MT5 accounts
router.get("/user-accounts", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userAccountLogins = userMT5Accounts.get(userId) || [];
    const accounts = [];

    // Get account details for each login
    for (const login of userAccountLogins) {
      try {
        const account = await mt5Service.getAccount(login);
        if (account) {
          accounts.push({
            ...account,
            accountType: "demo", // You may want to store this separately
            createdAt: new Date().toISOString(), // You may want to store this separately
          });
        }
      } catch (error) {
        console.error(`Error fetching account ${login}:`, error);
      }
    }

    res.json({
      success: true,
      data: accounts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to get user accounts",
      error: error.message,
    });
  }
});

// Create new MT5 live account
router.post("/create-live-account", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      leverage,
      accountGroup,
      password,
      investorPassword,
      initialDeposit,
    } = req.body;

    // Validate required fields
    if (!accountGroup || !password || !investorPassword) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: accountGroup, password, investorPassword",
      });
    }

    // Get user info from authenticated user (this would come from your user database)
    // For now, we'll use placeholder data - replace with actual user lookup
    const userInfo = {
      name: req.user?.email?.split('@')[0] || "User",
      email: req.user?.email || "user@example.com",
      phone: "+1234567890", // Get from user profile
      country: "United States", // Get from user profile
      city: "New York", // Get from user profile
      address: "123 Main St", // Get from user profile
      zipCode: "10001" // Get from user profile
    };

    // Validate leverage
    const validLeverages = [10, 50, 100, 200, 300, 400, 500];
    if (!validLeverages.includes(leverage)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leverage value. Must be one of: 10, 50, 100, 200, 300, 400, 500",
      });
    }

    // Validate account group
    const validAccountGroups = ["ENC", "Silver", "Prime", "Standard", "Gold", "Cent"];
    if (!validAccountGroups.includes(accountGroup)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account group. Must be one of: ENC, Silver, Prime, Standard, Gold, Cent",
      });
    }

    // Validate minimum deposit requirements
    const minDeposits = {
      ENC: 25000,
      Silver: 10000, 
      Prime: 50000,
      Standard: 1000,
      Gold: 5000,
      Cent: 100
    };

    if (initialDeposit < minDeposits[accountGroup as keyof typeof minDeposits]) {
      return res.status(400).json({
        success: false,
        message: `Minimum deposit for ${accountGroup} account is $${minDeposits[accountGroup as keyof typeof minDeposits].toLocaleString()}`,
      });
    }

    const createRequest: CreateAccountRequest = {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      country: userInfo.country,
      city: userInfo.city,
      address: userInfo.address,
      zipCode: userInfo.zipCode,
      leverage,
      accountGroup: accountGroup as "ENC" | "Silver" | "Prime" | "Standard" | "Gold" | "Cent",
      password,
      investorPassword,
      initialDeposit,
    };

    const account = await mt5Service.createAccount(createRequest);

    // Associate account with user
    const userId = req.user?.id;
    if (userId) {
      const userAccounts = userMT5Accounts.get(userId) || [];
      userAccounts.push(account.login);
      userMT5Accounts.set(userId, userAccounts);
      mt5AccountOwners.set(account.login, userId);
    }

    res.json({
      success: true,
      message: "Live MT5 account created successfully",
      data: {
        login: account.login,
        password: account.password,
        server: account.server,
        name: account.name,
        email: account.email,
        leverage: account.leverage,
        balance: account.balance,
        group: account.group,
        accountType: accountGroup,
      },
    });
  } catch (error: any) {
    console.error("Create Live Account Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create live MT5 account",
      error: error.message,
    });
  }
});

// Get account information
router.get("/info/:login", async (req, res) => {
  try {
    const login = Number.parseInt(req.params.login);
    if (isNaN(login)) {
      return res.status(400).json({
        success: false,
        message: "Invalid login number",
      });
    }

    const account = await mt5Service.getAccount(login);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.json({
      success: true,
      data: account,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to get account information",
      error: error.message,
    });
  }
});

// Get account positions
router.get("/positions/:login", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const login = Number.parseInt(req.params.login);
    if (isNaN(login)) {
      return res.status(400).json({
        success: false,
        message: "Invalid login number",
      });
    }

    // Check if user owns this account
    const userId = req.user?.id;
    const accountOwner = mt5AccountOwners.get(login);
    if (userId !== accountOwner && req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: You can only view your own accounts",
      });
    }

    const positions = await mt5Service.getPositions(login);
    res.json({
      success: true,
      data: positions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to get positions",
      error: error.message,
    });
  }
});

// Perform balance operation (deposit/withdrawal)
router.post("/balance-operation", async (req, res) => {
  try {
    const { login, amount, comment, type } = req.body;

    if (!login || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: login, amount, type",
      });
    }

    if (!["deposit", "withdrawal"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation type. Must be "deposit" or "withdrawal"',
      });
    }

    const success = await mt5Service.performBalanceOperation({
      login: Number.parseInt(login),
      amount: Number.parseFloat(amount),
      comment: comment || `${type} via CRM`,
      type,
    });

    if (success) {
      res.json({
        success: true,
        message: `${type} operation completed successfully`,
      });
    } else {
      res.status(500).json({
        success: false,
        message: `${type} operation failed`,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Balance operation failed",
      error: error.message,
    });
  }
});

export default router;
