import { Router } from "express"
import { body, validationResult } from "express-validator"

const router = Router()

// Simple logger for backend
const logger = {
  info: (message: string, data?: any) => console.log(`[INFO] ${message}`, data || ''),
  error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error || '')
}

// Simple auth middleware (matching the pattern from account.ts)
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    // Basic token validation - should be replaced with proper JWT verification
    req.user = { id: "user123", email: "user@example.com", role: "user" };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Create payment intent
router.post(
  "/create-intent",
  [
    authenticateToken,
    body("amount").isNumeric().custom((value) => value > 0),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { amount } = req.body
      const userId = req.user?.id

      // Mock payment intent for now - in production, use Stripe
      const mockPaymentIntent = {
        id: `pi_${Date.now()}`,
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        status: "requires_payment_method"
      }

      logger.info("Payment intent created:", { userId, amount, paymentIntentId: mockPaymentIntent.id })

      res.json({
        success: true,
        clientSecret: mockPaymentIntent.client_secret,
        paymentIntentId: mockPaymentIntent.id,
      })
    } catch (error) {
      logger.error("Create payment intent error:", error)
      res.status(500).json({ 
        success: false, 
        error: "Failed to create payment intent" 
      })
    }
  }
)

// Confirm payment
router.post(
  "/confirm",
  [
    authenticateToken,
    body("paymentIntentId").trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { paymentIntentId } = req.body
      const userId = req.user?.id

      // Mock payment confirmation - in production, verify with Stripe
      logger.info("Payment confirmed:", { userId, paymentIntentId })

      res.json({
        success: true,
        message: "Payment confirmed successfully",
        transaction: {
          id: paymentIntentId,
          status: "completed",
          timestamp: new Date().toISOString(),
        },
      })
    } catch (error) {
      logger.error("Confirm payment error:", error)
      res.status(500).json({ 
        success: false, 
        error: "Failed to confirm payment" 
      })
    }
  }
)

// Get payment history
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id

    // Mock payment history - in production, get from Stripe/database
    const mockHistory = [
      {
        id: "pi_1234567890",
        amount: 100,
        currency: "usd",
        status: "succeeded",
        created: new Date(Date.now() - 24 * 60 * 60 * 1000),
        description: "Account deposit",
      },
      {
        id: "pi_0987654321",
        amount: 250,
        currency: "usd",
        status: "succeeded",
        created: new Date(Date.now() - 48 * 60 * 60 * 1000),
        description: "Account deposit",
      },
    ]

    logger.info("Payment history requested:", { userId })

    res.json({
      success: true,
      data: mockHistory,
    })
  } catch (error) {
    logger.error("Get payment history error:", error)
    res.status(500).json({ 
      success: false, 
      error: "Failed to get payment history" 
    })
  }
})

export default router