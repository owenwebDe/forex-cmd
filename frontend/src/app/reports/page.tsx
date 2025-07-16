"use client"

import { useState, useEffect } from "react"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  Target,
  Award,
  AlertCircle
} from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart
} from "recharts"

interface Report {
  id: string
  name: string
  type: "performance" | "trading" | "financial" | "activity"
  description: string
  lastGenerated: string
  dataPoints: number
  format: "pdf" | "excel" | "csv"
}

interface PerformanceMetrics {
  totalProfit: number
  totalLoss: number
  winRate: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  maxDrawdown: number
  sharpeRatio: number
}

interface ChartData {
  date: string
  profit: number
  loss: number
  balance: number
  equity: number
  trades: number
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    from: "2024-01-01",
    to: "2024-01-31"
  })
  const [selectedAccount, setSelectedAccount] = useState("all")
  
  const [performanceData, setPerformanceData] = useState<ChartData[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalProfit: 15420,
    totalLoss: -8950,
    winRate: 68.5,
    averageWin: 245,
    averageLoss: -180,
    profitFactor: 1.72,
    maxDrawdown: -12.5,
    sharpeRatio: 1.45
  })

  // Mock data for charts
  const mockPerformanceData: ChartData[] = [
    { date: "Jan 1", profit: 1200, loss: -800, balance: 10400, equity: 10350, trades: 15 },
    { date: "Jan 8", profit: 1800, loss: -600, balance: 11600, equity: 11550, trades: 22 },
    { date: "Jan 15", profit: 950, loss: -1200, balance: 11350, equity: 11280, trades: 18 },
    { date: "Jan 22", profit: 2100, loss: -400, balance: 13050, equity: 13020, trades: 25 },
    { date: "Jan 29", profit: 1650, loss: -950, balance: 13750, equity: 13680, trades: 20 }
  ]

  const profitLossData = [
    { name: "Winning Trades", value: 68.5, color: "#10b981" },
    { name: "Losing Trades", value: 31.5, color: "#ef4444" }
  ]

  const tradingHoursData = [
    { hour: "00:00", trades: 2 },
    { hour: "04:00", trades: 1 },
    { hour: "08:00", trades: 15 },
    { hour: "12:00", trades: 25 },
    { hour: "16:00", trades: 18 },
    { hour: "20:00", trades: 8 }
  ]

  const symbolPerformance = [
    { symbol: "EURUSD", trades: 45, profit: 2850, winRate: 71 },
    { symbol: "GBPUSD", trades: 32, profit: 1920, winRate: 69 },
    { symbol: "USDJPY", trades: 28, profit: -450, winRate: 43 },
    { symbol: "AUDUSD", trades: 22, profit: 1180, winRate: 64 },
    { symbol: "USDCAD", trades: 18, profit: 890, winRate: 61 }
  ]

  const monthlyReports: Report[] = [
    {
      id: "rpt_001",
      name: "Monthly Performance Report",
      type: "performance",
      description: "Comprehensive trading performance analysis",
      lastGenerated: "2024-01-31T23:59:00Z",
      dataPoints: 1245,
      format: "pdf"
    },
    {
      id: "rpt_002", 
      name: "Trading Activity Summary",
      type: "trading",
      description: "Detailed breakdown of all trading activities",
      lastGenerated: "2024-01-31T23:59:00Z",
      dataPoints: 892,
      format: "excel"
    },
    {
      id: "rpt_003",
      name: "Financial Statement",
      type: "financial",
      description: "Account balance and transaction history",
      lastGenerated: "2024-01-31T23:59:00Z",
      dataPoints: 456,
      format: "pdf"
    },
    {
      id: "rpt_004",
      name: "Risk Analysis Report",
      type: "activity",
      description: "Risk metrics and exposure analysis",
      lastGenerated: "2024-01-31T23:59:00Z",
      dataPoints: 324,
      format: "csv"
    }
  ]

  useEffect(() => {
    loadReportData()
  }, [dateRange, selectedAccount])

  const loadReportData = async () => {
    try {
      setIsLoading(true)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPerformanceData(mockPerformanceData)
    } catch (error) {
      console.error("Error loading report data:", error)
      toast.error("Failed to load report data")
    } finally {
      setIsLoading(false)
    }
  }

  const generateReport = async (reportId: string) => {
    try {
      setIsLoading(true)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Report generated successfully")
      
      // Mock download
      const link = document.createElement("a")
      link.href = "#"
      link.download = `report_${reportId}_${Date.now()}.pdf`
      link.click()
    } catch (error) {
      toast.error("Failed to generate report")
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = (format: string) => {
    toast.success(`Exporting data as ${format.toUpperCase()}`)
    // Mock export functionality
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "performance", name: "Performance", icon: TrendingUp },
    { id: "trading", name: "Trading Analysis", icon: Activity },
    { id: "reports", name: "Generate Reports", icon: Download }
  ]

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Reports & Analytics
                </h1>
                <p className="text-gray-600">Comprehensive trading performance analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={loadReportData}
                className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/80 transition-all duration-300 shadow-lg border border-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportData("pdf")}
                  className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </button>
                <button
                  onClick={() => exportData("excel")}
                  className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="input-field"
              >
                <option value="all">All Accounts</option>
                <option value="123456">Account #123456</option>
                <option value="789012">Account #789012</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={loadReportData}
                disabled={isLoading}
                className="btn-primary flex items-center w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-lg">
            <nav className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border border-green-500/30"
                      : "text-gray-600 hover:bg-gray-100/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Net Profit</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(metrics.totalProfit + metrics.totalLoss)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Win Rate</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPercentage(metrics.winRate)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Profit Factor</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {metrics.profitFactor.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Max Drawdown</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatPercentage(metrics.maxDrawdown)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Balance Trend */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance & Equity Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} name="Balance" />
                    <Line type="monotone" dataKey="equity" stroke="#10b981" strokeWidth={3} name="Equity" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Win/Loss Ratio */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Win/Loss Ratio</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={profitLossData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {profitLossData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value}%`, '']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  {profitLossData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="space-y-6">
            {/* Detailed Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Profit", value: formatCurrency(metrics.totalProfit), color: "green" },
                { label: "Total Loss", value: formatCurrency(metrics.totalLoss), color: "red" },
                { label: "Average Win", value: formatCurrency(metrics.averageWin), color: "blue" },
                { label: "Average Loss", value: formatCurrency(metrics.averageLoss), color: "orange" },
                { label: "Sharpe Ratio", value: metrics.sharpeRatio.toFixed(2), color: "purple" },
                { label: "Win Rate", value: formatPercentage(metrics.winRate), color: "indigo" },
                { label: "Profit Factor", value: metrics.profitFactor.toFixed(2), color: "teal" },
                { label: "Max Drawdown", value: formatPercentage(metrics.maxDrawdown), color: "pink" }
              ].map((metric, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                  <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                  <p className={`text-xl font-bold text-${metric.color}-600`}>{metric.value}</p>
                </div>
              ))}
            </div>

            {/* Profit/Loss Chart */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit & Loss Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Bar dataKey="profit" fill="#10b981" name="Profit" />
                  <Bar dataKey="loss" fill="#ef4444" name="Loss" />
                  <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} name="Balance" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "trading" && (
          <div className="space-y-6">
            {/* Trading Hours Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Hours Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tradingHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Bar dataKey="trades" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Volume Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="tradesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="trades" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      fill="url(#tradesGradient)" 
                      name="Number of Trades"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Symbol Performance */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Symbol Performance Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Symbol</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Trades</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">P&L</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Win Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {symbolPerformance.map((symbol, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-medium text-gray-900">{symbol.symbol}</td>
                        <td className="py-3 px-4 text-gray-600">{symbol.trades}</td>
                        <td className={`py-3 px-4 font-medium ${symbol.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(symbol.profit)}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{symbol.winRate}%</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${symbol.winRate >= 60 ? 'bg-green-500' : symbol.winRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${symbol.winRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">{symbol.winRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {monthlyReports.map((report) => (
                <div key={report.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.type === "performance" ? "bg-green-100 text-green-800" :
                      report.type === "trading" ? "bg-blue-100 text-blue-800" :
                      report.type === "financial" ? "bg-purple-100 text-purple-800" :
                      "bg-orange-100 text-orange-800"
                    }`}>
                      {report.type}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Generated:</span>
                      <span className="text-gray-900">{new Date(report.lastGenerated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Data Points:</span>
                      <span className="text-gray-900">{report.dataPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Format:</span>
                      <span className="text-gray-900 uppercase">{report.format}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => generateReport(report.id)}
                    disabled={isLoading}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Report Builder */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Report Builder</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Type
                  </label>
                  <select className="input-field">
                    <option>Performance Summary</option>
                    <option>Trading Details</option>
                    <option>Risk Analysis</option>
                    <option>Financial Statement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period
                  </label>
                  <select className="input-field">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Year to Date</option>
                    <option>Custom Range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <select className="input-field">
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                  </select>
                </div>
              </div>
              <button className="btn-primary flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Generate Custom Report
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}