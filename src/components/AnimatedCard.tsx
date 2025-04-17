'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  isLoading?: boolean
}

export default function AnimatedCard({ 
  children, 
  className = '', 
  isLoading = false 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      className={`glass-panel rounded-lg p-6 ${className} ${isLoading ? 'relative opacity-80' : ''}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-lg">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
      {children}
    </motion.div>
  )
} 