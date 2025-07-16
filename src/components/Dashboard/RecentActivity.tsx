"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { apiClient } from "@/lib/api"
import type { SystemLog } from "@/types"

export default function RecentActivity() {
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentLogs = async () => {
      try {
        const data = await apiClient.getSystemLogs({ limit: 10, level: "info" })
        setLogs(data)
      } catch (error) {
        console.error("Failed to fetch recent logs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentLogs()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="p-6">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    log.level === "error" ? "bg-red-500" : log.level === "warning" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{log.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm")} • {log.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
