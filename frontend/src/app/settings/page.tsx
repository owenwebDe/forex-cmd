"use client"

import { useState, useEffect } from "react"
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Globe, 
  Palette, 
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"

interface AppSettings {
  // Appearance
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  currency: string
  dateFormat: string
  
  // Notifications
  desktopNotifications: boolean
  soundEnabled: boolean
  emailDigest: boolean
  weeklyReport: boolean
  marketAlerts: boolean
  
  // Trading
  defaultLeverage: number
  autoRefresh: boolean
  refreshInterval: number
  showBalance: boolean
  confirmOrders: boolean
  
  // Data & Privacy
  dataCollection: boolean
  analyticsOptOut: boolean
  crashReports: boolean
  
  // Performance
  animationsEnabled: boolean
  reducedMotion: boolean
  lazyLoading: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  const [settings, setSettings] = useState<AppSettings>({
    // Appearance
    theme: "light",
    language: "en",
    timezone: "UTC",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    
    // Notifications
    desktopNotifications: true,
    soundEnabled: true,
    emailDigest: false,
    weeklyReport: true,
    marketAlerts: true,
    
    // Trading
    defaultLeverage: 100,
    autoRefresh: true,
    refreshInterval: 30,
    showBalance: true,
    confirmOrders: true,
    
    // Data & Privacy
    dataCollection: true,
    analyticsOptOut: false,
    crashReports: true,
    
    // Performance
    animationsEnabled: true,
    reducedMotion: false,
    lazyLoading: true
  })

  const [originalSettings, setOriginalSettings] = useState<AppSettings>(settings)

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    // Check if settings have changed
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings))
  }, [settings, originalSettings])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Settings would normally be loaded from API
      setOriginalSettings(settings)
    } catch (error) {
      console.error("Error loading settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setOriginalSettings(settings)
      setHasChanges(false)
      toast.success("Settings saved successfully")
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  const resetSettings = () => {
    setSettings(originalSettings)
    setHasChanges(false)
    toast.success("Settings reset to last saved state")
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "mt5-crm-settings.json"
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Settings exported successfully")
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string)
        setSettings({ ...settings, ...importedSettings })
        toast.success("Settings imported successfully")
      } catch (error) {
        toast.error("Invalid settings file")
      }
    }
    reader.readAsText(file)
  }

  const tabs = [
    { id: "general", name: "General", icon: SettingsIcon },
    { id: "appearance", name: "Appearance", icon: Palette },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "trading", name: "Trading", icon: Monitor },
    { id: "privacy", name: "Privacy", icon: User },
    { id: "performance", name: "Performance", icon: Globe }
  ]

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "ja", name: "日本語" },
    { code: "zh", name: "中文" }
  ]

  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "EST", label: "Eastern Time (EST)" },
    { value: "PST", label: "Pacific Time (PST)" },
    { value: "GMT", label: "Greenwich Mean Time (GMT)" },
    { value: "JST", label: "Japan Standard Time (JST)" },
    { value: "CET", label: "Central European Time (CET)" }
  ]

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" }
  ]

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Application Settings
                </h1>
                <p className="text-gray-600">Customize your MT5 CRM experience</p>
              </div>
            </div>
            
            {hasChanges && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={resetSettings}
                  className="btn-secondary flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </button>
                <button
                  onClick={saveSettings}
                  disabled={isLoading}
                  className="btn-primary flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
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
                        ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-700 border border-purple-500/30"
                        : "text-gray-600 hover:bg-gray-100/50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>

              {/* Import/Export */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <button
                    onClick={exportSettings}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Settings
                  </button>
                  <label className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded-lg transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Settings
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              
              {/* General Tab */}
              {activeTab === "general" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange("language", e.target.value)}
                        className="input-field"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange("timezone", e.target.value)}
                        className="input-field"
                      >
                        {timezones.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleSettingChange("currency", e.target.value)}
                        className="input-field"
                      >
                        {currencies.map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.code} - {curr.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Format
                      </label>
                      <select
                        value={settings.dateFormat}
                        onChange={(e) => handleSettingChange("dateFormat", e.target.value)}
                        className="input-field"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        <option value="DD MMM YYYY">DD MMM YYYY</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Theme
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: "light", icon: Sun, label: "Light" },
                          { value: "dark", icon: Moon, label: "Dark" },
                          { value: "system", icon: Monitor, label: "System" }
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => handleSettingChange("theme", theme.value)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              settings.theme === theme.value
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <theme.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                            <div className="text-sm font-medium text-gray-900">{theme.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Animations</h4>
                          <p className="text-sm text-gray-600">Enable smooth animations</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.animationsEnabled}
                            onChange={(e) => handleSettingChange("animationsEnabled", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Reduced Motion</h4>
                          <p className="text-sm text-gray-600">Minimize animations for accessibility</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.reducedMotion}
                            onChange={(e) => handleSettingChange("reducedMotion", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { key: "desktopNotifications", title: "Desktop Notifications", desc: "Show browser notifications", icon: Bell },
                      { key: "soundEnabled", title: "Sound Notifications", desc: "Play sound for alerts", icon: Volume2 },
                      { key: "emailDigest", title: "Email Digest", desc: "Daily summary via email", icon: Bell },
                      { key: "weeklyReport", title: "Weekly Report", desc: "Account performance summary", icon: Bell },
                      { key: "marketAlerts", title: "Market Alerts", desc: "Important market movements", icon: Bell }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5 text-gray-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[item.key as keyof AppSettings] as boolean}
                            onChange={(e) => handleSettingChange(item.key as keyof AppSettings, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trading Tab */}
              {activeTab === "trading" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Trading Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Leverage
                        </label>
                        <select
                          value={settings.defaultLeverage}
                          onChange={(e) => handleSettingChange("defaultLeverage", parseInt(e.target.value))}
                          className="input-field"
                        >
                          <option value={10}>1:10</option>
                          <option value={50}>1:50</option>
                          <option value={100}>1:100</option>
                          <option value={200}>1:200</option>
                          <option value={300}>1:300</option>
                          <option value={400}>1:400</option>
                          <option value={500}>1:500</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Auto Refresh Interval (seconds)
                        </label>
                        <select
                          value={settings.refreshInterval}
                          onChange={(e) => handleSettingChange("refreshInterval", parseInt(e.target.value))}
                          className="input-field"
                          disabled={!settings.autoRefresh}
                        >
                          <option value={10}>10 seconds</option>
                          <option value={30}>30 seconds</option>
                          <option value={60}>1 minute</option>
                          <option value={300}>5 minutes</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: "autoRefresh", title: "Auto Refresh", desc: "Automatically update account data" },
                        { key: "showBalance", title: "Show Balance", desc: "Display account balance in header" },
                        { key: "confirmOrders", title: "Confirm Orders", desc: "Show confirmation dialog for trades" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings[item.key as keyof AppSettings] as boolean}
                              onChange={(e) => handleSettingChange(item.key as keyof AppSettings, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Data</h2>
                  
                  <div className="space-y-4">
                    {[
                      { key: "dataCollection", title: "Usage Data Collection", desc: "Help improve the platform by sharing usage data" },
                      { key: "crashReports", title: "Crash Reports", desc: "Automatically send crash reports to help fix issues" }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[item.key as keyof AppSettings] as boolean}
                            onChange={(e) => handleSettingChange(item.key as keyof AppSettings, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Analytics Opt-out</h4>
                        <p className="text-sm text-gray-600">Opt out of analytics tracking</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analyticsOptOut}
                          onChange={(e) => handleSettingChange("analyticsOptOut", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-red-800">Danger Zone</h4>
                          <p className="text-sm text-red-600">Permanently delete all your data</p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === "performance" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Lazy Loading</h4>
                        <p className="text-sm text-gray-600">Load images and content as needed to improve performance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.lazyLoading}
                          onChange={(e) => handleSettingChange("lazyLoading", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Performance Tips</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Enable lazy loading for better page load times</li>
                        <li>• Reduce animations if experiencing performance issues</li>
                        <li>• Use longer refresh intervals for better battery life on mobile</li>
                        <li>• Disable sound notifications to reduce resource usage</li>
                      </ul>
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