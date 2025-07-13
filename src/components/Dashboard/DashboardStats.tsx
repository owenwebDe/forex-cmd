"use client"

import { useEffect, useState } from "react"
import { Users, TrendingUp, Wallet, Activity } from "lucide-react"
import { apiClient } from "@/lib/api"
import type { DashboardStatsType } from "@/types"

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType,
}: {
  title: string
  value: string | number
  icon: any
  change?: string
  changeType?: "positive" | "negative" | "neutral"
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change && (
          <p
            className={`text-sm mt-1 ${
              changeType === "positive"
                ? "text-green-600"
                : changeType === "negative"
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
          >
            {change}
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-full">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
)

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load dashboard statistics</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon={Users}
        change={`${stats.activeUsers} active`}
        changeType="positive"
      />
      <StatCard
        title="Total Balance"
        value={`$${stats.totalBalance.toLocaleString()}`}
        icon={Wallet}
        change={`Equity: $${stats.totalEquity.toLocaleString()}`}
        changeType="neutral"
      />
      <StatCard
        title="Total P&L"
        value={`$${stats.totalProfit.toLocaleString()}`}
        icon={TrendingUp}
        change={stats.totalProfit >= 0 ? "+" : ""}
        changeType={stats.totalProfit >= 0 ? "positive" : "negative"}
      />
      <StatCard
        title="Open Positions"
        value={stats.openPositions}
        icon={Activity}
        change={`Server: ${stats.serverStatus}`}
        changeType={stats.serverStatus === "online" ? "positive" : "negative"}
      />
    </div>
  )
}
