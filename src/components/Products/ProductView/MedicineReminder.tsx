'use client'
import { Bell, BellRing } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { useTransitionRouter } from 'next-view-transitions'
//import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useCreateMedicineRemainder } from '@/utils/hooks/medicineRemainderHooks'
import useCheckoutStore from '@/store/useCheckoutStore'

interface MedicineReminderProps {
  productId: string
  productTitle: string
  isOutOfStock: boolean
}

export default function MedicineReminder({
  productId,
  productTitle,
  isOutOfStock
}: MedicineReminderProps) {
  const { toast } = useToast()
  const { data: session } = useSession()
  const router = useTransitionRouter()
  //const productTranslation = useTranslations('Product')
  const { currentLocation } = useCheckoutStore(state => state)

  const [isReminderSet, setIsReminderSet] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const createMedicineRemainder = useCreateMedicineRemainder()

  const handleSetReminder = async () => {
    if (!session?.user) {
      router.push('/login')
      return
    }

    if (!currentLocation?.zipCode) {
      toast({
        title: 'Location Required',
        description:
          'Please set your delivery location to set a medicine reminder.',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      // Create medicine remainder - backend will handle userId and deliveryPolicyId
      const res = await createMedicineRemainder.mutateAsync({
        pincode: currentLocation?.zipCode,
        productId
      })

      if (res.error) {
        toast({
          title: 'Oops!',
          description: res.message,
          variant: 'destructive'
        })
      } else {
        setIsReminderSet(true)
        toast({
          title: 'Reminder Set Successfully',
          description: `We'll notify you when ${productTitle} is back in stock at your location.`
        })
      }
    } catch (error: any) {
      toast({
        title: 'Oops!',
        description: error?.message,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Only show for out of stock products
  if (!isOutOfStock) {
    return null
  }

  return (
    <div className='flex items-center gap-2 py-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={handleSetReminder}
        disabled={isLoading || isReminderSet}
        className='flex items-center gap-2 text-sm'
      >
        {isLoading ? (
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
        ) : isReminderSet ? (
          <BellRing className='h-4 w-4 text-green-600' />
        ) : (
          <Bell className='h-4 w-4' />
        )}
        {isReminderSet ? 'Reminder Set' : 'Remind Me When Available'}
      </Button>
    </div>
  )
}
