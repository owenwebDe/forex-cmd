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
  accountGroup: "ENC" | "Silver" | "Prime" | "Standard" | "Gold" | "Cent"
  password: string
  investorPassword: string
  initialDeposit: number
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
        ...(data && { data: JSON.stringify(data) }),
      }

      console.log('MT5 API Request:', {
        url: config.url,
        method: config.method,
        data: config.data
      });

      const response: AxiosResponse<T> = await axios(config)
      console.log('MT5 API Response:', response.data);
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
      ManagerId: MT5_CONFIG.MANAGER_ID,
      Password: MT5_CONFIG.MANAGER_PASSWORD,
      ServerIP: MT5_CONFIG.SERVER_IP,
      Name: request.name,
      Email: request.email,
      Phone: request.phone,
      Country: request.country,
      City: request.city,
      Address: request.address,
      ZipCode: request.zipCode,
      Group: ACCOUNT_GROUPS[request.accountGroup],
      Leverage: request.leverage,
      MainPassword: request.password,
      InvestorPassword: request.investorPassword,
      InitialBalance: request.initialDeposit,
      Currency: "USD",
      Comment: `${request.accountGroup} Account created via CRM - ${new Date().toISOString()}`
    }

    try {
      const response = await this.makeRequest<any>(MT5_CONFIG.ENDPOINTS.CREATE_ACCOUNT, accountData)

      if (response.success && response.data) {
        return {
          login: response.data.login,
          password: response.data.password,
          name: request.name,
          email: request.email,
          group: accountData.Group,
          leverage: request.leverage,
          balance: accountData.InitialBalance,
          equity: accountData.InitialBalance,
          margin: 0,
          freeMargin: accountData.InitialBalance,
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

  async depositToAccount(login: number, amount: number): Promise<{ success: boolean; error?: string }> {
    try {
      const operation: BalanceOperation = {
        login,
        amount,
        comment: `Wallet transfer - Deposit ${amount} USD`,
        type: "deposit"
      }

      const success = await this.performBalanceOperation(operation)
      
      if (success) {
        return { success: true }
      } else {
        return { success: false, error: "MT5 deposit operation failed" }
      }
    } catch (error: any) {
      console.error("Deposit to MT5 account error:", error)
      return { success: false, error: error.message }
    }
  }

  async withdrawFromAccount(login: number, amount: number): Promise<{ success: boolean; error?: string }> {
    try {
      // First check if account has sufficient balance
      const currentBalance = await this.getAccountBalance(login)
      if (currentBalance < amount) {
        return { success: false, error: "Insufficient MT5 account balance" }
      }

      const operation: BalanceOperation = {
        login,
        amount,
        comment: `Wallet transfer - Withdrawal ${amount} USD`,
        type: "withdrawal"
      }

      const success = await this.performBalanceOperation(operation)
      
      if (success) {
        return { success: true }
      } else {
        return { success: false, error: "MT5 withdrawal operation failed" }
      }
    } catch (error: any) {
      console.error("Withdraw from MT5 account error:", error)
      return { success: false, error: error.message }
    }
  }

  async getUserAccounts(email: string): Promise<MT5Account[]> {
    try {
      // This is a mock implementation since the real MT5 API endpoint for user accounts
      // would need to be implemented on the MT5 server side
      // For now, return mock accounts
      const mockAccounts: MT5Account[] = [
        {
          login: 123456,
          password: "****",
          name: "Standard Account",
          email: email,
          group: "standard",
          leverage: 100,
          balance: 8750.25,
          equity: 8750.25,
          margin: 0,
          freeMargin: 8750.25,
          marginLevel: 0,
          server: MT5_CONFIG.SERVER_NAME
        },
        {
          login: 789012,
          password: "****",
          name: "Gold Account",
          email: email,
          group: "gold",
          leverage: 200,
          balance: 25300.75,
          equity: 25300.75,
          margin: 0,
          freeMargin: 25300.75,
          marginLevel: 0,
          server: MT5_CONFIG.SERVER_NAME
        },
        {
          login: 456789,
          password: "****",
          name: "Prime Account",
          email: email,
          group: "prime",
          leverage: 500,
          balance: 52140.00,
          equity: 52140.00,
          margin: 0,
          freeMargin: 52140.00,
          marginLevel: 0,
          server: MT5_CONFIG.SERVER_NAME
        }
      ]

      return mockAccounts
    } catch (error) {
      console.error("Get user accounts error:", error)
      return []
    }
  }
}

export const mt5Service = new MT5Service()
export { MT5Service }
