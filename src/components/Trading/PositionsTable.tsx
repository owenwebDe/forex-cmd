"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { X, ExternalLink } from "lucide-react"
import { apiClient } from "@/lib/api"
import type { Position } from "@/types"
import toast from "react-hot-toast"

export default function PositionsTable() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [closingPosition, setClosingPosition] = useState<number | null>(null)

  useEffect(() => {
    fetchPositions()

    // Refresh positions every 10 seconds
    const interval = setInterval(fetchPositions, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchPositions = async () => {
    try {
      const data = await apiClient.getPositions()
      setPositions(data)
    } catch (error) {
      console.error("Failed to fetch positions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClosePosition = async (ticket: number) => {
    if (!confirm("Are you sure you want to close this position?")) return

    setClosingPosition(ticket)
    try {
      await apiClient.closePosition(ticket)
      toast.success("Position closed successfully")
      fetchPositions() // Refresh the list
    } catch (error) {
      toast.error("Failed to close position")
    } finally {
      setClosingPosition(null)
    }
  }

  const getProfitColor = (profit: number) => {
    if (profit > 0) return "text-green-600"
    if (profit < 0) return "text-red-600"
    return "text-gray-600"
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Open Positions</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Open Positions</h3>
        <span className="text-sm text-gray-500">{positions.length} positions</span>
      </div>

      {positions.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No open positions</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {positions.map((position) => (
                <tr key={position.ticket} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{position.ticket}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{position.loginId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{position.symbol}</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{position.openPrice.toFixed(5)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {position.currentPrice.toFixed(5)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getProfitColor(position.profit)}`}>
                    ${position.profit.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(position.openTime), "MMM dd, HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleClosePosition(position.ticket)}
                        disabled={closingPosition === position.ticket}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Close Position"
                      >
                        {closingPosition === position.ticket ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                      <button className="text-blue-600 hover:text-blue-900" title="View Details">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
