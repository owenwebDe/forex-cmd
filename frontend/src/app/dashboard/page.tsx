"use client"

import { useState, useEffect } from "react"
import { Wallet, TrendingUp, Activity, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import { apiClient } from "@/lib/api"
import { toast } from "react-hot-toast"
import type { DashboardStats, Position, MT5Account } from "@/types"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [account, setAccount] = useState<MT5Account | null>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = async () => {
    try {
      const [accountResponse, balanceResponse, positionsResponse] = await Promise.all([
        apiClient.getMT5AccountInfo(),
        apiClient.getAccountBalance(),
        apiClient.getPositions(),
      ])

      if (accountResponse.success) {
        setAccount(accountResponse.data)
      }

      if (balanceResponse.success) {
        setStats(balanceResponse.data)
      }

      if (positionsResponse.success) {
        setPositions(positionsResponse.positions || [])
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            {account && (
              <p className="text-sm text-gray-600">
                MT5 Account: {account.loginId} | Group: {account.group}
              </p>
            )}
          </div>
          <button onClick={handleRefresh} disabled={refreshing} className="btn-secondary flex items-center space-x-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Balance" value={`$${stats.balance.toLocaleString()}`} icon={Wallet} color="blue" />
            <StatCard title="Equity" value={`$${stats.equity.toLocaleString()}`} icon={DollarSign} color="green" />
            <StatCard title="Margin" value={`$${stats.margin.toLocaleString()}`} icon={TrendingUp} color="yellow" />
            <StatCard
              title="Free Margin"
              value={`$${stats.freeMargin.toLocaleString()}`}
              icon={Activity}
              color="purple"
            />
          </div>
        )}

        {/* Account Status */}
        {account && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Account Name</p>
                <p className="font-medium">{account.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Leverage</p>
                <p className="font-medium">1:{account.leverage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`badge ${account.enabled ? "badge-success" : "badge-danger"}`}>
                  {account.enabled ? "Active" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Open Positions */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Open Positions</h2>
            <span className="badge badge-info">{positions.length} positions</span>
          </div>

          {positions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Type</th>
                    <th>Volume</th>
                    <th>Open Price</th>
                    <th>Current Price</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position) => (
                    <tr key={position.ticket}>
                      <td className="font-medium">{position.symbol}</td>
                      <td>
                        <span className={`badge ${position.type === "buy" ? "badge-success" : "badge-danger"}`}>
                          {position.type.toUpperCase()}
                        </span>
                      </td>
                      <td>{position.volume}</td>
                      <td>{position.openPrice}</td>
                      <td>{position.currentPrice}</td>
                      <td>
                        <span
                          className={`flex items-center ${position.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {position.profit >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          ${Math.abs(position.profit).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No open positions</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="Deposit Funds"
            description="Add money to your trading account"
            href="/deposit"
            icon={ArrowUpRight}
            color="green"
          />
          <QuickActionCard
            title="Withdraw Funds"
            description="Request withdrawal from your account"
            href="/withdraw"
            icon={ArrowDownRight}
            color="red"
          />
          <QuickActionCard
            title="View Transactions"
            description="Check your transaction history"
            href="/transactions"
            icon={Activity}
            color="blue"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({ title, description, href, icon: Icon, color }: any) {
  const colorClasses = {
    green: "border-green-200 hover:border-green-300",
    red: "border-red-200 hover:border-red-300",
    blue: "border-blue-200 hover:border-blue-300",
  }

  return (
    <a
      href={href}
      className={`block p-6 bg-white rounded-lg border-2 transition-colors duration-200 ${colorClasses[color]}`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-8 w-8 text-gray-600" />
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </a>
  )
}
