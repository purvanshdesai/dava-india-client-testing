import { useRef, useEffect, useState } from 'react'
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0
}

export const useElementOnScreen = (options = observerOptions) => {
  const containerRef = useRef(null)
  const [isVisible, setVisible] = useState(true)

  const observerHandler = (entries: any) => {
    const [entry] = entries
    setVisible(entry.isIntersecting)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(observerHandler, options)

    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [containerRef, options])

  return [containerRef, isVisible]
}
