'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
// import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { forgotPasswordSchema } from '@/lib/zod'
import { useForgotPassword } from '@/utils/hooks/auth'
import Link from 'next/link'

export default function ForgotPassword() {
  const { toast } = useToast()
  // const searchParams = useSearchParams()
  const forgotPasswordMutation = useForgotPassword()
  const [submittedEmail, setSubmittedEmail] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  // function maskEmail(email: any) {
  //   const [username, domain] = email.split('@')

  //   const maskedUsername =
  //     username[0] +
  //     '*'.repeat(username.length - 2) +
  //     username[username.length - 1]

  //   return `${maskedUsername}@${domain}`
  // }

  // 1. Define your form.
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      setEmail(values.email)
      await forgotPasswordMutation.mutateAsync({ email: values.email })
      setSubmittedEmail(true)
    } catch (e:any) {
      toast({
        description: 'Email not found'
      })
    }
  }
  return (
    <div className={' '}>
      <div>
        <div>
          <div className={'py-2 text-2xl font-semibold'}>Forgot Password</div>
          {submittedEmail ? (
            <p>Email sent to your registered email {email}</p>
          ) : (
            <p>Enter your registered email ID below</p>
          )}
          <div className='mt-5'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-7'
              >
                <div style={{ display: submittedEmail ? 'none' : 'block' }}>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder='Email' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='mt-5'>
                    <Button type='submit' className='w-full'>
                      Submit
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
          <div className={'py-3 text-center text-sm text-label'}>
            <Link href={'/login'} className='text-blue-500'>
              Click here
            </Link>{' '}
            for login
          </div>
        </div>
      </div>
    </div>
  )
}
