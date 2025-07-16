"use client"

import { useState, useEffect } from "react"
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Download, 
  Search,
  Calendar,
  Eye,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "balance_adjustment" | "transfer"
  amount: number
  status: "completed" | "pending" | "failed" | "cancelled"
  timestamp: string
  description: string
  accountId: string
  accountName: string
  method: string
  reference: string
  fee?: number
}

type FilterType = "all" | "deposit" | "withdrawal" | "balance_adjustment" | "transfer"
type StatusFilter = "all" | "completed" | "pending" | "failed" | "cancelled"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<FilterType>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [dateRange, setDateRange] = useState({
    from: "",
    to: ""
  })

  // Mock data
  const mockTransactions: Transaction[] = [
    {
      id: "txn_001",
      type: "deposit",
      amount: 1000,
      status: "completed",
      timestamp: "2024-01-15T10:30:00Z",
      description: "Credit card deposit",
      accountId: "123456",
      accountName: "Standard Account",
      method: "Credit Card",
      reference: "REF001",
      fee: 30
    },
    {
      id: "txn_002",
      type: "withdrawal",
      amount: 500,
      status: "pending",
      timestamp: "2024-01-14T14:20:00Z",
      description: "Bank transfer withdrawal",
      accountId: "123456",
      accountName: "Standard Account",
      method: "Bank Transfer",
      reference: "REF002",
      fee: 25
    },
    {
      id: "txn_003",
      type: "deposit",
      amount: 2500,
      status: "completed",
      timestamp: "2024-01-13T09:15:00Z",
      description: "Wire transfer deposit",
      accountId: "789012",
      accountName: "Gold Account",
      method: "Wire Transfer",
      reference: "REF003"
    },
    {
      id: "txn_004",
      type: "withdrawal",
      amount: 300,
      status: "failed",
      timestamp: "2024-01-12T16:45:00Z",
      description: "Card withdrawal failed",
      accountId: "123456",
      accountName: "Standard Account",
      method: "Credit Card",
      reference: "REF004"
    },
    {
      id: "txn_005",
      type: "balance_adjustment",
      amount: 100,
      status: "completed",
      timestamp: "2024-01-11T11:30:00Z",
      description: "Bonus credit",
      accountId: "789012",
      accountName: "Gold Account",
      method: "Manual",
      reference: "BONUS001"
    },
    {
      id: "txn_006",
      type: "transfer",
      amount: 750,
      status: "completed",
      timestamp: "2024-01-10T13:22:00Z",
      description: "Internal transfer",
      accountId: "123456",
      accountName: "Standard Account",
      method: "Internal",
      reference: "TRF001"
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
      toast.error("Failed to load transactions")
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
        txn.accountName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "withdrawal":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <History className="w-4 h-4 text-blue-600" />
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
    const headers = ["Date", "Type", "Amount", "Status", "Description", "Account", "Method", "Reference", "Fee"]
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map(txn => [
        new Date(txn.timestamp).toLocaleDateString(),
        txn.type,
        txn.amount,
        txn.status,
        `"${txn.description}"`,
        `"${txn.accountName}"`,
        txn.method,
        txn.reference,
        txn.fee || 0
      ].join(","))
    ].join("\n")

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Transactions exported successfully")
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <History className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Transaction History
                </h1>
                <p className="text-gray-600">View and manage your account transactions</p>
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
                <Download className="w-4 h-4 mr-2" />
                Export
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
                Search
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
                  placeholder="Search transactions..."
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                className="input-field"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="balance_adjustment">Adjustments</option>
                <option value="transfer">Transfers</option>
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
                <p className="text-sm text-gray-600">Total Deposits</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(
                    filteredTransactions
                      .filter(txn => txn.type === "deposit" && txn.status === "completed")
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
                <p className="text-sm text-gray-600">Total Withdrawals</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(
                    filteredTransactions
                      .filter(txn => txn.type === "withdrawal" && txn.status === "completed")
                      .reduce((sum, txn) => sum + txn.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-lg font-semibold text-yellow-600">
                  {filteredTransactions.filter(txn => txn.status === "pending").length}
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
                      Account
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
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center">
                            {getTypeIcon(transaction.type)}
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.reference}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {transaction.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`text-sm font-medium ${
                            transaction.type === "deposit" || transaction.type === "balance_adjustment" 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {transaction.type === "deposit" || transaction.type === "balance_adjustment" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          {transaction.fee && (
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
                        <div>
                          <p className="text-sm text-gray-900">#{transaction.accountId}</p>
                          <p className="text-sm text-gray-500">{transaction.accountName}</p>
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}