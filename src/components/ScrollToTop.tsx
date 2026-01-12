'use client'
import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div>
      {showScrollTop && (
        <div
          onClick={scrollToTop}
          className='w-[48px] cursor-pointer rounded-full bg-primary p-3'
        >
          <ChevronUp className='text-white' />
        </div>
      )}
    </div>
  )
}
