"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { CreditCard, DollarSign, CheckCircle } from "lucide-react"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import { apiClient } from "@/lib/api"
import { toast } from "react-hot-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function DepositPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CreditCard className="h-6 w-6 mr-2" />
            Deposit Funds
          </h1>
          <p className="text-gray-600 mt-2">Add money to your MT5 trading account securely</p>
        </div>

        <Elements stripe={stripePromise}>
          <DepositForm />
        </Elements>
      </div>
    </DashboardLayout>
  )
}

function DepositForm() {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const stripe = useStripe()
  const elements = useElements()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const createPaymentIntent = async () => {
    if (!amount || Number.parseFloat(amount) < 1) {
      toast.error("Minimum deposit amount is $1")
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.createPaymentIntent(Number.parseFloat(amount))
      if (response.success) {
        setClientSecret(response.clientSecret)
      } else {
        toast.error(response.error || "Failed to create payment")
      }
    } catch (error) {
      console.error("Payment intent creation failed:", error)
      toast.error("Failed to create payment")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setLoading(true)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setLoading(false)
      return
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    })

    if (error) {
      toast.error(error.message || "Payment failed")
      setLoading(false)
    } else if (paymentIntent.status === "succeeded") {
      try {
        await apiClient.confirmPayment(paymentIntent.id)
        setSuccess(true)
        toast.success("Deposit successful!")
      } catch (error) {
        console.error("Payment confirmation failed:", error)
        toast.error("Payment processed but confirmation failed")
      }
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit Successful!</h2>
        <p className="text-gray-600 mb-6">Your deposit of ${amount} has been processed successfully.</p>
        <div className="space-y-3">
          <button onClick={() => (window.location.href = "/dashboard")} className="btn-primary w-full">
            Return to Dashboard
          </button>
          <button
            onClick={() => {
              setSuccess(false)
              setAmount("")
              setClientSecret("")
            }}
            className="btn-secondary w-full"
          >
            Make Another Deposit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Amount Selection */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Deposit Amount</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="form-label">
              Amount (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="amount"
                type="text"
                className="form-input pl-10"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 5000].map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                className="btn-secondary text-sm py-2"
              >
                ${quickAmount}
              </button>
            ))}
          </div>

          {!clientSecret && (
            <button
              onClick={createPaymentIntent}
              disabled={!amount || Number.parseFloat(amount) < 1 || loading}
              className="btn-primary w-full"
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
          )}
        </div>
      </div>

      {/* Payment Form */}
      {clientSecret && (
        <form onSubmit={handleSubmit} className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>

          <div className="space-y-4">
            <div>
              <label className="form-label">Card Information</label>
              <div className="p-3 border border-gray-300 rounded-lg">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Deposit Summary</h3>
              <div className="text-blue-800 space-y-1">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-blue-200 pt-2">
                  <span>Total:</span>
                  <span>${amount}</span>
                </div>
              </div>
            </div>

            <button type="submit" disabled={!stripe || loading} className="btn-primary w-full">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Deposit $${amount}`
              )}
            </button>
          </div>
        </form>
      )}

      {/* Security Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Security & Processing</h3>
        <ul className="text-gray-600 space-y-1 text-sm">
          <li>• All payments are processed securely through Stripe</li>
          <li>• Deposits are typically processed within 1-2 business days</li>
          <li>• Your card information is never stored on our servers</li>
          <li>• Funds will be added directly to your MT5 account balance</li>
        </ul>
      </div>
    </div>
  )
}
