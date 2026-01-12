'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useFetchAllCoupons, useFetchCoupon } from '@/utils/hooks/couponHooks'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useTranslations } from 'next-intl'
import FormDialog from '../Form/FormDialog'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '../ui/input'

export default function Coupon() {
  const cart = useTranslations('Cart')
  const session: any = useSession()
  const { toast } = useToast()
  const isLoggedIn = session.status === 'authenticated'

  const {
    applyCoupon,
    removeCoupon,
    subTotal,
    discountAmount,
    appliedCouponData: appliedCouponFromStore,
    products
  } = useCheckoutStore(state => state)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [appliedCouponCode, setAppliedCouponCode] = useState(null)
  const [coupons, setCoupons] = useState<any[]>([])
  const [recommendedCoupon, setRecommendedCoupon] = useState<any>(null)
  const [couponDiscountValue, setCouponDiscountValue] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const [errorMessage, setMessage] = useState('')
  const [celebrate, setCelebrate] = useState<{
    code: string
    saved: number
  } | null>(null)
  const [manualCouponCode, setManualCouponCode] = useState('')

  const { mutateAsync: fetchAllCoupons } = useFetchAllCoupons()
  const { mutateAsync: verifyCoupon } = useFetchCoupon()
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchAllCouponsFn = async () => {
    try {
      const res = await fetchAllCoupons({
        total: subTotal,
        email: session?.data?.user?.email,
        phoneNumber: session?.data?.user?.phoneNumber,
        isNewCode: true
      })

      if (res?.message) {
        setMessage(res?.message)
        setCoupons([])
      } else {
        setMessage('')
        setCoupons(res)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false)
      return
    }
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current)
    }

    setIsLoading(true)
    fetchTimeoutRef.current = setTimeout(() => {
      fetchAllCouponsFn()
    }, 500)

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }
    }
  }, [isLoggedIn, subTotal])

  useEffect(() => {
    if (coupons.length) {
      const calculatedCoupons = coupons.map(coup => {
        return {
          ...coup,
          finalDiscountedValue: calcDiscountValue(coup)
        }
      })

      const mostDiscountedCoupon = calculatedCoupons.reduce((max, coup) => {
        return coup.finalDiscountedValue > max.finalDiscountedValue ? coup : max
      }, calculatedCoupons[0])

      setRecommendedCoupon(mostDiscountedCoupon)

      setCouponDiscountValue(mostDiscountedCoupon.finalDiscountedValue)
    } else {
      setRecommendedCoupon(null)
      setCouponDiscountValue(0)
    }
  }, [coupons])

  const calcDiscountValue = (coupon: any): number => {
    let discountValue = 0
    if (coupon.discountType === 'percentage') {
      const discount = (subTotal * coupon.discountValue) / 100
      if (
        coupon?.maximumDiscountValue !== undefined &&
        discount > coupon?.maximumDiscountValue
      ) {
        discountValue = Math.min(discount, coupon?.maximumDiscountValue)
      } else {
        discountValue = discount
      }
    } else if (coupon.discountType === 'fixedAmount') {
      discountValue = coupon.discountValue
    }

    return discountValue
  }

  const handleRemoveCoupon = () => {
    setAppliedCouponCode(null)
    removeCoupon()
  }

  const handleManualCouponApply = async () => {
    if (!manualCouponCode.trim()) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a coupon code.',
        variant: 'destructive'
      })
      return
    }

    await handleApplyCoupon(manualCouponCode.trim())
    setManualCouponCode('')
  }

  const handleApplyCoupon = async (coupon: any) => {
    if (applyingCoupon) return

    setApplyingCoupon(true)
    try {
      if (!coupon) return

      const res = await verifyCoupon({
        couponCode: coupon?.couponCode ?? coupon,
        totalAmount: subTotal,
        items: products.map((p: any) => ({
          productId: p._id,
          quantity: p.quantity,
          isSelected: p.isSelected,
          consultationId: p?.consultationId,
          isConsultationItem: p.isConsultationItem,
          isBuyNowItem: p.isBuyNowItem,
          prescriptionReq: p.prescriptionReq,
          batchNo: p.batchNo,
          expiryDate: p.expiryDate,
          storeId: p.storeId,
          collections: p.collections
        }))
      })

      if (res?.couponName) {
        // Get discount amount before applying coupon to calculate only the new discount
        const discountBefore = useCheckoutStore.getState().discountAmount || 0

        applyCoupon(res)
        setAppliedCouponCode(res.couponCode)

        toast({
          title: 'Coupon Applied',
          description: `${res.couponName} was successfully applied.`
        })
        setDialogOpen(false)

        // Calculate saved amount for this specific coupon only
        // Use API response discountAmount if available (discount for this coupon)
        // Otherwise calculate from coupon data
        let saved = 0
        if (
          typeof (res as any)?.discountAmount === 'number' &&
          (res as any).discountAmount > 0
        ) {
          // API returned the discount amount for this specific coupon
          saved = (res as any).discountAmount
        } else if ((res as any)?.discountValue && (res as any)?.discountType) {
          // Calculate discount from coupon data
          if ((res as any).discountType === 'percentage') {
            const discount = (subTotal * (res as any).discountValue) / 100
            saved = (res as any)?.maximumDiscountValue
              ? Math.min(discount, (res as any).maximumDiscountValue)
              : discount
          } else if ((res as any).discountType === 'fixedAmount') {
            saved = (res as any).discountValue
          }
        } else {
          // Fallback: calculate difference (new total discount - old total discount)
          // This ensures we only show the discount from this coupon, not cumulative
          const discountAfter = useCheckoutStore.getState().discountAmount || 0
          saved = Math.max(0, discountAfter - discountBefore)
        }

        setCelebrate({
          code: res.couponCode || res.couponName,
          saved: Number(saved)
        })
        setTimeout(() => setCelebrate(null), 3000)
      } else {
        toast({
          title: 'Invalid Coupon',
          description: res?.message || 'This coupon cannot be applied.',
          variant: 'destructive'
        })
      }
    } catch (err) {
      toast({
        title: 'Something went wrong',
        description: 'Failed to apply coupon. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setApplyingCoupon(false)
    }
  }

  return (
    <div>
      {celebrate && (
        <div className='pointer-events-none fixed inset-0 z-[1000] flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/35' />

          <>
            <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-visible'>
              <Image
                src='/images/Confettii.gif'
                alt='Confetti'
                width={900}
                height={700}
                priority
                className='pointer-events-none max-w-none opacity-95'
              />
            </div>

            <div className='relative z-20 w-[320px] rounded-2xl bg-white px-8 py-6 text-center shadow-xl md:w-[380px]'>
              <div className='mx-auto h-24 w-24'>
                <Image
                  src='/images/GreenTick.gif'
                  alt='Success'
                  width={150}
                  height={150}
                  className='mx-auto'
                />
              </div>
              <p className='text-base font-semibold text-black'>
                '{celebrate.code}' Applied
              </p>
              <p className='mt-1 text-2xl font-normal text-black'>
                You Saved ₹{Number(celebrate.saved).toFixed(2)}
              </p>
              <p className='mt-1 text-sm font-medium text-[#E14F2C]'>
                Yay! Thanks
              </p>
            </div>
          </>
        </div>
      )}
      <Card className='relative overflow-hidden rounded-[18px] border border-[#E14F2C]'>
        <div
          className='absolute left-0 top-0 h-full w-full rounded-[18px]'
          style={{
            backgroundImage: `url('/images/CouponBg.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            zIndex: 0
          }}
        />
        <CardHeader className='relative z-10 p-3'>
          <div className='flex items-center justify-start'>
            <div className='flex w-full items-center justify-start gap-3'>
              <div
                id='coupon-icon-slot'
                className='flex h-16 w-16 items-center justify-center rounded-md'
              >
                <Image
                  src='/images/discountIcon.gif'
                  alt='Discount'
                  width={60}
                  height={60}
                  className='min-h-[60px] min-w-[60px]'
                />
              </div>

              <CardTitle className='text-xl font-semibold text-black'>
                {cart('apply_coupon')}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className='relative z-10 -mt-1 px-6 pb-6'>
          {isLoading ? (
            <div className='animate-pulse space-y-3'>
              <div className='h-6 w-3/4 rounded bg-gray-200' />
              <div className='h-4 w-1/2 rounded bg-gray-200' />
            </div>
          ) : (
            <>
              <div className='grid grid-cols-[auto_1fr_auto] items-center gap-3'>
                <div
                  id='save-icon-slot'
                  className='flex h-12 w-12 items-center justify-center rounded-md'
                >
                  <Image
                    src={
                      discountAmount !== 0 && appliedCouponFromStore
                        ? '/images/AppiledIcon.svg'
                        : '/images/percentageIcon.svg'
                    }
                    alt={
                      discountAmount !== 0 && appliedCouponFromStore
                        ? 'Applied'
                        : 'Percentage'
                    }
                    width={30}
                    height={30}
                  />
                </div>

                <div className='text-base font-medium text-black'>
                  {!coupons?.length && !errorMessage ? (
                    'No offers available at the moment!'
                  ) : errorMessage ? (
                    <div className='text-sm'>{errorMessage}</div>
                  ) : (
                    <span
                      className={`${
                        discountAmount !== 0 && appliedCouponFromStore
                          ? 'text-left'
                          : 'text-left text-sm'
                      } `}
                    >
                      {discountAmount !== 0 && appliedCouponFromStore
                        ? `You Saved ₹${Number(discountAmount).toFixed(2)} with '${appliedCouponFromStore?.couponCode || appliedCouponFromStore?.couponName}'`
                        : `Save ₹${couponDiscountValue?.toFixed(2)} with ${recommendedCoupon?.couponCode ?? '-'}`}
                    </span>
                  )}
                </div>

                {coupons.length > 0 && (
                  <div>
                    {discountAmount !== 0 && appliedCouponFromStore && (
                      <div className='self-center justify-self-end'>
                        <Button
                          variant='outline2'
                          className='rounded-md border-[2px] border-[#E14F2C] px-5 py-2 text-sm font-semibold text-[#E14F2C] hover:bg-white'
                          onClick={handleRemoveCoupon}
                        >
                          {cart('remove')}
                        </Button>
                      </div>
                    )}
                    {!(discountAmount !== 0 && appliedCouponFromStore) && (
                      <div className='self-start justify-self-end'>
                        <Button
                          variant='outline2'
                          className='rounded-md border-[2px] border-[#E14F2C] px-5 py-2 text-sm font-semibold text-[#E14F2C] hover:bg-white'
                          onClick={() => {
                            setAppliedCouponCode(null)
                            handleApplyCoupon(recommendedCoupon)
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                className='mt-2 flex cursor-pointer items-center text-sm font-medium text-black'
                onClick={() => {
                  setAppliedCouponCode(null)
                  setDialogOpen(true)
                }}
              >
                <span className='no-underline'>View/Add Coupon</span>

                <Image
                  src='/images/viewAllIcon.svg'
                  alt='View All'
                  width={18}
                  height={18}
                  className='ml-2'
                />
              </div>
            </>
          )}
          <FormDialog
            trigger={<span />}
            title={'Apply Coupons'}
            width={'w-[95vw] sm:w-[560px] md:w-[780px]'}
            content={
              errorMessage ? (
                <div className='flex flex-col'>
                  <div className='flex items-center gap-2 border-b bg-white p-2 py-4'>
                    <Input
                      placeholder='Coupon Code'
                      value={manualCouponCode}
                      onChange={e => setManualCouponCode(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleManualCouponApply()
                        }
                      }}
                    />
                    <Button
                      className='bg-primary dark:bg-primary-dim'
                      onClick={handleManualCouponApply}
                    >
                      <span className='px-3'>Apply</span>
                    </Button>
                  </div>
                  <div className='flex flex-col items-center space-y-4 bg-white py-4'>
                    <div
                      className='relative'
                      style={{ width: 101, height: 101 }}
                    >
                      <Image
                        src='/images/CouponMessage.svg'
                        alt='Coupon Gift'
                        fill
                        objectFit='contain'
                      />
                    </div>
                    <span className='text-sm'>{errorMessage}</span>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col'>
                  {' '}
                  <div className='flex items-center gap-2 border-b bg-white p-2 py-4'>
                    <Input
                      placeholder='Coupon Code'
                      value={manualCouponCode}
                      onChange={e => setManualCouponCode(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleManualCouponApply()
                        }
                      }}
                    />
                    <Button
                      className='bg-primary dark:bg-primary-dim'
                      onClick={handleManualCouponApply}
                    >
                      <span className='px-3'>Apply</span>
                    </Button>
                  </div>
                  <div className='m-2 space-y-4'>
                    {coupons.map((coup, idx) => (
                      <div
                        key={idx}
                        className='grid grid-cols-[40px_1fr_auto] items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:shadow-sm'
                      >
                        <div className='relative h-10 w-10'>
                          <Image
                            src='/images/couponImg.svg'
                            alt='Coupon Icon'
                            fill
                            objectFit='contain'
                          />
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-base font-semibold uppercase'>
                            {coup.couponCode || coup.couponName}
                          </span>
                          <span className='text-[13px] leading-5 text-gray-700'>
                            Save ₹{calcDiscountValue(coup).toFixed(2)} on this
                            order
                          </span>
                          <span className='text-[13px] leading-5 text-gray-700'>
                            Minimum order value: Rs.{coup.minimumPurchaseValue}{' '}
                            <span className='text-[#E14F2C]'>
                              T&amp;C Apply
                            </span>
                          </span>
                          {/* {idx === 0 && (
                          <div className='mt-2 flex items-start gap-2'>
                            <span className='flex h-4 w-6 items-center justify-center rounded-full bg-[#FFA928] text-[10px] font-normal text-white'>
                              i
                            </span>
                            <span className='text-[13px] font-medium text-[#54863C]'>
                              This coupon applies only on one product in the
                              cart.
                            </span>
                          </div>
                        )} */}
                        </div>
                        <div className='self-center'>
                          {appliedCouponCode === coup.couponCode ||
                          appliedCouponFromStore?.couponCode ===
                            coup.couponCode ? (
                            <Button
                              variant='ghost'
                              className='text-sm font-semibold uppercase text-[#E14F2C]'
                              onClick={() => handleRemoveCoupon()}
                            >
                              REMOVE
                            </Button>
                          ) : (
                            <Button
                              variant='ghost'
                              className='rounded-md px-5 py-2 text-sm font-semibold uppercase text-[#E14F2C]'
                              onClick={() => handleApplyCoupon(coup)}
                            >
                              APPLY
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            footerActions={null}
            isCoupon={true}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        </CardContent>
      </Card>
    </div>
  )
}
