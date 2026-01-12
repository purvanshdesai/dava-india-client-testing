'use client'

import PaymentSummary from '@/components/Checkout/PaymentSummary'
import CartProducts from '@/components/Checkout/CartProducts'
import Coupon from '@/components/Checkout/Coupon'
import { useTranslations } from 'next-intl'
import EmptyCart from '@/components/Checkout/EmptyCart'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useEffect, useState } from 'react'
import useCommonStore from '@/store/useCommonStore'
import { isPrescriptionStepRequired } from '@/store/useCheckoutStore'
import CartLoader from '@/components/Loader/CartLoader'
// import DeliveryMode from '../DeliveryMode'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function CartComponent() {
  const [showDialog, setShowDialog] = useState(false)
  const prescriptionStepRequired = isPrescriptionStepRequired()
  const {
    loading,
    isCartFetched,
    totalProducts,
    resetOrderConfirmation,
    deliveryMode,
    setDeliveryMode
  } = useCheckoutStore(state => state)
  const setAppBarSearchStatus = useCommonStore(
    state => state.setAppBarSearchStatus
  )

  const cart = useTranslations('Cart')
  const product = useTranslations('Product')

  useEffect(() => {
    resetOrderConfirmation()
    setAppBarSearchStatus(true)
  }, [])

  useEffect(() => {
    setDeliveryMode('standard')
  }, [])

  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()

    const shouldShowDialog = hour < 9 || hour >= 20

    let isAlreadyAcknowledged = false

    if (typeof window !== 'undefined') {
      const acknowledgedAt = localStorage.getItem(
        'sameDayDeliveryNoticeAcknowledged'
      )

      if (acknowledgedAt) {
        const acknowledgedTime = parseInt(acknowledgedAt, 10)
        const twelveHours = 12 * 60 * 60 * 1000
        const timeElapsed = now.getTime() - acknowledgedTime

        // ✅ Only mark as acknowledged if it’s within 12 hours
        if (timeElapsed < twelveHours) {
          isAlreadyAcknowledged = true
        }
      }
    }

    if (shouldShowDialog && !isAlreadyAcknowledged) {
      setShowDialog(true)
    }
  }, [deliveryMode])

  const handleProcessNotice = () => {
    setShowDialog(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'sameDayDeliveryNoticeAcknowledged',
        Date.now().toString()
      )
    }
  }

  return (
    <div className='flex w-full justify-center p-4 pb-6 md:px-6'>
      <div className='w-full lg:w-3/4'>
        <h1 className='flex items-center gap-2 pb-6 text-xl font-semibold'>
          {cart('cart_title')}{' '}
          <span className='text-sm font-normal text-label'>
            ({totalProducts} {product('products')})
          </span>
        </h1>

        <div>
          {loading || !isCartFetched ? (
            <CartLoader />
          ) : totalProducts === 0 ? (
            <EmptyCart />
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-[3fr_2fr]'>
              <div>
                <CartProducts />
              </div>
              <div className='space-y-4'>
                <Coupon />
                {/* <DeliveryMode /> */}
                <div className='sticky top-2'>
                  <PaymentSummary
                    nextPath={
                      prescriptionStepRequired
                        ? '/checkout/prescription'
                        : '/checkout/address'
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog open={showDialog}>
        <DialogContent className='text-white'>
          <DialogTitle className='text-black'>
            Notice for Same-Day Delivery
          </DialogTitle>
          <Image
            className='mx-auto'
            src={'/images/LateDelivery.svg'}
            alt={'dia'}
            height={100}
            width={328}
          />

          <p className='text-muted-foreground flex items-center justify-center text-sm text-black'>
            Same Day delivery is available between 9 AM to 8 PM only
          </p>
          <DialogFooter>
            <Button onClick={() => handleProcessNotice()}>Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
