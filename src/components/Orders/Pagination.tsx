import React from 'react'
import { useTranslations } from 'next-intl'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const getPaginationRange = (current: number, total: number): (number | "...")[] => {
  const delta = 2
  const range: (number | "...")[] = []
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  range.push(1)
  if (left > 2) range.push("...")
  for (let i = left; i <= right; i++) range.push(i)
  if (right < total - 1) range.push("...")
  if (total > 1) range.push(total)

  return range
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const paginationTranslate = useTranslations('Pagination')
  const pages = getPaginationRange(currentPage, totalPages)

  return (
    <div className='mt-4 flex justify-center space-x-2'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded px-4 py-2 ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white'}`}
      >
        {paginationTranslate('previous')}
      </button>

      {pages.map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`rounded px-4 py-2 ${currentPage === page ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`rounded px-4 py-2 ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white'}`}
      >
        {paginationTranslate('next')}
      </button>
    </div>
  )
}

export default Pagination
