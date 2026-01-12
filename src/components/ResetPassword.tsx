'use client'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { resetPasswordSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import {
  useConsumerCheckTokenValidity,
  useResetPassword
} from '@/utils/hooks/auth'
import { Input } from './ui/input'

export default function SetNewPassword() {
  const [isTokenValid, setIsTokenValid] = useState(false)
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    values: {
      newPassword: '',
      confirmPassword: ''
    }
  })
  const searchParams = useSearchParams()
  const router = useRouter()

  const resetPasswordMutation = useResetPassword()
  const { data: tokenValidityData } = useConsumerCheckTokenValidity(
    searchParams.get('token') || ''
  )

  const handleSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      const token: any = searchParams.get('token') || ''
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: data?.newPassword
      })
      router.push('/login')
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    console.log('tokenValidityData', tokenValidityData)

    if (tokenValidityData) {
      setIsTokenValid(tokenValidityData.tokenValid)
    }
  }, [tokenValidityData])

  //   if (isLoading) {
  //     return <div>loading................</div>
  //   }

  return (
    <div className=''>
      <div>
        {isTokenValid ? (
          <div className='flex w-full items-center justify-start'>
            <div>
              <div className={'py-8 text-2xl font-semibold'}>
                Set your password
              </div>
              <div className='w-[55vh]'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-7'
                  >
                    <div className='w-full'>
                      <FormField
                        control={form.control}
                        name='newPassword'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type='password'
                                placeholder='Password'
                                {...field}
                                className='border-gray-200 bg-gray-100'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name='confirmPassword'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type='password'
                                placeholder='Confirm Password'
                                {...field}
                                className='border-gray-200 bg-gray-100'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type='submit' className='w-full'>
                      Submit
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className='text-lg font-semibold'>
              Sorry, This link is expired for now. You can contact Dava-India
              for more details
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
