"use client"

import AdminLayout from "@/components/Layout/AdminLayout"
import UserManagement from "@/components/Users/UserManagement"

export default function UsersPage() {
  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        <UserManagement />
      </div>
    </AdminLayout>
  )
}
