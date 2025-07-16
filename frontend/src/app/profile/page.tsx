"use client"

import { useState, useEffect } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save,
  Camera,
  Shield,
  Award,
  Activity,
  TrendingUp,
  Wallet,
  Globe,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Star
} from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardLayout from "@/components/Layout/DashboardLayout"

interface UserProfile {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  
  // Address Information
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  
  // Trading Information
  tradingExperience: string
  riskTolerance: string
  investmentGoals: string
  annualIncome: string
  netWorth: string
  
  // Account Information
  accountType: string
  joinDate: string
  lastLogin: string
  timezone: string
  language: string
  
  // Profile Settings
  profilePicture: string
  bio: string
  website: string
  linkedIn: string
  
  // Verification Status
  emailVerified: boolean
  phoneVerified: boolean
  identityVerified: boolean
  addressVerified: boolean
}

interface AccountStats {
  totalDeposits: number
  totalWithdrawals: number
  totalTrades: number
  winRate: number
  currentBalance: number
  accountAge: number
  verificationLevel: number
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string>("")
  
  const [profile, setProfile] = useState<UserProfile>({
    // Personal Information
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    nationality: "United States",
    
    // Address Information
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    
    // Trading Information
    tradingExperience: "3-5 years",
    riskTolerance: "Moderate",
    investmentGoals: "Long-term growth",
    annualIncome: "$75,000 - $100,000",
    netWorth: "$50,000 - $100,000",
    
    // Account Information
    accountType: "Gold Account",
    joinDate: "2023-03-15T00:00:00Z",
    lastLogin: "2024-01-15T14:30:00Z",
    timezone: "EST",
    language: "English",
    
    // Profile Settings
    profilePicture: "",
    bio: "Experienced trader passionate about forex markets and financial technology.",
    website: "https://johndoe.com",
    linkedIn: "https://linkedin.com/in/johndoe",
    
    // Verification Status
    emailVerified: true,
    phoneVerified: true,
    identityVerified: true,
    addressVerified: false
  })

  const [accountStats] = useState<AccountStats>({
    totalDeposits: 45000,
    totalWithdrawals: 12500,
    totalTrades: 287,
    winRate: 68.5,
    currentBalance: 38750,
    accountAge: 315, // days
    verificationLevel: 85
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Profile data would be loaded from API
    } catch (error) {
      console.error("Error loading profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
        setProfile(prev => ({ ...prev, profilePicture: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
      toast.success("Profile picture updated")
    }
  }

  const saveProfile = async () => {
    setIsLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-orange-600" />
    )
  }

  const getVerificationText = (verified: boolean) => {
    return verified ? "Verified" : "Pending"
  }

  const getVerificationColor = (verified: boolean) => {
    return verified ? "text-green-600" : "text-orange-600"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const tabs = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "address", name: "Address", icon: MapPin },
    { id: "trading", name: "Trading Profile", icon: TrendingUp },
    { id: "account", name: "Account Details", icon: Shield },
    { id: "social", name: "Social & Bio", icon: Globe }
  ]

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-gray-600">Manage your personal information and preferences</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
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
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Overview Card */}
        <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                ) : (
                  `${profile.firstName[0]}${profile.lastName[0]}`
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {profile.accountType}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {profile.email}
                </span>
                <span className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {profile.phone}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member since {new Date(profile.joinDate).toLocaleDateString()}
                </span>
              </div>
              {profile.bio && (
                <p className="text-gray-700 text-sm">{profile.bio}</p>
              )}
            </div>

            {/* Verification Status */}
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-2">Verification Level</div>
              <div className="text-2xl font-bold text-green-600 mb-2">{accountStats.verificationLevel}%</div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${accountStats.verificationLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(accountStats.currentBalance)}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Trades</p>
                <p className="text-xl font-bold text-blue-600">{accountStats.totalTrades}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Win Rate</p>
                <p className="text-xl font-bold text-purple-600">{accountStats.winRate}%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Age</p>
                <p className="text-xl font-bold text-orange-600">{accountStats.accountAge} days</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
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
                        ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-700 border border-blue-500/30"
                        : "text-gray-600 hover:bg-gray-100/50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>

              {/* Verification Status */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Verification Status</h4>
                <div className="space-y-2">
                  {[
                    { label: "Email", verified: profile.emailVerified },
                    { label: "Phone", verified: profile.phoneVerified },
                    { label: "Identity", verified: profile.identityVerified },
                    { label: "Address", verified: profile.addressVerified }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.label}</span>
                      <div className="flex items-center space-x-1">
                        {getVerificationBadge(item.verified)}
                        <span className={`text-xs ${getVerificationColor(item.verified)}`}>
                          {getVerificationText(item.verified)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              
              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profile.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nationality
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        value={profile.nationality}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Address Information Tab */}
              {activeTab === "address" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Address Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profile.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={profile.state}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP/Postal Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={profile.zipCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={profile.country}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Trading Profile Tab */}
              {activeTab === "trading" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Trading Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trading Experience
                      </label>
                      <select
                        name="tradingExperience"
                        value={profile.tradingExperience}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      >
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5+ years">5+ years</option>
                        <option value="Professional">Professional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Risk Tolerance
                      </label>
                      <select
                        name="riskTolerance"
                        value={profile.riskTolerance}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      >
                        <option value="Conservative">Conservative</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Aggressive">Aggressive</option>
                        <option value="Very Aggressive">Very Aggressive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Investment Goals
                      </label>
                      <select
                        name="investmentGoals"
                        value={profile.investmentGoals}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      >
                        <option value="Income generation">Income generation</option>
                        <option value="Capital preservation">Capital preservation</option>
                        <option value="Long-term growth">Long-term growth</option>
                        <option value="Short-term gains">Short-term gains</option>
                        <option value="Speculation">Speculation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Annual Income
                      </label>
                      <select
                        name="annualIncome"
                        value={profile.annualIncome}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      >
                        <option value="Under $25,000">Under $25,000</option>
                        <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                        <option value="$50,000 - $75,000">$50,000 - $75,000</option>
                        <option value="$75,000 - $100,000">$75,000 - $100,000</option>
                        <option value="$100,000+">$100,000+</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Net Worth
                      </label>
                      <select
                        name="netWorth"
                        value={profile.netWorth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      >
                        <option value="Under $50,000">Under $50,000</option>
                        <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                        <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                        <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                        <option value="$500,000+">$500,000+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Details Tab */}
              {activeTab === "account" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Type
                      </label>
                      <input
                        type="text"
                        value={profile.accountType}
                        disabled
                        className="input-field bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Join Date
                      </label>
                      <input
                        type="text"
                        value={new Date(profile.joinDate).toLocaleDateString()}
                        disabled
                        className="input-field bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Login
                      </label>
                      <input
                        type="text"
                        value={new Date(profile.lastLogin).toLocaleString()}
                        disabled
                        className="input-field bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={profile.timezone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      >
                        <option value="EST">Eastern Time (EST)</option>
                        <option value="PST">Pacific Time (PST)</option>
                        <option value="GMT">Greenwich Mean Time (GMT)</option>
                        <option value="CET">Central European Time (CET)</option>
                        <option value="JST">Japan Standard Time (JST)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Language
                      </label>
                      <select
                        name="language"
                        value={profile.language}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Español</option>
                        <option value="French">Français</option>
                        <option value="German">Deutsch</option>
                        <option value="Japanese">日本語</option>
                        <option value="Chinese">中文</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Social & Bio Tab */}
              {activeTab === "social" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Social & Bio</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={4}
                        className="input-field"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={profile.website}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input-field"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          name="linkedIn"
                          value={profile.linkedIn}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="input-field"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
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