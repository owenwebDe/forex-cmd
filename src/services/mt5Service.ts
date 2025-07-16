import axios, { type AxiosInstance } from "axios"
import { MT5_CONFIG } from "../config/mt5"
import { logger } from "../utils/logger"

export class MT5Service {
  private api: AxiosInstance
  private token: string | null = null
  private tokenExpiry: Date | null = null

  constructor() {
    this.api = axios.create({
      baseURL: MT5_CONFIG.baseUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token && config.url !== MT5_CONFIG.endpoints.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.token) {
          // Token expired, try to refresh
          await this.authenticate()
          return this.api.request(error.config)
        }
        return Promise.reject(error)
      },
    )
  }

  async authenticate(): Promise<string> {
    try {
      const response = await this.api.post(MT5_CONFIG.endpoints.token, MT5_CONFIG.credentials)

      if (response.data && response.data.token) {
        this.token = response.data.token
        this.tokenExpiry = new Date(Date.now() + (response.data.expiresIn || 3600) * 1000)
        logger.info("MT5 authentication successful")
        return this.token
      }

      throw new Error("Invalid authentication response")
    } catch (error) {
      logger.error("MT5 authentication failed:", error)
      throw new Error("Failed to authenticate with MT5 server")
    }
  }

  async ensureAuthenticated(): Promise<void> {
    if (!this.token || (this.tokenExpiry && new Date() >= this.tokenExpiry)) {
      await this.authenticate()
    }
  }

  // Trading Operations
  async getPosition(loginId: number): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.get(`${MT5_CONFIG.endpoints.getPosition}/${loginId}`)
    return response.data
  }

  async getPositionByGroup(groupName: string): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.get(`${MT5_CONFIG.endpoints.getPositionByGroup}/${groupName}`)
    return response.data
  }

  async getPositionBySymbol(groupName: string, symbolName: string): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.get(`${MT5_CONFIG.endpoints.getPositionBySymbol}/${groupName}/${symbolName}`)
    return response.data
  }

  async getSymbolInfo(symbol: string): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.get(`${MT5_CONFIG.endpoints.getSymbolInfo}/${symbol}`)
    return response.data
  }

  async getJournal(): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.get(MT5_CONFIG.endpoints.journal)
    return response.data
  }

  // Account Management
  async createAccount(accountData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.createAccount, accountData)
    return response.data
  }

  async getUserInfo(loginId: number): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.get(`${MT5_CONFIG.endpoints.getUserInfo}/${loginId}`)
    return response.data
  }

  async getAllUsers(groupName: string): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.get(`${MT5_CONFIG.endpoints.getAllUsers}/${groupName}`)
    return response.data
  }

  async getAllAccountInfos(): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.get(MT5_CONFIG.endpoints.getAllAccountInfos)
    return response.data
  }

  async updateAccount(accountData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.updateAccount, accountData)
    return response.data
  }

  async updatePassword(passwordData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.updatePwd, passwordData)
    return response.data
  }

  async checkPassword(passwordData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.checkPwd, passwordData)
    return response.data
  }

  async disableUser(userData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.userDisable, userData)
    return response.data
  }

  async disableTrade(tradeData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.tradeDisable, tradeData)
    return response.data
  }

  // Balance Operations
  async balanceOperation(balanceData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.balanceOP, balanceData)
    return response.data
  }

  async transfer(transferData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.transfer, transferData)
    return response.data
  }

  // Trading Operations
  async sendOpenTrade(tradeData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.sendOpenTrade, tradeData)
    return response.data
  }

  async sendCloseTrade(tradeData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.sendCloseTrade, tradeData)
    return response.data
  }

  async sendCloseByTrade(tradeData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.sendCloseByTrade, tradeData)
    return response.data
  }

  async pendingOrder(orderData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.pendingOrder, orderData)
    return response.data
  }

  async updatePosition(positionData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.updatePosition, positionData)
    return response.data
  }

  async cancelOrder(orderId: number): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.get(`${MT5_CONFIG.endpoints.orderCancel}/${orderId}`)
    return response.data
  }

  async updateOrder(orderData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.orderUpdate, orderData)
    return response.data
  }

  // History and Logs
  async getTradeHistory(historyData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.tradeHistory, historyData)
    return response.data
  }

  async getHistoryFromDBTime(timeData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.getHistoryFromDBTime, timeData)
    return response.data
  }

  async getTradeHistoryByLoginTime(historyData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.tradeHistoryByLoginTime, historyData)
    return response.data
  }

  async getLogs(logData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.getLogs, logData)
    return response.data
  }

  // Charts
  async getChart(chartData: any): Promise<any> {
    await this.ensureAuthenticated()
    const response = await this.api.post(MT5_CONFIG.endpoints.getChart, chartData)
    return response.data
  }
}

export const mt5Service = new MT5Service()
