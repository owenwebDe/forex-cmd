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
  status: "active" | "disabled"
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
  status: "active" | "disabled"
  tradeAllowed: boolean
}

export interface Position {
  ticket: number
  loginId: number
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
  loginId: number
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

export interface BalanceOperation {
  id: string
  loginId: number
  type: "deposit" | "withdrawal" | "credit" | "bonus"
  amount: number
  description: string
  timestamp: string
  status: "completed" | "pending" | "failed"
}

export interface SystemLog {
  id: string
  timestamp: string
  level: "info" | "warning" | "error"
  message: string
  source: string
  details?: any
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalBalance: number
  totalEquity: number
  totalProfit: number
  openPositions: number
  todayDeposits: number
  todayWithdrawals: number
  serverStatus: "online" | "offline" | "maintenance"
}
