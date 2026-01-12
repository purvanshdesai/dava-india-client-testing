'use client'
import Image from 'next/image'
import { useEffect } from 'react'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { useForm, UseFormReturn } from 'react-hook-form'
import { userSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormComboboxField from '../Form/FormCombobox'
import { useSession } from 'next-auth/react'
import { useGetUser, usePatchUserDetails } from '@/utils/hooks/auth'
import { useToast } from '@/hooks/use-toast'
import FormReactDatePicker from '../Form/FormReactDatePicker'

export default function EditProfile() {
  const session = useSession()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: null,
      gender: '',
      height: '',
      weight: ''
    }
  })
  const userId = session?.data?.user?.id
  const { data } = useGetUser(userId)

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        phone: data?.phoneNumber?.startsWith('+91')
          ? data.phoneNumber.slice(3)
          : data.phoneNumber,
        dateOfBirth: data?.dateOfBirth ? new Date(data?.dateOfBirth) : null
      })
    }
  }, [data])
  const updateUserData = usePatchUserDetails()

  const handleSubmit = async (data: z.infer<typeof userSchema>) => {
    try {
      const updatedDetails = { ...data, phoneNumber: data?.phone }
      await updateUserData.mutateAsync({ id: userId, data: updatedDetails })
      toast({
        title: 'Success',
        description: `Your details has been updated `
      })
    } catch (error) {
      console.log(error, 'error while patching')
    }
  }

  return (
    <div className='w-full bg-gray-100'>
      <div className='w-full rounded-lg bg-white p-8 shadow-md'>
        <div className='flex w-full flex-col items-center'>
          <h2 className='mb-6 text-center text-2xl font-semibold'>
            Edit Profile
          </h2>
          <div className='mb-6 flex justify-center'>
            <div
              style={{ position: 'relative', width: '52px', height: '52px' }}
            >
              <Image
                src={'/images/InnerSideBarImage.svg'}
                alt='Footer Logo'
                fill
                objectFit='contain'
              />
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='w-96 space-y-7'
            >
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Your Name'
                          className='border-gray-200 bg-gray-100'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            className='w-full border-gray-200 bg-gray-100 pl-12'
                            placeholder='Enter phone number'
                            value={field.value}
                            onChange={e => {
                              if (/^\d*$/.test(e.target.value)) {
                                field.onChange(e.target.value)
                              }
                            }}
                          />
                          <div className='absolute left-2 top-2 border-r-2 border-[#B2B2C2] pr-2'>
                            +91
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={true}
                          placeholder='Email'
                          className='border-gray-200 bg-gray-100'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormComboboxField
                  formInstance={form as unknown as UseFormReturn}
                  isSmall={true}
                  multiple={false}
                  name='gender'
                  items={(
                    [
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                      { label: 'Others', value: 'others' }
                    ] as any
                  )?.map((c: any) => ({
                    label: c.label,
                    value: c.value
                  }))}
                  className='w-full'
                />

                <FormReactDatePicker
                  className='w-full'
                  formInstance={form as unknown as UseFormReturn}
                  name='dateOfBirth'
                  placeholder='Select a date'
                  isSmall={true}
                />
                <FormField
                  control={form.control}
                  name='height'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Your Height'
                          className='border-gray-200 bg-gray-100'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='weight'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Your Weight'
                          className='border-gray-200 bg-gray-100'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type='submit' className='mt-4 w-full'>
                Save
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
