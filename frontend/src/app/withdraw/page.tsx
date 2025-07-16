"use client"

import { useState, useEffect } from "react"
import { 
  TrendingDown, 
  CreditCard, 
  Banknote, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Wallet
} from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"

interface MT5Account {
  login: number
  name: string
  balance: number
  group: string
}

interface WithdrawalMethod {
  id: string
  name: string
  type: "bank" | "card" | "crypto" | "ewallet"
  fee: number
  minAmount: number
  maxAmount: number
  processingTime: string
  icon: any
}

interface WithdrawalRequest {
  accountId: string
  method: string
  amount: number
  bankAccount?: string
  cardNumber?: string
  walletAddress?: string
  notes?: string
}

export default function WithdrawPage() {
  const [accounts, setAccounts] = useState<MT5Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Select Account, 2: Enter Details, 3: Confirmation
  
  const [withdrawalDetails, setWithdrawalDetails] = useState({
    bankAccount: "",
    cardNumber: "",
    walletAddress: "",
    notes: ""
  })

  const withdrawalMethods: WithdrawalMethod[] = [
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      type: "bank",
      fee: 25,
      minAmount: 100,
      maxAmount: 50000,
      processingTime: "2-3 business days",
      icon: Banknote
    },
    {
      id: "credit_card",
      name: "Credit/Debit Card",
      type: "card",
      fee: 3.5, // percentage
      minAmount: 50,
      maxAmount: 10000,
      processingTime: "1-2 business days",
      icon: CreditCard
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      type: "crypto",
      fee: 1, // percentage
      minAmount: 25,
      maxAmount: 100000,
      processingTime: "30 minutes - 2 hours",
      icon: DollarSign
    }
  ]

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      // Mock data - replace with actual API call
      const mockAccounts: MT5Account[] = [
        { login: 123456, name: "Standard Account", balance: 5000, group: "standard" },
        { login: 789012, name: "Gold Account", balance: 15000, group: "gold" }
      ]
      setAccounts(mockAccounts)
    } catch (error) {
      console.error("Error loading accounts:", error)
      toast.error("Failed to load accounts")
    }
  }

  const getSelectedMethodDetails = () => {
    return withdrawalMethods.find(method => method.id === selectedMethod)
  }

  const calculateFee = () => {
    const method = getSelectedMethodDetails()
    if (!method || !amount) return 0

    if (method.type === "bank") {
      return method.fee // Fixed fee
    } else {
      return (parseFloat(amount) * method.fee) / 100 // Percentage fee
    }
  }

  const getNetAmount = () => {
    const amountNum = parseFloat(amount) || 0
    const fee = calculateFee()
    return amountNum - fee
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    setStep(2)
  }

  const handleSubmitWithdrawal = async () => {
    const method = getSelectedMethodDetails()
    const selectedAcc = accounts.find(acc => acc.login.toString() === selectedAccount)
    
    if (!method || !selectedAcc) return

    // Validation
    const amountNum = parseFloat(amount)
    if (amountNum < method.minAmount) {
      toast.error(`Minimum withdrawal amount is $${method.minAmount}`)
      return
    }
    if (amountNum > method.maxAmount) {
      toast.error(`Maximum withdrawal amount is $${method.maxAmount}`)
      return
    }
    if (amountNum > selectedAcc.balance) {
      toast.error("Insufficient balance")
      return
    }

    setIsLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Withdrawal request submitted successfully")
      // Reset form or redirect
      setStep(1)
      setAmount("")
      setSelectedMethod("")
      setSelectedAccount("")
      setWithdrawalDetails({
        bankAccount: "",
        cardNumber: "",
        walletAddress: "",
        notes: ""
      })
    } catch (error) {
      toast.error("Failed to submit withdrawal request")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Withdraw Funds
              </h1>
              <p className="text-gray-600">Transfer money from your MT5 accounts</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                2
              </div>
              <div className={`flex-1 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                3
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Select Account</span>
              <span>Enter Details</span>
              <span>Confirmation</span>
            </div>
          </div>

          {/* Step 1: Select Account & Method */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Select Account */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Select Account
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accounts.map((account) => (
                    <div
                      key={account.login}
                      onClick={() => setSelectedAccount(account.login.toString())}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedAccount === account.login.toString()
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">#{account.login}</p>
                          <p className="text-sm text-gray-500">{account.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(account.balance)}</p>
                          <p className="text-sm text-green-600">Available</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Withdrawal Method */}
              {selectedAccount && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Withdrawal Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {withdrawalMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => handleMethodSelect(method.id)}
                        className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <method.icon className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{method.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{method.processingTime}</p>
                          <p className="text-sm text-gray-500">
                            Fee: {method.type === "bank" ? formatCurrency(method.fee) : `${method.fee}%`}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Min: {formatCurrency(method.minAmount)} - Max: {formatCurrency(method.maxAmount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Enter Details */}
          {step === 2 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Withdrawal Details</h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  ← Back
                </button>
              </div>

              <div className="space-y-6">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Withdrawal Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      className="input-field pl-10"
                      placeholder="0.00"
                    />
                  </div>
                  {amount && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Withdrawal Amount:</span>
                        <span>{formatCurrency(parseFloat(amount) || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Processing Fee:</span>
                        <span>-{formatCurrency(calculateFee())}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold border-t pt-2 mt-2">
                        <span>You will receive:</span>
                        <span>{formatCurrency(getNetAmount())}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Method-specific fields */}
                {selectedMethod === "bank_transfer" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Account Details
                    </label>
                    <textarea
                      value={withdrawalDetails.bankAccount}
                      onChange={(e) => setWithdrawalDetails(prev => ({...prev, bankAccount: e.target.value}))}
                      className="input-field"
                      rows={3}
                      placeholder="Enter your bank account details (Account number, routing number, etc.)"
                    />
                  </div>
                )}

                {selectedMethod === "credit_card" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number (Last 4 digits)
                    </label>
                    <input
                      type="text"
                      value={withdrawalDetails.cardNumber}
                      onChange={(e) => setWithdrawalDetails(prev => ({...prev, cardNumber: e.target.value}))}
                      className="input-field"
                      placeholder="**** **** **** 1234"
                      maxLength={4}
                    />
                  </div>
                )}

                {selectedMethod === "crypto" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Crypto Wallet Address
                    </label>
                    <input
                      type="text"
                      value={withdrawalDetails.walletAddress}
                      onChange={(e) => setWithdrawalDetails(prev => ({...prev, walletAddress: e.target.value}))}
                      className="input-field"
                      placeholder="Enter your wallet address"
                    />
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={withdrawalDetails.notes}
                    onChange={(e) => setWithdrawalDetails(prev => ({...prev, notes: e.target.value}))}
                    className="input-field"
                    rows={2}
                    placeholder="Any additional information..."
                  />
                </div>

                {/* Continue Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(3)}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className="btn-primary"
                  >
                    Continue to Confirmation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Withdrawal</h3>
                <button
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  ← Back
                </button>
              </div>

              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Withdrawal Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">From Account:</span>
                      <span className="font-medium">
                        #{selectedAccount} ({accounts.find(acc => acc.login.toString() === selectedAccount)?.name})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium">{getSelectedMethodDetails()?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(amount) || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fee:</span>
                      <span className="font-medium">-{formatCurrency(calculateFee())}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold text-gray-900">You will receive:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(getNetAmount())}</span>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                    <div>
                      <h5 className="font-medium text-yellow-800 mb-1">Important Notice</h5>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Processing time: {getSelectedMethodDetails()?.processingTime}</li>
                        <li>• Withdrawals are processed during business hours</li>
                        <li>• You will receive a confirmation email once processed</li>
                        <li>• This action cannot be undone once submitted</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                  >
                    Back to Edit
                  </button>
                  <button
                    onClick={handleSubmitWithdrawal}
                    disabled={isLoading}
                    className="btn-primary flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm Withdrawal
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}