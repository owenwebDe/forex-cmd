import axios, { type AxiosResponse } from "axios"
import { logger } from "../utils/logger"
import { MT5_CONFIG, ACCOUNT_GROUPS } from "../config/mt5"

interface MT5AccountData {
  login?: number
  name: string
  email: string
  group: string
  leverage: number
  balance: number
  mPassword: string
  iPassword: string
  phone?: string
  country?: string
  city?: string
  state?: string
  zipCode?: string
  address?: string
}

interface MT5Response {
  success: boolean
  data?: any
  error?: string
  message?: string
  login?: number
  loginId?: number
}

class MT5Service {
  private baseURL: string
  private managerId: number
  private managerPassword: string
  private serverIp: string

  constructor() {
    this.baseURL = MT5_CONFIG.API_URL
    this.managerId = MT5_CONFIG.MANAGER_ID
    this.managerPassword = MT5_CONFIG.MANAGER_PASSWORD
    this.serverIp = MT5_CONFIG.SERVER_IP
  }

  private async makeRequest(endpoint: string, data: any, method = "POST"): Promise<any> {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          mngId: this.managerId,
          pwd: this.managerPassword,
          srvIp: this.serverIp,
          ...data,
        },
        timeout: MT5_CONFIG.TIMEOUT,
      }

      logger.info(`MT5 API Request to ${endpoint}:`, {
        ...config.data,
        pwd: "[HIDDEN]",
        mPassword: "[HIDDEN]",
        iPassword: "[HIDDEN]",
      })

      const response: AxiosResponse = await axios(config)

      logger.info(`MT5 API Response from ${endpoint}:`, response.data)

      return response.data
    } catch (error: any) {
      logger.error(`MT5 API Error for ${endpoint}:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      })
      throw error
    }
  }

  async createAccount(accountData: MT5AccountData) {
    try {
      logger.info("Creating MT5 account with data:", {
        ...accountData,
        mPassword: "[HIDDEN]",
        iPassword: "[HIDDEN]",
      })

      const requestData = {
        name: accountData.name,
        email: accountData.email,
        group: accountData.group || ACCOUNT_GROUPS.DEMO,
        leverage: accountData.leverage || MT5_CONFIG.DEFAULT_LEVERAGE,
        balance: accountData.balance || MT5_CONFIG.DEFAULT_BALANCE,
        mPassword: accountData.mPassword,
        iPassword: accountData.iPassword,
        phone: accountData.phone || "",
        country: accountData.country || "",
        city: accountData.city || "",
        state: accountData.state || "",
        zipCode: accountData.zipCode || "",
        address: accountData.address || "",
      }

      const response = await this.makeRequest(MT5_CONFIG.ENDPOINTS.CREATE_ACCOUNT, requestData)

      if (response.success !== false && (response.login || response.loginId)) {
        return {
          success: true,
          loginId: response.login || response.loginId,
          login: response.login || response.loginId,
          groupName: requestData.group,
          leverage: requestData.leverage,
          balance: requestData.balance,
          server: this.serverIp,
          mPassword: requestData.mPassword,
          iPassword: requestData.iPassword,
          name: requestData.name,
          email: requestData.email,
        }
      } else {
        return {
          success: false,
          error: response.error || response.message || "Unknown error creating account",
        }
      }
    } catch (error: any) {
      logger.error("Error in createAccount:", error)
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to create MT5 account",
      }
    }
  }

  async getAccountInfo(loginId: number) {
    try {
      const response = await this.makeRequest(MT5_CONFIG.ENDPOINTS.GET_ACCOUNT, {
        login: loginId,
      })

      if (response.success !== false) {
        return {
          success: true,
          data: {
            loginId: response.login || loginId,
            login: response.login || loginId,
            name: response.name,
            email: response.email,
            group: response.group,
            leverage: response.leverage,
            balance: response.balance,
            equity: response.equity,
            margin: response.margin,
            freeMargin: response.freeMargin || response.free_margin,
            marginLevel: response.marginLevel || response.margin_level,
            enabled: response.enabled,
            server: this.serverIp,
            currency: response.currency || "USD",
            credit: response.credit || 0,
            profit: response.profit || 0,
          },
        }
      } else {
        return {
          success: false,
          error: response.error || response.message || "Failed to get account info",
        }
      }
    } catch (error: any) {
      logger.error("Error in getAccountInfo:", error)
      return {
        success: false,
        error:
          error.response?.data?.error || error.response?.data?.message || error.message || "Failed to get account info",
      }
    }
  }

  async getBalance(loginId: number) {
    try {
      const response = await this.makeRequest(MT5_CONFIG.ENDPOINTS.GET_BALANCE, {
        login: loginId,
      })

      if (response.success !== false) {
        return {
          success: true,
          balance: response.balance || 0,
          equity: response.equity || 0,
          margin: response.margin || 0,
          freeMargin: response.freeMargin || response.free_margin || 0,
          marginLevel: response.marginLevel || response.margin_level || 0,
          credit: response.credit || 0,
          profit: response.profit || 0,
          currency: response.currency || "USD",
        }
      } else {
        return {
          success: false,
          error: response.error || response.message || "Failed to get balance",
        }
      }
    } catch (error: any) {
      logger.error("Error in getBalance:", error)
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || error.message || "Failed to get balance",
      }
    }
  }

  async performBalanceOperation(loginId: number, type: string, amount: number, comment: string) {
    try {
      const response = await this.makeRequest(MT5_CONFIG.ENDPOINTS.BALANCE_OPERATION, {
        login: loginId,
        type: type, // "DEPOSIT" or "WITHDRAWAL"
        amount: amount,
        comment: comment || `${type} operation`,
      })

      if (response.success !== false) {
        return {
          success: true,
          data: response,
          newBalance: response.balance,
          transactionId: response.transactionId || response.ticket,
        }
      } else {
        return {
          success: false,
          error: response.error || response.message || "Failed to perform balance operation",
        }
      }
    } catch (error: any) {
      logger.error("Error in performBalanceOperation:", error)
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to perform balance operation",
      }
    }
  }

  async getPositions(loginId: number) {
    try {
      const response = await this.makeRequest(MT5_CONFIG.ENDPOINTS.GET_POSITIONS, {
        login: loginId,
      })

      if (response.success !== false) {
        const positions = response.positions || response.data || response || []
        return {
          success: true,
          positions: Array.isArray(positions) ? positions : [],
        }
      } else {
        return {
          success: false,
          error: response.error || response.message || "Failed to get positions",
        }
      }
    } catch (error: any) {
      logger.error("Error in getPositions:", error)
      return {
        success: false,
        error:
          error.response?.data?.error || error.response?.data?.message || error.message || "Failed to get positions",
      }
    }
  }

  async getTradeHistory(loginId: number, from: string, to: string) {
    try {
      const response = await this.makeRequest(MT5_CONFIG.ENDPOINTS.GET_HISTORY, {
        login: loginId,
        from: from,
        to: to,
      })

      if (response.success !== false) {
        const trades = response.trades || response.history || response.data || response || []
        return {
          success: true,
          trades: Array.isArray(trades) ? trades : [],
        }
      } else {
        return {
          success: false,
          error: response.error || response.message || "Failed to get trade history",
        }
      }
    } catch (error: any) {
      logger.error("Error in getTradeHistory:", error)
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to get trade history",
      }
    }
  }

  async updateAccount(loginId: number, updateData: any) {
    try {
      const response = await this.makeRequest(MT5_CONFIG.ENDPOINTS.UPDATE_ACCOUNT, {
        login: loginId,
        ...updateData,
      })

      if (response.success !== false) {
        return {
          success: true,
          data: response,
        }
      } else {
        return {
          success: false,
          error: response.error || response.message || "Failed to update account",
        }
      }
    } catch (error: any) {
      logger.error("Error in updateAccount:", error)
      return {
        success: false,
        error:
          error.response?.data?.error || error.response?.data?.message || error.message || "Failed to update account",
      }
    }
  }

  async getSymbols() {
    try {
      const response = await this.makeRequest(MT5_CONFIG.ENDPOINTS.GET_SYMBOLS, {})

      if (response.success !== false) {
        const symbols = response.symbols || response.data || response || []
        return {
          success: true,
          symbols: Array.isArray(symbols) ? symbols : [],
        }
      } else {
        return {
          success: false,
          error: response.error || response.message || "Failed to get symbols",
        }
      }
    } catch (error: any) {
      logger.error("Error in getSymbols:", error)
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || error.message || "Failed to get symbols",
      }
    }
  }

  async getQuotes(symbols: string[]) {
    try {
      const response = await this.makeRequest(MT5_CONFIG.ENDPOINTS.GET_QUOTES, {
        symbols: symbols,
      })

      if (response.success !== false) {
        const quotes = response.quotes || response.data || response || []
        return {
          success: true,
          quotes: Array.isArray(quotes) ? quotes : [],
        }
      } else {
        return {
          success: false,
          error: response.error || response.message || "Failed to get quotes",
        }
      }
    } catch (error: any) {
      logger.error("Error in getQuotes:", error)
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || error.message || "Failed to get quotes",
      }
    }
  }

  // Test connection to MT5 server
  async testConnection() {
    try {
      const response = await this.makeRequest("/api/System/Status", {})
      return {
        success: true,
        status: "Connected",
        server: this.serverIp,
        data: response,
      }
    } catch (error: any) {
      logger.error("Error testing MT5 connection:", error)
      return {
        success: false,
        status: "Disconnected",
        error: error.message,
      }
    }
  }
}

export const mt5Service = new MT5Service()
