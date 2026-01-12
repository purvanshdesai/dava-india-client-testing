'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ComingSoonPage() {
  const [displayedText, setDisplayedText] = useState('')
  const fullText = "Stay Tuned!!!"
  const typingSpeed = 70

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, currentIndex + 1))
      currentIndex++
      if (currentIndex === fullText.length) {
        clearInterval(interval)
      }
    }, typingSpeed)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-10 w-full max-w-md text-center shadow-xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
          className="text-4xl font-bold text-white mb-4"
        >
          Coming Soon
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-white text-lg h-12"
        >
          {displayedText}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Link
            href="/"
            className="mt-6 inline-block bg-white text-[#2c5364] font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
          >
             Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
