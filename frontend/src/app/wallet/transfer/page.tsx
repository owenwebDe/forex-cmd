"use client"

import { useState, useEffect } from "react"
import { 
  ArrowRightLeft,
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Shield,
  Clock,
  RefreshCw
} from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"

interface MT5Account {
  login: number
  name: string
  balance: number
  group: string
  server: string
  currency: string
}

interface WalletInfo {
  balance: number
  currency: string
}

interface TransferData {
  fromType: "wallet" | "mt5"
  toType: "wallet" | "mt5"
  fromAccount?: string
  toAccount?: string
  amount: number
  description: string
}

export default function TransferPage() {
  const [transferType, setTransferType] = useState<"wallet_to_mt5" | "mt5_to_wallet">("wallet_to_mt5")
  const [mt5Accounts, setMT5Accounts] = useState<MT5Account[]>([])
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({ balance: 15420.50, currency: "USD" })
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Select accounts, 2: Enter amount, 3: Confirmation
  
  const [transferData, setTransferData] = useState<TransferData>({
    fromType: "wallet",
    toType: "mt5",
    amount: 0,
    description: ""
  })

  // Mock MT5 accounts
  const mockMT5Accounts: MT5Account[] = [
    {
      login: 123456,
      name: "Standard Account",
      balance: 8750.25,
      group: "standard",
      server: "MT5-Live-01",
      currency: "USD"
    },
    {
      login: 789012,
      name: "Gold Account", 
      balance: 25300.75,
      group: "gold",
      server: "MT5-Live-02",
      currency: "USD"
    },
    {
      login: 456789,
      name: "Prime Account",
      balance: 52140.00,
      group: "prime",
      server: "MT5-Live-03",
      currency: "USD"
    }
  ]

  useEffect(() => {
    loadAccounts()
  }, [])

  useEffect(() => {
    // Update transfer data when type changes
    if (transferType === "wallet_to_mt5") {
      setTransferData(prev => ({
        ...prev,
        fromType: "wallet",
        toType: "mt5",
        fromAccount: "wallet",
        toAccount: ""
      }))
    } else {
      setTransferData(prev => ({
        ...prev,
        fromType: "mt5", 
        toType: "wallet",
        fromAccount: "",
        toAccount: "wallet"
      }))
    }
    setStep(1) // Reset to first step
  }, [transferType])

  const loadAccounts = async () => {
    try {
      setIsLoading(true)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMT5Accounts(mockMT5Accounts)
    } catch (error) {
      console.error("Error loading accounts:", error)
      toast.error("Failed to load accounts")
    } finally {
      setIsLoading(false)
    }
  }

  const getSourceBalance = () => {
    if (transferType === "wallet_to_mt5") {
      return walletInfo.balance
    } else {
      const selectedAccount = mt5Accounts.find(acc => acc.login.toString() === transferData.fromAccount)
      return selectedAccount?.balance || 0
    }
  }

  const getDestinationAccount = () => {
    if (transferType === "wallet_to_mt5") {
      return mt5Accounts.find(acc => acc.login.toString() === transferData.toAccount)
    } else {
      return { name: "My Wallet", balance: walletInfo.balance }
    }
  }

  const getSourceAccount = () => {
    if (transferType === "mt5_to_wallet") {
      return mt5Accounts.find(acc => acc.login.toString() === transferData.fromAccount)
    } else {
      return { name: "My Wallet", balance: walletInfo.balance }
    }
  }

  const validateTransfer = () => {
    if (transferData.amount <= 0) {
      toast.error("Please enter a valid amount")
      return false
    }

    if (transferData.amount > getSourceBalance()) {
      toast.error("Insufficient balance")
      return false
    }

    if (transferType === "wallet_to_mt5" && !transferData.toAccount) {
      toast.error("Please select a destination MT5 account")
      return false
    }

    if (transferType === "mt5_to_wallet" && !transferData.fromAccount) {
      toast.error("Please select a source MT5 account")
      return false
    }

    return true
  }

  const handleTransfer = async () => {
    if (!validateTransfer()) return

    setIsLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`Transfer of ${formatCurrency(transferData.amount)} completed successfully`)
      
      // Reset form
      setTransferData({
        fromType: transferType === "wallet_to_mt5" ? "wallet" : "mt5",
        toType: transferType === "wallet_to_mt5" ? "mt5" : "wallet",
        fromAccount: transferType === "wallet_to_mt5" ? "wallet" : "",
        toAccount: transferType === "wallet_to_mt5" ? "" : "wallet",
        amount: 0,
        description: ""
      })
      setStep(1)
      
      // Update balances (mock)
      if (transferType === "wallet_to_mt5") {
        setWalletInfo(prev => ({ ...prev, balance: prev.balance - transferData.amount }))
      } else {
        setWalletInfo(prev => ({ ...prev, balance: prev.balance + transferData.amount }))
      }
      
    } catch (error) {
      toast.error("Transfer failed. Please try again.")
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

  const getTransferFee = () => {
    // Mock transfer fee calculation (0.5% or minimum $1)
    const feeRate = 0.005
    const calculatedFee = transferData.amount * feeRate
    return Math.max(calculatedFee, 1)
  }

  const getNetAmount = () => {
    return transferData.amount - getTransferFee()
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <ArrowRightLeft className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Transfer Funds
              </h1>
              <p className="text-gray-600">Move money between your wallet and MT5 accounts</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl">
          {/* Transfer Type Selection */}
          <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Direction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setTransferType("wallet_to_mt5")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  transferType === "wallet_to_mt5"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Wallet to MT5</h4>
                    <p className="text-sm text-gray-600">Transfer funds from wallet to MT5 account</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTransferType("mt5_to_wallet")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  transferType === "mt5_to_wallet"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">MT5 to Wallet</h4>
                    <p className="text-sm text-gray-600">Transfer funds from MT5 account to wallet</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

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
              <span>Enter Amount</span>
              <span>Confirmation</span>
            </div>
          </div>

          {/* Step 1: Account Selection */}
          {step === 1 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {transferType === "wallet_to_mt5" ? "Select Destination MT5 Account" : "Select Source MT5 Account"}
              </h3>

              {/* Source/Destination Display */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {transferType === "wallet_to_mt5" ? "From:" : "To:"}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">My Wallet</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="font-bold text-gray-900">{formatCurrency(walletInfo.balance)}</p>
                  </div>
                </div>
              </div>

              {/* MT5 Account Selection */}
              <div className="space-y-4">
                {mt5Accounts.map((account) => (
                  <div
                    key={account.login}
                    onClick={() => {
                      if (transferType === "wallet_to_mt5") {
                        setTransferData(prev => ({ ...prev, toAccount: account.login.toString() }))
                      } else {
                        setTransferData(prev => ({ ...prev, fromAccount: account.login.toString() }))
                      }
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      (transferType === "wallet_to_mt5" ? transferData.toAccount : transferData.fromAccount) === account.login.toString()
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Account #{account.login}
                          </h4>
                          <p className="text-sm text-gray-600">{account.name}</p>
                          <p className="text-xs text-gray-500">{account.server}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(account.balance)}</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {account.group}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={
                    transferType === "wallet_to_mt5" ? !transferData.toAccount : !transferData.fromAccount
                  }
                  className="btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Amount Entry */}
          {step === 2 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Enter Transfer Amount</h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  ← Back
                </button>
              </div>

              {/* Transfer Summary */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {transferType === "wallet_to_mt5" ? (
                        <Wallet className="w-5 h-5 text-purple-600" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      )}
                      <span className="font-medium">
                        {getSourceAccount()?.name || `Account #${transferData.fromAccount}`}
                      </span>
                    </div>
                    <ArrowRightLeft className="w-5 h-5 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      {transferType === "wallet_to_mt5" ? (
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Wallet className="w-5 h-5 text-purple-600" />
                      )}
                      <span className="font-medium">
                        {getDestinationAccount()?.name || `Account #${transferData.toAccount}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="font-bold text-gray-900">{formatCurrency(getSourceBalance())}</p>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={transferData.amount || ""}
                    onChange={(e) => setTransferData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="input-field pl-10"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    max={getSourceBalance()}
                  />
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="mt-3 flex space-x-2">
                  {[25, 50, 75, 100].map((percentage) => (
                    <button
                      key={percentage}
                      onClick={() => {
                        const amount = (getSourceBalance() * percentage) / 100
                        setTransferData(prev => ({ ...prev, amount }))
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={transferData.description}
                  onChange={(e) => setTransferData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  placeholder="Enter transfer description..."
                />
              </div>

              {/* Transfer Summary */}
              {transferData.amount > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">Transfer Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transfer Amount:</span>
                      <span className="font-medium">{formatCurrency(transferData.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transfer Fee:</span>
                      <span className="font-medium">{formatCurrency(getTransferFee())}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold text-gray-900">Amount to Receive:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(getNetAmount())}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={transferData.amount <= 0 || transferData.amount > getSourceBalance()}
                  className="btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Transfer</h3>
                <button
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  ← Back
                </button>
              </div>

              {/* Transfer Details */}
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Transfer Details
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">
                      {getSourceAccount()?.name || `Account #${transferData.fromAccount}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">
                      {getDestinationAccount()?.name || `Account #${transferData.toAccount}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatCurrency(transferData.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer Fee:</span>
                    <span className="font-medium">{formatCurrency(getTransferFee())}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-gray-900">Amount to Receive:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(getNetAmount())}</span>
                  </div>
                  {transferData.description && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium">{transferData.description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Important Notice */}
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h5 className="font-medium text-yellow-800 mb-1">Important Notice</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Transfers are processed instantly</li>
                      <li>• Transfer fees are non-refundable</li>
                      <li>• Please verify all details before confirming</li>
                      <li>• This action cannot be undone</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="btn-secondary"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleTransfer}
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
                      <Shield className="w-4 h-4 mr-2" />
                      Confirm Transfer
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}