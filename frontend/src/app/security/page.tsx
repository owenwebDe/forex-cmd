"use client"

import { useState, useEffect } from "react"
import { 
  Shield, 
  Lock, 
  Key, 
  Smartphone, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wifi,
  MapPin,
  Monitor,
  RefreshCw,
  XCircle,
  Settings as SettingsIcon
} from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"

interface LoginSession {
  id: string
  device: string
  location: string
  ipAddress: string
  timestamp: string
  current: boolean
  browser: string
}

interface SecurityEvent {
  id: string
  type: "login" | "password_change" | "2fa_enabled" | "2fa_disabled" | "suspicious_activity"
  description: string
  timestamp: string
  location: string
  ipAddress: string
  status: "success" | "failed" | "warning"
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState<LoginSession[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    suspiciousActivityAlerts: true,
    sessionTimeout: 30
  })

  // Mock data
  const mockSessions: LoginSession[] = [
    {
      id: "session_1",
      device: "Windows PC",
      location: "New York, US",
      ipAddress: "192.168.1.100",
      timestamp: "2024-01-15T10:30:00Z",
      current: true,
      browser: "Chrome 120"
    },
    {
      id: "session_2", 
      device: "iPhone 15",
      location: "New York, US",
      ipAddress: "192.168.1.101",
      timestamp: "2024-01-14T15:20:00Z",
      current: false,
      browser: "Safari 17"
    },
    {
      id: "session_3",
      device: "MacBook Pro",
      location: "Los Angeles, US", 
      ipAddress: "10.0.0.50",
      timestamp: "2024-01-13T09:45:00Z",
      current: false,
      browser: "Firefox 121"
    }
  ]

  const mockSecurityEvents: SecurityEvent[] = [
    {
      id: "event_1",
      type: "login",
      description: "Successful login from new device",
      timestamp: "2024-01-15T10:30:00Z",
      location: "New York, US",
      ipAddress: "192.168.1.100",
      status: "success"
    },
    {
      id: "event_2",
      type: "password_change",
      description: "Password changed successfully",
      timestamp: "2024-01-12T14:22:00Z",
      location: "New York, US", 
      ipAddress: "192.168.1.100",
      status: "success"
    },
    {
      id: "event_3",
      type: "suspicious_activity",
      description: "Multiple failed login attempts",
      timestamp: "2024-01-10T03:15:00Z",
      location: "Unknown",
      ipAddress: "185.220.101.X",
      status: "warning"
    },
    {
      id: "event_4",
      type: "2fa_enabled",
      description: "Two-factor authentication enabled",
      timestamp: "2024-01-08T16:30:00Z",
      location: "New York, US",
      ipAddress: "192.168.1.100", 
      status: "success"
    }
  ]

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = async () => {
    try {
      setIsLoading(true)
      // Mock API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSessions(mockSessions)
      setSecurityEvents(mockSecurityEvents)
    } catch (error) {
      console.error("Error loading security data:", error)
      toast.error("Failed to load security data")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success("Password changed successfully")
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      toast.error("Failed to change password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle2FA = async () => {
    setIsLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSecuritySettings(prev => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled
      }))
      toast.success(`Two-factor authentication ${!securitySettings.twoFactorEnabled ? 'enabled' : 'disabled'}`)
    } catch (error) {
      toast.error("Failed to update 2FA settings")
    } finally {
      setIsLoading(false)
    }
  }

  const terminateSession = async (sessionId: string) => {
    if (sessions.find(s => s.id === sessionId)?.current) {
      toast.error("Cannot terminate current session")
      return
    }

    try {
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      toast.success("Session terminated successfully")
    } catch (error) {
      toast.error("Failed to terminate session")
    }
  }

  const getEventIcon = (type: string, status: string) => {
    if (status === "warning") {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    }
    
    switch (type) {
      case "login":
        return <Wifi className="w-4 h-4 text-blue-600" />
      case "password_change":
        return <Key className="w-4 h-4 text-green-600" />
      case "2fa_enabled":
      case "2fa_disabled":
        return <Smartphone className="w-4 h-4 text-purple-600" />
      case "suspicious_activity":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Shield className="w-4 h-4 text-gray-600" />
    }
  }

  const getSecurityScore = () => {
    let score = 0
    if (securitySettings.twoFactorEnabled) score += 40
    if (securitySettings.emailNotifications) score += 20
    if (securitySettings.loginAlerts) score += 20
    if (securitySettings.suspiciousActivityAlerts) score += 20
    return score
  }

  const tabs = [
    { id: "overview", name: "Security Overview", icon: Shield },
    { id: "password", name: "Password", icon: Lock },
    { id: "sessions", name: "Active Sessions", icon: Monitor },
    { id: "activity", name: "Security Activity", icon: Clock },
    { id: "settings", name: "Security Settings", icon: SettingsIcon }
  ]

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Account Security
              </h1>
              <p className="text-gray-600">Manage your account security and monitor activity</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 border border-red-500/30"
                        : "text-gray-600 hover:bg-gray-100/50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              
              {/* Security Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Overview</h2>
                  
                  {/* Security Score */}
                  <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Security Score</h3>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{getSecurityScore()}%</div>
                        <div className="text-sm text-gray-600">
                          {getSecurityScore() >= 80 ? "Excellent" : getSecurityScore() >= 60 ? "Good" : "Needs Improvement"}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${getSecurityScore()}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Security Status Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-white/50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Extra layer of security</p>
                        </div>
                        <div className="flex items-center">
                          {securitySettings.twoFactorEnabled ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          securitySettings.twoFactorEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 bg-white/50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Active Sessions</h4>
                          <p className="text-sm text-gray-600">Logged in devices</p>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {sessions.length}
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {sessions.filter(s => s.current).length} Current
                        </span>
                      </div>
                    </div>

                    <div className="p-6 bg-white/50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Recent Activity</h4>
                          <p className="text-sm text-gray-600">Security events</p>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {securityEvents.filter(e => 
                            new Date(e.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                          ).length}
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Last 7 days
                        </span>
                      </div>
                    </div>

                    <div className="p-6 bg-white/50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Password Strength</h4>
                          <p className="text-sm text-gray-600">Last changed</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">Strong</div>
                          <div className="text-xs text-gray-500">3 days ago</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => setActiveTab("password")}
                      className="p-4 text-left bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    >
                      <Lock className="w-6 h-6 mb-2" />
                      <div className="font-semibold">Change Password</div>
                      <div className="text-sm opacity-80">Update your password</div>
                    </button>

                    <button 
                      onClick={handleToggle2FA}
                      disabled={isLoading}
                      className="p-4 text-left bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
                    >
                      <Smartphone className="w-6 h-6 mb-2" />
                      <div className="font-semibold">
                        {securitySettings.twoFactorEnabled ? "Disable" : "Enable"} 2FA
                      </div>
                      <div className="text-sm opacity-80">Two-factor authentication</div>
                    </button>

                    <button 
                      onClick={() => setActiveTab("sessions")}
                      className="p-4 text-left bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
                    >
                      <Monitor className="w-6 h-6 mb-2" />
                      <div className="font-semibold">Manage Sessions</div>
                      <div className="text-sm opacity-80">View active devices</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === "password" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                  
                  <div className="max-w-md space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, currentPassword: e.target.value}))}
                          className="input-field pr-10"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, newPassword: e.target.value}))}
                          className="input-field pr-10"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, confirmPassword: e.target.value}))}
                          className="input-field pr-10"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Password Requirements</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• Include at least one number</li>
                        <li>• Include at least one special character</li>
                      </ul>
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                      className="btn-primary flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4 mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Active Sessions Tab */}
              {activeTab === "sessions" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
                    <button
                      onClick={loadSecurityData}
                      className="btn-secondary flex items-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                  </div>

                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="bg-white/50 rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <Monitor className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {session.device}
                                {session.current && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Current
                                  </span>
                                )}
                              </h4>
                              <p className="text-sm text-gray-600">{session.browser}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {session.location}
                                </span>
                                <span className="flex items-center">
                                  <Wifi className="w-3 h-3 mr-1" />
                                  {session.ipAddress}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(session.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          {!session.current && (
                            <button
                              onClick={() => terminateSession(session.id)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                              Terminate
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Activity Tab */}
              {activeTab === "activity" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Activity</h2>

                  <div className="space-y-4">
                    {securityEvents.map((event) => (
                      <div key={event.id} className="bg-white/50 rounded-xl p-6 border border-gray-200">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            {getEventIcon(event.type, event.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900">{event.description}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                event.status === "success" ? "bg-green-100 text-green-800" :
                                event.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {event.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(event.timestamp).toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {event.location}
                              </span>
                              <span className="flex items-center">
                                <Wifi className="w-3 h-3 mr-1" />
                                {event.ipAddress}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                  <div className="space-y-6">
                    <div className="bg-white/50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Require a verification code in addition to your password</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.twoFactorEnabled}
                            onChange={handleToggle2FA}
                            disabled={isLoading}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white/50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive security alerts via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.emailNotifications}
                            onChange={(e) => setSecuritySettings(prev => ({...prev, emailNotifications: e.target.checked}))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white/50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Login Alerts</h4>
                          <p className="text-sm text-gray-600">Get notified when someone signs into your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.loginAlerts}
                            onChange={(e) => setSecuritySettings(prev => ({...prev, loginAlerts: e.target.checked}))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white/50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Suspicious Activity Alerts</h4>
                          <p className="text-sm text-gray-600">Get alerted about unusual account activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.suspiciousActivityAlerts}
                            onChange={(e) => setSecuritySettings(prev => ({...prev, suspiciousActivityAlerts: e.target.checked}))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white/50 rounded-xl p-6 border border-gray-200">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Session Timeout</h4>
                        <p className="text-sm text-gray-600 mb-4">Automatically log out after period of inactivity</p>
                        <select
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings(prev => ({...prev, sessionTimeout: parseInt(e.target.value)}))}
                          className="input-field max-w-xs"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={120}>2 hours</option>
                          <option value={480}>8 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}