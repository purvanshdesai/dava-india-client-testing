'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useElementOnScreen } from '@/hooks/useElementOnScreen'
import useCommonStore from '@/store/useCommonStore'
import { SearchIcon } from 'lucide-react'
import { useTransitionRouter } from 'next-view-transitions'
import { useTranslations } from 'next-intl'

export default function GlobalSearch() {
  const router = useTransitionRouter()
  const [containerRef, isVisible] = useElementOnScreen() as any
  const setAppBarSearchStatus = useCommonStore(
    state => state.setAppBarSearchStatus
  )
  const global = useTranslations('GlobalSearch')

  const searchOptions = global('search_types')
    .split('/')
    .map(v => v.trim()) // search options
  searchOptions.push(searchOptions[0])
  const [translateY, setTranslateY] = useState(0) // initial translateY position
  const [transitionDuration, setTransitionDuration] = useState(0) // initial transition duration
  const maxTransforms = searchOptions.length // number of moves before resetting
  const intervalTime = 1250 // interval time in milliseconds

  useEffect(() => {
    setAppBarSearchStatus(!isVisible)
  }, [isVisible])

  useEffect(() => {
    let transformCount = 0
    let interval: NodeJS.Timeout | null = null
    let animationRunning = false // Track if animation is running

    const scroll = () => {
      if (transformCount === 0) {
        setTransitionDuration(400)
      }
      setTranslateY(prevY => prevY - 20) // Move by -20px
      transformCount++
    }

    const reset = () => {
      setTransitionDuration(0) // Reset transition duration
      setTranslateY(0) // Reset to initial position
      transformCount = 0
    }

    const waitTillScrollFinish = async () => {
      return new Promise<void>(resolve => {
        interval = setInterval(() => {
          scroll()
          if (transformCount === maxTransforms) {
            clearInterval(interval!)
            reset()
            resolve()
          }
        }, intervalTime)
      })
    }

    const animateLoop = async () => {
      if (animationRunning) return // Prevent multiple instances

      animationRunning = true
      while (true) {
        if (transformCount === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
          scroll()
        }
        await waitTillScrollFinish()
      }
    }

    animateLoop()

    // Cleanup interval on component unmount
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  const goToSearchPage = () => {
    router.push('/search')
  }

  return (
    <div ref={containerRef}>
      <div className='px-4 pt-6 md:px-6'>
        <div
          className='relative flex h-40 items-center justify-center rounded-xl bg-gradient-to-b'
          style={{
            background: 'linear-gradient(to bottom, #2DA771,#2A8D61)'
          }}
        >
          <div className='absolute left-0 hidden h-full w-72 md:block'>
            <Image
              src={`/images/TopLeft.svg`}
              alt='SearchBanner'
              fill
              priority={true}
            />
          </div>

          {/* <div className='absolute left-4 hidden h-44 w-60 md:block'>
            <Image
              src={`/images/TopLeft.svg`}
              alt='SearchBanner'
              fill
              priority={true}
            />
          </div> */}

          <div className='w-full space-y-3 p-4 md:w-1/2'>
            <p className='text-center text-lg font-medium text-white'>
              {global('global_search_header')}
            </p>
            <div className='flex w-full items-center rounded-full border bg-gray-100 px-3 py-1.5 dark:border-gray-600 dark:bg-gray-700'>
              <div className='rounded-full bg-primary p-1.5 text-white'>
                <SearchIcon size={18} />
              </div>
              <div
                className={
                  'flex w-full cursor-text gap-x-1 bg-gray-100 pl-3 text-sm text-[#a9a9a9] dark:bg-gray-700'
                }
                onClick={() => goToSearchPage()}
              >
                <div>{global('search')}</div>
                <div
                  className={
                    'pointer-events-none flex h-5 flex-col overflow-hidden'
                  }
                >
                  <ul
                    className={`duration-${transitionDuration} flex transform flex-col ${transitionDuration === 0 ? 'transition-none' : 'transition-transform'}`}
                    style={{ transform: `translateY(${translateY}px)` }}
                  >
                    {searchOptions.map((option, idx) => (
                      <li key={idx}>{option}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className='absolute -right-4 hidden h-full w-72 md:block'>
            <Image
              src={`/images/TopRight.svg`}
              alt='SearchBanner'
              fill
              priority={true}
            />
          </div>

          {/* <div className='absolute -bottom-2 right-[1%] hidden h-44 w-44 md:block'>
            <Image
              src={`/images/Home/Search/KapilDev.svg`}
              alt='SearchBanner'
              fill
              priority={true}
            />
          </div> */}
        </div>
      </div>
    </div>
  )
}
