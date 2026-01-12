'use client'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Edit3Icon, MailIcon, MapPinHouse, SmartphoneIcon } from 'lucide-react'
import { Link } from 'next-view-transitions'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
// import { AddNewAddressDialog } from './AddNewAddressDialog'
// import { useTranslations } from 'next-intl'

interface Props {
  hideEdit?: boolean
}

export default function DeliveryAddressSummary({ hideEdit }: Props) {
  const { selectedAddress, checkoutCopy, isOrderConfirmed } = useCheckoutStore(
    state => state
  ) as any
  // const cart = useTranslations('Cart')

  const address = isOrderConfirmed
    ? checkoutCopy?.selectedAddress
    : selectedAddress

  const { data } = useSession()

  function formatDeliveryMode(deliveryMode: string) {
    if (!deliveryMode) return ''
    // Insert a space before capital letters, then capitalize the first letter
    let formatted = deliveryMode.replace(/([A-Z])/g, ' $1') // Add space before capital letters
    formatted =
      formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase() // Capitalize first letter
    return formatted
  }

  const getDeliveryMode = () => {
    if (typeof window === 'undefined') return ''

    const mode: any = JSON.parse(localStorage.getItem('deliveryMode') ?? '{}')

    return mode ?? {}
  }

  return (
    <div>
      <Card className='dark:bg-gray-900'>
        <CardHeader className='rounded-t-lg bg-gray-50 p-3 dark:bg-gray-700'>
          <CardTitle className='flex items-center justify-between text-sm font-semibold'>
            {address && 'Delivery Address'}
            {/* {!address && (
              <div>
                {' '}
                <AddNewAddressDialog editAddress={''} loading={false} />
              </div>
            )} */}
            {!isOrderConfirmed && !hideEdit && (
              <Link href={'/checkout/address'}>
                <Edit3Icon size={20} className='cursor-pointer' />
              </Link>
            )}
          </CardTitle>
        </CardHeader>
        {address && (
          <CardContent className='space-y-3 pt-3'>
            <div className='flex gap-3'>
              <div>
                <MapPinHouse
                  size={20}
                  className='text-primary dark:text-label-dark'
                />
              </div>
              <div className='text-sm'>
                <p> {address?.userName} </p>
                {address?.addressLine1}, {address?.addressLine2},{' '}
                {address?.city}, {address?.state}, {address?.country}, Pin:{' '}
                {address?.postalCode},
              </div>
            </div>
            <div className='flex gap-3'>
              <div>
                <SmartphoneIcon
                  size={20}
                  className='text-primary dark:text-label-dark'
                />
              </div>
              <div className='text-sm'>{address?.phoneNumber}</div>
            </div>
            <div className='flex gap-3'>
              <div>
                <MailIcon
                  size={20}
                  className='text-primary dark:text-label-dark'
                />
              </div>
              <div className='text-sm'>{data?.user?.email}</div>
            </div>
            <div className='w-full border-b pb-3'></div>

            {isOrderConfirmed && (
              <div className='flex items-center gap-3'>
                <div>
                  <Image
                    src={`/images/${getDeliveryMode() == 'standard' ? 'StandardDelivery' : 'OneDayDelivery'}.svg`}
                    alt=''
                    width={40}
                    height={30}
                  />
                </div>
                <div className='text-sm font-semibold'>
                  {formatDeliveryMode(getDeliveryMode()?.mode)} Delivery
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
