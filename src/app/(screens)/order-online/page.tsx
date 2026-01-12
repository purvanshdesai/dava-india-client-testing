import type { Metadata } from 'next'
import GlobalSearch from '@/components/Home/GlobalSearch'
import SponsoredLayout from '@/components/Home/SponsoredLayout'
import React from 'react'

export const metadata: Metadata = {
  title: 'Dava India | Featured Products',
  description: 'Dava India Ecommerce app'
}

export default function Home() {
  return (
    <div className='dark:bg-slate-800'>
      <div className=''>
        <GlobalSearch />
        <div className=''>
          <SponsoredLayout isForCampaign={true} />
        </div>
      </div>
    </div>
  )
}
