"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Plus, 
  Eye, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Activity,
  Copy,
  RefreshCw
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"

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

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<MT5Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getUserMT5Accounts()
      if (response.success) {
        setAccounts(response.data || [])
      } else {
        setError("Failed to load accounts")
      }
    } catch (err) {
      console.error("Error loading accounts:", err)
      setError("Failed to load accounts")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.toString())
    toast.success("Copied to clipboard")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getAccountTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "enc": return "bg-purple-100 text-purple-800"
      case "silver": return "bg-gray-100 text-gray-800"
      case "prime": return "bg-blue-100 text-blue-800"
      case "standard": return "bg-green-100 text-green-800"
      case "gold": return "bg-yellow-100 text-yellow-800"
      case "cent": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading accounts...</p>
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
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  MT5 Accounts
                </h1>
                <p className="text-gray-600">Manage and monitor your trading accounts</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={loadAccounts}
                className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/80 transition-all duration-300 shadow-lg border border-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <Link
                href="/create-account"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/50 border border-red-200 rounded-xl backdrop-blur-sm">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Accounts Grid */}
        {accounts.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No MT5 Accounts</h3>
            <p className="text-gray-600 mb-6">You haven't created any MT5 accounts yet. Get started by creating your first trading account.</p>
            <Link
              href="/create-account"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Account
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <div
                key={account.login}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Account Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Account #{account.login}
                        </h3>
                        <button
                          onClick={() => copyToClipboard(account.login.toString())}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(account.accountType || account.group)}`}>
                          {account.accountType || account.group}
                        </span>
                        <span className="text-sm text-gray-500">1:{account.leverage}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <Link 
                      href="/account-settings"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                    </Link>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Balance</p>
                    <p className="text-xl font-semibold text-gray-900">{formatCurrency(account.balance)}</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Equity</p>
                    <p className="text-xl font-semibold text-gray-900">{formatCurrency(account.equity)}</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Free Margin</p>
                    <p className="text-lg font-medium text-gray-700">{formatCurrency(account.freeMargin)}</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Margin Level</p>
                    <p className="text-lg font-medium text-gray-700">{account.marginLevel.toFixed(2)}%</p>
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Server</span>
                    <span className="text-sm text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{account.server}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm text-gray-700">{account.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Created</span>
                    <span className="text-sm text-gray-700">
                      {new Date(account.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <Link
                    href="/deposit"
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Deposit
                  </Link>
                  <Link
                    href="/withdraw"
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                  >
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Withdraw
                  </Link>
                  <button className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
                    <Activity className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}