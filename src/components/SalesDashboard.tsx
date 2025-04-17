'use client'

import { useState, useRef, useEffect } from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  ArcElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js'
import { motion } from 'framer-motion'
import { 
  FiDollarSign, 
  FiUsers, 
  FiShoppingBag, 
  FiBarChart2, 
  FiCalendar, 
  FiFilter, 
  FiRefreshCw, 
  FiTrendingUp, 
  FiTrendingDown 
} from 'react-icons/fi'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Types
interface SalesData {
  totalRevenue: number
  totalSales: number
  avgOrderValue: number
  conversionRate: number
  monthlySales: {
    month: string
    revenue: number
    orders: number
  }[]
  productPerformance: {
    name: string
    sales: number
    revenue: number
  }[]
  salesByChannel: {
    channel: string
    value: number
  }[]
  salesByRegion: {
    region: string
    value: number
  }[]
  topSellingProducts: {
    name: string
    units: number
    revenue: number
    growth: number
  }[]
  revenueByCategory: {
    category: string
    value: number
    growth: number
  }[]
}

interface SalesDashboardProps {
  initialData?: SalesData
}

export default function SalesDashboard({ initialData }: SalesDashboardProps) {
  // Filter states
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | '90days' | 'year'>('30days')
  const [productCategory, setProductCategory] = useState<string>('all')
  const [salesChannel, setSalesChannel] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  
  // Chart refs
  const revenueChartRef = useRef(null)
  const productChartRef = useRef(null)
  
  // Sample data - would be replaced with actual API data
  const [salesData, setSalesData] = useState<SalesData>({
    totalRevenue: 1825450,
    totalSales: 12342,
    avgOrderValue: 148,
    conversionRate: 3.2,
    monthlySales: [
      { month: 'Jan', revenue: 125000, orders: 840 },
      { month: 'Feb', revenue: 140000, orders: 952 },
      { month: 'Mar', revenue: 150000, orders: 1023 },
      { month: 'Apr', revenue: 175000, orders: 1142 },
      { month: 'May', revenue: 185000, orders: 1276 },
      { month: 'Jun', revenue: 190000, orders: 1321 },
      { month: 'Jul', revenue: 195000, orders: 1362 },
      { month: 'Aug', revenue: 210000, orders: 1425 },
      { month: 'Sep', revenue: 215000, orders: 1476 },
      { month: 'Oct', revenue: 230000, orders: 1525 },
      { month: 'Nov', revenue: 0, orders: 0 }, // Current month (partial)
      { month: 'Dec', revenue: 0, orders: 0 }  // Future month
    ],
    productPerformance: [
      { name: 'Electronics', sales: 4270, revenue: 625450 },
      { name: 'Clothing', sales: 3850, revenue: 410350 },
      { name: 'Home Goods', sales: 2120, revenue: 325750 },
      { name: 'Beauty', sales: 1740, revenue: 275300 },
      { name: 'Sports', sales: 910, revenue: 188600 }
    ],
    salesByChannel: [
      { channel: 'Online Store', value: 1095270 },
      { channel: 'Marketplace', value: 456360 },
      { channel: 'Retail Stores', value: 192370 },
      { channel: 'Social Media', value: 82450 }
    ],
    salesByRegion: [
      { region: 'North America', value: 840250 },
      { region: 'Europe', value: 520700 },
      { region: 'Asia', value: 325000 },
      { region: 'Australia', value: 92300 },
      { region: 'Other', value: 47200 }
    ],
    topSellingProducts: [
      { name: 'Smartphone Pro Max', units: 1240, revenue: 124000, growth: 12.5 },
      { name: 'Wireless Earbuds', units: 980, revenue: 58800, growth: 8.2 },
      { name: 'Designer Handbag', units: 750, revenue: 93750, growth: -2.1 },
      { name: 'Smart Watch Series 5', units: 620, revenue: 74400, growth: 15.3 },
      { name: 'Kitchen Mixer Pro', units: 540, revenue: 86400, growth: 4.7 }
    ],
    revenueByCategory: [
      { category: 'Electronics', value: 625450, growth: 8.7 },
      { category: 'Clothing', value: 410350, growth: 3.2 },
      { category: 'Home Goods', value: 325750, growth: 5.8 },
      { category: 'Beauty', value: 275300, growth: 9.3 },
      { category: 'Sports', value: 188600, growth: -1.2 }
    ]
  })
  
  // Filter options
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'home', label: 'Home Goods' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'sports', label: 'Sports' }
  ]
  
  const channelOptions = [
    { value: 'all', label: 'All Channels' },
    { value: 'online', label: 'Online Store' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'retail', label: 'Retail Stores' },
    { value: 'social', label: 'Social Media' }
  ]
  
  // Simulate data loading when filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // In a real application, this would be an API call with the filters
      // For now, we'll just use slight variations of our sample data
      
      // Apply a random adjustment factor based on selected filters
      const adjustmentFactor = 0.85 + (Math.random() * 0.3)
      
      setSalesData(prevData => ({
        ...prevData,
        totalRevenue: Math.round(prevData.totalRevenue * adjustmentFactor),
        totalSales: Math.round(prevData.totalSales * adjustmentFactor),
        avgOrderValue: Math.round(prevData.avgOrderValue * (1 + (adjustmentFactor - 1) / 2)),
        conversionRate: +(prevData.conversionRate * (1 + (adjustmentFactor - 1) / 3)).toFixed(1),
        monthlySales: prevData.monthlySales.map(month => ({
          ...month,
          revenue: Math.round(month.revenue * (0.9 + Math.random() * 0.2)),
          orders: Math.round(month.orders * (0.9 + Math.random() * 0.2))
        })),
        // Other data would be similarly adjusted in a real implementation
      }))
      
      setIsLoading(false)
    }
    
    fetchData()
  }, [dateRange, productCategory, salesChannel])
  
  // Revenue chart configuration
  const revenueChartData = {
    labels: salesData.monthlySales.map(item => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: salesData.monthlySales.map(item => item.revenue),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Orders',
        data: salesData.monthlySales.map(item => item.orders * 100), // Scale for visualization
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        yAxisID: 'y1',
      }
    ],
  }
  
  const revenueChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
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
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label === 'Revenue') {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
              }).format(context.raw);
            } else {
              label += context.raw / 100; // Adjust for scaled orders
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue ($)',
          color: 'rgba(255, 255, 255, 0.6)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Orders',
          color: 'rgba(255, 255, 255, 0.6)',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: function(value: any) {
            return (value / 100).toLocaleString();
          }
        },
      },
    },
  }

  // Product performance chart
  const productChartData = {
    labels: salesData.productPerformance.map(item => item.name),
    datasets: [
      {
        label: 'Revenue',
        data: salesData.productPerformance.map(item => item.revenue),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  }
  
  const productChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(context.raw);
            return label;
          }
        }
      }
    },
  }
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }
  
  // Handle filter changes
  const handleDateRangeChange = (range: 'today' | '7days' | '30days' | '90days' | 'year') => {
    setDateRange(range)
  }
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductCategory(e.target.value)
  }
  
  const handleChannelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSalesChannel(e.target.value)
  }
  
  // Calculate growth percentages
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  }

  // Revenue growth (comparing to previous period)
  const revenueGrowth = calculateGrowth(
    salesData.monthlySales[salesData.monthlySales.length - 3].revenue,
    salesData.monthlySales[salesData.monthlySales.length - 4].revenue
  )
  
  // Sales growth
  const salesGrowth = calculateGrowth(
    salesData.monthlySales[salesData.monthlySales.length - 3].orders,
    salesData.monthlySales[salesData.monthlySales.length - 4].orders
  )
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-gray-400" />
            <span className="text-sm font-medium mr-2">Date Range:</span>
            <div className="flex">
              {(['today', '7days', '30days', '90days', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => handleDateRangeChange(range)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    dateRange === range 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {range === 'today' && 'Today'}
                  {range === '7days' && '7 Days'}
                  {range === '30days' && '30 Days'}
                  {range === '90days' && '90 Days'}
                  {range === 'year' && 'Year'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <FiFilter className="mr-2 text-gray-400" />
            <span className="text-sm font-medium mr-2">Category:</span>
            <select
              value={productCategory}
              onChange={handleCategoryChange}
              className="bg-gray-700/50 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <FiFilter className="mr-2 text-gray-400" />
            <span className="text-sm font-medium mr-2">Channel:</span>
            <select
              value={salesChannel}
              onChange={handleChannelChange}
              className="bg-gray-700/50 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              {channelOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className="ml-auto flex items-center px-3 py-2 bg-blue-600/80 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => setIsLoading(false), 800)
              // In a real app, this would refresh the data
            }}
          >
            <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold">{formatCurrency(salesData.totalRevenue)}</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <FiDollarSign className="text-blue-400 w-6 h-6" />
            </div>
          </div>
          <div className={`flex items-center mt-4 ${revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {revenueGrowth >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
            <span className="text-sm font-medium">{Math.abs(revenueGrowth).toFixed(1)}% from last month</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Sales</p>
              <h3 className="text-2xl font-bold">{salesData.totalSales.toLocaleString('en-US')}</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <FiShoppingBag className="text-green-400 w-6 h-6" />
            </div>
          </div>
          <div className={`flex items-center mt-4 ${salesGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {salesGrowth >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
            <span className="text-sm font-medium">{Math.abs(salesGrowth).toFixed(1)}% from last month</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg. Order Value</p>
              <h3 className="text-2xl font-bold">{formatCurrency(salesData.avgOrderValue)}</h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <FiBarChart2 className="text-purple-400 w-6 h-6" />
            </div>
          </div>
          <div className={`flex items-center mt-4 text-green-400`}>
            <FiTrendingUp className="mr-1" />
            <span className="text-sm font-medium">2.4% from last month</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
              <h3 className="text-2xl font-bold">{salesData.conversionRate}%</h3>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-full">
              <FiUsers className="text-orange-400 w-6 h-6" />
            </div>
          </div>
          <div className={`flex items-center mt-4 text-green-400`}>
            <FiTrendingUp className="mr-1" />
            <span className="text-sm font-medium">0.5% from last month</span>
          </div>
        </motion.div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-medium mb-4">Revenue & Orders Trend</h3>
          <div className="h-80">
            <Line ref={revenueChartRef} data={revenueChartData} options={revenueChartOptions} />
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-medium mb-4">Revenue by Category</h3>
          <div className="h-80 flex items-center justify-center">
            <Pie ref={productChartRef} data={productChartData} options={productChartOptions} />
          </div>
        </div>
      </div>
      
      {/* Top Products & Regional Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-3 px-2">#</th>
                  <th className="text-left py-3 px-2">Product</th>
                  <th className="text-right py-3 px-2">Units</th>
                  <th className="text-right py-3 px-2">Revenue</th>
                  <th className="text-right py-3 px-2">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {salesData.topSellingProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-700/20">
                    <td className="py-3 px-2">{index + 1}</td>
                    <td className="py-3 px-2 font-medium">{product.name}</td>
                    <td className="py-3 px-2 text-right">{product.units.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">{formatCurrency(product.revenue)}</td>
                    <td className={`py-3 px-2 text-right ${product.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <div className="flex items-center justify-end">
                        {product.growth >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                        {Math.abs(product.growth).toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-medium mb-4">Sales by Region</h3>
          <div className="space-y-4">
            {salesData.salesByRegion.map((region, index) => {
              // Calculate percentage of total
              const total = salesData.salesByRegion.reduce((sum, r) => sum + r.value, 0)
              const percentage = ((region.value / total) * 100).toFixed(1)
              
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{region.region}</span>
                    <div className="text-sm flex items-center">
                      <span className="text-gray-400 mr-2">{formatCurrency(region.value)}</span>
                      <span>{percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <h3 className="text-lg font-medium mt-8 mb-4">Sales by Channel</h3>
          <div className="space-y-4">
            {salesData.salesByChannel.map((channel, index) => {
              // Calculate percentage of total
              const total = salesData.salesByChannel.reduce((sum, c) => sum + c.value, 0)
              const percentage = ((channel.value / total) * 100).toFixed(1)
              
              // Different colors for different channels
              const colors = ['bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500']
              
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{channel.channel}</span>
                    <div className="text-sm flex items-center">
                      <span className="text-gray-400 mr-2">{formatCurrency(channel.value)}</span>
                      <span>{percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colors[index % colors.length]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-medium mb-4">Revenue Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {salesData.revenueByCategory.map((category, index) => (
            <div key={index} className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">{category.category}</p>
                  <p className="text-lg font-medium mt-1">{formatCurrency(category.value)}</p>
                </div>
                <div className={`rounded-full p-2 ${
                  category.growth >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {category.growth >= 0 ? 
                    <FiTrendingUp className="w-5 h-5" /> : 
                    <FiTrendingDown className="w-5 h-5" />
                  }
                </div>
              </div>
              <div className={`mt-2 text-sm ${
                category.growth >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {category.growth >= 0 ? '+' : ''}{category.growth.toFixed(1)}% growth
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 border-t border-gray-700/50 pt-4">
          <h4 className="font-medium mb-3">Key Observations</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
            <li>Electronics continue to be the highest revenue generator, with 8.7% growth compared to last month.</li>
            <li>Beauty products show the strongest growth at 9.3%, suggesting increased customer interest in this category.</li>
            <li>Sports category is experiencing a slight decline of 1.2%, may require promotional attention.</li>
            <li>Online store remains the dominant sales channel at 60% of total revenue.</li>
            <li>North America represents the largest market share at 46% of total sales.</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 