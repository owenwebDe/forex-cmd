import axios, { type AxiosInstance } from "axios"
import toast from "react-hot-toast"

class ApiClient {
  private api: AxiosInstance
  private token: string | null = null

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
      timeout: 30000,
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
      this.token = localStorage.getItem("admin_token")
    }
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem("admin_token", token)
  }

  logout() {
    this.token = null
    localStorage.removeItem("admin_token")
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.api.post("/auth/login", { email, password })
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response.data
  }

  // Dashboard
  async getDashboardStats() {
    const response = await this.api.get("/admin/dashboard-stats")
    return response.data
  }

  // Users
  async getUsers() {
    const response = await this.api.get("/admin/users")
    return response.data
  }

  async createUser(userData: any) {
    const response = await this.api.post("/admin/users", userData)
    return response.data
  }

  async updateUser(userId: string, userData: any) {
    const response = await this.api.put(`/admin/users/${userId}`, userData)
    return response.data
  }

  async disableUser(userId: string) {
    const response = await this.api.post(`/admin/users/${userId}/disable`)
    return response.data
  }

  async enableUser(userId: string) {
    const response = await this.api.post(`/admin/users/${userId}/enable`)
    return response.data
  }

  // MT5 Accounts
  async getMT5Accounts() {
    const response = await this.api.get("/admin/mt5-accounts")
    return response.data
  }

  async createMT5Account(accountData: any) {
    const response = await this.api.post("/admin/mt5-accounts", accountData)
    return response.data
  }

  async updateMT5Account(loginId: number, accountData: any) {
    const response = await this.api.put(`/admin/mt5-accounts/${loginId}`, accountData)
    return response.data
  }

  async getMT5AccountInfo(loginId: number) {
    const response = await this.api.get(`/admin/mt5-accounts/${loginId}`)
    return response.data
  }

  // Positions
  async getPositions(loginId?: number) {
    const url = loginId ? `/trading/position/${loginId}` : "/admin/positions"
    const response = await this.api.get(url)
    return response.data
  }

  async closePosition(ticket: number) {
    const response = await this.api.post("/admin/close-position", { ticket })
    return response.data
  }

  // Trading
  async openTrade(tradeData: any) {
    const response = await this.api.post("/admin/open-trade", tradeData)
    return response.data
  }

  async closeTrade(tradeData: any) {
    const response = await this.api.post("/admin/close-trade", tradeData)
    return response.data
  }

  async getTradeHistory(params: any) {
    const response = await this.api.post("/trading/history", params)
    return response.data
  }

  // Balance Operations
  async performBalanceOperation(operationData: any) {
    const response = await this.api.post("/admin/balance-operation", operationData)
    return response.data
  }

  async getBalanceHistory(loginId?: number) {
    const url = loginId ? `/admin/balance-history/${loginId}` : "/admin/balance-history"
    const response = await this.api.get(url)
    return response.data
  }

  // Logs
  async getSystemLogs(params?: any) {
    const response = await this.api.get("/admin/logs", { params })
    return response.data
  }

  async getJournal() {
    const response = await this.api.get("/trading/journal")
    return response.data
  }

  // Symbols
  async getSymbolInfo(symbol: string) {
    const response = await this.api.get(`/trading/symbol/${symbol}`)
    return response.data
  }

  async getChartData(chartParams: any) {
    const response = await this.api.post("/trading/chart", chartParams)
    return response.data
  }
}

export const apiClient = new ApiClient()
