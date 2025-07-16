export interface MT5Account {
  login: number
  password: string
  server: string
  name: string
  email: string
  leverage: number
  balance: number
  equity: number
  margin: number
  freeMargin: number
  marginLevel: number
  group: string
  currency: string
  enabled: boolean
  createdAt: string
}

export interface CreateAccountRequest {
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
  comment?: string
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

export interface BalanceOperation {
  login: number
  amount: number
  comment: string
  type: "deposit" | "withdrawal"
  timestamp: string
  status: "pending" | "completed" | "failed"
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  timestamp?: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  country?: string
  city?: string
  address?: string
  zipCode?: string
  createdAt: string
  updatedAt: string
  mt5Accounts: MT5Account[]
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  clientSecret: string
}

export interface DepositRequest {
  amount: number
  currency: string
  paymentMethod: string
  loginId: number
}
