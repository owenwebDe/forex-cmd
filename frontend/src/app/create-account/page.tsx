"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Shield, DollarSign, UserCheck } from "lucide-react"
import DashboardLayout from "@/components/Layout/DashboardLayout"

type AccountGroup = "ENC" | "Silver" | "Prime" | "Standard" | "Gold" | "Cent"

interface FormData {
  leverage: number
  accountGroup: AccountGroup
  password: string
  investorPassword: string
  initialDeposit: number
}

interface MT5Account {
  login: number
  password: string
  server: string
  name: string
  email: string
  leverage: number
  balance: number
  group: string
}

export default function CreateAccountPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [accountData, setAccountData] = useState<MT5Account | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showInvestorPassword, setShowInvestorPassword] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    leverage: 100,
    accountGroup: "Standard",
    password: "",
    investorPassword: "",
    initialDeposit: 1000,
  })

  // Account group information
  const accountGroups = {
    ENC: { name: "ENC Account", description: "Enhanced execution with lowest spreads", minDeposit: 25000 },
    Silver: { name: "Silver Account", description: "Premium trading conditions", minDeposit: 10000 },
    Prime: { name: "Prime Account", description: "Institutional-grade trading", minDeposit: 50000 },
    Standard: { name: "Standard Account", description: "Standard trading conditions", minDeposit: 1000 },
    Gold: { name: "Gold Account", description: "VIP trading experience", minDeposit: 5000 },
    Cent: { name: "Cent Account", description: "Micro lots trading", minDeposit: 100 }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "leverage" || name === "initialDeposit" ? Number(value) : value,
    }))
  }

  const generatePassword = (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generatePasswords = () => {
    setFormData(prev => ({
      ...prev,
      password: generatePassword(10),
      investorPassword: generatePassword(10)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/create-live-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setAccountData(result.data)
        setSuccess(true)
      } else {
        setError(result.message || "Failed to create account")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success && accountData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Created Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your MT5 trading account has been created. Please save these credentials:
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Login:</span>
                <span className="font-mono text-gray-900">{accountData.login}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Password:</span>
                <span className="font-mono text-gray-900">{accountData.password}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Server:</span>
                <span className="font-mono text-gray-900">{accountData.server}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Leverage:</span>
                <span className="text-gray-900">1:{accountData.leverage}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Balance:</span>
                <span className="text-gray-900">${accountData.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Group:</span>
                <span className="text-gray-900">{accountData.group}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => window.print()}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Print Credentials
              </button>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please save these credentials securely. You will need them to access your
                MT5 trading platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Open Live MT5 Account
            </h1>
            <p className="mt-2 text-gray-600">Create your professional trading account with advanced features</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Configuration Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Account Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Group Selection */}
                <div>
                  <label htmlFor="accountGroup" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Group *
                  </label>
                  <select
                    id="accountGroup"
                    name="accountGroup"
                    value={formData.accountGroup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  >
                    {Object.entries(accountGroups).map(([key, group]) => (
                      <option key={key} value={key}>
                        {group.name} (Min: ${group.minDeposit.toLocaleString()})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {accountGroups[formData.accountGroup].description}
                  </p>
                </div>

                {/* Leverage Selection */}
                <div>
                  <label htmlFor="leverage" className="block text-sm font-medium text-gray-700 mb-2">
                    Leverage *
                  </label>
                  <select
                    id="leverage"
                    name="leverage"
                    value={formData.leverage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  >
                    <option value={10}>1:10</option>
                    <option value={50}>1:50</option>
                    <option value={100}>1:100</option>
                    <option value={200}>1:200</option>
                    <option value={300}>1:300</option>
                    <option value={400}>1:400</option>
                    <option value={500}>1:500</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Higher leverage increases both potential profits and risks
                  </p>
                </div>
              </div>
            </div>

            {/* Password Configuration Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Security Configuration
                </h3>
                <button
                  type="button"
                  onClick={generatePasswords}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Generate Passwords
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Trading Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter trading password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Used for trading and account management
                  </p>
                </div>

                {/* Investor Password */}
                <div>
                  <label htmlFor="investorPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Investor Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showInvestorPassword ? "text" : "password"}
                      id="investorPassword"
                      name="investorPassword"
                      value={formData.investorPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter investor password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowInvestorPassword(!showInvestorPassword)}
                    >
                      {showInvestorPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Read-only access for monitoring
                  </p>
                </div>
              </div>
            </div>

            {/* Initial Deposit */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
                Initial Deposit
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="initialDeposit" className="block text-sm font-medium text-gray-700 mb-2">
                    Deposit Amount (USD) *
                  </label>
                  <input
                    type="number"
                    id="initialDeposit"
                    name="initialDeposit"
                    min={accountGroups[formData.accountGroup].minDeposit}
                    step="100"
                    value={formData.initialDeposit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={accountGroups[formData.accountGroup].minDeposit.toString()}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum deposit: ${accountGroups[formData.accountGroup].minDeposit.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Account Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Professional trading platform</li>
                      <li>• Advanced charting tools</li>
                      <li>• Real-time market data</li>
                      <li>• Expert advisor support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || formData.initialDeposit < accountGroups[formData.accountGroup].minDeposit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Opening Account...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 mr-2" />
                    Open Live MT5 Account
                  </>
                )}
              </button>
              
              {formData.initialDeposit < accountGroups[formData.accountGroup].minDeposit && (
                <p className="mt-2 text-sm text-red-600 text-center">
                  Minimum deposit for {accountGroups[formData.accountGroup].name} is ${accountGroups[formData.accountGroup].minDeposit.toLocaleString()}
                </p>
              )}
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your account will be created instantly upon submission</li>
              <li>• Save your login credentials securely</li>
              <li>• Deposits can be made immediately after account creation</li>
              <li>• Contact support for any assistance</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
