'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { FiDownload, FiRefreshCw, FiPlus, FiMinus, FiEdit2, FiSun, FiMoon } from 'react-icons/fi'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface MetricData {
  current: number[];
  previous: number[];
}

interface Metrics {
  [key: string]: MetricData;
}

export default function DataVisualization() {
  const [timeRange, setTimeRange] = useState('month')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [editIndex, setEditIndex] = useState(-1)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const chartRef = useRef<any>(null)

  const [metricsData, setMetricsData] = useState<Metrics>({
    revenue: {
      current: [1200, 1500, 1800, 2000],
      previous: [1000, 1300, 1600, 1900],
    },
    expenses: {
      current: [800, 900, 1000, 1100],
      previous: [700, 800, 900, 1000],
    },
    profit: {
      current: [400, 600, 800, 900],
      previous: [300, 500, 700, 900],
    },
    growth: {
      current: [5, 8, 12, 15],
      previous: [3, 6, 9, 12],
    },
  })

  const metrics = [
    { id: 'revenue', label: 'Revenue', unit: '$' },
    { id: 'expenses', label: 'Expenses', unit: '$' },
    { id: 'profit', label: 'Profit', unit: '$' },
    { id: 'growth', label: 'Growth', unit: '%' },
  ]

  const generateData = () => {
    const labels = timeRange === 'month' 
      ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

    const currentData = metricsData[selectedMetric].current
    const previousData = metricsData[selectedMetric].previous

    return {
      labels,
      datasets: [
        {
          label: 'Current Period',
          data: currentData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4,
        },
        {
          label: 'Previous Period',
          data: previousData,
          borderColor: 'rgb(156, 163, 175)',
          backgroundColor: 'rgba(156, 163, 175, 0.5)',
          tension: 0.4,
        },
      ],
    }
  }

  const [chartData, setChartData] = useState(generateData())

  const handleAddData = () => {
    const newData = [...metricsData[selectedMetric].current]
    const lastValue = newData[newData.length - 1]
    newData.push(lastValue + (Math.random() * 200 - 100))
    setMetricsData({
      ...metricsData,
      [selectedMetric]: {
        ...metricsData[selectedMetric],
        current: newData,
      },
    })
  }

  const handleRemoveData = () => {
    const newData = [...metricsData[selectedMetric].current]
    if (newData.length > 1) {
      newData.pop()
      setMetricsData({
        ...metricsData,
        [selectedMetric]: {
          ...metricsData[selectedMetric],
          current: newData,
        },
      })
    }
  }

  const handleEditData = (index: number) => {
    setEditIndex(index)
    setEditValue(metricsData[selectedMetric].current[index].toString())
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (editIndex !== -1) {
      const newData = [...metricsData[selectedMetric].current]
      newData[editIndex] = parseFloat(editValue) || 0
      setMetricsData({
        ...metricsData,
        [selectedMetric]: {
          ...metricsData[selectedMetric],
          current: newData,
        },
      })
    }
    setIsEditing(false)
    setEditIndex(-1)
  }

  const handleDownload = () => {
    if (chartRef.current) {
      try {
        const link = document.createElement('a')
        link.download = `${selectedMetric}-chart.png`
        link.href = chartRef.current.toBase64Image()
        link.click()
      } catch (error) {
        console.error('Error downloading chart:', error)
      }
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      const newData = metricsData[selectedMetric].current.map(value => 
        value + (Math.random() * 200 - 100)
      )
      setMetricsData({
        ...metricsData,
        [selectedMetric]: {
          ...metricsData[selectedMetric],
          current: newData,
        },
      })
      setIsLoading(false)
    }, 1000)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  useEffect(() => {
    setChartData(generateData())
  }, [selectedMetric, timeRange, metricsData])

  const pieData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
    },
  }

  return (
    <div className={`space-y-6 ${isDarkMode ? 'dark' : ''}`}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedMetric === metric.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setTimeRange(timeRange === 'month' ? 'quarter' : 'month')}
            className="px-4 py-2 bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-700"
          >
            {timeRange === 'month' ? 'Monthly' : 'Quarterly'}
          </button>
          <button
            onClick={handleAddData}
            className="p-2 bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-700"
          >
            <FiPlus className="w-5 h-5" />
          </button>
          <button
            onClick={handleRemoveData}
            className="p-2 bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-700"
          >
            <FiMinus className="w-5 h-5" />
          </button>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-700"
          >
            <FiDownload className="w-5 h-5" />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-700"
          >
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Data Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData[selectedMetric].current.map((value, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-400">
                {timeRange === 'month' ? `Week ${index + 1}` : `Month ${index + 1}`}
              </p>
              <p className="text-xl font-semibold">
                {metrics.find(m => m.id === selectedMetric)?.unit}
                {value.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleEditData(index)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Value</h3>
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white mb-4"
              placeholder="Enter new value"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Trend Analysis</h3>
          <Line ref={chartRef} data={chartData} options={options} />
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
          <Bar data={chartData} options={options} />
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Product Distribution</h3>
          <Pie data={pieData} options={options} />
        </motion.div>

        {/* Metrics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Revenue', value: '$125,000', change: '+12%' },
              { label: 'Average Order', value: '$450', change: '+5%' },
              { label: 'Conversion Rate', value: '3.2%', change: '+0.8%' },
              { label: 'Customer Growth', value: '1,250', change: '+15%' },
            ].map((metric) => (
              <div
                key={metric.label}
                className="p-4 bg-gray-700/30 rounded-lg"
              >
                <p className="text-sm text-gray-400">{metric.label}</p>
                <p className="text-xl font-semibold mt-1">{metric.value}</p>
                <p className="text-sm text-green-400 mt-1">{metric.change}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 