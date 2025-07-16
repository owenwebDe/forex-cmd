"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  User, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  History, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Plus,
  Users,
  BarChart3,
  PiggyBank,
  Wallet,
  FileText,
  Shield
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "react-hot-toast"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Overview & Analytics" },
  { 
    name: "Account Management", 
    href: "/accounts", 
    icon: Wallet, 
    description: "MT5 Accounts",
    submenu: [
      { name: "Create Account", href: "/create-account", icon: Plus },
      { name: "Account List", href: "/accounts", icon: Users },
      { name: "Account Settings", href: "/account-settings", icon: Settings },
    ]
  },
  { 
    name: "Wallet", 
    href: "/wallet", 
    icon: CreditCard, 
    description: "Wallet Management",
    submenu: [
      { name: "My Wallet", href: "/wallet", icon: Wallet },
      { name: "Transfer Funds", href: "/wallet/transfer", icon: TrendingUp },
      { name: "Wallet History", href: "/wallet/history", icon: History },
    ]
  },
  { 
    name: "Transactions", 
    href: "/transactions", 
    icon: History, 
    description: "Financial History",
    submenu: [
      { name: "Deposit Funds", href: "/deposit", icon: PiggyBank },
      { name: "Withdraw Funds", href: "/withdraw", icon: TrendingDown },
      { name: "Transaction History", href: "/transactions", icon: History },
    ]
  },
  { name: "Reports", href: "/reports", icon: BarChart3, description: "Analytics & Reports" },
  { name: "Documents", href: "/documents", icon: FileText, description: "Account Documents" },
  { name: "Security", href: "/security", icon: Shield, description: "Account Security" },
  { name: "Profile", href: "/profile", icon: User, description: "Personal Information" },
  { name: "Settings", href: "/settings", icon: Settings, description: "App Settings" },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("user_token")
        if (!token) {
          router.push("/login")
          return
        }

        // You can add a user info endpoint to get current user data
        setLoading(false)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    apiClient.logout()
    toast.success("Logged out successfully")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? "" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent navigation={navigation} pathname={pathname} onLogout={handleLogout} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent navigation={navigation} pathname={pathname} onLogout={handleLogout} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ navigation, pathname, onLogout }: any) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700">
      {/* Logo Section */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">MT5 CRM</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.submenu && item.submenu.some((sub: any) => pathname === sub.href))
            const isExpanded = expandedItems.includes(item.name)

            return (
              <div key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={`w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive 
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30" 
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"}`} />
                        <div className="text-left">
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-slate-400 group-hover:text-slate-300">{item.description}</div>
                          )}
                        </div>
                      </div>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Submenu */}
                    <div className={`mt-1 space-y-1 transition-all duration-200 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      {item.submenu.map((subItem: any) => {
                        const isSubActive = pathname === subItem.href
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`group flex items-center pl-11 pr-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              isSubActive 
                                ? "bg-blue-500/30 text-white" 
                                : "text-slate-400 hover:bg-slate-700/30 hover:text-slate-200"
                            }`}
                          >
                            <subItem.icon className={`mr-2 h-4 w-4 ${isSubActive ? "text-blue-300" : "text-slate-500 group-hover:text-slate-400"}`} />
                            {subItem.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30" 
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                  >
                    <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"}`} />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-slate-400 group-hover:text-slate-300">{item.description}</div>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="flex-shrink-0 border-t border-slate-700 p-4">
          <div className="flex items-center space-x-3 mb-3 p-2 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Welcome Back</p>
              <p className="text-xs text-slate-400 truncate">Account Manager</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout} 
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 group"
          >
            <LogOut className="mr-3 h-4 w-4 text-slate-400 group-hover:text-red-400" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
