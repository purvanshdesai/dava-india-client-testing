import { Input } from '@/components/ui/input'
import useCheckoutStore from '@/store/useCheckoutStore'
import { fetchLocationByZipCode } from '@/utils/actions/zipCodeActions'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { notServiceable } from '@/components/utils/icons'

export default function InnerPincode() {
  const { currentLocation, deliveryPolicy, setCurrentLocation } =
    useCheckoutStore(state => state)

  const [pinCode, setPinCode] = useState<any>(currentLocation?.zipCode)
  const [isZipCodeNotExist, setZipCodeNotExistStatus] = useState(false)
  const productTranslation = useTranslations('Product')
  const cart = useTranslations('Cart')

  useEffect(() => {
    const fetchNewLocation = async () => {
      const res = await fetchLocationByZipCode(pinCode)
      if (!res.location) setZipCodeNotExistStatus(true)
      else {
        // setCurrentLocation(res)
        setZipCodeNotExistStatus(false)
      }
    }

    if (pinCode?.length == 6 && pinCode !== currentLocation?.zipCode)
      fetchNewLocation()
  }, [pinCode])

  const handleApply = async () => {
    if (pinCode?.length === 6 && !isZipCodeNotExist) {
      const res = await fetchLocationByZipCode(pinCode)
      if (res.location) {
        setCurrentLocation(res)
        setZipCodeNotExistStatus(false)
      } else {
        setZipCodeNotExistStatus(true)
      }
    }
  }

  return (
    <div>
      {' '}
      <div className='pt-6'>
        <div
          className='flex w-full items-center justify-between rounded-md bg-gray-50 p-3 md:p-4'
          //   style={{
          //     background:
          //       'linear-gradient(114deg, rgba(220,252,231,1) 0%, rgba(172,223,113,1) 100%)'
          //   }}
        >
          <div className='flex flex-col gap-3 border-r-2 pr-8'>
            {/* <div className='text-sm text-gray-800'>
                <span className='pr-2 font-semibold text-gray-500'>
                  Expiry Date:
                </span>
                21-OCT-2024
              </div> */}
            <div className='flex flex-col gap-2 text-sm font-semibold'>
              {productTranslation('order_is_delivering_to')}
              <div className='flex items-center gap-3'>
                <div className='w-50 relative'>
                  <Input
                    className='appearance-none pl-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                    type='number'
                    placeholder='Pincode'
                    value={pinCode}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleApply()
                      }
                    }}
                    onChange={event => setPinCode(event.target.value)}
                  />
                  <div
                    className='absolute left-2 top-2.5'
                    style={{
                      width: '20px',
                      height: '20px'
                    }}
                  >
                    <Image
                      src={`/images/pinRound.svg`}
                      alt='Pin'
                      fill
                      priority={false}
                    />
                  </div>
                  <div
                    className='absolute right-2.5 top-[9px] cursor-pointer font-semibold text-primary'
                    onClick={handleApply}
                  >
                    {cart('apply_button')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='pl-4'>
            <div>
              {isZipCodeNotExist ? (
                <p className='flex items-center gap-2 text-xs font-medium italic text-red-600'>
                  {notServiceable} {productTranslation('pincode_not_available')}
                </p>
              ) : (
                <p className='text-xs italic text-label'>
                  {currentLocation?.area}, {currentLocation?.district}
                </p>
              )}
            </div>
            {currentLocation?.isDeliverable ? (
              <span className='pt-3 text-sm text-gray-800'>
                <span className='text-gray-500'>
                  {productTranslation('expected_delivery_date')}:
                </span>

                {deliveryPolicy?.deliveryEstimation ? (
                  dayjs(deliveryPolicy?.deliveryEstimation).format(
                    'DD MMM YYYY HH:mm A'
                  )
                ) : (
                  <div className='flex items-center gap-2'>'Not available'</div>
                )}
              </span>
            ) : (
              <span className={'flex items-center gap-2 text-sm'}>
                {notServiceable}
                Sorry, we are not delivering here at the moment. We will deliver
                soon.
              </span>
            )}
          </div>
          {/* <div
            style={{
              position: 'relative',
              width: '250px',
              height: '150px'
            }}
          >
            <Image
              src={`/images/ProductDescription/order-delivery.svg`}
              alt='Delivery-man'
              fill
              priority={true}
            />
          </div> */}
        </div>
      </div>
    </div>
  )
}
