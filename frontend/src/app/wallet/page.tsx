"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Plus,
  Eye,
  EyeOff,
  RefreshCw,
  DollarSign,
  History,
  Send,
  Download,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"

interface WalletBalance {
  available: number
  pending: number
  total: number
  currency: string
}

interface MT5Account {
  login: number
  name: string
  balance: number
  group: string
  server: string
}

interface RecentTransaction {
  id: string
  type: "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "mt5_to_wallet" | "wallet_to_mt5"
  amount: number
  status: "completed" | "pending" | "failed"
  timestamp: string
  description: string
  reference?: string
  fromAccount?: string
  toAccount?: string
}

export default function WalletPage() {
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    available: 15420.50,
    pending: 2500.00,
    total: 17920.50,
    currency: "USD"
  })
  
  const [mt5Accounts, setMT5Accounts] = useState<MT5Account[]>([])
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
  const [showBalance, setShowBalance] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data
  const mockMT5Accounts: MT5Account[] = [
    { login: 123456, name: "Standard Account", balance: 8750.25, group: "standard", server: "MT5-Live-01" },
    { login: 789012, name: "Gold Account", balance: 25300.75, group: "gold", server: "MT5-Live-02" },
    { login: 456789, name: "Prime Account", balance: 52140.00, group: "prime", server: "MT5-Live-03" }
  ]

  const mockRecentTransactions: RecentTransaction[] = [
    {
      id: "txn_001",
      type: "mt5_to_wallet",
      amount: 1500.00,
      status: "completed",
      timestamp: "2024-01-15T14:30:00Z",
      description: "Transfer from MT5 Account",
      reference: "TXN001",
      fromAccount: "MT5 #123456",
      toAccount: "Wallet"
    },
    {
      id: "txn_002",
      type: "wallet_to_mt5",
      amount: 2000.00,
      status: "completed",
      timestamp: "2024-01-14T10:15:00Z",
      description: "Transfer to MT5 Account",
      reference: "TXN002",
      fromAccount: "Wallet",
      toAccount: "MT5 #789012"
    },
    {
      id: "txn_003",
      type: "deposit",
      amount: 5000.00,
      status: "pending",
      timestamp: "2024-01-13T16:45:00Z",
      description: "Bank wire deposit",
      reference: "DEP003"
    },
    {
      id: "txn_004",
      type: "withdrawal",
      amount: 800.00,
      status: "completed",
      timestamp: "2024-01-12T09:20:00Z",
      description: "Withdrawal to bank account",
      reference: "WTH004"
    },
    {
      id: "txn_005",
      type: "mt5_to_wallet",
      amount: 750.00,
      status: "failed",
      timestamp: "2024-01-11T13:10:00Z",
      description: "Transfer from MT5 Account (Failed)",
      reference: "TXN005",
      fromAccount: "MT5 #456789",
      toAccount: "Wallet"
    }
  ]

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    try {
      setIsLoading(true)
      // Mock API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMT5Accounts(mockMT5Accounts)
      setRecentTransactions(mockRecentTransactions)
    } catch (error) {
      console.error("Error loading wallet data:", error)
      toast.error("Failed to load wallet data")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshWallet = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      // Simulate balance update
      setWalletBalance(prev => ({
        ...prev,
        available: prev.available + Math.random() * 100 - 50
      }))
      toast.success("Wallet refreshed successfully")
    } catch (error) {
      toast.error("Failed to refresh wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (!showBalance) return "••••••"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: walletBalance.currency,
    }).format(amount)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "withdrawal":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      case "wallet_to_mt5":
        return <Send className="w-4 h-4 text-blue-600" />
      case "mt5_to_wallet":
        return <Download className="w-4 h-4 text-purple-600" />
      default:
        return <ArrowRightLeft className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading && mt5Accounts.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wallet...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  My Wallet
                </h1>
                <p className="text-gray-600">Manage your funds and transfers</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshWallet}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/80 transition-all duration-300 shadow-lg border border-white/20"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                href="/wallet/transfer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Transfer Funds
              </Link>
            </div>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Wallet className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Wallet Balance</h2>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-purple-100 text-sm mb-1">Available Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(walletBalance.available)}</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm mb-1">Pending</p>
              <p className="text-xl font-semibold">{formatCurrency(walletBalance.pending)}</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm mb-1">Total Balance</p>
              <p className="text-xl font-semibold">{formatCurrency(walletBalance.total)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link
            href="/deposit"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <PiggyBank className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Deposit</h3>
                <p className="text-sm text-gray-600">Add funds to wallet</p>
              </div>
            </div>
          </Link>

          <Link
            href="/withdraw"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Withdraw</h3>
                <p className="text-sm text-gray-600">Transfer to bank</p>
              </div>
            </div>
          </Link>

          <Link
            href="/wallet/transfer"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <ArrowRightLeft className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Transfer</h3>
                <p className="text-sm text-gray-600">Move funds to MT5</p>
              </div>
            </div>
          </Link>

          <Link
            href="/wallet/history"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <History className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">History</h3>
                <p className="text-sm text-gray-600">View transactions</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MT5 Accounts */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                MT5 Accounts
              </h3>
              <Link
                href="/wallet/transfer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Transfer Funds →
              </Link>
            </div>

            <div className="space-y-4">
              {mt5Accounts.map((account) => (
                <div key={account.login} className="bg-white/50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Account #{account.login}
                      </h4>
                      <p className="text-sm text-gray-600">{account.name}</p>
                      <p className="text-xs text-gray-500">{account.server}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(account.balance)}
                      </p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {account.group}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-600">Total MT5 Balance:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(mt5Accounts.reduce((sum, acc) => sum + acc.balance, 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <History className="w-6 h-6 mr-3 text-purple-600" />
                Recent Activity
              </h3>
              <Link
                href="/wallet/history"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {recentTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                      {transaction.fromAccount && transaction.toAccount && (
                        <p className="text-xs text-gray-400">
                          {transaction.fromAccount} → {transaction.toAccount}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <p className={`font-semibold ${
                        transaction.type === "deposit" || transaction.type === "mt5_to_wallet" 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {transaction.type === "deposit" || transaction.type === "mt5_to_wallet" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      {getStatusIcon(transaction.status)}
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  recentTransactions
                    .filter(t => t.type === "deposit" || t.type === "mt5_to_wallet")
                    .filter(t => t.status === "completed")
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
              <p className="text-sm text-gray-600">Total Received</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  recentTransactions
                    .filter(t => t.type === "withdrawal" || t.type === "wallet_to_mt5")
                    .filter(t => t.status === "completed")
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
              <p className="text-sm text-gray-600">Total Sent</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <ArrowRightLeft className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {recentTransactions.filter(t => 
                  t.type === "wallet_to_mt5" || t.type === "mt5_to_wallet"
                ).length}
              </p>
              <p className="text-sm text-gray-600">MT5 Transfers</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {recentTransactions.filter(t => t.status === "pending").length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}