'use client'
import { usePathname } from 'next/navigation'
import {
  MapPinHouseIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  FileTextIcon
} from 'lucide-react'
import { useTransitionRouter } from 'next-view-transitions'
import { useTranslations } from 'next-intl'
import useCheckoutStore from '@/store/useCheckoutStore'
import { isPrescriptionStepRequired } from '@/store/useCheckoutStore'

const dashes = (idx: number) => {
  return (
    <>
      <div className='flex text-label dark:text-label-dark'>
        {Array.from(Array(10).keys()).map(i => (
          <span key={`dash-${idx}-${i}`}>-</span>
        ))}
      </div>
    </>
  )
}

export default function CheckoutHeader() {
  const pathname = usePathname()
  const router = useTransitionRouter()
  const prescriptionStepRequired = isPrescriptionStepRequired()

  const { isBuyNow, totalProducts, isOrderConfirmed, isConsultationOrder } =
    useCheckoutStore(state => state)

  const cart = useTranslations('Cart')

  const checkoutRoutes = [
    {
      title: cart('cart_title'),
      path: 'cart',
      icon: ShoppingCartIcon,
      lookupKeys: ['cart']
    },
    {
      title: 'Prescription Upload',
      path: 'prescription',
      icon: FileTextIcon,
      lookupKeys: ['cart', 'prescription']
    },
    {
      title: cart('address_title'),
      path: 'address',
      icon: MapPinHouseIcon,
      lookupKeys: ['cart', 'prescription', 'address']
    },
    {
      title: cart('payment_title'),
      path: 'confirmation',
      icon: CreditCardIcon,
      lookupKeys: ['cart', 'address', 'confirmation', 'payment']
    }
  ]

  const getLookupKeys = (): Array<any> => {
    const route = checkoutRoutes.find(r => {
      return pathname.includes(r.path)
    })
    return route?.lookupKeys ?? []
  }

  if (totalProducts == 0 || isOrderConfirmed) return <></>

  const filteredRoutes = checkoutRoutes.filter(r => {
    if (r.path == 'prescription' && !prescriptionStepRequired) return false
    return true
  })

  return (
    <div>
      {isBuyNow || isConsultationOrder ? (
        <div className='pt-6 text-center text-lg font-semibold text-primary'>
          {cart('checkout')}
        </div>
      ) : (
        <div className='flex flex-wrap items-center justify-center gap-2 p-4 text-sm font-medium md:p-6'>
          {filteredRoutes.map((r, idx) => {
            const Icon = r.icon
            const confirmedRoutes = getLookupKeys().includes(r.path)

            return (
              <div key={idx} className='flex gap-2'>
                <div
                  className={`${confirmedRoutes ? 'cursor-pointer font-semibold text-primary' : ''} flex items-center gap-1`}
                  onClick={() =>
                    confirmedRoutes && router.push(`/checkout/${r.path}`)
                  }
                >
                  <Icon size={20} />
                  {r.title}
                </div>
                {idx != filteredRoutes.length - 1 && <div>{dashes(idx)}</div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
