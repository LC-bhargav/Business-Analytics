'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiDownload, FiFileText, FiImage, FiClipboard, FiMail, FiShare2 } from 'react-icons/fi'

interface ExportOptionsProps {
  onExport: (format: string, options?: any) => void
  exportableData: any
  chartRef?: React.RefObject<any>
}

export default function ExportOptions({ onExport, exportableData, chartRef }: ExportOptionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState('pdf')
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const handleExport = (format: string) => {
    try {
      onExport(format, { includeTimestamp: true })
      
      // For demo, show feedback
      setFeedbackMessage(`Successfully exported as ${format.toUpperCase()}`)
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
      
      // If it's an image type and we have a chart reference
      if (format === 'png' && chartRef?.current) {
        const link = document.createElement('a')
        link.download = `chart-export-${new Date().toISOString()}.png`
        link.href = chartRef.current.toBase64Image()
        link.click()
      }
      
      setIsOpen(false)
    } catch (error) {
      setFeedbackMessage('Export failed. Please try again.')
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
    }
  }

  const copyToClipboard = () => {
    try {
      const jsonStr = JSON.stringify(exportableData, null, 2)
      navigator.clipboard.writeText(jsonStr)
      
      setFeedbackMessage('Data copied to clipboard')
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
      
      setIsOpen(false)
    } catch (error) {
      setFeedbackMessage('Failed to copy data')
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
    }
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="minimal-button flex items-center"
      >
        <FiDownload className="mr-2" />
        Export
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg border border-gray-700/50 shadow-lg z-10"
          >
            <div className="p-3 border-b border-gray-700/50">
              <h3 className="text-sm font-medium text-white">Export Options</h3>
            </div>
            <div className="p-2">
              <button
                onClick={() => handleExport('csv')}
                className="w-full text-left p-2 flex items-center space-x-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FiFileText className="text-gray-400" />
                <span className="text-sm text-gray-200">Export as CSV</span>
              </button>
              
              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left p-2 flex items-center space-x-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FiFileText className="text-gray-400" />
                <span className="text-sm text-gray-200">Export as PDF</span>
              </button>
              
              <button
                onClick={() => handleExport('png')}
                className="w-full text-left p-2 flex items-center space-x-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FiImage className="text-gray-400" />
                <span className="text-sm text-gray-200">Export as Image</span>
              </button>
              
              <button
                onClick={copyToClipboard}
                className="w-full text-left p-2 flex items-center space-x-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FiClipboard className="text-gray-400" />
                <span className="text-sm text-gray-200">Copy to Clipboard</span>
              </button>
              
              <div className="border-t border-gray-700/50 my-2"></div>
              
              <button
                onClick={() => {
                  setFeedbackMessage('Share functionality will be added soon')
                  setShowFeedback(true)
                  setTimeout(() => setShowFeedback(false), 3000)
                }}
                className="w-full text-left p-2 flex items-center space-x-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FiShare2 className="text-gray-400" />
                <span className="text-sm text-gray-200">Share Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  setFeedbackMessage('Email functionality will be added soon')
                  setShowFeedback(true)
                  setTimeout(() => setShowFeedback(false), 3000)
                }}
                className="w-full text-left p-2 flex items-center space-x-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FiMail className="text-gray-400" />
                <span className="text-sm text-gray-200">Email Report</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 z-50"
          >
            {feedbackMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 