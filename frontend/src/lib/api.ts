import axios, { type AxiosInstance } from "axios"
import toast from "react-hot-toast"

class ApiClient {
  private api: AxiosInstance
  private token: string | null = null

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
      timeout: 30000,
      withCredentials: true,
    })

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout()
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
        }

        const message = error.response?.data?.error || error.message || "An error occurred"
        if (typeof window !== "undefined") {
          toast.error(message)
        }

        return Promise.reject(error)
      },
    )

    // Load token from localStorage
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem("auth_token", token)
  }

  logout() {
    this.token = null
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
  }

  // Authentication
  async register(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
  }) {
    const response = await this.api.post("/auth/register", userData)
    if (response.data.token) {
      this.setToken(response.data.token)
      localStorage.setItem("user_data", JSON.stringify(response.data.user))
    }
    return response.data
  }

  async login(email: string, password: string) {
    const response = await this.api.post("/auth/login", { email, password })
    if (response.data.token) {
      this.setToken(response.data.token)
      localStorage.setItem("user_data", JSON.stringify(response.data.user))
    }
    return response.data
  }

  // Account Management
  async getAccountInfo() {
    const response = await this.api.get("/account/info")
    return response.data
  }

  async createLiveAccount(accountData: {
    name: string
    phone: string
    country: string
    city: string
    address: string
    leverage: number
    groupName: string
    mPassword: string
    iPassword: string
  }) {
    const response = await this.api.post("/account/create-live", accountData)
    return response.data
  }

  async updateAccount(updateData: any) {
    const response = await this.api.put("/account/update", updateData)
    return response.data
  }

  async disableAccount() {
    const response = await this.api.post("/account/disable")
    return response.data
  }

  // Trading
  async getPositions() {
    const user = JSON.parse(localStorage.getItem("user_data") || "{}")
    if (!user.loginId) throw new Error("No MT5 account found")

    const response = await this.api.get(`/trading/position/${user.loginId}`)
    return response.data
  }

  async getTradeHistory(params?: { from?: string; to?: string }) {
    const user = JSON.parse(localStorage.getItem("user_data") || "{}")
    if (!user.loginId) throw new Error("No MT5 account found")

    const response = await this.api.post("/trading/history", {
      loginId: user.loginId,
      ...params,
    })
    return response.data
  }

  async getJournal() {
    const response = await this.api.get("/trading/journal")
    return response.data
  }

  async getChartData(params: { symbol: string; timeframe: number; from?: string; to?: string }) {
    const response = await this.api.post("/trading/chart", params)
    return response.data
  }

  // Balance Operations
  async processDeposit(data: { amount: number; paymentIntentId: string; description?: string }) {
    const response = await this.api.post("/balance/deposit", data)
    return response.data
  }

  async requestWithdrawal(data: {
    amount: number
    method: string
    details: any
    reason?: string
  }) {
    const response = await this.api.post("/balance/withdrawal-request", data)
    return response.data
  }

  async getTransactionHistory(params?: { from?: string; to?: string; type?: string }) {
    const response = await this.api.get("/balance/history", { params })
    return response.data
  }

  async getWithdrawalRequests() {
    const response = await this.api.get("/balance/withdrawal-requests")
    return response.data
  }

  // Payments
  async createPaymentIntent(amount: number, currency = "usd") {
    const response = await this.api.post("/payment/create-payment-intent", {
      amount,
      currency,
    })
    return response.data
  }

  async getPaymentHistory() {
    const response = await this.api.get("/payment/history")
    return response.data
  }
}

export const apiClient = new ApiClient()
