import GenericInformation from '@/components/GenericInfo'
import type { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Dava India | Generic Medicine',
  description: 'Dava India Ecommerce app'
}

export default function GenericInfo() {
  return (
    <div className=''>
      <GenericInformation />
    </div>
  )
}