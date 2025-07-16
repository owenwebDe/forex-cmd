"use client"

import { useState, useEffect } from "react"
import { 
  History,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Send,
  Download,
  PiggyBank,
  Filter,
  Search,
  Calendar,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  FileDown
} from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"

interface WalletTransaction {
  id: string
  type: "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "mt5_to_wallet" | "wallet_to_mt5"
  amount: number
  fee?: number
  status: "completed" | "pending" | "failed" | "cancelled"
  timestamp: string
  description: string
  reference: string
  fromAccount?: string
  toAccount?: string
  transactionHash?: string
  notes?: string
}

type FilterType = "all" | "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "mt5_to_wallet" | "wallet_to_mt5"
type StatusFilter = "all" | "completed" | "pending" | "failed" | "cancelled"

export default function WalletHistoryPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<WalletTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<FilterType>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [dateRange, setDateRange] = useState({
    from: "",
    to: ""
  })

  // Mock transaction data
  const mockTransactions: WalletTransaction[] = [
    {
      id: "wallet_txn_001",
      type: "mt5_to_wallet",
      amount: 1500.00,
      fee: 5.00,
      status: "completed",
      timestamp: "2024-01-15T14:30:00Z",
      description: "Transfer from MT5 Account",
      reference: "TXN001",
      fromAccount: "MT5 #123456 (Standard)",
      toAccount: "My Wallet",
      transactionHash: "0x1a2b3c4d5e6f...",
      notes: "Profit withdrawal from trading"
    },
    {
      id: "wallet_txn_002",
      type: "wallet_to_mt5",
      amount: 2000.00,
      fee: 7.50,
      status: "completed",
      timestamp: "2024-01-14T10:15:00Z",
      description: "Transfer to MT5 Account",
      reference: "TXN002",
      fromAccount: "My Wallet",
      toAccount: "MT5 #789012 (Gold)",
      transactionHash: "0x2b3c4d5e6f7a...",
      notes: "Additional trading capital"
    },
    {
      id: "wallet_txn_003",
      type: "deposit",
      amount: 5000.00,
      fee: 25.00,
      status: "pending",
      timestamp: "2024-01-13T16:45:00Z",
      description: "Bank wire deposit",
      reference: "DEP003",
      toAccount: "My Wallet",
      notes: "Monthly funding"
    },
    {
      id: "wallet_txn_004",
      type: "withdrawal",
      amount: 800.00,
      fee: 15.00,
      status: "completed",
      timestamp: "2024-01-12T09:20:00Z",
      description: "Withdrawal to bank account",
      reference: "WTH004",
      fromAccount: "My Wallet",
      notes: "Emergency fund withdrawal"
    },
    {
      id: "wallet_txn_005",
      type: "mt5_to_wallet",
      amount: 750.00,
      fee: 3.75,
      status: "failed",
      timestamp: "2024-01-11T13:10:00Z",
      description: "Transfer from MT5 Account (Failed)",
      reference: "TXN005",
      fromAccount: "MT5 #456789 (Prime)",
      toAccount: "My Wallet",
      notes: "Insufficient MT5 balance"
    },
    {
      id: "wallet_txn_006",
      type: "deposit",
      amount: 10000.00,
      fee: 0.00,
      status: "completed",
      timestamp: "2024-01-10T08:30:00Z",
      description: "Credit card deposit",
      reference: "DEP006",
      toAccount: "My Wallet",
      transactionHash: "0x3c4d5e6f7a8b...",
      notes: "Initial account funding"
    },
    {
      id: "wallet_txn_007",
      type: "wallet_to_mt5",
      amount: 3500.00,
      fee: 12.25,
      status: "completed",
      timestamp: "2024-01-09T15:45:00Z",
      description: "Transfer to MT5 Account",
      reference: "TXN007",
      fromAccount: "My Wallet",
      toAccount: "MT5 #123456 (Standard)",
      transactionHash: "0x4d5e6f7a8b9c...",
      notes: "Portfolio rebalancing"
    },
    {
      id: "wallet_txn_008",
      type: "withdrawal",
      amount: 1200.00,
      fee: 18.00,
      status: "cancelled",
      timestamp: "2024-01-08T11:20:00Z",
      description: "Withdrawal to bank account (Cancelled)",
      reference: "WTH008",
      fromAccount: "My Wallet",
      notes: "Cancelled by user request"
    }
  ]

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [transactions, searchTerm, typeFilter, statusFilter, dateRange])

  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTransactions(mockTransactions)
    } catch (error) {
      console.error("Error loading transactions:", error)
      toast.error("Failed to load transaction history")
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...transactions]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(txn => 
        txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.fromAccount?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.toAccount?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(txn => txn.type === typeFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(txn => txn.status === statusFilter)
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter(txn => 
        new Date(txn.timestamp) >= new Date(dateRange.from)
      )
    }
    if (dateRange.to) {
      filtered = filtered.filter(txn => 
        new Date(txn.timestamp) <= new Date(dateRange.to + "T23:59:59")
      )
    }

    setFilteredTransactions(filtered)
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
      case "transfer_in":
        return <ArrowRightLeft className="w-4 h-4 text-green-600" />
      case "transfer_out":
        return <ArrowRightLeft className="w-4 h-4 text-red-600" />
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
      case "cancelled":
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
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "transfer_in":
      case "mt5_to_wallet":
        return "bg-green-100 text-green-800"
      case "withdrawal":
      case "transfer_out":
      case "wallet_to_mt5":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const exportTransactions = () => {
    // Create CSV content
    const headers = [
      "Date", "Type", "Amount", "Fee", "Net Amount", "Status", 
      "Description", "Reference", "From", "To", "Notes"
    ]
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map(txn => [
        new Date(txn.timestamp).toLocaleDateString(),
        txn.type.replace(/_/g, " "),
        txn.amount,
        txn.fee || 0,
        txn.amount - (txn.fee || 0),
        txn.status,
        `"${txn.description}"`,
        txn.reference,
        `"${txn.fromAccount || ""}"`,
        `"${txn.toAccount || ""}"`,
        `"${txn.notes || ""}"`
      ].join(","))
    ].join("\n")

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wallet_history_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Wallet history exported successfully")
  }

  const getAmountDisplay = (transaction: WalletTransaction) => {
    const isIncoming = transaction.type === "deposit" || 
                     transaction.type === "transfer_in" || 
                     transaction.type === "mt5_to_wallet"
    
    return {
      isIncoming,
      symbol: isIncoming ? "+" : "-",
      color: isIncoming ? "text-green-600" : "text-red-600"
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wallet history...</p>
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
                <History className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Wallet History
                </h1>
                <p className="text-gray-600">Complete transaction history for your wallet</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={loadTransactions}
                className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/80 transition-all duration-300 shadow-lg border border-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={exportTransactions}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Transactions
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9"
                  placeholder="Search by description, reference, account..."
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                className="input-field"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="mt5_to_wallet">MT5 → Wallet</option>
                <option value="wallet_to_mt5">Wallet → MT5</option>
                <option value="transfer_in">Transfers In</option>
                <option value="transfer_out">Transfers Out</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))}
                  className="input-field text-sm"
                />
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))}
                  className="input-field text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-lg font-semibold text-gray-900">{filteredTransactions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Inflow</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(
                    filteredTransactions
                      .filter(txn => ["deposit", "transfer_in", "mt5_to_wallet"].includes(txn.type))
                      .filter(txn => txn.status === "completed")
                      .reduce((sum, txn) => sum + txn.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Outflow</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(
                    filteredTransactions
                      .filter(txn => ["withdrawal", "transfer_out", "wallet_to_mt5"].includes(txn.type))
                      .filter(txn => txn.status === "completed")
                      .reduce((sum, txn) => sum + txn.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Fees</p>
                <p className="text-lg font-semibold text-yellow-600">
                  {formatCurrency(
                    filteredTransactions
                      .filter(txn => txn.status === "completed")
                      .reduce((sum, txn) => sum + (txn.fee || 0), 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transfer Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => {
                    const amountDisplay = getAmountDisplay(transaction)
                    return (
                      <tr key={transaction.id} className="hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getTransactionIcon(transaction.type)}
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.reference}
                              </p>
                              {transaction.notes && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {transaction.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                            {transaction.type.replace(/_/g, " ").replace(/to/g, "→")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className={`text-sm font-medium ${amountDisplay.color}`}>
                              {amountDisplay.symbol}{formatCurrency(transaction.amount)}
                            </p>
                            {transaction.fee && transaction.fee > 0 && (
                              <p className="text-xs text-gray-500">
                                Fee: {formatCurrency(transaction.fee)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getStatusIcon(transaction.status)}
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {transaction.fromAccount && (
                              <p className="text-gray-600">
                                <span className="font-medium">From:</span> {transaction.fromAccount}
                              </p>
                            )}
                            {transaction.toAccount && (
                              <p className="text-gray-600">
                                <span className="font-medium">To:</span> {transaction.toAccount}
                              </p>
                            )}
                            {transaction.transactionHash && (
                              <p className="text-xs text-gray-400 mt-1">
                                Hash: {transaction.transactionHash.substring(0, 12)}...
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {new Date(transaction.timestamp).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}