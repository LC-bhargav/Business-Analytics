'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import { FiChevronDown, FiChevronUp, FiCalendar, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

interface TimeComparisonProps {
  initialMetrics?: {
    current: {
      label: string;
      data: number[];
    };
    previous: {
      label: string;
      data: number[];
    };
    timeLabels: string[];
  }
}

export default function TimeComparison({ 
  initialMetrics = {
    current: {
      label: 'Current Month',
      data: [150000, 155000, 162000, 168000, 172000, 178000, 185000],
    },
    previous: {
      label: 'Previous Month',
      data: [140000, 142000, 145000, 150000, 153000, 158000, 165000],
    },
    timeLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
  }
}: TimeComparisonProps) {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [comparisonMode, setComparisonMode] = useState<'month' | 'quarter' | 'year'>('month')
  const [showDetails, setShowDetails] = useState(false)
  
  const getComparisonData = (mode: 'month' | 'quarter' | 'year') => {
    // This would normally fetch from an API
    // For demo, we'll just simulate different data based on mode
    switch (mode) {
      case 'quarter':
        return {
          current: {
            label: 'Current Quarter',
            data: [450000, 480000, 510000],
          },
          previous: {
            label: 'Previous Quarter',
            data: [420000, 430000, 445000],
          },
          timeLabels: ['Month 1', 'Month 2', 'Month 3'],
        }
      case 'year':
        return {
          current: {
            label: 'Current Year',
            data: [1800000, 1900000, 2000000, 2100000],
          },
          previous: {
            label: 'Previous Year',
            data: [1600000, 1650000, 1700000, 1750000],
          },
          timeLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
        }
      default:
        return initialMetrics
    }
  }
  
  const handleModeChange = (mode: 'month' | 'quarter' | 'year') => {
    setComparisonMode(mode)
    setMetrics(getComparisonData(mode))
  }
  
  const chartData = {
    labels: metrics.timeLabels,
    datasets: [
      {
        label: metrics.current.label,
        data: metrics.current.data,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: metrics.previous.label,
        data: metrics.previous.data,
        borderColor: 'rgba(156, 163, 175, 1)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const value = context.raw as number
            return `${context.dataset.label}: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(value)}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value: any) => {
            if (typeof value === 'number') {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
              }).format(value)
            }
            return value
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
  }
  
  // Calculate period-over-period changes
  const calculateChanges = () => {
    const current = metrics.current.data
    const previous = metrics.previous.data
    
    // Calculate overall change
    const currentTotal = current.reduce((sum, val) => sum + val, 0)
    const previousTotal = previous.reduce((sum, val) => sum + val, 0)
    const overallChange = ((currentTotal - previousTotal) / previousTotal) * 100
    
    // Calculate point-by-point changes
    const pointChanges = current.map((val, index) => {
      if (index < previous.length) {
        return ((val - previous[index]) / previous[index]) * 100
      }
      return 0
    })
    
    return {
      overall: overallChange,
      points: pointChanges,
    }
  }
  
  const changes = calculateChanges()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-light text-white">Time Comparison</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleModeChange('month')}
            className={`minimal-button ${comparisonMode === 'month' ? 'bg-blue-600' : ''}`}
          >
            Monthly
          </button>
          <button
            onClick={() => handleModeChange('quarter')}
            className={`minimal-button ${comparisonMode === 'quarter' ? 'bg-blue-600' : ''}`}
          >
            Quarterly
          </button>
          <button
            onClick={() => handleModeChange('year')}
            className={`minimal-button ${comparisonMode === 'year' ? 'bg-blue-600' : ''}`}
          >
            Yearly
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-gray-400" />
            <h4 className="text-lg font-medium text-white">
              {metrics.current.label} vs {metrics.previous.label}
            </h4>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Overall Change:</span>
            <div className={`flex items-center ${changes.overall >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {changes.overall >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
              <span className="font-medium">{Math.abs(changes.overall).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <Line data={chartData} options={options} />
        
        <div className="mt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showDetails ? (
              <>
                <FiChevronUp className="mr-1" />
                Hide Details
              </>
            ) : (
              <>
                <FiChevronDown className="mr-1" />
                Show Details
              </>
            )}
          </button>
          
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 border-t border-gray-700/50 pt-4"
            >
              <h5 className="text-sm font-medium text-white mb-3">Period-over-Period Analysis</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h6 className="text-sm text-gray-400 mb-1">Total {metrics.current.label}</h6>
                  <p className="text-xl font-medium text-white">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0
                    }).format(metrics.current.data.reduce((sum, val) => sum + val, 0))}
                  </p>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h6 className="text-sm text-gray-400 mb-1">Total {metrics.previous.label}</h6>
                  <p className="text-xl font-medium text-white">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0
                    }).format(metrics.previous.data.reduce((sum, val) => sum + val, 0))}
                  </p>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h6 className="text-sm text-gray-400 mb-1">Overall Growth</h6>
                  <div className={`text-xl font-medium flex items-center ${changes.overall >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {changes.overall >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                    <span>{Math.abs(changes.overall).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h5 className="text-sm font-medium text-white mb-3">Point-by-Point Changes</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {changes.points.map((change, index) => (
                    <div key={index} className="bg-gray-700/20 rounded-lg p-2">
                      <h6 className="text-xs text-gray-400">{metrics.timeLabels[index]}</h6>
                      <div className={`text-sm font-medium flex items-center ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {change >= 0 ? <FiTrendingUp className="mr-1 w-3 h-3" /> : <FiTrendingDown className="mr-1 w-3 h-3" />}
                        <span>{Math.abs(change).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 