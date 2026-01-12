import AppShare from '@/components/AppShare'
import type { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Dava India | App Share',
  description: 'Dava India Ecommerce app'
}

export default function ShareApp() {
  return (
    <div className=''>
      <AppShare />
    </div>
  )
}