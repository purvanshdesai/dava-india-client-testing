import React from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export default function PaymentSummaryEmpty() {
  const cart = useTranslations('Cart')

  return (
    <div>
      <Card className='dark:bg-gray-900'>
        <CardHeader className='rounded-t-lg bg-gray-50 p-4 dark:bg-gray-700'>
          <CardTitle className='text-base'>{cart('payment_summary')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3 rounded-b-lg py-4'>
          <div className='flex items-center justify-between text-sm'>
            <p>{cart('mrp_total')}</p>

            <span className='flex items-center font-medium'>-</span>
          </div>

          <div className='flex items-center justify-between text-sm'>
            <p>{cart('discount_on_mrp')}</p>

            <span className='flex items-center font-medium text-red-600'>
              -
            </span>
          </div>
          <div className='flex items-center justify-between text-sm'>
            <p>{cart('shipping_charges')}</p>

            <span className='flex items-center font-medium'>-</span>
          </div>

          <div className='flex items-center justify-between text-sm'>
            <p>{cart('handling_packaging_fee')}</p>

            <span className='flex items-center gap-1'>-</span>
          </div>

          <div className='flex items-center justify-between text-sm'>
            <p>{cart('platform_fee')}</p>

            <span className='flex items-center gap-1'>-</span>
          </div>

          <div className='flex items-center justify-between text-sm'>
            <p>{cart('total_coupon_discount')}</p>

            <span className='flex items-center font-medium text-red-600'>
              -
            </span>
          </div>

          <div className='flex items-center justify-between text-sm'>
            <p>{cart('tax_amount')}</p>

            <span className='flex items-center font-medium'>-</span>
          </div>
          <div className='flex items-center justify-between text-sm font-medium text-green-600 dark:text-green-600'>
            <p>{cart('total_savings')}</p>

            <span className='flex items-center font-medium'>-</span>
          </div>

          <div className='flex items-center justify-between text-base font-semibold'>
            <p>{cart('total_paid')}</p>

            <span className='flex items-center'>-</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
