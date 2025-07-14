import axios, { type AxiosResponse } from "axios"
import { MT5_CONFIG, ACCOUNT_GROUPS } from "../config/mt5.js"

export interface MT5Account {
  login: number
  password: string
  name: string
  email: string
  group: string
  leverage: number
  balance: number
  equity: number
  margin: number
  freeMargin: number
  marginLevel: number
  server: string
}

export interface CreateAccountRequest {
  name: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  zipCode: string
  leverage: number
  accountType: "demo" | "live"
  initialDeposit?: number
}

export interface MT5Position {
  ticket: number
  symbol: string
  type: number
  volume: number
  openPrice: number
  currentPrice: number
  profit: number
  swap: number
  commission: number
  openTime: string
}

export interface BalanceOperation {
  login: number
  amount: number
  comment: string
  type: "deposit" | "withdrawal"
}

class MT5Service {
  private baseURL: string
  private timeout: number

  constructor() {
    this.baseURL = MT5_CONFIG.API_URL
    this.timeout = MT5_CONFIG.TIMEOUT
  }

  private async makeRequest<T>(endpoint: string, data?: any, method: "GET" | "POST" | "PUT" = "POST"): Promise<T> {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        timeout: this.timeout,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        ...(data && { data }),
      }

      const response: AxiosResponse<T> = await axios(config)
      return response.data
    } catch (error: any) {
      console.error(`MT5 API Error [${endpoint}]:`, error.response?.data || error.message)
      throw new Error(`MT5 API Error: ${error.response?.data?.message || error.message}`)
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test connection by trying to get server info
      await this.makeRequest("/api/Server/Info", null, "GET")
      return true
    } catch (error) {
      console.error("MT5 Connection Test Failed:", error)
      return false
    }
  }

  async createAccount(request: CreateAccountRequest): Promise<MT5Account> {
    const accountData = {
      mngId: MT5_CONFIG.MANAGER_ID,
      pwd: MT5_CONFIG.MANAGER_PASSWORD,
      srvIp: MT5_CONFIG.SERVER_IP,
      name: request.name,
      email: request.email,
      phone: request.phone,
      country: request.country,
      city: request.city,
      address: request.address,
      zipCode: request.zipCode,
      group: request.accountType === "demo" ? ACCOUNT_GROUPS.DEMO : ACCOUNT_GROUPS.LIVE_STANDARD,
      leverage: request.leverage,
      balance: request.initialDeposit || (request.accountType === "demo" ? MT5_CONFIG.DEFAULT_BALANCE : 0),
      currency: "USD",
      comment: `Account created via CRM - ${new Date().toISOString()}`,
    }

    try {
      const response = await this.makeRequest<any>(MT5_CONFIG.ENDPOINTS.CREATE_ACCOUNT, accountData)

      if (response.success && response.data) {
        return {
          login: response.data.login,
          password: response.data.password,
          name: request.name,
          email: request.email,
          group: accountData.group,
          leverage: request.leverage,
          balance: accountData.balance,
          equity: accountData.balance,
          margin: 0,
          freeMargin: accountData.balance,
          marginLevel: 0,
          server: MT5_CONFIG.SERVER_NAME,
        }
      } else {
        throw new Error(response.message || "Failed to create MT5 account")
      }
    } catch (error: any) {
      console.error("Create Account Error:", error)
      throw new Error(`Failed to create MT5 account: ${error.message}`)
    }
  }

  async getAccount(login: number): Promise<MT5Account | null> {
    try {
      const response = await this.makeRequest<any>(MT5_CONFIG.ENDPOINTS.GET_ACCOUNT, {
        mngId: MT5_CONFIG.MANAGER_ID,
        pwd: MT5_CONFIG.MANAGER_PASSWORD,
        srvIp: MT5_CONFIG.SERVER_IP,
        login: login,
      })

      if (response.success && response.data) {
        return {
          login: response.data.login,
          password: response.data.password || "****",
          name: response.data.name,
          email: response.data.email,
          group: response.data.group,
          leverage: response.data.leverage,
          balance: response.data.balance,
          equity: response.data.equity,
          margin: response.data.margin,
          freeMargin: response.data.freeMargin,
          marginLevel: response.data.marginLevel,
          server: MT5_CONFIG.SERVER_NAME,
        }
      }
      return null
    } catch (error) {
      console.error("Get Account Error:", error)
      return null
    }
  }

  async getPositions(login: number): Promise<MT5Position[]> {
    try {
      const response = await this.makeRequest<any>(MT5_CONFIG.ENDPOINTS.GET_POSITIONS, {
        mngId: MT5_CONFIG.MANAGER_ID,
        pwd: MT5_CONFIG.MANAGER_PASSWORD,
        srvIp: MT5_CONFIG.SERVER_IP,
        login: login,
      })

      if (response.success && response.data) {
        return response.data.map((pos: any) => ({
          ticket: pos.ticket,
          symbol: pos.symbol,
          type: pos.type,
          volume: pos.volume,
          openPrice: pos.openPrice,
          currentPrice: pos.currentPrice,
          profit: pos.profit,
          swap: pos.swap,
          commission: pos.commission,
          openTime: pos.openTime,
        }))
      }
      return []
    } catch (error) {
      console.error("Get Positions Error:", error)
      return []
    }
  }

  async performBalanceOperation(operation: BalanceOperation): Promise<boolean> {
    try {
      const response = await this.makeRequest<any>(MT5_CONFIG.ENDPOINTS.BALANCE_OPERATION, {
        mngId: MT5_CONFIG.MANAGER_ID,
        pwd: MT5_CONFIG.MANAGER_PASSWORD,
        srvIp: MT5_CONFIG.SERVER_IP,
        login: operation.login,
        amount: operation.type === "withdrawal" ? -Math.abs(operation.amount) : Math.abs(operation.amount),
        comment: operation.comment,
        type: operation.type === "deposit" ? 2 : 3, // MT5 operation types
      })

      return response.success === true
    } catch (error) {
      console.error("Balance Operation Error:", error)
      return false
    }
  }

  async getAccountBalance(login: number): Promise<number> {
    try {
      const account = await this.getAccount(login)
      return account?.balance || 0
    } catch (error) {
      console.error("Get Balance Error:", error)
      return 0
    }
  }
}

export const mt5Service = new MT5Service()
