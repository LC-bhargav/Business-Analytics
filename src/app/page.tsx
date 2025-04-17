'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiPieChart, FiBarChart2, FiSettings, FiTarget, FiClock, FiUser, FiBell, FiCheckCircle, FiDollarSign } from 'react-icons/fi'
import BusinessDashboard from '@/components/BusinessDashboard'
import PortfolioManagement from '@/components/PortfolioManagement'
import DataVisualization from '@/components/DataVisualization'
import SearchFilter from '@/components/SearchFilter'
import ExportOptions from '@/components/ExportOptions'
import GoalTracker from '@/components/GoalTracker'
import TimeComparison from '@/components/TimeComparison'
import NotificationCenter from '@/components/NotificationCenter'
import SalesDashboard from '@/components/SalesDashboard'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({})
  const chartRef = useRef(null)
  
  // Data state with last refresh timestamp
  const [dashboardData, setDashboardData] = useState({
    lastRefreshed: new Date('2023-01-01T12:00:00'),
    isRefreshing: false,
    refreshCount: 0
  })
  
  // Update timestamp on client-side only after initial render
  useEffect(() => {
    setDashboardData(prev => ({
      ...prev,
      lastRefreshed: new Date()
    }))
  }, [])
  
  // Settings state
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    autoRefresh: false,
    dataCaching: true
  })
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    email: 'user@example.com',
    password: '********',
    isEditing: false,
    newEmail: '',
    newPassword: '',
    showSuccessMessage: false
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('businessAnalyticsSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
    
    const savedProfile = localStorage.getItem('businessAnalyticsProfile')
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setUserProfile(prev => ({
        ...prev,
        email: profile.email || prev.email,
        // Don't load actual password from storage for security reasons
      }))
    }
  }, [])
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('businessAnalyticsSettings', JSON.stringify(settings))
  }, [settings])
  
  // Toggle handler for settings
  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => {
      const newSettings = { ...prev, [setting]: !prev[setting] }
      return newSettings
    })
  }
  
  // Start editing profile
  const startEditingProfile = () => {
    setUserProfile(prev => ({
      ...prev,
      isEditing: true,
      newEmail: prev.email,
      newPassword: ''
    }))
  }
  
  // Cancel editing profile
  const cancelEditingProfile = () => {
    setUserProfile(prev => ({
      ...prev,
      isEditing: false,
      newEmail: '',
      newPassword: ''
    }))
  }
  
  // Update profile
  const updateProfile = () => {
    // Validate email
    if (userProfile.newEmail && !/\S+@\S+\.\S+/.test(userProfile.newEmail)) {
      alert('Please enter a valid email address')
      return
    }
    
    const updatedProfile = {
      ...userProfile,
      email: userProfile.newEmail || userProfile.email,
      password: userProfile.newPassword ? '********' : userProfile.password,
      isEditing: false,
      showSuccessMessage: true
    }
    
    setUserProfile(updatedProfile)
    
    // Save to localStorage (only email for demo, in a real app you would use secure authentication)
    localStorage.setItem('businessAnalyticsProfile', JSON.stringify({
      email: updatedProfile.email
    }))
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setUserProfile(prev => ({
        ...prev,
        showSuccessMessage: false
      }))
    }, 3000)
  }

  // Auto-refresh effect
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout

    if (settings.autoRefresh) {
      refreshInterval = setInterval(() => {
        // Simulate data refresh
        setDashboardData(prev => ({
          ...prev,
          isRefreshing: true
        }))
        
        // Simulate API call delay
        setTimeout(() => {
          setDashboardData(prev => ({
            lastRefreshed: new Date(),
            isRefreshing: false,
            refreshCount: prev.refreshCount + 1
          }))
          
          // If notifications are enabled, show a refresh notification
          if (settings.notifications && Math.random() > 0.5) {
            // In a real app, you would trigger a notification here
            console.log('Dashboard data refreshed')
          }
        }, 1000)
      }, 60000) // Refresh every minute
    }

    return () => {
      if (refreshInterval) clearInterval(refreshInterval)
    }
  }, [settings.autoRefresh, settings.notifications])

  // Manual refresh function
  const refreshData = () => {
    if (dashboardData.isRefreshing) return
    
    setDashboardData(prev => ({
      ...prev,
      isRefreshing: true
    }))
    
    // Simulate API call delay
    setTimeout(() => {
      setDashboardData(prev => ({
        lastRefreshed: new Date(),
        isRefreshing: false,
        refreshCount: prev.refreshCount + 1
      }))
    }, 1000)
  }

  const tabs = [
    { id: 'dashboard', label: 'Business Dashboard', icon: <FiTrendingUp /> },
    { id: 'sales', label: 'Sales Dashboard', icon: <FiDollarSign /> },
    { id: 'portfolio', label: 'Portfolio Management', icon: <FiPieChart /> },
    { id: 'visualization', label: 'Data Visualization', icon: <FiBarChart2 /> },
    { id: 'goals', label: 'Goal Tracker', icon: <FiTarget /> },
    { id: 'comparison', label: 'Time Comparison', icon: <FiClock /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // You would implement actual filtering logic here
  }

  const handleFilter = (filters: Record<string, boolean>) => {
    setActiveFilters(filters)
    // You would implement actual filtering logic here
  }

  const handleExport = (format: string, options?: any) => {
    // Implement actual export logic here
    console.log(`Exporting as ${format}`, options)
  }

  const filterOptions = [
    { id: 'revenue', label: 'Revenue Metrics' },
    { id: 'users', label: 'User Metrics' },
    { id: 'growth', label: 'Growth Metrics' },
    { id: 'portfolio', label: 'Portfolio Data' },
  ]

  // Mock data for exports
  const exportableData = {
    metrics: {
      revenue: 150000,
      expenses: 75000,
      profit: 75000,
      growth: 12.5,
    },
    timeframe: 'Last 30 days',
    generated: new Date().toISOString()
  }

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    // In a real app, this would navigate to relevant section or show details
    console.log('Notification clicked:', notification)
    
    // Example handling based on notification type
    if (notification.type === 'success' && notification.title.includes('Goal')) {
      setActiveTab('goals')
    } else if (notification.title.includes('Portfolio')) {
      setActiveTab('portfolio')
    }
  }

  // Filter options for different tabs
  const getSectionFilterOptions = (section: string) => {
    switch(section) {
      case 'sales':
        return [
          { id: 'revenue', label: 'Revenue Metrics' },
          { id: 'products', label: 'Product Data' },
          { id: 'regions', label: 'Regional Data' },
          { id: 'channels', label: 'Sales Channels' },
        ]
      case 'dashboard':
      case 'portfolio': 
      case 'visualization':
      default:
        return [
          { id: 'revenue', label: 'Revenue Metrics' },
          { id: 'users', label: 'User Metrics' },
          { id: 'growth', label: 'Growth Metrics' },
          { id: 'portfolio', label: 'Portfolio Data' },
        ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed left-0 top-0 h-full w-64 bg-gray-800/50 backdrop-blur-lg border-r border-gray-700/50 z-50"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Business Analytics</h1>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-8">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700/50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
          
          {/* Header with search and actions */}
          <div className="flex flex-col mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-light">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <span>Last updated: {dashboardData.lastRefreshed.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true})}</span>
                  {dashboardData.isRefreshing && (
                    <span className="ml-2 flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Refreshing...
                    </span>
                  )}
                  {!dashboardData.isRefreshing && (
                    <button 
                      onClick={refreshData}
                      className="ml-2 text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Refresh
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {settings.notifications && (
                  <NotificationCenter 
                    onNotificationClick={handleNotificationClick} 
                  />
                )}
                <ExportOptions 
                  onExport={handleExport}
                  exportableData={exportableData}
                  chartRef={chartRef}
                />
              </div>
            </div>
            
            {/* Search and filter */}
            {(activeTab === 'dashboard' || activeTab === 'portfolio' || activeTab === 'visualization' || activeTab === 'sales') && (
              <SearchFilter
                onSearch={handleSearch}
                onFilter={handleFilter}
                filterOptions={getSectionFilterOptions(activeTab)}
              />
            )}
          </div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && <BusinessDashboard />}
            {activeTab === 'portfolio' && <PortfolioManagement />}
            {activeTab === 'visualization' && <DataVisualization />}
            {activeTab === 'goals' && <GoalTracker />}
            {activeTab === 'comparison' && <TimeComparison />}
            {activeTab === 'sales' && <SalesDashboard />}
            {activeTab === 'settings' && (
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                
                {userProfile.showSuccessMessage && (
                  <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded-lg mb-6 flex items-center">
                    <FiCheckCircle className="mr-2" /> Profile updated successfully
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span>Dark Mode</span>
                      {settings.darkMode && (
                        <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Active</span>
                      )}
                    </div>
                    <button 
                      className={`w-12 h-6 ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-700'} rounded-full relative`}
                      onClick={() => toggleSetting('darkMode')}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                          settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                        }`} 
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span>Notifications</span>
                      {settings.notifications && (
                        <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Active</span>
                      )}
                    </div>
                    <button 
                      className={`w-12 h-6 ${settings.notifications ? 'bg-blue-600' : 'bg-gray-700'} rounded-full relative`}
                      onClick={() => toggleSetting('notifications')}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                          settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`} 
                      />
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-medium mb-4">Data Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <span>Auto-refresh</span>
                            {settings.autoRefresh && (
                              <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Active</span>
                            )}
                          </div>
                          {settings.autoRefresh && (
                            <p className="text-sm text-gray-400 mt-1">
                              Dashboard will refresh automatically every minute.
                              Total refreshes: {dashboardData.refreshCount}
                            </p>
                          )}
                        </div>
                        <button 
                          className={`w-12 h-6 ${settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-700'} rounded-full relative`}
                          onClick={() => toggleSetting('autoRefresh')}
                        >
                          <div 
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                              settings.autoRefresh ? 'translate-x-6' : 'translate-x-0.5'
                            }`} 
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span>Data Caching</span>
                          {settings.dataCaching && (
                            <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Active</span>
                          )}
                        </div>
                        <button 
                          className={`w-12 h-6 ${settings.dataCaching ? 'bg-blue-600' : 'bg-gray-700'} rounded-full relative`}
                          onClick={() => toggleSetting('dataCaching')}
                        >
                          <div 
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                              settings.dataCaching ? 'translate-x-6' : 'translate-x-0.5'
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FiUser className="mr-2" /> User Profile
                    </h3>
                    
                    {userProfile.isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm text-gray-400">Email</label>
                          <input
                            type="email"
                            value={userProfile.newEmail}
                            onChange={(e) => setUserProfile({...userProfile, newEmail: e.target.value})}
                            className="bg-gray-700/50 w-full rounded-lg px-4 py-2 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new email"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm text-gray-400">New Password</label>
                          <input
                            type="password"
                            value={userProfile.newPassword}
                            onChange={(e) => setUserProfile({...userProfile, newPassword: e.target.value})}
                            className="bg-gray-700/50 w-full rounded-lg px-4 py-2 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new password (leave blank to keep current)"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button 
                            onClick={updateProfile}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                          <button 
                            onClick={cancelEditingProfile}
                            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm text-gray-400">Email</label>
                          <div className="bg-gray-700/30 w-full rounded-lg px-4 py-2 text-white">
                            {userProfile.email}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm text-gray-400">Password</label>
                          <div className="bg-gray-700/30 w-full rounded-lg px-4 py-2 text-white">
                            {userProfile.password}
                          </div>
                        </div>
                        <button 
                          onClick={startEditingProfile}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Edit Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
