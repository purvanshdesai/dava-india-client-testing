import React, { useState } from 'react'
import { Button } from '../ui/button'
import FormDialog from '../Form/FormDialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { getReturnProductSchema } from '@/lib/zod'
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
import { Switch } from '@/components/ui/switch' // ✅ add a toggle switch
import { Input } from '@/components/ui/input' // ✅ for quantity field
import { useReturnProduct } from '@/utils/hooks/orderHooks'
import dynamic from 'next/dynamic'
import { UploadIcon } from 'lucide-react'
import { useGetAllReturnReasons } from '@/utils/hooks/appDataHooks'
import Image from 'next/image'
import { trackOrderReturnRequest } from '@/analytics/trackers/orderTracker'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

const FileUploadComponent = dynamic(
  () => import('@/components/Prescription/FileUpload'),
  { ssr: false }
)

export default function ReturnOrderDialog({
  orderId,
  productId,
  productQuantity, // ✅ pass total quantity as prop
  onReturn
}: {
  orderId: string
  productId: string
  productQuantity: number
  onReturn?: any
}) {
  const { data: returnReasons, isPending: returnReasonsPending } =
    useGetAllReturnReasons()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const [returnWhole, setReturnWhole] = useState(true)

  // form

  const returnProductSchema = getReturnProductSchema(productQuantity)

  const form = useForm<
    z.infer<typeof returnProductSchema> & { quantity?: number }
  >({
    resolver: zodResolver(returnProductSchema),
    defaultValues: {
      reason: '',
      note: '',
      images: [],
      quantity: 1
    }
  })

  const { mutateAsync: returnProduct, isPending } = useReturnProduct()

  const handleOnSubmit = async (data: any) => {
    try {
      const payload = {
        orderId,
        productId,
        ...data,
        returnQuantity: returnWhole ? productQuantity : data.returnQuantity // ✅ handle quantity logic
      }

      await returnProduct(payload as any)

      trackOrderReturnRequest({
        orderId,
        userId: session?.user?.id ?? '',
        productId,
        reasonForReturn: data.reason + ' - ' + data.note
      })

      setDialogOpen(false)
      if (typeof onReturn === 'function') onReturn()
    } catch (e: any) {
      toast({
        title: 'Oops!',
        description: e.message
      })
    }
  }

  if (returnReasonsPending) return <div>Loading...</div>

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
            Return
          </Button>
        }
        title={'Return Product'}
        content={
          <div className=''>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleOnSubmit)}>
                <div className='flex max-h-[500px] flex-col gap-4 overflow-y-auto'>
                  {/* Return Guidelines */}
                  <div className='mb-2'>
                    <div className='mb-4 ml-1 text-xs font-semibold'>
                      Return Guidelines
                    </div>
                    <div className='flex gap-3'>
                      <Image
                        src='/images/ReturnPopup.svg'
                        alt='Return Image'
                        width={150}
                        height={300}
                        className='object-contain'
                      />
                      <div className='flex flex-col gap-2 text-xs'>
                        <p>
                          1. Please return the products in their original
                          packaging.
                        </p>
                        <p>
                          2. Attach pictures of the batch ID and issue with the
                          product.
                        </p>
                        <p>
                          3. The original invoice must be included with the
                          return.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
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
                            {returnReasons?.map((reason: any, idx: number) => (
                              <SelectItem key={idx} value={reason?.statusCode}>
                                {reason?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ✅ Quantity Logic */}
                  {productQuantity > 1 && (
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>
                          Return whole product?
                        </span>
                        <Switch
                          checked={returnWhole}
                          onCheckedChange={setReturnWhole}
                        />
                      </div>

                      {!returnWhole && (
                        <>
                          <FormField
                            control={form.control}
                            name='returnQuantity'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type='number'
                                    min={1}
                                    max={productQuantity}
                                    placeholder='Enter quantity to return'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className='text-xs text-label'>
                            Max Quantity: {productQuantity}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div>
                    {/* Notes */}
                    <Textarea
                      {...form.register('note')}
                      placeholder='Enter note*'
                      style={{ backgroundColor: '#F9F9F9' }}
                    />
                  </div>

                  {/* File Upload */}
                  <FileUploadComponent
                    onFileUpload={(_, filesObject) => {
                      form.setValue('images', filesObject ?? [])
                    }}
                    renderButton={(openFilePicker, isLoading) => (
                      <div
                        className='mt-2 flex w-full cursor-pointer items-center justify-center gap-3 rounded-md border-2 border-dashed p-3 text-sm'
                        onClick={openFilePicker}
                      >
                        <UploadIcon
                          size={20}
                          className={`${isLoading ? 'animate-bounce' : ''}`}
                        />
                        {isLoading ? 'Uploading ...' : 'Attach Product Image'}
                      </div>
                    )}
                    isLoggedIn={true}
                  />
                  {form?.formState?.errors?.images && (
                    <div className='pt-2 text-xs text-red-600'>
                      Please attach at least one product image
                    </div>
                  )}

                  <Button
                    type='submit'
                    className='mt-4 w-full'
                    variant={'destructive'}
                    disabled={isPending}
                  >
                    Return Product
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
