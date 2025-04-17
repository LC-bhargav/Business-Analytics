'use client'

import { useState } from 'react'
import { FiTarget, FiCheckCircle, FiAlertTriangle, FiCalendar, FiTrendingUp, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline: Date
  category: 'revenue' | 'growth' | 'conversion' | 'engagement' | 'other'
  createdAt: Date
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Q3 Revenue Target',
      target: 500000,
      current: 325000,
      unit: '$',
      deadline: new Date('2023-09-30'),
      category: 'revenue',
      createdAt: new Date('2023-07-01')
    },
    {
      id: '2',
      title: 'New User Acquisition',
      target: 10000,
      current: 8750,
      unit: 'users',
      deadline: new Date('2023-08-31'),
      category: 'growth',
      createdAt: new Date('2023-06-15')
    },
    {
      id: '3',
      title: 'Conversion Rate',
      target: 5,
      current: 3.2,
      unit: '%',
      deadline: new Date('2023-12-31'),
      category: 'conversion',
      createdAt: new Date('2023-01-01')
    }
  ])
  
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    target: 0,
    current: 0,
    unit: '',
    category: 'other',
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 3))
  })
  
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }
  
  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500'
    if (progress < 50) return 'bg-orange-500'
    if (progress < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue':
        return <FiTarget className="text-green-400" />
      case 'growth':
        return <FiTrendingUp className="text-blue-400" />
      case 'conversion':
        return <FiCheckCircle className="text-purple-400" />
      case 'engagement':
        return <FiCalendar className="text-orange-400" />
      default:
        return <FiTarget className="text-gray-400" />
    }
  }
  
  const getDaysRemaining = (deadline: Date) => {
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) return
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title || '',
      target: newGoal.target || 0,
      current: newGoal.current || 0,
      unit: newGoal.unit || '',
      deadline: newGoal.deadline || new Date(),
      category: newGoal.category as any || 'other',
      createdAt: new Date()
    }
    
    setGoals([...goals, goal])
    setIsAddingGoal(false)
    setNewGoal({
      title: '',
      target: 0,
      current: 0,
      unit: '',
      category: 'other',
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 3))
    })
  }
  
  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === id ? { ...goal, ...updates } : goal
      )
    )
  }
  
  const handleDeleteGoal = (id: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id))
  }
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Goal Tracker</h2>
        <button
          onClick={() => setIsAddingGoal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus />
          <span>Add Goal</span>
        </button>
      </div>
      
      {isAddingGoal && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50"
        >
          <h3 className="font-semibold mb-4">Add New Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
                placeholder="Goal title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
              >
                <option value="revenue">Revenue</option>
                <option value="growth">Growth</option>
                <option value="conversion">Conversion</option>
                <option value="engagement">Engagement</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target</label>
              <input
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
                placeholder="Target value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current Value</label>
              <input
                type="number"
                value={newGoal.current}
                onChange={(e) => setNewGoal({ ...newGoal, current: parseFloat(e.target.value) })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
                placeholder="Current value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <input
                type="text"
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
                placeholder="e.g. $, %, users"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                value={newGoal.deadline ? new Date(newGoal.deadline).toISOString().split('T')[0] : ''}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: new Date(e.target.value) })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsAddingGoal(false)}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddGoal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Goal
            </button>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {goals.map(goal => {
          const progress = calculateProgress(goal.current, goal.target)
          const daysRemaining = getDaysRemaining(goal.deadline)
          const isEditing = editingGoalId === goal.id
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden"
            >
              {isEditing ? (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={goal.title}
                        onChange={(e) => handleUpdateGoal(goal.id, { title: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        value={goal.category}
                        onChange={(e) => handleUpdateGoal(goal.id, { category: e.target.value as any })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
                      >
                        <option value="revenue">Revenue</option>
                        <option value="growth">Growth</option>
                        <option value="conversion">Conversion</option>
                        <option value="engagement">Engagement</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Target</label>
                      <input
                        type="number"
                        value={goal.target}
                        onChange={(e) => handleUpdateGoal(goal.id, { target: parseFloat(e.target.value) })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Current Value</label>
                      <input
                        type="number"
                        value={goal.current}
                        onChange={(e) => handleUpdateGoal(goal.id, { current: parseFloat(e.target.value) })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Unit</label>
                      <input
                        type="text"
                        value={goal.unit}
                        onChange={(e) => handleUpdateGoal(goal.id, { unit: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Deadline</label>
                      <input
                        type="date"
                        value={new Date(goal.deadline).toISOString().split('T')[0]}
                        onChange={(e) => handleUpdateGoal(goal.id, { deadline: new Date(e.target.value) })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setEditingGoalId(null)}
                      className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setEditingGoalId(null)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(goal.category)}
                        <h3 className="font-semibold">{goal.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingGoalId(goal.id)}
                          className="p-1.5 rounded-full hover:bg-gray-700/50"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1.5 rounded-full hover:bg-gray-700/50"
                        >
                          <FiTrash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700/30 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${getProgressColor(progress)}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Current</div>
                        <div className="font-medium">{goal.unit}{formatNumber(goal.current)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Target</div>
                        <div className="font-medium">{goal.unit}{formatNumber(goal.target)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="text-gray-400" />
                        <span>{formatDate(goal.deadline)}</span>
                      </div>
                      
                      <div>
                        {daysRemaining <= 0 ? (
                          <span className="inline-flex items-center bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full text-xs font-medium">
                            <FiAlertTriangle className="mr-1" /> Overdue
                          </span>
                        ) : daysRemaining <= 7 ? (
                          <span className="inline-flex items-center bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full text-xs font-medium">
                            <FiAlertTriangle className="mr-1" /> {daysRemaining}d left
                          </span>
                        ) : (
                          <span className="inline-flex items-center bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                            {daysRemaining}d left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
} 