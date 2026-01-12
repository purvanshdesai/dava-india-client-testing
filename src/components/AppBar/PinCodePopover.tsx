import { MapPinned } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'
import useDeliveryAddressStore from '@/store/useDeliveryAddressStore'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useSession } from 'next-auth/react'
import { Link } from 'next-view-transitions'
import { useEffect, useRef, useState } from 'react'
import { fetchLocationByZipCode } from '@/utils/actions/zipCodeActions'
import { PopoverClose } from '@radix-ui/react-popover'

export default function PinCodePopover() {
  const session = useSession()
  const isLoggedIn = session.status === 'authenticated'
  const productTranslation = useTranslations('Product')
  const cart = useTranslations('Cart')
  const locationManager = useTranslations('LocationManager')
  const { addresses } = useDeliveryAddressStore(state => state)
  const popoverCloseRef: any = useRef(null)

  const {
    changeAddress: handleAddressChange,
    setCurrentLocation,
    currentLocation,
    selectedAddress
  } = useCheckoutStore(state => state)

  const [zipCode, setZipCode] = useState(currentLocation?.zipCode ?? '')
  const [isZipCodeNotExist, setZipCodeNotExistStatus] = useState(false)

  useEffect(() => {
    const fetchNewLocation = async () => {
      const res = await fetchLocationByZipCode(zipCode)
      if (!res.location) setZipCodeNotExistStatus(true)
      else {
        // setCurrentLocation(res)
        setZipCodeNotExistStatus(false)
      }
    }

    if (zipCode?.length == 6 && zipCode !== currentLocation?.zipCode)
      fetchNewLocation()
  }, [zipCode])

  const handleApply = async () => {
    if (zipCode?.length === 6 && !isZipCodeNotExist) {
      const res = await fetchLocationByZipCode(zipCode)
      if (res.location) {
        setCurrentLocation(res)
        setZipCodeNotExistStatus(false)
      } else {
        setZipCodeNotExistStatus(true)
      }
    }
  }

  const handleSelectAddress = (address: any) => {
    setZipCode(address?.postalCode)
    handleAddressChange(address)
  }

  return (
    <div className='flex flex-col gap-3 divide-y divide-gray-300'>
      <div className='px-4 pt-4 text-lg font-semibold'>
        {locationManager('choose_location')}
      </div>
      <div className='flex flex-col gap-3 px-4 pb-2 pt-4'>
        <span className='text-sm font-semibold'>
          {locationManager('enter_pincode')}
        </span>
        <div className='w-50 relative'>
          <MapPinned
            className='absolute left-2 top-2 text-gray-500'
            size={20}
          />
          <Input
            placeholder={locationManager('pincode')}
            value={zipCode}
            className='px-10 text-sm font-semibold'
            onChange={e => setZipCode(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleApply()
                if (zipCode?.length === 6 && !isZipCodeNotExist) {
                  popoverCloseRef.current?.click()
                }
              }
            }}
            autoFocus={false}
          />
          <PopoverClose ref={popoverCloseRef}>
            <div
              className='absolute right-2 top-2 cursor-pointer font-semibold text-primary'
              onClick={handleApply}
            >
              {cart('apply_button')}
            </div>
          </PopoverClose>
        </div>
        <div>
          {isZipCodeNotExist ? (
            <p className='text-xs font-semibold italic text-red-600'>
              {productTranslation('pincode_not_available')}
            </p>
          ) : (
            <p className='text-xs italic text-label'>
              {zipCode && zipCode.length > 6 ? (
                <span className='italic text-red-600'>Enter valid pincode</span>
              ) : (
                `${currentLocation?.area}, ${currentLocation?.district}`
              )}
            </p>
          )}
        </div>
      </div>
      {isLoggedIn ? (
        <div className='max-h-96 overflow-y-auto'>
          {addresses && addresses.length > 0 && (
            <div className='px-3 pb-4'>
              <p className='px-2 py-3 text-base font-semibold'>My Addresses</p>

              <ul className='flex flex-col gap-2 px-2'>
                {/* {defaultAddress && (
                  <li
                    onClick={() => handleSelectAddress(defaultAddress)}
                    className={`rounded border ${selectedAddress?._id == defaultAddress?._id ? 'bg-primary-dim' : 'cursor-pointer'} ${selectedAddress?._id == defaultAddress?._id ? 'border-primary' : 'border-[#DDDDDD]'} p-3 text-sm`}
                  >
                    <span className='font-semibold'>
                      {defaultAddress?.userName},{' '}
                    </span>{' '}
                    {defaultAddress?.type && (
                      <span> {defaultAddress?.type}, </span>
                    )}
                    <span>
                      {defaultAddress?.addressLine1},{' '}
                      {defaultAddress?.addressLine2}, {defaultAddress?.city},{' '}
                      {defaultAddress?.state}, {defaultAddress?.country} ,
                    </span>
                    <span className='font-semibold'>
                      {defaultAddress?.postalCode}
                    </span>
                  </li>
                )} */}
                {addresses?.map((address: any) => {
                  const isSelected = selectedAddress?._id == address?._id

                  return (
                    <li
                      key={address?._id}
                      onClick={() => handleSelectAddress(address)}
                      className={`rounded border ${isSelected ? 'bg-primary-dim' : 'cursor-pointer'} ${isSelected ? 'border-primary' : 'border-[#DDDDDD]'} p-3 text-sm`}
                    >
                      <p className='font-semibold'>{address?.userName},</p>{' '}
                      {address?.type && <span> {address?.type}, </span>}
                      <span>
                        {address.addressLine1}, {address.addressLine2},{' '}
                        {address.city}
                      </span>
                      <p>
                        {address.state}, {address.country}
                      </p>
                      <p className='font-semibold'>{address.postalCode}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className='flex flex-col items-center gap-3 p-4'>
          <Link href={'/login'} className='w-full'>
            <Button type='button' className='w-full'>
              {locationManager('sign_in')}
            </Button>
          </Link>

          <span className='text-xs text-gray-400'>
            {locationManager('sign_in_description')}
          </span>
        </div>
      )}
    </div>
  )
}
