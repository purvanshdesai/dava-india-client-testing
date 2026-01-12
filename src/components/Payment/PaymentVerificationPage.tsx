import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { PaymentDetails } from './PaymentDetails'

interface PaymentVerificationPageProps {
  status: 'verifying' | 'success' | 'failed'
  orderDetails: any
}

export function PaymentVerificationPage({
  status,
  orderDetails
}: PaymentVerificationPageProps) {
  const statusMessages = {
    verifying: {
      title: 'Verifying Payment',
      description: 'Please wait while we verify your payment...',
      icon: <Loader2 className='h-16 w-16 animate-spin text-primary' />
    },
    success: {
      title: 'Payment Successful',
      description: 'Your payment has been successfully processed.',
      icon: <CheckCircle className='h-16 w-16 text-green-500' />
    },
    failed: {
      title: 'Payment Failed',
      description: "We couldn't process your payment. Please try again.",
      icon: <XCircle className='h-16 w-16 text-red-500' />
    }
  }

  const currentStatus = statusMessages[status]

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4'>
      <Card className='w-full max-w-lg border-0 shadow-lg'>
        <CardHeader className='flex flex-col items-center space-y-2 pb-2'>
          <div className='mb-2'>{currentStatus.icon}</div>
          <CardTitle className='text-center text-2xl font-bold'>
            {currentStatus.title}
          </CardTitle>
          <CardDescription className='text-center text-base'>
            {currentStatus.description}
          </CardDescription>
        </CardHeader>

        <CardContent className='pb-4'>
          {status !== 'verifying' && (
            <PaymentDetails orderDetails={orderDetails} />
          )}

          {status === 'verifying' && (
            <div className='mt-4 flex justify-center'>
              <div className='w-full max-w-[250px] space-y-2'>
                <div className='h-2 animate-pulse rounded-full bg-slate-200'></div>
                <div className='h-2 animate-pulse rounded-full bg-slate-200'></div>
                <div className='h-2 animate-pulse rounded-full bg-slate-200'></div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className='flex justify-center pb-6 pt-2'>
          <p className='text-xs'>
            Page will automatically redirect to app. Please do not close the
            window
          </p>

          {/* {status === 'success' && (
            <Button className='w-full max-w-[250px]'>Continue Shopping</Button>
          )}

          {status === 'failed' && (
            <Button className='w-full max-w-[250px]'>Try Again</Button>
          )} */}
        </CardFooter>
      </Card>

      <div className='mt-8 text-center text-sm text-slate-500'>
        <p>Copyright 2024 Davaindia. All rights reserved.</p>
        <p className='mt-1'>
          Need help?{' '}
          <a
            href='https://www.davaindia.com/contact-us'
            className='text-primary hover:underline'
            target='_blank'
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}
