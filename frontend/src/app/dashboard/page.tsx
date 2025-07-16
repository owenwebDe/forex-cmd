"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Users, 
  CreditCard,
  PiggyBank,
  Activity,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"

interface MT5Account {
  login: number
  name: string
  email: string
  group: string
  leverage: number
  balance: number
  equity: number
  margin: number
  freeMargin: number
  marginLevel: number
  server: string
  accountType: string
  createdAt: string
}

interface Position {
  ticket: number
  symbol: string
  type: number
  volume: number
  openPrice: number
  currentPrice: number
  profit: number
  swap: number
  commission: number
  openTime: string
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface Transaction {
  id: string
  type: "deposit" | "withdrawal"
  amount: number
  status: "completed" | "pending" | "failed"
  timestamp: string
  description: string
}

interface ChartData {
  date: string
  deposits: number
  withdrawals: number
  balance: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [mt5Accounts, setMT5Accounts] = useState<MT5Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [openPositions, setOpenPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Mock data for demonstration
  const mockChartData: ChartData[] = [
    { date: "Jan", deposits: 1200, withdrawals: 800, balance: 5400 },
    { date: "Feb", deposits: 1500, withdrawals: 600, balance: 6300 },
    { date: "Mar", deposits: 800, withdrawals: 1000, balance: 6100 },
    { date: "Apr", deposits: 2000, withdrawals: 400, balance: 7700 },
    { date: "May", deposits: 1800, withdrawals: 900, balance: 8600 },
    { date: "Jun", deposits: 2200, withdrawals: 700, balance: 10100 },
  ]

  const mockTransactions: Transaction[] = [
    {
      id: "txn_001",
      type: "deposit",
      amount: 500,
      status: "completed",
      timestamp: "2024-01-15T10:30:00Z",
      description: "Stripe payment"
    },
    {
      id: "txn_002",
      type: "withdrawal",
      amount: 200,
      status: "completed",
      timestamp: "2024-01-14T14:20:00Z",
      description: "Bank transfer"
    },
    {
      id: "txn_003",
      type: "deposit",
      amount: 1000,
      status: "pending",
      timestamp: "2024-01-13T09:15:00Z",
      description: "Wire transfer"
    },
    {
      id: "txn_004",
      type: "withdrawal",
      amount: 300,
      status: "completed",
      timestamp: "2024-01-12T16:45:00Z",
      description: "Card withdrawal"
    },
  ]

  const pieChartData = [
    { name: "Deposits", value: 8500, color: "#10b981" },
    { name: "Withdrawals", value: 3800, color: "#ef4444" },
  ]

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      
      // Get user info from token
      const token = localStorage.getItem("user_token")
      if (!token) {
        window.location.href = "/login"
        return
      }

      // Load user's MT5 accounts
      await loadMT5Accounts()
      
      // Set mock data for charts and transactions
      setChartData(mockChartData)
      setTransactions(mockTransactions)
      
    } catch (err) {
      setError("Failed to load user data")
      console.error("Error loading user data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMT5Accounts = async () => {
    try {
      const response = await apiClient.getUserMT5Accounts()
      if (response.success) {
        setMT5Accounts(response.data || [])
        // Load positions for each account
        await loadOpenPositions(response.data || [])
      }
    } catch (err) {
      console.error("Error loading MT5 accounts:", err)
      // Start with empty accounts for now
      setMT5Accounts([])
    }
  }

  const loadOpenPositions = async (accounts: MT5Account[]) => {
    try {
      const allPositions: Position[] = []
      
      for (const account of accounts) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/positions/${account.login}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("user_token")}`
            }
          })
          
          if (response.ok) {
            const result = await response.json()
            if (result.success && result.data.length > 0) {
              // Add account login to each position for reference
              const positions = result.data.map((pos: Position) => ({
                ...pos,
                accountLogin: account.login
              }))
              allPositions.push(...positions)
            }
          }
        } catch (err) {
          console.error(`Error loading positions for account ${account.login}:`, err)
        }
      }
      
      setOpenPositions(allPositions)
    } catch (err) {
      console.error("Error loading open positions:", err)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">Monitor your MT5 accounts, track transactions, and manage your portfolio</p>
            </div>
          </div>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50/50 border border-red-200 rounded-xl backdrop-blur-sm">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to your CRM Dashboard</h2>
          <p className="text-gray-600">Manage your MT5 accounts, track transactions, and monitor your portfolio performance.</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(10100)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.5%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Deposits</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(8500)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +8.2%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Withdrawals</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(3800)}</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  -2.1%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Accounts</p>
                <p className="text-2xl font-bold text-gray-900">{mt5Accounts.length}</p>
                <p className="text-sm text-gray-500 mt-1">MT5 Accounts</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Balance Trend Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Balance Trend</h3>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Account Balance</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fill="url(#balanceGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Deposits vs Withdrawals Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Deposits vs Withdrawals</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">Deposits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">Withdrawals</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="deposits" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="withdrawals" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Overview and Portfolio Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <Link 
                href="/transactions" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View all
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.type === "deposit" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {transaction.type === "deposit" ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{transaction.type}</p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.type === "deposit" ? "+" : "-"}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Distribution */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), '']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-4">
              {pieChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/deposit"
              className="flex items-center justify-center p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <PiggyBank className="w-6 h-6 mr-3" />
              Deposit Funds
            </Link>
            
            <Link
              href="/create-account"
              className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-6 h-6 mr-3" />
              New Account
            </Link>
            
            <button className="flex items-center justify-center p-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Activity className="w-6 h-6 mr-3" />
              View Reports
            </button>
            
            <button className="flex items-center justify-center p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              <CreditCard className="w-6 h-6 mr-3" />
              Manage Cards
            </button>
          </div>
        </div>

        {/* Open Positions Section */}
        {openPositions.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Activity className="w-6 h-6 mr-3 text-blue-600" />
                Open Positions
              </h3>
              <div className="text-sm text-gray-500">
                {openPositions.length} active position{openPositions.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Price</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {openPositions.map((position) => (
                      <tr key={position.ticket} className="hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          #{position.ticket}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {position.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            position.type === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {position.type === 0 ? 'BUY' : 'SELL'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {position.volume.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {position.openPrice.toFixed(5)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {position.currentPrice.toFixed(5)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={`${
                            position.profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {position.profit >= 0 ? '+' : ''}{formatCurrency(position.profit)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          #{(position as any).accountLogin}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total P&L:</span>
                  <span className={`font-medium ${
                    openPositions.reduce((sum, pos) => sum + pos.profit, 0) >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {openPositions.reduce((sum, pos) => sum + pos.profit, 0) >= 0 ? '+' : ''}
                    {formatCurrency(openPositions.reduce((sum, pos) => sum + pos.profit, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MT5 Accounts Section */}
        {mt5Accounts.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Your MT5 Accounts</h3>
              <Link
                href="/create-account"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Account
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mt5Accounts.map((account) => (
                <div
                  key={account.login}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          Account #{account.login}
                        </h3>
                        <p className="text-sm text-gray-500">{account.accountType} • 1:{account.leverage}</p>
                      </div>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Balance</span>
                      <span className="text-lg font-semibold text-gray-900">{formatCurrency(account.balance)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Equity</span>
                      <span className="text-sm font-medium text-gray-700">{formatCurrency(account.equity)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Free Margin</span>
                      <span className="text-sm font-medium text-gray-700">{formatCurrency(account.freeMargin)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Server</span>
                      <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{account.server}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}