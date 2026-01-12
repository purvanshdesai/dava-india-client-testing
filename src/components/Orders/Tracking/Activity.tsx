import React, { useState } from 'react'
import dayjs from 'dayjs'

interface TimelineItem {
  date?: string
  dateTime?: string
  authorType?: string
  authorName: string
  label: string
  status?: string | null
  location?: string
  comment?: string
  statusCode: string
}

interface TimelineProps {
  items: TimelineItem[]
}

const TimelineActivity: React.FC<TimelineProps> = ({ items }) => {
  const [showAll, setShowAll] = useState(false)

  // Remove grouping — single flat list
  const sortedItems = [...items].sort(
    (a, b) =>
      dayjs(b.date || b.dateTime).valueOf() -
      dayjs(a.date || a.dateTime).valueOf()
  )

  const visibleItems = showAll ? sortedItems : sortedItems.slice(0, 4)

  return (
    <div>
      {visibleItems.map((item, idx) => {
        const dateStr = dayjs(item.date || item.dateTime).format('DD MMM, YYYY')
        const timeStr = dayjs(item.date || item.dateTime).format('hh:mm A')

        return (
          <div className='relative flex gap-x-3' key={idx}>
            {/* Time */}
            <div className='w-20 pt-7 text-right text-xs font-medium text-black dark:text-neutral-400'>
              {dateStr}
            </div>

            {/* Icon */}
            <div
              className={`relative flex flex-col items-center pt-6 dark:after:bg-neutral-700 dark:before:bg-neutral-700 ${idx !== visibleItems.length - 1
                  ? 'after:absolute after:left-1/2 after:-translate-x-1/2 after:transform after:bottom-0 after:top-[38px] after:w-[2px] after:bg-[#51B22A]'
                  : ''
                } ${idx !== 0
                  ? 'before:absolute before:left-1/2 before:-translate-x-1/2 before:transform before:top-0 before:h-[38px] before:w-[2px] before:bg-[#51B22A]'
                  : ''
                }`}
            >
              <div className='relative z-10 flex h-7 w-7 items-center justify-center'>
                <div className='h-3.5 w-3.5 rounded-full bg-[#009045] dark:bg-neutral-600'></div>
              </div>
            </div>

            {/* Right Content */}
            <div className='flex-1 pb-4 pt-0.5'>
              <div
                className={`rounded-md border p-3 ${idx === 0 ? 'border border-[#51B22A] bg-[#EAFFF6]' : 'bg-gray-50'}`}
              >
                <h3 className='flex flex-col text-gray-800 dark:text-white md:flex-row md:items-center md:gap-x-2'>
                  <span className='text-sm'>
                    <span className='font-semibold'>Status:</span> {item.label}
                  </span>
                </h3>
                <h3 className='flex flex-col text-gray-800 dark:text-white md:flex-row md:items-center md:gap-x-2'>
                  <span className='text-sm'>
                    <span className='font-semibold'>Time:</span> {timeStr}
                  </span>
                </h3>

                {item?.location && (
                  <div className='mt-1 flex flex-col text-xs text-gray-600 dark:text-neutral-400 md:flex-row md:gap-x-4'>
                    <span>{item.location}</span>
                  </div>
                )}

                {item.statusCode === 'refund_completed' && (
                  <p className='mt-1 text-xs text-gray-600 dark:text-neutral-400'>
                    *Refund will be credited within 7 working days from the
                    initiation date.
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* View More / View Less button */}
      {sortedItems.length > 4 && (
        <div className='mt-4 text-center'>
          <button
            onClick={() => setShowAll(prev => !prev)}
            className='rounded-md px-4 py-2 text-sm font-medium text-primary underline'
          >
            {showAll
              ? 'View Less'
              : `View More Status (${sortedItems.length - 4})`}
          </button>
        </div>
      )}
    </div>
  )
}

export default TimelineActivity
