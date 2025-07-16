"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Plus, Edit, UserX, UserCheck, Eye } from "lucide-react"
import { apiClient } from "@/lib/api"
import type { User, MT5Account } from "@/types"
import toast from "react-hot-toast"
import CreateUserModal from "./CreateUserModal"
import UserDetailsModal from "./UserDetailsModal"

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [mt5Accounts, setMT5Accounts] = useState<MT5Account[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersData, accountsData] = await Promise.all([apiClient.getUsers(), apiClient.getMT5Accounts()])
      setUsers(usersData)
      setMT5Accounts(accountsData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDisableUser = async (userId: string) => {
    if (!confirm("Are you sure you want to disable this user?")) return

    try {
      await apiClient.disableUser(userId)
      toast.success("User disabled successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to disable user")
    }
  }

  const handleEnableUser = async (userId: string) => {
    try {
      await apiClient.enableUser(userId)
      toast.success("User enabled successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to enable user")
    }
  }

  const getMT5Account = (loginId?: number) => {
    return mt5Accounts.find((acc) => acc.loginId === loginId)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">User Management</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">User Management</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MT5 Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const mt5Account = getMT5Account(user.loginId)
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.loginId ? (
                        <div>
                          <div className="font-medium">{user.loginId}</div>
                          {mt5Account && <div className="text-xs text-gray-500">{mt5Account.group}</div>}
                        </div>
                      ) : (
                        <span className="text-gray-400">No MT5 Account</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mt5Account ? (
                        <div>
                          <div className="font-medium">${mt5Account.balance.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Equity: ${mt5Account.equity.toLocaleString()}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDetailsModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit User">
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.status === "active" ? (
                          <button
                            onClick={() => handleDisableUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Disable User"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnableUser(user.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Enable User"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchData()
          }}
        />
      )}

      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          mt5Account={getMT5Account(selectedUser.loginId)}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedUser(null)
          }}
          onUpdate={fetchData}
        />
      )}
    </>
  )
}
