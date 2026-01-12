import React, { useState } from 'react'
import { Button } from '../ui/button'
import FormDialog from '../Form/FormDialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { getCancelProductSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useCancelProduct } from '@/utils/hooks/orderHooks'
import { useGetAllCancelReasons } from '@/utils/hooks/appDataHooks'
import { trackOrderCancelled } from '@/analytics/trackers/orderTracker'
import { useSession } from 'next-auth/react'
import { Switch } from '@/components/ui/switch' // assume you have a switch/toggle component
import { Input } from '@/components/ui/input'

export default function CancelOrderDialog({
  orderId,
  productId,
  quantity = 1,
  onCancel
}: {
  orderId: string
  productId: string
  quantity: number
  onCancel?: any
}) {
  const { data: cancelReasons, isPending: cancelReasonsPending } =
    useGetAllCancelReasons()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const { data: session } = useSession()
  const [cancelWhole, setCancelWhole] = useState(true)

  const cancelProductSchema = getCancelProductSchema(quantity)

  // form
  const form = useForm<z.infer<typeof cancelProductSchema>>({
    resolver: zodResolver(cancelProductSchema),
    defaultValues: {
      reason: '',
      note: '',
      cancelQuantity: 1
    }
  })

  const { mutateAsync: cancelProduct, isPending } = useCancelProduct()

  const handleOnSubmit = async (data: {
    reason: string
    note: string
    cancelQuantity?: number
  }) => {
    const finalQty =
      quantity === 1 || cancelWhole ? quantity : (data.cancelQuantity ?? 1)

    await cancelProduct({
      orderId,
      productId,
      reason: data.reason,
      note: data.note,
      cancelQuantity: finalQty
    })

    trackOrderCancelled({
      orderId,
      userId: session?.user?.id ?? '',
      productId,
      cancellationReason: data.reason + ' - ' + data.note
    })

    setDialogOpen(false)
    if (typeof onCancel === 'function') onCancel()
  }

  if (cancelReasonsPending) return <div>Loading...</div>

  return (
    <div>
      <FormDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        trigger={
          <Button
            variant={'destructive'}
            size={'sm'}
            onClick={() => setDialogOpen(true)}
          >
            Cancel
          </Button>
        }
        title={'Cancel Product'}
        content={
          <div className=''>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(data => {
                  handleOnSubmit(data)
                })}
              >
                <div className='flex flex-col gap-4'>
                  {/* Reason field */}
                  <FormField
                    control={form.control}
                    name='reason'
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select Your Reason' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cancelReasons?.map((reason: any, idx: number) => {
                              return (
                                <SelectItem
                                  key={idx}
                                  value={reason?.statusCode}
                                >
                                  {reason?.name}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantity logic */}
                  {quantity > 1 && (
                    <div className='flex flex-col gap-2 pt-3'>
                      <div className='flex items-center justify-between'>
                        <label className='text-sm font-medium'>
                          Cancel whole product?
                        </label>
                        <Switch
                          checked={cancelWhole}
                          onCheckedChange={setCancelWhole}
                          className=''
                        />
                      </div>

                      {!cancelWhole && (
                        <>
                          <FormField
                            control={form.control}
                            name='cancelQuantity'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type='number'
                                    min={1}
                                    max={quantity}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className='text-xs text-label'>
                            Max Quantity: {quantity}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Note */}
                  <Textarea
                    {...form.register('note')}
                    placeholder='Enter note*'
                    style={{ backgroundColor: '#F9F9F9' }}
                  />

                  <Button
                    type='submit'
                    className='mt-4 w-full'
                    variant={'destructive'}
                    disabled={isPending}
                  >
                    Cancel Product
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        }
        footerActions={null}
      />
    </div>
  )
}
