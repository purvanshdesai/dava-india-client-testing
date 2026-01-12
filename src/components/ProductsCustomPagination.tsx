import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

const ProductsCustomPagination = ({
  currentPage,
  totalResults,
  resultsPerPage,
  onPageChange
}: any) => {
  const totalPages = Math.ceil(totalResults / resultsPerPage)

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  // Function to render page numbers with ellipses
  const renderPageNumbers = () => {
    const pages = []
    const startPage = Math.max(currentPage - 1, 1)
    const endPage = Math.min(currentPage + 1, totalPages)

    // Add the first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            href='#'
            onClick={() => {
              
              handlePageChange(1)
            }}
            className='h-10 rounded-lg border bg-white'
          >
            1
          </PaginationLink>
        </PaginationItem>
      )
      if (startPage > 2) {
        pages.push(<PaginationEllipsis key='start-ellipsis' />)
      }
    }

    // Add the current, previous, and next pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href='#'
            onClick={() => {
              
              handlePageChange(i)
            }}
            className={
              i === currentPage
                ? 'active h-10 rounded-lg border bg-white font-semibold text-[#E75634]'
                : 'h-10 rounded-lg border bg-white'
            }
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    // Add the last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<PaginationEllipsis key='end-ellipsis' />)
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href='#'
            onClick={() => {
              
              handlePageChange(totalPages)
            }}
            className='h-10 rounded-lg border bg-white'
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return pages
  }

  return (
    <div>
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              className={`rounded-lg border ${
                currentPage !== 1 ? 'bg-white' : 'bg-none'
              }`}
              href='#'
              onClick={() => {
                if (currentPage !== 1) {
                 
                  handlePageChange(currentPage - 1)
                }
              }}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {renderPageNumbers()}

          {/* Next Button */}
          <PaginationItem>
            {currentPage !== totalPages && (
              <PaginationNext
                className={`rounded-lg border ${
                  currentPage !== totalPages ? 'bg-white' : 'bg-none'
                }`}
                href='#'
                onClick={() => {
                  if (currentPage !== totalPages) {
                    
                    handlePageChange(currentPage + 1)
                  }
                }}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default ProductsCustomPagination
