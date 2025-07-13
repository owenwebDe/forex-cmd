"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import { apiClient } from "@/lib/api"
import toast from "react-hot-toast"

const createAccountSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  leverage: z.number().min(1).max(1000),
  groupName: z.string().min(1, "Group is required"),
  mPassword: z.string().min(6, "Main password must be at least 6 characters"),
  iPassword: z.string().min(6, "Investor password must be at least 6 characters"),
})

type CreateAccountForm = z.infer<typeof createAccountSchema>

export default function CreateAccountPage() {
  const [loading, setLoading] = useState(false)
  const [showMPassword, setShowMPassword] = useState(false)
  const [showIPassword, setShowIPassword] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false)
  const [accountDetails, setAccountDetails] = useState<any>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountForm>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      leverage: 100,
      groupName: "REAL-LIVE-GROUP",
    },
  })

  const onSubmit = async (data: CreateAccountForm) => {
    setLoading(true)
    try {
      const result = await apiClient.createLiveAccount(data)
      setAccountDetails(result.account)
      setAccountCreated(true)
      toast.success("Live MT5 account created successfully!")

      // Update user data in localStorage
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
      userData.loginId = result.account.loginId
      localStorage.setItem("user_data", JSON.stringify(userData))
    } catch (error) {
      // Error is handled by the API client
    } finally {
      setLoading(false)
    }
  }

  if (accountCreated && accountDetails) {
    return (
      <DashboardLayout title="Account Created">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Live MT5 Account Created Successfully!</h2>

            <p className="text-gray-600 mb-8">
              Your live trading account has been created. Here are your account details:
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">MT5 Login ID</p>
                  <p className="font-bold text-lg text-blue-600">{accountDetails.loginId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Group</p>
                  <p className="font-medium">{accountDetails.groupName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Leverage</p>
                  <p className="font-medium">1:{accountDetails.leverage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Server</p>
                  <p className="font-medium">{accountDetails.server}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Platform</p>
                  <p className="font-medium">{accountDetails.platform}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Download MetaTrader 5 platform</li>
                <li>Use your Login ID and password to connect</li>
                <li>Server: {accountDetails.server}</li>
                <li>Start trading with your live account</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push("/deposit")}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Deposit Funds
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Create Live MT5 Account">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Live Trading Account</h2>
            <p className="text-gray-600">
              Fill in the details below to create your live MT5 trading account. This will be a real trading account
              connected to live markets.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                {...register("phone")}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  {...register("country")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your country"
                />
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  {...register("city")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your city"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                {...register("address")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full address"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leverage</label>
                <select
                  {...register("leverage", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={50}>1:50</option>
                  <option value={100}>1:100</option>
                  <option value={200}>1:200</option>
                  <option value={500}>1:500</option>
                  <option value={1000}>1:1000</option>
                </select>
                {errors.leverage && <p className="mt-1 text-sm text-red-600">{errors.leverage.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Group</label>
                <select
                  {...register("groupName")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="REAL-LIVE-GROUP">Real Live Group</option>
                  <option value="REAL-STANDARD">Real Standard</option>
                  <option value="REAL-ECN">Real ECN</option>
                </select>
                {errors.groupName && <p className="mt-1 text-sm text-red-600">{errors.groupName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Password</label>
                <div className="relative">
                  <input
                    {...register("mPassword")}
                    type={showMPassword ? "text" : "password"}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter main password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowMPassword(!showMPassword)}
                  >
                    {showMPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.mPassword && <p className="mt-1 text-sm text-red-600">{errors.mPassword.message}</p>}
                <p className="mt-1 text-xs text-gray-500">Used for trading and account management</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investor Password</label>
                <div className="relative">
                  <input
                    {...register("iPassword")}
                    type={showIPassword ? "text" : "password"}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter investor password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowIPassword(!showIPassword)}
                  >
                    {showIPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.iPassword && <p className="mt-1 text-sm text-red-600">{errors.iPassword.message}</p>}
                <p className="mt-1 text-xs text-gray-500">Read-only access for monitoring</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      This will create a <strong>live trading account</strong> with real money. Make sure all
                      information is accurate. You will receive your MT5 login credentials after account creation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Live Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
