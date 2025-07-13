"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, Activity, Plus } from "lucide-react"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import { apiClient } from "@/lib/api"
import type { MT5Account, Position } from "@/types"
import Link from "next/link"
import { format } from "date-fns"

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

export default function DashboardPage() {
  const [accountInfo, setAccountInfo] = useState<MT5Account | null>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAccount, setHasAccount] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}")

      if (userData.loginId) {
        setHasAccount(true)
        const [accountData, positionsData] = await Promise.all([apiClient.getAccountInfo(), apiClient.getPositions()])
        setAccountInfo(accountData)
        setPositions(positionsData)
      } else {
        setHasAccount(false)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
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

  if (!hasAccount) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No MT5 Account Found</h3>
            <p className="text-gray-600 mb-6">
              You need to create a live MT5 trading account to access the dashboard features.
            </p>
            <Link
              href="/create-account"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Live Account
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const totalProfit = positions.reduce((sum, pos) => sum + pos.profit, 0)
  const openPositions = positions.length

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Account Balance"
            value={`$${accountInfo?.balance?.toLocaleString() || "0"}`}
            icon={DollarSign}
            change={`Login ID: ${accountInfo?.loginId || "N/A"}`}
            changeType="neutral"
          />
          <StatCard
            title="Equity"
            value={`$${accountInfo?.equity?.toLocaleString() || "0"}`}
            icon={TrendingUp}
            change={`Free Margin: $${accountInfo?.freeMargin?.toLocaleString() || "0"}`}
            changeType="neutral"
          />
          <StatCard
            title="Total P&L"
            value={`$${totalProfit.toFixed(2)}`}
            icon={totalProfit >= 0 ? TrendingUp : TrendingDown}
            change={totalProfit >= 0 ? "Profit" : "Loss"}
            changeType={totalProfit >= 0 ? "positive" : "negative"}
          />
          <StatCard
            title="Open Positions"
            value={openPositions}
            icon={Activity}
            change={`Leverage: 1:${accountInfo?.leverage || "N/A"}`}
            changeType="neutral"
          />
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">MT5 Login ID</p>
              <p className="font-medium">{accountInfo?.loginId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Group</p>
              <p className="font-medium">{accountInfo?.group}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Server</p>
              <p className="font-medium">{accountInfo?.server}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Currency</p>
              <p className="font-medium">{accountInfo?.currency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Margin Level</p>
              <p className="font-medium">{accountInfo?.marginLevel?.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  accountInfo?.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {accountInfo?.enabled ? "Active" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Open Positions</h3>
            <Link href="/trading" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              View All
            </Link>
          </div>

          {positions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No open positions</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Open Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Open Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {positions.slice(0, 5).map((position) => (
                    <tr key={position.ticket} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {position.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            position.type === "buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {position.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{position.volume}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {position.openPrice.toFixed(5)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {position.currentPrice.toFixed(5)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          position.profit >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ${position.profit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(position.openTime), "MMM dd, HH:mm")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/deposit"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Deposit Funds</h4>
                <p className="text-sm text-gray-600">Add money to your trading account</p>
              </div>
            </div>
          </Link>

          <Link
            href="/withdraw"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-full">
                <TrendingDown className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Withdraw Funds</h4>
                <p className="text-sm text-gray-600">Request withdrawal from your account</p>
              </div>
            </div>
          </Link>

          <Link
            href="/transactions"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">View Transactions</h4>
                <p className="text-sm text-gray-600">Check your transaction history</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
