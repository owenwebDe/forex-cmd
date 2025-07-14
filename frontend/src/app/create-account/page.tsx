"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface FormData {
  name: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  zipCode: string
  leverage: number
  accountType: "demo" | "live"
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

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
    leverage: 100,
    accountType: "demo",
    initialDeposit: 10000,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "leverage" || name === "initialDeposit" ? Number(value) : value,
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create MT5 Account</h1>
            <p className="mt-2 text-gray-600">Fill out the form below to create your trading account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your country"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your city"
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your ZIP code"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your full address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="demo">Demo Account</option>
                  <option value="live">Live Account</option>
                </select>
              </div>

              <div>
                <label htmlFor="leverage" className="block text-sm font-medium text-gray-700 mb-1">
                  Leverage
                </label>
                <select
                  id="leverage"
                  name="leverage"
                  value={formData.leverage}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value={1}>1:1</option>
                  <option value={10}>1:10</option>
                  <option value={20}>1:20</option>
                  <option value={50}>1:50</option>
                  <option value={100}>1:100</option>
                  <option value={200}>1:200</option>
                  <option value={300}>1:300</option>
                  <option value={400}>1:400</option>
                  <option value={500}>1:500</option>
                  <option value={1000}>1:1000</option>
                </select>
              </div>

              <div>
                <label htmlFor="initialDeposit" className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Deposit ($)
                </label>
                <input
                  type="number"
                  id="initialDeposit"
                  name="initialDeposit"
                  min="0"
                  step="100"
                  value={formData.initialDeposit}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="10000"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create MT5 Account"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button onClick={() => router.push("/login")} className="text-blue-600 hover:text-blue-700 font-medium">
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
