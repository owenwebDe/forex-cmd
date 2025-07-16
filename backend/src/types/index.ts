export interface User {
  id: string
  email: string
  name: string
  phone?: string
  country?: string
  city?: string
  address?: string
  zipCode?: string
  createdAt: Date
  updatedAt: Date
  mt5Accounts?: MT5AccountInfo[]
}

export interface MT5AccountInfo {
  login: number
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
  createdAt: Date
  isActive: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  timestamp?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateAccountPayload {
  name: string
  email: string
  phone: string
  country: string
  city?: string
  address?: string
  zipCode?: string
  leverage: number
  accountType: "demo" | "live"
  initialDeposit?: number
}

export interface BalanceOperationPayload {
  login: number
  amount: number
  comment: string
  type: "deposit" | "withdrawal"
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

export interface MT5Trade {
  ticket: number
  symbol: string
  type: number
  volume: number
  openPrice: number
  closePrice?: number
  profit: number
  swap: number
  commission: number
  openTime: string
  closeTime?: string
  comment?: string
}
