'use client'

import { useState } from 'react'
import { Pie, Line } from 'react-chartjs-2'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrendingUp, FiDollarSign, FiPieChart, FiBarChart2 } from 'react-icons/fi'
import AnimatedCard from './AnimatedCard'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

export default function PortfolioManagement() {
  const [portfolio, setPortfolio] = useState({
    totalValue: 250000,
    stocks: 150000,
    bonds: 50000,
    crypto: 30000,
    cash: 20000,
    performance: {
      '1D': 2.5,
      '1W': 5.8,
      '1M': 12.3,
      '1Y': 28.7,
    },
  })

  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1Y')
  const [isLoading, setIsLoading] = useState(false)

  const pieData = {
    labels: ['Stocks', 'Bonds', 'Crypto', 'Cash'],
    datasets: [
      {
        data: [
          portfolio.stocks,
          portfolio.bonds,
          portfolio.crypto,
          portfolio.cash,
        ],
        backgroundColor: [
          'rgba(255, 255, 255, 0.8)',
          'rgba(255, 255, 255, 0.6)',
          'rgba(255, 255, 255, 0.4)',
          'rgba(255, 255, 255, 0.2)',
        ],
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    ],
  }

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [200000, 210000, 215000, 220000, 225000, 230000, 235000, 240000, 245000, 248000, 249000, 250000],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.raw as number
            const percentage = ((value / portfolio.totalValue) * 100).toFixed(1)
            return `${label}: $${value.toLocaleString()} (${percentage}%)`
          },
        },
      },
    },
  }

  const performanceOptions: ChartOptions<'line'> = {
    responsive: true,
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
        callbacks: {
          label: (context) => {
            const value = context.raw as number
            return `$${value.toLocaleString()}`
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value) => `$${value.toLocaleString()}`,
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

  const assetCards = [
    {
      title: 'Stocks',
      value: portfolio.stocks,
      icon: <FiTrendingUp className="w-6 h-6" />,
      percentage: ((portfolio.stocks / portfolio.totalValue) * 100).toFixed(1),
    },
    {
      title: 'Bonds',
      value: portfolio.bonds,
      icon: <FiDollarSign className="w-6 h-6" />,
      percentage: ((portfolio.bonds / portfolio.totalValue) * 100).toFixed(1),
    },
    {
      title: 'Crypto',
      value: portfolio.crypto,
      icon: <FiPieChart className="w-6 h-6" />,
      percentage: ((portfolio.crypto / portfolio.totalValue) * 100).toFixed(1),
    },
    {
      title: 'Cash',
      value: portfolio.cash,
      icon: <FiBarChart2 className="w-6 h-6" />,
      percentage: ((portfolio.cash / portfolio.totalValue) * 100).toFixed(1),
    },
  ]

  const handleTimeRangeChange = (range: '1D' | '1W' | '1M' | '1Y') => {
    setIsLoading(true);
    setTimeRange(range);
    
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h3 className="text-lg font-light text-white">Portfolio Overview</h3>
        <div className="flex space-x-2">
          {['1D', '1W', '1M', '1Y'].map((range) => (
            <motion.button
              key={range}
              onClick={() => handleTimeRangeChange(range as '1D' | '1W' | '1M' | '1Y')}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <AnimatedCard isLoading={isLoading}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-light text-gray-300">Total Value</h3>
              <p className="text-2xl font-light text-white mt-2">
                ${portfolio.totalValue.toLocaleString()}
              </p>
              <p className="text-xs text-green-400 mt-1">
                +{portfolio.performance[timeRange]}% this {timeRange}
              </p>
            </div>
            <div className="text-white/60">
              <FiDollarSign className="w-8 h-8" />
            </div>
          </div>
        </AnimatedCard>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {assetCards.map((card, index) => (
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
                      <p className="text-xl font-light text-white mt-2">
                        ${card.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{card.percentage}%</p>
                    </div>
                    <div className="text-white/60">{card.icon}</div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="h-64 flex items-center justify-center"
        >
          <AnimatedCard className="w-full h-full">
            <Pie data={pieData} options={options} />
          </AnimatedCard>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AnimatedCard isLoading={isLoading}>
          <h3 className="text-lg font-light text-white mb-6">Performance</h3>
          <Line data={performanceData} options={performanceOptions} />
        </AnimatedCard>
      </motion.div>
    </div>
  )
} 