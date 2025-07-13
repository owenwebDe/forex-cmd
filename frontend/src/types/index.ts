export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: "user" | "admin"
  loginId?: number
  createdAt: string
  lastLogin?: string
}

export interface MT5Account {
  loginId: number
  name: string
  email: string
  group: string
  balance: number
  equity: number
  margin: number
  freeMargin: number
  marginLevel: number
  leverage: number
  currency: string
  server: string
  lastActivity: string
  enabled: boolean
  tradeAllowed: boolean
}

export interface Position {
  ticket: number
  symbol: string
  type: "buy" | "sell"
  volume: number
  openPrice: number
  currentPrice: number
  profit: number
  swap: number
  commission: number
  openTime: string
  comment: string
}

export interface Trade {
  ticket: number
  symbol: string
  type: string
  volume: number
  openPrice: number
  closePrice?: number
  profit: number
  swap: number
  commission: number
  openTime: string
  closeTime?: string
  comment: string
}

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "credit" | "bonus"
  amount: number
  description: string
  timestamp: string
  status: "completed" | "pending" | "failed"
  paymentMethod?: string
}

export interface WithdrawalRequest {
  id: string
  amount: number
  method: string
  details: any
  reason?: string
  status: "pending" | "approved" | "rejected" | "completed"
  requestedAt: string
  processedAt?: string
}
