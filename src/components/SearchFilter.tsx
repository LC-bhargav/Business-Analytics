'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiX, FiFilter } from 'react-icons/fi'

interface SearchFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: Record<string, boolean>) => void
  filterOptions: { id: string; label: string }[]
}

export default function SearchFilter({ onSearch, onFilter, filterOptions }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    // Initialize active filters
    const initialFilters: Record<string, boolean> = {}
    filterOptions.forEach(option => {
      initialFilters[option.id] = false
    })
    setActiveFilters(initialFilters)
  }, [filterOptions])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleFilterToggle = (filterId: string) => {
    const updatedFilters = {
      ...activeFilters,
      [filterId]: !activeFilters[filterId]
    }
    setActiveFilters(updatedFilters)
    onFilter(updatedFilters)
  }

  const clearSearch = () => {
    setSearchQuery('')
    onSearch('')
  }

  const resetFilters = () => {
    const resetFilters: Record<string, boolean> = {}
    filterOptions.forEach(option => {
      resetFilters[option.id] = false
    })
    setActiveFilters(resetFilters)
    onFilter(resetFilters)
  }

  return (
    <div className="mb-6">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="bg-gray-800/50 w-full rounded-lg pl-10 pr-10 py-2 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search metrics, reports..."
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`minimal-button flex items-center ${Object.values(activeFilters).some(f => f) ? 'bg-blue-600' : ''}`}
          >
            <FiFilter className="mr-2" />
            Filter
            {Object.values(activeFilters).filter(f => f).length > 0 && (
              <span className="ml-2 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {Object.values(activeFilters).filter(f => f).length}
              </span>
            )}
          </motion.button>

          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg border border-gray-700/50 shadow-lg z-10"
            >
              <div className="p-3 border-b border-gray-700/50 flex justify-between items-center">
                <h3 className="text-sm font-medium text-white">Filter Options</h3>
                <button 
                  onClick={resetFilters}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Reset
                </button>
              </div>
              <div className="p-3 space-y-2">
                {filterOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`filter-${option.id}`}
                      checked={activeFilters[option.id] || false}
                      onChange={() => handleFilterToggle(option.id)}
                      className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <label 
                      htmlFor={`filter-${option.id}`} 
                      className="ml-2 text-sm text-gray-200"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 