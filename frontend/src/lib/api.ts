import axios, { type AxiosInstance } from "axios"
import { toast } from "react-hot-toast"

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
          window.location.href = "/login"
        }

        const message = error.response?.data?.error || error.message || "An error occurred"
        toast.error(message)

        return Promise.reject(error)
      },
    )

    // Load token from localStorage
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("user_token")
    }
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem("user_token", token)
  }

  logout() {
    this.token = null
    localStorage.removeItem("user_token")
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.api.post("/auth/login", { email, password })
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response.data
  }

  async register(userData: any) {
    const response = await this.api.post("/auth/register", userData)
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response.data
  }

  // Account Management
  async createLiveAccount(accountData: any) {
    const response = await this.api.post("/account/create-live-account", accountData)
    return response.data
  }

  async getMT5AccountInfo() {
    const response = await this.api.get("/account/mt5-info")
    return response.data
  }

  async getAccountBalance() {
    const response = await this.api.get("/account/balance")
    return response.data
  }

  async updateAccount(updateData: any) {
    const response = await this.api.put("/account/update", updateData)
    return response.data
  }

  // Trading
  async getPositions() {
    const response = await this.api.get("/trading/positions")
    return response.data
  }

  async getTradeHistory(params: any) {
    const response = await this.api.post("/trading/history", params)
    return response.data
  }

  async getJournal() {
    const response = await this.api.get("/trading/journal")
    return response.data
  }

  async getSymbolInfo(symbol: string) {
    const response = await this.api.get(`/trading/symbol/${symbol}`)
    return response.data
  }

  async getChartData(chartParams: any) {
    const response = await this.api.post("/trading/chart", chartParams)
    return response.data
  }

  // Balance Operations
  async deposit(amount: number, paymentMethodId: string) {
    const response = await this.api.post("/balance/deposit", {
      amount,
      paymentMethodId,
    })
    return response.data
  }

  async requestWithdrawal(amount: number, method: string, details: any) {
    const response = await this.api.post("/balance/withdraw", {
      amount,
      method,
      details,
    })
    return response.data
  }

  async getTransactionHistory() {
    const response = await this.api.get("/balance/history")
    return response.data
  }

  // Payments
  async createPaymentIntent(amount: number) {
    const response = await this.api.post("/payment/create-intent", { amount })
    return response.data
  }

  async confirmPayment(paymentIntentId: string) {
    const response = await this.api.post("/payment/confirm", { paymentIntentId })
    return response.data
  }
}

export const apiClient = new ApiClient()
