'use client'

import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrendingUp, FiUsers, FiDollarSign, FiBarChart2 } from 'react-icons/fi'
import AnimatedCard from './AnimatedCard'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function BusinessDashboard() {
  const [metrics, setMetrics] = useState({
    revenue: 150000,
    expenses: 75000,
    profit: 75000,
    growth: 12.5,
    customers: 1250,
    conversion: 3.2,
    churn: 1.8,
    arpu: 120,
  })

  const [timeRange, setTimeRange] = useState('6M')
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [120000, 135000, 140000, 145000, 150000, 155000],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: [70000, 72000, 73000, 74000, 75000, 76000],
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        tension: 0.4,
        fill: true,
      },
    ],
  })

  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
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
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value: string | number) => {
            if (typeof value === 'number') {
              return `$${value.toLocaleString()}`
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

  const handleTimeRangeChange = (range: string) => {
    try {
      setIsLoading(true)
      setTimeRange(range)
      const labels = {
        '1M': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        '3M': ['Jan', 'Feb', 'Mar'],
        '6M': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        '1Y': ['Q1', 'Q2', 'Q3', 'Q4'],
      }
      
      setTimeout(() => {
        setChartData(prev => ({
          ...prev,
          labels: labels[range as keyof typeof labels] || prev.labels,
        }))
        setIsLoading(false)
      }, 300)
    } catch (error) {
      console.error('Error changing time range:', error)
      setIsLoading(false)
    }
  }

  const metricCards = [
    {
      title: 'Revenue',
      value: metrics.revenue,
      icon: <FiDollarSign className="w-6 h-6" />,
      change: '+12.5%',
      changeColor: 'text-green-400',
    },
    {
      title: 'Customers',
      value: metrics.customers,
      icon: <FiUsers className="w-6 h-6" />,
      change: '+8.3%',
      changeColor: 'text-green-400',
    },
    {
      title: 'Growth',
      value: metrics.growth,
      icon: <FiTrendingUp className="w-6 h-6" />,
      change: '+2.1%',
      changeColor: 'text-green-400',
    },
    {
      title: 'Conversion',
      value: metrics.conversion,
      icon: <FiBarChart2 className="w-6 h-6" />,
      change: '+0.4%',
      changeColor: 'text-green-400',
    },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h3 className="text-lg font-light text-white">Business Overview</h3>
        <div className="flex space-x-2">
          {['1M', '3M', '6M', '1Y'].map((range) => (
            <motion.button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`minimal-button ${
                timeRange === range ? 'active' : ''
              }`}
            >
              {range}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {metricCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AnimatedCard>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-light text-gray-300">{card.title}</h3>
                    <p className="text-2xl font-light text-white mt-2">
                      {typeof card.value === 'number' && card.title !== 'Growth'
                        ? new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0
                          }).format(card.value)
                        : `${card.value}%`}
                    </p>
                    <p className={`text-xs ${card.changeColor} mt-1`}>{card.change}</p>
                  </div>
                  <div className="text-white/60">{card.icon}</div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AnimatedCard>
          <h3 className="text-lg font-light text-white mb-6">Financial Overview</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <Line data={chartData} options={options} />
          )}
        </AnimatedCard>
      </motion.div>
    </div>
  )
} 