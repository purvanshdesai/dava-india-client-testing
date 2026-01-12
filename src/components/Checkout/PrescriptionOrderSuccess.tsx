'use client'
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle
  // CardDescription
} from '@/components/ui/card'
import Image from 'next/image'
// import { Button } from '../ui/button'
// import { useTransitionRouter } from 'next-view-transitions'
// import { DotIcon } from 'lucide-react'

export default function PrescriptionOrderSuccess() {
  // const router = useTransitionRouter()

  return (
    <div>
      <Card>
        <CardHeader className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
          <CardTitle className='space-y-2 text-base font-semibold'>
            <div className='flex items-center gap-6'>
              <div
                style={{
                  position: 'relative',
                  width: '30px',
                  height: '30px'
                }}
              >
                <Image
                  src={`/images/BagChecked.svg`}
                  alt='Footer Logo'
                  fill
                  priority={false}
                />
              </div>
              <span className='text-sm md:text-lg'>
                Your Request is placed successfully !
              </span>
            </div>

            <div className='flex items-center gap-3'>
              <div
                style={{
                  position: 'relative',
                  width: '45px',
                  height: '45px'
                }}
              >
                <Image
                  src={`/images/PrescriptionSuccess.svg`}
                  alt='Footer Logo'
                  fill
                  priority={false}
                />
              </div>
              <div className='space-y-2 text-xs text-label'>
                <p className=''>
                  Your Prescription is
                  <span className='text-primary-variant'> under review.</span>
                </p>
                <p>You'll receive a call from +91-7965189000.</p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        {/* <CardDescription className='p-4'>
          <div>
            <Button className='px-10' onClick={() => router.push('/')}>
              Home
            </Button>

            <div className='space-y-3 pt-6'>
              <p className='text-sm font-medium'>Status</p>

              <div className='p-2'>
                <div className='flex items-center rounded-md'>
                  <DotIcon size={28} className='text-green-500' />
                  <p className='text-sm font-medium'>Order Confirmed </p>
                </div>

                <div className='ml-3 h-5 w-1 border-l-2 border-green-500'></div>

                <div className='flex items-center rounded-md'>
                  <DotIcon size={28} className='text-green-500' />
                  <p className='text-sm font-medium'>
                    Prescription under review{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardDescription> */}
      </Card>
    </div>
  )
}
