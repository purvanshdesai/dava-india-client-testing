'use client'
import { PhoneIcon, MailIcon } from 'lucide-react'
import React, { useState } from 'react'
import { contactFormSchema } from '@/lib/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSendUserQuery } from '@/utils/hooks/contactUsHooks'

export default function ContactUsPage() {
  const [isSubmitted, setSubmitStatus] = useState(false)
  const { mutateAsync: sendUserQuery, isPending } = useSendUserQuery()

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      message: ''
    }
  })

  const handleOnSubmit = async (data: any) => {
    try {
      await sendUserQuery(data)
      setSubmitStatus(true)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='flex items-center justify-center'>
      <div
        className='m-6 min-h-96 w-[75%] overflow-y-auto rounded-lg bg-primary-green-dim p-6'
        style={{
          background:
            'linear-gradient(0deg, rgba(220,252,231,1) 0%, rgba(17,122,79,1) 100%)'
        }}
      >
        <div className='space-y-4'>
          <p className='text-center text-xl font-semibold text-white'>
            Contact Us
          </p>

          {isSubmitted ? (
            <div className='flex h-72 items-center justify-center'>
              <div className='w-full md:w-1/2'>
                <p className='text-center text-lg font-semibold text-black'>
                  Thank You for Reaching Out!
                </p>
                <p className='pt-3 text-center text-sm text-black'>
                  We've received your query and will get back to you shortly. If
                  your query is urgent, feel free to contact us directly at
                  +91-8471 009 009.
                </p>
              </div>
            </div>
          ) : (
            <div className='grid h-full grid-cols-2 gap-x-6 p-3'>
              <div className='min-h-96 w-full rounded-md bg-white'>
                <div className='w-full space-y-6 p-6'>
                  <p className='text-center text-base font-semibold'>
                    For any queries please connect with us
                  </p>

                  <div className='px-6'>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(data => {
                          console.log('Form is being submitted')
                          handleOnSubmit(data)
                        })}
                      >
                        <div className='flex flex-col gap-4'>
                          <Input
                            {...form.register('name')}
                            placeholder='Enter your name*'
                            style={{ backgroundColor: '#F9F9F9' }}
                          />

                          {form?.formState?.errors?.name && (
                            <p className='text-xs text-red-600'>
                              {form?.formState?.errors?.name?.message}
                            </p>
                          )}

                          <Input
                            {...form.register('phoneNumber')}
                            placeholder='Mobile Number*'
                            style={{ backgroundColor: '#F9F9F9' }}
                          />
                          {form?.formState?.errors?.phoneNumber && (
                            <p className='text-xs text-red-600'>
                              {form?.formState?.errors?.phoneNumber?.message}
                            </p>
                          )}

                          <Input
                            {...form.register('email')}
                            placeholder='Email*'
                            style={{ backgroundColor: '#F9F9F9' }}
                          />
                          {form?.formState?.errors?.email && (
                            <p className='text-xs text-red-600'>
                              {form?.formState?.errors?.email?.message}
                            </p>
                          )}

                          <Textarea
                            {...form.register('message')}
                            placeholder='Type Your Query'
                            style={{ backgroundColor: '#F9F9F9' }}
                          />
                          {form?.formState?.errors?.message && (
                            <p className='text-xs text-red-600'>
                              {form?.formState?.errors?.message?.message}
                            </p>
                          )}

                          <Button
                            type='submit'
                            className='mt-4 w-full'
                            disabled={isPending}
                          >
                            {isPending ? 'Submitting' : 'Submit'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
              <div className='min-h-96 rounded-md bg-white'>
                <div className='space-y-6 p-6'>
                  <p className='text-center text-base font-semibold'>
                    Our Offices
                  </p>

                  <div>
                    <p className='pb-2 text-sm font-semibold'>
                      Registered Office :
                    </p>

                    <div className='text-xs'>
                      Davaindia Generic Pharmacy (A Brand of ZOTA HEALTH CARE
                      LIMITED)Zota House 2/896, Hira Modi Street Sagrampura,
                      Surat, Gujarat-395002
                    </div>
                    <p
                      className='flex cursor-pointer items-center gap-2 pt-2 text-sm'
                      onClick={() =>
                        (window.location.href = 'tel:+918471009009')
                      }
                    >
                      <PhoneIcon className='text-label' size={18} />
                      +91-8471 009 009
                    </p>
                  </div>

                  <div className='w-full border-b'></div>

                  <div>
                    <p className='pb-2 text-sm font-semibold'>Head Office :</p>

                    <div className='text-xs'>
                      Zota House, 2 & 3rd Floor,Navsari State Highway, Bhagwan
                      Aiyappa Complex,Opp. GIDC, Udhna, Pandesara Ind. Estate,
                      Surat, Gujarat - 394221
                    </div>
                    <p
                      className='flex cursor-pointer items-center gap-2 pt-2 text-sm'
                      onClick={() =>
                        (window.location.href = 'tel:+918471009009')
                      }
                    >
                      <PhoneIcon className='text-label' size={18} />
                      +91-8471 009 009
                    </p>
                   
                    <p
                      className='flex cursor-pointer items-center gap-2 pt-2 text-sm'
                      onClick={() =>
                        window.open(
                          'https://mail.google.com/mail/?view=cm&fs=1&to=care@davaindia.com',
                          '_blank'
                        )
                      }
                    >
                      <MailIcon className='text-label' size={18} />
                      care@davaindia.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
