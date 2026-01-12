import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface FormDialog {
  title: string
  content: any
  footerActions?: any
  trigger?: any
  open?: any
  onOpenChange?: any
  isCoupon?: any
  classNames?: string
  width?: any
  styles?: any
}

// Reusable FormDialog component
export default function FormDialog({
  title,
  content,
  footerActions,
  trigger,
  open,
  onOpenChange,
  isCoupon = false,
  classNames = '',
  styles
}: FormDialog) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <div className='bg-white'>
        <DialogContent
          className={cn(
            isCoupon ? '' : '',
            `md:w-[1300px] ${classNames}`,
            'md:w-[1300px]',
            styles
          )}
        >
          <DialogHeader className=''>
            <DialogTitle className={'text-lg'}>{title}</DialogTitle>
          </DialogHeader>
          <div
            className={cn(
              isCoupon ? 'bg-primary-light-blue' : '',
              'grid gap-4'
            )}
          >
            {content}
          </div>
          <DialogFooter className='w-full'>{footerActions}</DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  )
}
