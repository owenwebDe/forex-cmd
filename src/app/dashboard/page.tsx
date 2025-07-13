"use client"

import AdminLayout from "@/components/Layout/AdminLayout"
import DashboardStats from "@/components/Dashboard/DashboardStats"
import RecentActivity from "@/components/Dashboard/RecentActivity"
import PositionsTable from "@/components/Trading/PositionsTable"

export default function DashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>

          {/* Open Positions */}
          <div className="lg:col-span-2">
            <PositionsTable />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
