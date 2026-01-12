'use client'
import Image from 'next/image'
import { Search } from 'lucide-react'
import PinCodeManager from './PinCodeManager'
import ProfileSettings from './ProfileSettings'
import LanguageSettings from './LanguageSettings'
import { Link } from 'next-view-transitions'
import useCheckoutStore from '@/store/useCheckoutStore'
import { cartIcon } from '../utils/icons'
import useCommonStore from '@/store/useCommonStore'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import PrescriptionManager from './PrescriptionManager'

interface Props {
  isForCampaign?: boolean
}

export default function AppBar({ isForCampaign = false }: Props) {
  const global = useTranslations('GlobalSearch')

  const {
    resetConsultationOrder,
    setProceedWithItemsWithoutPrescription,
    refreshCalculations
  } = useCheckoutStore()
  const showAppBarSearch = useCommonStore(state => state.showAppBarSearch)
  const totalProducts = useCheckoutStore(state => state.totalProducts)
  const shopCartIcon = cartIcon

  const searchOptions = global('search_types')
    .split('/')
    .map(v => v.trim()) // search options
  searchOptions.push(searchOptions[0])
  const [translateY, setTranslateY] = useState(0) // initial translateY position
  const [transitionDuration, setTransitionDuration] = useState(0) // initial transition duration
  const maxTransforms = searchOptions.length // number of moves before resetting
  const intervalTime = 1250 // interval time in milliseconds

  const SearchField = () => {
    useEffect(() => {
      let transformCount = 0
      let interval: NodeJS.Timeout | null = null
      let animationRunning = false // Track if animation is running

      const scroll = () => {
        if (transformCount === 0) {
          setTransitionDuration(400)
        }
        setTranslateY(prevY => prevY - 10) // Move by -20px
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

    return (
      <>
        {showAppBarSearch && (
          <div className='fade-in-up animate-delay-100 flex w-full items-center rounded-full border bg-gray-100 px-3 py-1.5 dark:border-gray-600 dark:bg-gray-700 md:max-w-96'>
            <div className='rounded-full bg-primary p-1.5 text-white'>
              <Search size={18} />
            </div>
            <Link href={'/search'}>
              {/*<input*/}
              {/*  type='text'*/}
              {/*  placeholder='Search ...'*/}
              {/*  className='w-full bg-gray-100 pl-3 text-sm outline-none dark:bg-gray-700'*/}
              {/*/>*/}
              <div
                className={
                  'flex w-full cursor-text gap-x-1 bg-gray-100 pl-3 text-sm text-[#a9a9a9] dark:bg-gray-700'
                }
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
            </Link>
          </div>
        )}
      </>
    )
  }

  return (
    <div className='flex w-full items-center border-b bg-white py-4 dark:border-gray-600 dark:bg-slate-900 md:py-2'>
      <div className='flex w-full flex-col items-center gap-3 px-3 md:flex-row md:gap-6'>
        <div className='flex w-full items-center justify-between gap-3 px-3 md:w-auto md:justify-normal md:px-6'>
          <Link href={'/'}>
            <div
              style={{ position: 'relative', width: '180px', height: '60px' }}
            >
              <Image
                src={'/images/Logo.svg'}
                alt='Davainda Logo'
                className='cursor-pointer'
                fill
                priority={true}
              />
            </div>
          </Link>
          <div className='mr-6 hidden h-16 border-r dark:border-gray-600 md:block'></div>
          <div className='hidden md:block'>
            <PinCodeManager />
          </div>

          {!isForCampaign && (
            <div className='flex items-center gap-1 md:hidden'>
              <Link
                href={'/checkout/cart'}
                onClick={() => {
                  resetConsultationOrder()
                  setProceedWithItemsWithoutPrescription(false)
                  refreshCalculations()
                }}
              >
                <div className='relative'>
                  {shopCartIcon}

                  {totalProducts > 0 && (
                    <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-green text-xs text-white'>
                      {totalProducts}
                    </span>
                  )}
                </div>
              </Link>
              <ProfileSettings />
            </div>
          )}
        </div>

        <div className='hidden w-full flex-1 items-center gap-3 px-3 md:flex md:px-0'>
          {SearchField()}
        </div>

        <div className='flex w-full items-center gap-4 px-3 md:w-auto md:px-0'>
          <div className='block md:hidden'>
            <PinCodeManager />
          </div>

          {!isForCampaign && (
            <div className='w-full md:w-auto'>
              <PrescriptionManager />
            </div>
          )}
          <div className='hidden md:block'>
            <LanguageSettings />
          </div>

          {!isForCampaign && (
            <>
              <div className='hidden md:block'>
                <Link
                  href={'/checkout/cart'}
                  onClick={() => {
                    resetConsultationOrder()
                    setProceedWithItemsWithoutPrescription(false)
                    refreshCalculations()
                  }}
                  className='flex items-center gap-1 text-xs'
                >
                  <div className='relative'>
                    {shopCartIcon}

                    {totalProducts > 0 && (
                      <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-green text-xs text-white'>
                        {totalProducts}
                      </span>
                    )}
                  </div>
                  Cart
                </Link>
              </div>
              <div className='relative w-5'>
                <Link href={'/me/notifications'}>
                  <Bell size={24} className='absolute -top-2.5 text-gray-400' />
                </Link>
              </div>
              <div className='hidden md:block'>
                <ProfileSettings />
              </div>
            </>
          )}
        </div>

        <div className='flex w-full flex-1 items-center gap-3 px-3 md:hidden md:px-0'>
          {SearchField()}
        </div>
      </div>
    </div>
  )
}
