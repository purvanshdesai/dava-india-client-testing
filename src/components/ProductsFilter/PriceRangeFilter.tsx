import React, { useState } from 'react'
import DualRangeSliderCustomLabel from './DualRangeSliderCustomLabel'
import {  IndianRupeeIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

const PriceRangeFilter = ({price,discount}:any) => {

  const [priceRange, setPriceRange] = useState({ from: 0, to: 5000 })
  const [discountRange, setDiscountRange] = useState({ from: 0, to: 5000 })
  const common = useTranslations('Common')


  // const selectedPriceRange = (value:any) => {
  //   price(value)
  // }
  // const selectedDiscountRange = (value:any) => {
  //   discount(value)
  // }

  const selectedPriceRange = (value: any) => {
    setPriceRange(value)
    price(value) 
  }

  const selectedDiscountRange = (value: any) => {
    setDiscountRange(value)
    discount(value)
  }
  
  return (
    <div className='mt-5 rounded-xl bg-white p-1'>
      <p className='mt-5 pl-5 font-semibold'>{common('price')}</p>
      <div className='mt-2'>
        <div className='ml-1 mt-2 flex w-full flex-row justify-between pl-4 pr-4 text-center'>
          {/* <div>
            <p className='text-sm font-medium'>Min Price</p>
          </div>
          <div>
            <p className='text-sm font-medium'>Max Price</p>
          </div> */}
          <span className='flex items-center text-sm font-semibold'>
          <IndianRupeeIcon size={14} className='inline'/>{priceRange.from}&nbsp;-&nbsp;<IndianRupeeIcon size={14} className='inline'/>{priceRange.to}
        </span>
        </div>

        <div className='mt-3'>
          <DualRangeSliderCustomLabel range={selectedPriceRange} />
        </div>
      </div>
      <p className='mt-5 pl-5 font-semibold'>{common('discount')}</p>

      <div className='mt-2 mb-9'>
        <div className='ml-1 mt-2 flex w-full flex-row justify-between pl-4 pr-4 text-center'>
          {/* <div>
            <p className='text-sm font-medium'>Min Price</p>
          </div>
          <div>
            <p className='text-sm font-medium'>Max Price</p>
          </div> */}
           <span className='flex items-center text-sm font-semibold'>
          <IndianRupeeIcon size={14} className='inline'/>{discountRange.from}&nbsp;-&nbsp;<IndianRupeeIcon size={14} className='inline'/>{discountRange.to}
        </span>
        </div>

        <div className='mt-3'>
          <DualRangeSliderCustomLabel range={selectedDiscountRange} />
        </div>
      </div>
    </div>
  )
}

export default PriceRangeFilter
