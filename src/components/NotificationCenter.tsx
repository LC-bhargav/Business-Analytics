'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBell, FiX, FiCheckCircle, FiAlertTriangle, FiInfo, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'alert'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void
}

export default function NotificationCenter({ onNotificationClick }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Simulate receiving notifications
  useEffect(() => {
    const notificationTypes = ['success', 'warning', 'info', 'alert']
    const titles = [
      'Performance Alert', 
      'Portfolio Update', 
      'Analytics Refresh',
      'Goal Achieved',
      'Revenue Increase',
      'New Data Available'
    ]
    
    // Initial notifications
    setNotifications([
      {
        id: '1',
        type: 'info',
        title: 'Welcome to Business Analytics',
        message: 'Your dashboard is ready with the latest metrics.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: false
      },
      {
        id: '2',
        type: 'success',
        title: 'Monthly Goal Achieved',
        message: 'Your team has achieved the monthly revenue target of $100,000.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        read: false
      }
    ])

    // Add random notifications periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new notification
        const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)] as 'success' | 'warning' | 'info' | 'alert'
        const title = titles[Math.floor(Math.random() * titles.length)]
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type,
          title,
          message: generateMessage(type, title),
          timestamp: new Date(),
          read: false
        }
        
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 30000) // Check every 30 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  // Update unread count whenever notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  const generateMessage = (type: string, title: string) => {
    switch (type) {
      case 'success':
        return `Great progress! ${title} has been successfully completed.`
      case 'warning':
        return `Attention needed: There's an issue with ${title.toLowerCase()}.`
      case 'info':
        return `Just to inform you about updates to ${title.toLowerCase()}.`
      case 'alert':
        return `Important: Please review ${title.toLowerCase()} immediately.`
      default:
        return `Update regarding ${title.toLowerCase()}.`
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    )
    
    // Call the callback
    if (onNotificationClick) {
      onNotificationClick(notification)
    }
  }

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(prevNotifications => 
      prevNotifications.filter(n => n.id !== id)
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-green-400" />
      case 'warning':
        return <FiAlertTriangle className="text-yellow-400" />
      case 'info':
        return <FiInfo className="text-blue-400" />
      case 'alert':
        return <FiTrendingDown className="text-red-400" />
      default:
        return <FiTrendingUp className="text-blue-400" />
    }
  }

  const getTimeAgo = (timestamp: Date) => {
    // For consistent SSR/client rendering, use a stable calculation
    // Skip dynamic time difference calculations during SSR
    if (typeof window === 'undefined') {
      return '1m ago'; // Stable fallback for SSR
    }
    
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50 z-50"
          >
            <div className="p-4 border-b border-gray-700/50 flex justify-between items-center sticky top-0 bg-gray-800/90 backdrop-blur-lg z-10">
              <h3 className="font-bold">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="divide-y divide-gray-700/50">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-700/30 cursor-pointer transition-colors flex ${
                      !notification.read ? 'bg-gray-700/20' : ''
                    }`}
                  >
                    <div className="mr-3 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{notification.title}</h4>
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="text-gray-500 hover:text-gray-300 p-1"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                      <span className="text-xs text-gray-400 mt-2 block">
                        {getTimeAgo(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No notifications
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 