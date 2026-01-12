'use client'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ChevronDown,
  ChevronUp,
  IndianRupeeIcon,
  Loader2Icon
} from 'lucide-react'
import { useTransitionRouter } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import useCheckoutStore, { getCheckoutProducts } from '@/store/useCheckoutStore'
import { useCreateOrder } from '@/utils/hooks/orderHooks'
import { socket } from '@/lib/socketio'
import { useSession } from 'next-auth/react'
import { initiatePayment } from '@/lib/paymentGateway'
import { useEffect, useRef, useState } from 'react'
import PageSpinner from '../ui/PageSpinner'
import { useTranslations } from 'next-intl'
import useDeliveryAddressStore from '@/store/useDeliveryAddressStore'
import { CheckoutStore } from '../../../types/checkoutStoreTypes'
import Image from 'next/image'
import { isPrescriptionStepRequired } from '@/store/useCheckoutStore'
import { useToast } from '@/hooks/use-toast'
import usePatientsStore from '@/store/userPatientsStore'
import {
  trackOrderPlaced,
  trackOrderFailed,
  trackCheckoutStarted,
  trackCheckoutAbandoned,
  trackPaymentSuccess,
  trackPaymentFailure
} from '@/analytics/trackers/orderTracker'
import { SUPPORTED_PAYMENT_GATEWAY } from '@/lib/paymentGateway'
import { useSearchParams } from 'next/navigation'
import DavaCoinOption from './DavaCoinOption'
import useUserDetailsStore from '@/store/useUserDetailsStore'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'
import { getUtmParamsFromLocal } from '@/utils/utmManager'

interface PaymentSummary {
  nextPath: string
}

const ORDER_ERRORS = {
  SYSTEM_ERROR: 'System Error',
  OUT_OF_STOCK: 'Product out of stock',
  DELIVERY_NOT_AVAILABLE: 'Delivery Mode Not Available',
  NOT_SERVICEABLE_LOCATION:
    'Selected location Not Serviceable for Same Day mode'
}

export default function PaymentSummary({ nextPath }: PaymentSummary) {
  const { toast } = useToast()
  const cart = useTranslations('Cart')
  const common = useTranslations('Common')
  const { data: session } = useSession()
  const router = useTransitionRouter()
  const pathname = usePathname()
  const prescriptionRequired = isPrescriptionStepRequired()
  const searchParams = useSearchParams()
  const selectedPaymentGateway = searchParams.get('paymentGateway')
  const paymentVerificationStatus = searchParams.get('status')
  const currentCheckoutOrderId = searchParams.get('orderId')
  const currentCheckoutNote = searchParams.get('note')

  const paymentVerified = useRef(false)
  const [isOpen, setIsOpen] = useState(false)

  const { mutateAsync: createOrder, isPending } = useCreateOrder()
  const { davaCoinsBalance } = useUserDetailsStore(state => state)

  const {
    isOrderConfirmed,
    isBuyNow,
    isConsultationOrder,
    consultationId,
    checkoutCopy,
    setPaymentStatus,
    prescriptionFiles,
    setPrescriptionUrl,
    consultDoctorForPrescription,
    setConsultDoctorForPrescription,
    isProceedWithItemsWithoutPrescription,
    currentLocation,
    selectedAddress,
    patientId,
    dateOfConsult,
    timeOfConsult,
    confirmedOrder,
    // paymentGateway,
    syncCartToServer
  } = useCheckoutStore(state => state)
  const products = getCheckoutProducts()

  const { patients } = usePatientsStore(store => store)

  const checkout: CheckoutStore = useCheckoutStore(state => state)

  const [paymentLoading, setPaymentLoading] = useState<boolean>(false)
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [paymentForm, setPaymentForm] = useState('')

  const addresses = useDeliveryAddressStore(state => state.addresses)

  const isPayNow = () => pathname.includes('/confirmation')

  const getPaymentGateway = () => {
    // For developers
    const gw = window && localStorage.getItem('payment-gateway-toggle')

    return gw || checkout.paymentGateway
  }

  const handleCreateOrder = async () => {
    try {
      const products = getCheckoutProducts()

      const items = products.map((product: any) => ({
        productId: product._id,
        quantity: product.quantity,
        amount: product.finalPrice,
        total: product.finalPrice * product.quantity,
        couponCode: checkout.couponCode,
        discountedAmount: checkout.discountAmount,
        consultationId: product?.consultationId ? product?.consultationId : null
      }))

      const orderPayload = {
        subTotal: checkout?.subTotal,
        orderTotal: checkout?.totalAmount,
        discountedAmount: checkout?.discountAmount,
        deliveryCharge: checkout?.deliveryCharge,
        taxAmount: checkout?.taxAmount,
        paymentAmount: checkout?.totalAmount,
        currency: 'INR',
        addressId: checkout.selectedAddress?._id,
        paymentMode: getPaymentGateway() ?? SUPPORTED_PAYMENT_GATEWAY.RAZORPAY,
        userSocketId: socket.id ?? '1234',
        items,
        couponCode: checkout?.couponCode,
        address: checkout.selectedAddress,
        orderType: isBuyNow
          ? 'buy-now'
          : isConsultationOrder
            ? 'consultation'
            : isProceedWithItemsWithoutPrescription
              ? 'items-without-prescription'
              : 'general',
        consultationId: isConsultationOrder ? consultationId : undefined,
        prescription: {
          urls: prescriptionFiles
        },
        consultDoctorForPrescription: consultDoctorForPrescription,
        patientId: isConsultationOrder ? patientId : undefined,
        deviceType: 'web',
        utmParams: getUtmParamsFromLocal()
      }

      handleTrackOrderPlacedAndCheckout('checkoutStarted', orderPayload)

      const res = await createOrder(orderPayload)

      if (res.error) {
        console.log('err ====== ', res.error)
        throw new Error(res.error.message)
      }
      return res.data
    } catch (e: any) {
      setPaymentLoading(false)

      let title = ORDER_ERRORS.SYSTEM_ERROR

      if (e.message === 'ONE_OR_MORE_ITEMS_OUT_OF_STOCK') {
        title = ORDER_ERRORS.OUT_OF_STOCK
        toast({
          title,
          description:
            'One or more items in cart went out of stock for selected location'
        })
      } else if (e.message === 'DELIVERY_MODE_NOT_AVAILABLE') {
        title = ORDER_ERRORS.DELIVERY_NOT_AVAILABLE

        toast({
          title,
          description:
            'Selected delivery mode is not availabe. Please choose other delivery mode! '
        })
      } else if (e.message === 'LOCATION_NOT_SERVICEABLE') {
        title = ORDER_ERRORS.NOT_SERVICEABLE_LOCATION
        toast({
          title,
          description:
            'Selected location Not Serviceable for Same Day mode! Please choose other delivery mode! '
        })
      }

      trackOrderFailed({
        userId: session?.user?.id ?? '',
        paymentGateway: getPaymentGateway(),
        reasonForFailure: title
      })

      // Refresh the cart to sync errors
      if (title === ORDER_ERRORS.OUT_OF_STOCK) {
        await syncCartToServer()
        router.push('/checkout/cart')
      }
    }
  }

  const getNextPage = () => {
    if (isConsultationOrder) return '/checkout/confirmation'
    else return '/checkout/cart'
  }

  const payNow = async () => {
    try {
      const user = session?.user
      const order = await handleCreateOrder()

      setCurrentOrder(order)

      if (getPaymentGateway() === SUPPORTED_PAYMENT_GATEWAY.PAYU) {
        setPaymentForm(order?.paymentForm)
      } else {
        setPaymentLoading(true)

        initiatePayment({
          ...order,
          user,
          paymentMode: SUPPORTED_PAYMENT_GATEWAY.RAZORPAY,
          name: 'Dava India',
          description: 'Checkout cart',
          onPaymentSuccess: async (res: any) => {
            await checkout.updateSuccessOrderStatus(order)
            setPaymentLoading(false)

            handleTrackOrderPlacedAndCheckout('orderPlaced', {
              ...order,
              transactionId: res?.razorpay_payment_id
            })

            // Enable only in Local
            setTimeout(() => {
              checkout?.isBuyNow
                ? checkout?.removeBuyNowProduct()
                : checkout?.isConsultationOrder
                  ? checkout.removeConsultationProducts()
                  : checkout.setCartEmpty()
              setPaymentStatus('')
              setPrescriptionUrl([])
              setConsultDoctorForPrescription(false)
            }, 1000)
          },
          onPaymentDismiss: async () => {
            setPaymentLoading(false)
            handleTrackCheckoutAbandoned(order)
            router.push(getNextPage())
          },
          onPaymentFailed: function () {
            trackPaymentFailure({
              userId: session?.user?.id ?? '',
              orderId: order?._id,
              reasonForFailure: 'Payment Failed from Razorpay'
            })

            router.push('/checkout/confirmation')
          },
          loadingPaymentStatus: () => {}
        })
      }
    } catch (error) {
      setPaymentLoading(false)
      throw error
    }
  }

  const handleTrackOrderPlacedAndCheckout = (type: string, order: any) => {
    const products = getCheckoutProducts()

    const payload = {
      userId: order?.userId,
      totalAmount: order?.orderTotal,
      paymentGateway: getPaymentGateway(),
      productsOrdered: products
        ?.map((p: any) => `${p.sku} - ${p.title}`)
        .join(', '),
      shippingAddress: order?.address?.fullAddress,
      couponCode: order?.couponCode ?? '',
      prescriptionUploaded: order?.hasPrescription ? 'Yes' : 'No',
      doctorConsultation: order?.consultDoctorForPrescription ? 'Yes' : 'No'
    }

    if (type === 'orderPlaced') {
      trackOrderPlaced({
        ...payload,
        orderId: order?.orderId,
        paymentMethod: 'upi'
      })

      // Ensure orderId is present
      if (order?.orderId) {
        trackPaymentSuccess({
          orderId: order?.orderId,
          userId: order?.userId,
          totalAmount: order?.orderTotal,
          paymentGateway: getPaymentGateway(),
          transactionId: order?.transactionId
        })
      }
    }
    if (type === 'checkoutStarted') trackCheckoutStarted(payload)
  }

  const handleTrackCheckoutAbandoned = (order: any) => {
    const products = getCheckoutProducts()

    trackCheckoutAbandoned({
      userId: order?.userId,
      totalAmount: order?.orderTotal,
      paymentGateway: getPaymentGateway(),
      paymentMethod: 'upi',
      productsOrdered: products
        ?.map((p: any) => `${p.sku} - ${p.title}`)
        .join(', '),
      stepAtCheckoutAbandoned: 'payment'
    })
  }

  const handleProceedCheckout = async () => {
    if (isPayNow()) return await payNow()

    router.push(nextPath)
  }

  useEffect(() => {
    if (
      !session ||
      paymentVerified.current ||
      !selectedPaymentGateway ||
      selectedPaymentGateway !== SUPPORTED_PAYMENT_GATEWAY.PAYU ||
      !paymentVerificationStatus
    ) {
      return
    }

    if (paymentVerificationStatus == 'success') {
      checkout.updateSuccessOrderStatus(currentOrder)

      setTimeout(() => {
        checkout?.isBuyNow
          ? checkout?.removeBuyNowProduct()
          : checkout?.isConsultationOrder
            ? checkout.removeConsultationProducts()
            : checkout.setCartEmpty()
        setPrescriptionUrl([])
        setPaymentStatus('')
        setConsultDoctorForPrescription(false)

        handleTrackOrderPlacedAndCheckout('orderPlaced', confirmedOrder)
      }, 1000)
    }
    if (paymentVerificationStatus == 'failed') {
      setPaymentLoading(false)
      trackPaymentFailure({
        userId: session?.user?.id ?? '',
        orderId: currentCheckoutOrderId ?? '',
        reasonForFailure: currentCheckoutNote ?? ''
      })
    }

    paymentVerified.current = true
  }, [paymentVerificationStatus, selectedPaymentGateway, session])

  useEffect(() => {
    const formData = document.getElementById('payment_post') as HTMLFormElement
    if (formData) {
      formData.submit()
    }
  }, [paymentForm])

  const isPaymentDisabled = () => {
    if (pathname.includes('confirmation') && !currentLocation?.isDeliverable)
      return true

    if (products.every((p: any) => !p.isSelected)) return true

    if (
      pathname.includes('confirmation') &&
      products?.some(product => product?.note)
    )
      return true

    if (pathname.includes('confirmation') && checkout?.totalAmount == 0)
      return true

    if (
      (pathname.includes('prescription') ||
        pathname.includes('confirmation')) &&
      consultDoctorForPrescription &&
      (!dateOfConsult || !timeOfConsult)
    )
      return true

    if (
      pathname.includes('prescription') &&
      prescriptionRequired &&
      !prescriptionFiles.length &&
      !consultDoctorForPrescription
    )
      return true

    if (pathname.includes('prescription') && (!patientId || !patients.length))
      return true

    if (
      pathname.includes('confirmation') &&
      prescriptionRequired &&
      !prescriptionFiles.length &&
      !consultDoctorForPrescription
    )
      return true

    if (
      isBuyNow &&
      prescriptionRequired &&
      !prescriptionFiles.length &&
      !consultDoctorForPrescription
    )
      return true

    if (
      (pathname.includes('address') || pathname.includes('confirmation')) &&
      selectedAddress &&
      !selectedAddress?.coordinates
    )
      return true

    return (
      (pathname.includes('address') || pathname.includes('confirmation')) &&
      addresses?.length == 0
    )
  }

  const getCheckoutState = () => {
    return isOrderConfirmed ? checkoutCopy : checkout
  }

  const getDiscountOnMrp = () => {
    const state = getCheckoutState()

    const totalMrpDiscount = state?.products?.reduce(
      (acc: number, p: any) => (acc += p.maximumRetailPrice - p.finalPrice),
      0
    )

    return totalMrpDiscount
  }

  const getTotalSavings = () => {
    const state = getCheckoutState()

    let savings = state?.deliveryChargeWaiver + getDiscountOnMrp()
    if (!state?.handlingChargeApplicable) savings += state?.handlingCharge || 0
    if (!state?.packagingChargeApplicable)
      savings += state?.packagingCharge || 0
    if (!state?.platformFeeApplicable) savings += state?.platformFee || 0

    return savings
  }

  const freeDelivery = () => {
    const { freeMinOrderValue, subTotal } = getCheckoutState()

    return {
      freeMinOrderValue,
      subTotal,
      isEqual: freeMinOrderValue === subTotal,
      addMore: freeMinOrderValue - subTotal
    }
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: paymentForm }} />
      <div className='space-y-4'>
        <Card className='dark:bg-gray-900'>
          <CardHeader className='bg-gray-50 dark:bg-gray-700'>
            <CardTitle
              className='flex cursor-pointer items-center justify-between rounded-t-lg px-4 text-base'
              onClick={() => setIsOpen(!isOpen)}
            >
              {cart('payment_summary')}
              <span className='text-sm text-gray-600'>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div
                className={`space-y-3 overflow-hidden rounded-b-lg py-4 transition-all duration-500 ${
                  isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className='flex items-center justify-between text-sm'>
                  <p>{cart('mrp_total')}</p>
                  <span className='flex items-center font-medium'>
                    <IndianRupeeIcon size={14} />
                    {Number(getCheckoutState()?.subTotal).toFixed(2)}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <p>{cart('shipping_charges')}</p>
                  <span className='flex items-center font-medium'>
                    <IndianRupeeIcon size={14} />
                    {Number(getCheckoutState()?.deliveryCharge).toFixed(2)}
                  </span>
                </div>
                {getCheckoutState()?.deliveryCharge > 0 &&
                  getCheckoutState()?.freeMinOrderValue >=
                    getCheckoutState()?.subTotal && (
                    <div className='rounded-md bg-[#2A8F62] p-2 text-xs text-white'>
                      Add{' '}
                      {freeDelivery()?.isEqual
                        ? `more than ₹ ${Number(freeDelivery()?.freeMinOrderValue).toFixed(2)} to avail free delivery`
                        : `₹ ${Number(freeDelivery()?.addMore).toFixed(2)} more to avail free delivery`}
                    </div>
                  )}
                <div className='flex items-center justify-between text-sm'>
                  <p>{cart('tax_amount')}</p>
                  <span className='flex items-center font-medium'>
                    <IndianRupeeIcon size={14} />
                    {Number(getCheckoutState().taxAmount).toFixed(2)}
                  </span>
                </div>
                {getCheckoutState().isDavaOneMembershipAdded && (
                  <div className='flex items-center justify-between text-sm'>
                    <p>DavaONE Membership</p>
                    <span className='flex items-center font-medium'>
                      <IndianRupeeIcon size={14} />
                      {Number(
                        getCheckoutState()?.davaOneMembershipAmount
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className='flex items-center justify-between text-sm'>
                  <p>Handling Charges</p>
                  <span className='flex items-center gap-1'>
                    <span
                      className={`flex items-center font-medium ${!getCheckoutState().handlingChargeApplicable ? 'line-through' : ''}`}
                    >
                      <IndianRupeeIcon size={14} />
                      {getCheckoutState().handlingCharge}
                    </span>
                    {!getCheckoutState().handlingChargeApplicable && (
                      <span className='font-semibold text-primary-green'>
                        Free
                      </span>
                    )}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <p>Packaging Charges</p>
                  <span className='flex items-center gap-1'>
                    <span
                      className={`flex items-center font-medium ${!getCheckoutState().packagingChargeApplicable ? 'line-through' : ''}`}
                    >
                      <IndianRupeeIcon size={14} />
                      {getCheckoutState().packagingCharge}
                    </span>
                    {!getCheckoutState().packagingChargeApplicable && (
                      <span className='font-semibold text-primary-green'>
                        Free
                      </span>
                    )}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='flex cursor-pointer items-center gap-1'>
                          <span>{cart('platform_fee')}</span>
                          <InfoIcon size={14} className='text-gray-500' />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className='max-w-sm'>
                        <p className='text-sm text-gray-700'>
                          This fee helps support Davaindia's operations and
                          improvements, ensuring you enjoy a seamless and
                          hassle-free app experience.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className='flex items-center gap-1'>
                    <span
                      className={`flex items-center font-medium ${!getCheckoutState().platformFeeApplicable ? 'line-through' : ''}`}
                    >
                      <IndianRupeeIcon size={14} />
                      {getCheckoutState().platformFee}
                    </span>
                    {!getCheckoutState().platformFeeApplicable && (
                      <span className='font-semibold text-primary-green'>
                        Free
                      </span>
                    )}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <p>{cart('total_coupon_discount')}</p>
                  <span className='flex items-center font-medium text-red-600'>
                    - <IndianRupeeIcon size={14} />
                    {Number(getCheckoutState().discountAmount).toFixed(2)}
                  </span>
                </div>
                {getCheckoutState()?.davaCoinsUsed > 0 && (
                  <div className='flex items-center justify-between text-sm'>
                    <p>Dava Coins</p>
                    <span className='flex items-center font-medium text-red-600'>
                      - <IndianRupeeIcon size={14} />{' '}
                      {getCheckoutState().davaCoinsUsed}
                    </span>
                  </div>
                )}

                <div className='py-3'>
                  <div className='rounded-md border border-[#7D0039]'>
                    <div
                      className='flex items-center justify-center gap-3 rounded-t-md bg-gradient-to-b p-3 text-sm text-white'
                      style={{
                        background:
                          'linear-gradient(to bottom, #7D0039,#D0005F)'
                      }}
                    >
                      <Image
                        src='/images/CheckoutSavings.svg'
                        alt='checkout savings'
                        width='25'
                        height='25'
                      />
                      <p>
                        You saved ₹ {Number(getTotalSavings()).toFixed(2)} for
                        this order
                      </p>
                    </div>

                    <div className='space-y-4 p-4'>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center gap-2'>
                          <Image
                            src='/images/SavingsTick.svg'
                            alt='checkout tick'
                            width='20'
                            height='20'
                          />
                          <p>{cart('discount_on_mrp')}</p>
                        </div>
                        <span className='flex items-center font-medium'>
                          <IndianRupeeIcon size={14} />
                          {Number(getDiscountOnMrp()).toFixed(2)}
                        </span>
                      </div>

                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center gap-2'>
                          <Image
                            src='/images/SavingsTick.svg'
                            alt='checkout tick'
                            width='20'
                            height='20'
                          />
                          <p>{cart('free_delivery')}</p>
                        </div>
                        <span className='flex items-center font-medium'>
                          <IndianRupeeIcon size={14} />
                          {Number(
                            getCheckoutState().deliveryChargeWaiver
                          ).toFixed(2)}
                        </span>
                      </div>

                      {!getCheckoutState().handlingChargeApplicable && (
                        <div className='flex items-center justify-between text-sm'>
                          <div className='flex items-center gap-2'>
                            <Image
                              src='/images/SavingsTick.svg'
                              alt='checkout tick'
                              width='20'
                              height='20'
                            />
                            <p>Handling Charge</p>
                          </div>
                          <span className='flex items-center font-medium'>
                            <IndianRupeeIcon size={14} />
                            {Number(getCheckoutState()?.handlingCharge).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      )}

                      {!getCheckoutState().packagingChargeApplicable && (
                        <div className='flex items-center justify-between text-sm'>
                          <div className='flex items-center gap-2'>
                            <Image
                              src='/images/SavingsTick.svg'
                              alt='checkout tick'
                              width='20'
                              height='20'
                            />
                            <p>Packaging Charge</p>
                          </div>
                          <span className='flex items-center font-medium'>
                            <IndianRupeeIcon size={14} />
                            {Number(
                              getCheckoutState()?.packagingCharge
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}

                      {!getCheckoutState().platformFeeApplicable && (
                        <div className='flex items-center justify-between text-sm'>
                          <div className='flex items-center gap-2'>
                            <Image
                              src='/images/SavingsTick.svg'
                              alt='checkout tick'
                              width='20'
                              height='20'
                            />
                            <p>{cart('platform_fee')}</p>
                          </div>
                          <span className='flex items-center font-medium'>
                            <IndianRupeeIcon size={14} />
                            {Number(getCheckoutState()?.platformFee).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {checkout?.isOrderConfirmed ? (
                <div className='flex items-center justify-between text-base font-semibold'>
                  <p>{cart('total_paid')}</p>
                  <span className='flex items-center'>
                    <IndianRupeeIcon size={14} />
                    {Number(getCheckoutState()?.totalAmount).toFixed(2)}
                  </span>
                </div>
              ) : (
                <div>
                  {Number(davaCoinsBalance ?? 0) > 0 && !isOrderConfirmed && (
                    <DavaCoinOption />
                  )}

                  <div className='mt-4 flex items-center justify-between text-base font-semibold'>
                    <p>{cart('total_payable')}</p>
                    <span className='flex items-center'>
                      <IndianRupeeIcon size={14} />
                      {Number(checkout?.totalAmount).toFixed(2)}
                    </span>
                  </div>

                  <div className='pt-6'>
                    <Button
                      className='w-full'
                      onClick={() => handleProceedCheckout()}
                      disabled={isPaymentDisabled()}
                    >
                      {isPending && (
                        <Loader2Icon size={24} className='mr-3 animate-spin' />
                      )}
                      {isPending
                        ? `${common('creating_payment')} ...`
                        : isPayNow()
                          ? `${common('confirm_and_pay')}`
                          : `${common('continue_button')}`}
                    </Button>

                    {!currentLocation?.isDeliverable && (
                      <div className='mt-3 flex justify-center text-sm text-red-500'>
                        We're coming to selected location soon. Stay tuned for
                        updates.
                      </div>
                    )}

                    {selectedAddress && !selectedAddress.coordinates && (
                      <div className='mt-3 flex justify-center text-sm text-red-500'>
                        Please select your location on map in the address form
                        to continue.
                      </div>
                    )}

                    {pathname.includes('confirmation') &&
                      products?.some(
                        product => product?.note && product?.isNotDeliverable
                      ) && (
                        <div className='mt-3 flex justify-center text-sm text-red-500'>
                          {products.find(product => product?.note)?.note}
                        </div>
                      )}

                    {products?.some(product => product?.isOutOfStock) && (
                      <div className='mt-3 flex justify-center text-sm text-red-500'>
                        Some products in your cart are unavailable. Please
                        continue with the available products
                      </div>
                    )}

                    {products.every((p: any) => !p.isSelected) && (
                      <div className='mt-3 flex justify-center text-sm text-red-500'>
                        Please select any one product to proceed further.
                      </div>
                    )}

                    {(pathname.includes('prescription') ||
                      pathname.includes('confirmation')) &&
                      consultDoctorForPrescription &&
                      (!dateOfConsult || !timeOfConsult) && (
                        <div className='mt-3 flex justify-center text-sm text-red-500'>
                          Please select date and time for doctor consultation.
                        </div>
                      )}
                    {pathname.includes('prescription') &&
                      (!patientId || !patients.length) && (
                        <div className='mt-3 flex justify-center text-sm text-red-500'>
                          Please select patient to proceed further.
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <PageSpinner show={paymentLoading} />
      </div>
    </>
  )
}
