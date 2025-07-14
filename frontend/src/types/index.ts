export interface User {
  id: string
  email: string
  name: string
  phone?: string
  country?: string
  city?: string
  address?: string
  mt5LoginId?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MT5Account {
  loginId: number
  name: string
  email: string
  group: string
  leverage: number
  balance: number
  equity: number
  margin: number
  freeMargin: number
  marginLevel: number
  enabled: boolean
  server: string
}

export interface Position {
  ticket: number
  symbol: string
  type: string
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
  closePrice: number
  profit: number
  swap: number
  commission: number
  openTime: string
  closeTime: string
  comment: string
}

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal"
  amount: number
  status: "pending" | "completed" | "failed" | "cancelled"
  method: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface CreateAccountData {
  name: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  leverage: number
  groupName: string
  balance: number
  mPassword?: string
  iPassword?: string
}

export interface DashboardStats {
  balance: number
  equity: number
  margin: number
  freeMargin: number
  marginLevel: number
  openPositions: number
  totalProfit: number
  todayProfit: number
}
