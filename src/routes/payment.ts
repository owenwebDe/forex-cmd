import { Router } from "express"
import Stripe from "stripe"
import { body, validationResult } from "express-validator"
import { authenticateToken, requireUserOrAdmin, type AuthRequest } from "../middleware/auth"
import { mt5Service } from "../services/mt5Service"
import { logger } from "../utils/logger"

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

// Create payment intent
router.post(
  "/create-payment-intent",
  [
    authenticateToken,
    requireUserOrAdmin,
    body("amount")
      .isNumeric()
      .custom((value) => value > 0),
    body("currency").optional().isIn(["usd", "eur", "gbp"]),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { amount, currency = "usd" } = req.body
      const userId = req.user?.id

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          userId,
          loginId: req.user?.loginId?.toString() || "",
          type: "deposit",
        },
      })

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      })
    } catch (error) {
      logger.error("Create payment intent error:", error)
      res.status(500).json({ error: "Failed to create payment intent" })
    }
  },
)

// Stripe webhook handler
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    logger.error("Stripe webhook secret not configured")
    return res.status(500).json({ error: "Webhook secret not configured" })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    logger.error("Webhook signature verification failed:", err)
    return res.status(400).json({ error: "Webhook signature verification failed" })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handleSuccessfulPayment(paymentIntent)
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handleFailedPayment(failedPayment)
        break

      default:
        logger.info("Unhandled webhook event type:", event.type)
    }

    res.json({ received: true })
  } catch (error) {
    logger.error("Webhook handler error:", error)
    res.status(500).json({ error: "Webhook handler failed" })
  }
})

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { userId, loginId, type } = paymentIntent.metadata
    const amount = paymentIntent.amount / 100 // Convert from cents

    if (type === "deposit" && loginId) {
      // Update MT5 account balance
      const balanceData = {
        loginid: Number.parseInt(loginId),
        amount: amount,
        txnType: 1, // Deposit
        description: "Stripe deposit",
        comment: `Stripe Payment - ${paymentIntent.id}`,
      }

      const result = await mt5Service.balanceOperation(balanceData)

      logger.info("Successful deposit processed:", {
        userId,
        loginId,
        amount,
        paymentIntentId: paymentIntent.id,
        mt5Result: result,
      })
    }
  } catch (error) {
    logger.error("Failed to process successful payment:", error)
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  const { userId, loginId } = paymentIntent.metadata

  logger.warn("Payment failed:", {
    userId,
    loginId,
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount / 100,
  })
}

// Get payment history
router.get("/history", [authenticateToken, requireUserOrAdmin], async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    // Get payment intents for this user
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      expand: ["data.charges"],
    })

    const userPayments = paymentIntents.data.filter((pi) => pi.metadata.userId === userId)

    const formattedPayments = userPayments.map((pi) => ({
      id: pi.id,
      amount: pi.amount / 100,
      currency: pi.currency,
      status: pi.status,
      created: new Date(pi.created * 1000),
      description: pi.description,
      metadata: pi.metadata,
    }))

    res.json(formattedPayments)
  } catch (error) {
    logger.error("Get payment history error:", error)
    res.status(500).json({ error: "Failed to get payment history" })
  }
})

export { router as paymentRoutes }
