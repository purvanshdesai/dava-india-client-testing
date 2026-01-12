import { Separator } from '@/components/ui/separator'

interface PaymentDetailsPageProps {
  orderDetails: any
}

export function PaymentDetails({ orderDetails }: PaymentDetailsPageProps) {
  const paymentInfo = orderDetails

  return (
    <div className='bg-card text-card-foreground mt-4 rounded-lg border shadow-sm'>
      <div className='space-y-4 p-6'>
        <h3 className='text-muted-foreground text-sm font-medium'>
          Payment Details
        </h3>

        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground text-sm'>Order ID</span>
            <span className='text-sm font-medium'>{paymentInfo.orderId}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-muted-foreground text-sm'>Date</span>
            <span className='text-sm font-medium'>{paymentInfo.date}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-muted-foreground text-sm'>Amount</span>
            <span className='text-sm font-medium'>₹{paymentInfo.amount}</span>
          </div>

          <Separator className='my-2' />

          <div className='flex justify-between'>
            <span className='text-muted-foreground text-sm'>
              Payment Method
            </span>
            <span className='text-sm font-medium'>{paymentInfo.method}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-muted-foreground text-sm'>Email</span>
            <span className='text-sm font-medium'>{paymentInfo.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
