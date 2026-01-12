'use client'
import { useForm, UseFormReturn } from 'react-hook-form'
import { newRegisterSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import React, { useEffect } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import FormReactDatePicker from '@/components/Form/FormReactDatePicker'
import { Button } from '@/components/ui/button'
import FormComboboxField from '@/components/Form/FormCombobox'
import {
  useGetUserDetailsByProfileToken,
  usePatchUserDetails,
  useSubmitProfileToken
} from '@/utils/hooks/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { getSession } from 'next-auth/react'
import { trackUserSignedIn } from '@/analytics/trackers/authTracker'
import dayjs from 'dayjs'

export default function ProfileSubmit() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const updateUserData = usePatchUserDetails()
  const { mutateAsync: loginWithProfileToken } = useSubmitProfileToken()
  const form = useForm<z.infer<typeof newRegisterSchema>>({
    resolver: zodResolver(newRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: null,
      gender: ''
    }
  })
  const profileToken: any = searchParams.get('profileToken')

  const { data: profileData }: any =
    useGetUserDetailsByProfileToken(profileToken)

  useEffect(() => {
    if (profileData?.user) {
      form.reset({
        ...profileData?.user,
        phoneNumber: profileData?.user?.phoneNumber?.slice(3),
        dateOfBirth: profileData?.user?.dateOfBirth
          ? new Date(profileData?.user?.dateOfBirth)
          : null
      })
    }
  }, [profileData?.user])

  const handleSubmit = async (data: z.infer<typeof newRegisterSchema>) => {
    try {
      const res = await updateUserData.mutateAsync({
        id: profileData?.user?._id,
        data: data
      })

      if (res?._doc) await loginWithProfileToken(profileToken)
      await trackUserLogin()
      router.push('/')
    } catch (error: any) {
      toast({
        title: 'Oops!',
        description: 'Email or Phone Number already exist!'
      })
      console.log(error, 'error while patching')
    }
  }

  const trackUserLogin = async () => {
    const session = (await getSession()) as any

    if (session && session.user) {
      console.log('Ready!')
      trackUserSignedIn({
        name: session?.user?.name,
        email: session?.user?.email,
        phoneNumber: session?.user?.phoneNumber,
        deviceType: 'web',
        dateTime: dayjs().format('DD-MM-YYYY HH:mm A')
      })
    }
  }
  return (
    <div>
      <header className='pb-3 text-xl font-bold md:pb-6 md:text-2xl'>
        Add Details
      </header>
      <div>
        {' '}
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
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          disabled={
                            profileData?.user?.identifierType == 'mobile'
                          }
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
                        disabled={profileData?.user?.identifierType == 'email'}
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
                placeholder='Gender'
                className='w-full'
              />

              <FormReactDatePicker
                className='w-full'
                formInstance={form as unknown as UseFormReturn}
                name='dateOfBirth'
                placeholder='Select date of birth'
                isSmall={true}
              />
            </div>
            <Button type='submit' className='mt-4 w-full'>
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
