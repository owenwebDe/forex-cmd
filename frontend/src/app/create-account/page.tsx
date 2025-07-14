"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, CheckCircle } from "lucide-react"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import { apiClient } from "@/lib/api"
import { toast } from "react-hot-toast"
import type { CreateAccountData } from "@/types"

export default function CreateAccountPage() {
  const [formData, setFormData] = useState<CreateAccountData>({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    leverage: 100,
    groupName: "REAL-LIVE-GROUP",
    balance: 0,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [accountDetails, setAccountDetails] = useState<any>(null)
  const router = useRouter()

  const leverageOptions = [50, 100, 200, 300, 400, 500, 1000]
  const groupOptions = ["REAL-LIVE-GROUP", "STANDARD-LIVE", "ECN-LIVE", "PREMIUM-LIVE"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiClient.createLiveAccount(formData)

      if (response.success) {
        setAccountDetails(response.data)
        setSuccess(true)
        toast.success("Live MT5 account created successfully!")
      } else {
        toast.error(response.error || "Failed to create account")
      }
    } catch (error) {
      console.error("Account creation error:", error)
      toast.error("Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "leverage" || name === "balance" ? Number(value) : value,
    })
  }

  if (success && accountDetails) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Account Created Successfully!</h1>
            <p className="text-gray-600 mt-2">Your live MT5 trading account is now ready</p>
          </div>

          <div className="card space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Account Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">MT5 Login ID</label>
                <div className="p-3 bg-gray-50 rounded-lg font-mono text-lg font-bold text-blue-600">
                  {accountDetails.loginId}
                </div>
              </div>

              <div>
                <label className="form-label">Group</label>
                <div className="p-3 bg-gray-50 rounded-lg">{accountDetails.groupName}</div>
              </div>

              <div>
                <label className="form-label">Leverage</label>
                <div className="p-3 bg-gray-50 rounded-lg">1:{accountDetails.leverage}</div>
              </div>

              <div>
                <label className="form-label">Server</label>
                <div className="p-3 bg-gray-50 rounded-lg">{accountDetails.server || "MT5-Live-Server"}</div>
              </div>

              <div>
                <label className="form-label">Main Password</label>
                <div className="p-3 bg-gray-50 rounded-lg font-mono">{accountDetails.mPassword}</div>
              </div>

              <div>
                <label className="form-label">Investor Password</label>
                <div className="p-3 bg-gray-50 rounded-lg font-mono">{accountDetails.iPassword}</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Download and install MetaTrader 5 platform</li>
                <li>• Use the login credentials above to access your account</li>
                <li>• Connect to the server: {accountDetails.server || "MT5-Live-Server"}</li>
                <li>• Start trading with your live account</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => router.push("/dashboard")} className="btn-primary flex-1">
                Go to Dashboard
              </button>
              <button onClick={() => router.push("/deposit")} className="btn-secondary flex-1">
                Deposit Funds
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Plus className="h-6 w-6 mr-2" />
            Create Live MT5 Account
          </h1>
          <p className="text-gray-600 mt-2">Create a new live trading account connected to the MT5 platform</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="form-label">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-input"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="form-label">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="form-input"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="country" className="form-label">
                Country *
              </label>
              <input
                id="country"
                name="country"
                type="text"
                required
                className="form-input"
                placeholder="Enter country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="city" className="form-label">
                City *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                className="form-input"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="address" className="form-label">
                Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="form-input"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="leverage" className="form-label">
                Leverage *
              </label>
              <select
                id="leverage"
                name="leverage"
                required
                className="form-input"
                value={formData.leverage}
                onChange={handleChange}
              >
                {leverageOptions.map((leverage) => (
                  <option key={leverage} value={leverage}>
                    1:{leverage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="groupName" className="form-label">
                Account Group *
              </label>
              <select
                id="groupName"
                name="groupName"
                required
                className="form-input"
                value={formData.groupName}
                onChange={handleChange}
              >
                {groupOptions.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="balance" className="form-label">
                Initial Balance (USD)
              </label>
              <input
                id="balance"
                name="balance"
                type="number"
                min="0"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                value={formData.balance}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">Leave as 0 to start with no initial balance</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Important Notes:</h3>
            <ul className="text-yellow-800 space-y-1 text-sm">
              <li>• This will create a real live trading account</li>
              <li>• Account credentials will be generated automatically</li>
              <li>• Make sure all information is accurate</li>
              <li>• You can deposit funds after account creation</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button type="button" onClick={() => router.push("/dashboard")} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Live Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
