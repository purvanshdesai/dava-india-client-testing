'use client'
import { Calendar } from 'lucide-react'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'

export type DateFilterType =
  | 'all'
  | '7days'
  | '15days'
  | '30days'
  | 'thisYear'
  | 'lastYear'

interface OrderDateFilterProps {
  selectedFilter: DateFilterType
  onFilterChange: (filter: DateFilterType) => void
}

const OrderDateFilter: React.FC<OrderDateFilterProps> = ({
  selectedFilter,
  onFilterChange
}) => {
  const getFilterLabel = (filter: DateFilterType): string => {
    const labels: Record<DateFilterType, string> = {
      all: 'All Orders',
      '7days': 'Last 7 Days',
      '15days': 'Last 15 Days',
      '30days': 'Last 30 Days',
      thisYear: 'This Year',
      lastYear: 'Last Year'
    }
    return labels[filter]
  }

  return (
    <div className='flex cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5 text-sm'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center gap-2'>
            <Calendar size={16} />
            <span className='whitespace-nowrap'>
              {getFilterLabel(selectedFilter)}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='z-[10000]' align='end' forceMount>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => onFilterChange('all')}
          >
            All Orders
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => onFilterChange('7days')}
          >
            Last 7 Days
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => onFilterChange('15days')}
          >
            Last 15 Days
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => onFilterChange('30days')}
          >
            Last 30 Days
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => onFilterChange('thisYear')}
          >
            This Year
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => onFilterChange('lastYear')}
          >
            Last Year
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default OrderDateFilter

