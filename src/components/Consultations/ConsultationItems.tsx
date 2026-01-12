'use client'
import Image from 'next/image'
import React from 'react'

export default function ConsultationItems({ items }: { items: any[] }) {
  return (
    <div>
      <div className='flex items-center border-b border-t border-[#DFE4EA] bg-[#F9FAFB] px-4 py-3'>
        <h1 className='w-[60%] font-semibold'>Product details</h1>
        <h1 className='w-[20%] font-semibold'>Quantity</h1>
        <h1 className='w-[20%] font-semibold'>Price</h1>
      </div>
      <div>
        {items.map((consultation, index) => (
          <div key={index} className='flex items-center p-5'>
            <div className='w-[60%]'>
              <div className='flex gap-2'>
                <Image
                  width={96}
                  height={96}
                  src={consultation?.productId?.thumbnail}
                  className='rounded-md'
                  alt=''
                />
                <div className='font-semibold'>
                  {consultation?.productId?.title}
                </div>
              </div>
            </div>
            <div className='w-[20%]'>{consultation?.quantity} Quantity</div>
            <div className='w-[20%]'>
              Rs {Number(consultation?.productId?.finalPrice).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
