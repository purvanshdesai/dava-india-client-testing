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
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  useUserCredentialSignIn,
  useUserRegister,
  useVerifyPhonNumber
} from '@/utils/hooks/auth'
import { useState } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp'
import { Link } from 'next-view-transitions'
import { signUpFormSchema, otpFormSchema } from '@/lib/zod'
import { EyeOff, Eye } from 'lucide-react'
import { checkUserEmailRegistered } from '@/utils/actions/authActions'
import { trackUserSignedUp } from '@/analytics/trackers/authTracker'
import clevertapProvider from '@/analytics/providers/clevertap'

// TypeScript type inferred from schema
export type userRegisterSchema = z.infer<typeof signUpFormSchema>

export default function ProfileRegister() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [timer, setTimer] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

  const [userDetails, setUserDetails] = useState({}) as any
  const [userPassword, setUserPassword] = useState('') as any

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible)
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible)

  const { mutateAsync: registerUser, isPending } = useUserRegister()
  const {
    mutateAsync: verifyPhoneNumber
    // isError: isErrorVerifyPhoneNumber,
    // isPending: isPendingVerifyPhonNumber
  } = useVerifyPhonNumber()

  const [phoneNumberRegistered, setPhoneNumberRegistered] = useState('')

  // 1. Form Schemas
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      verifyPassword: ''
    }
  })

  const { mutateAsync: submitEmailPassword } = useUserCredentialSignIn()

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: ''
    }
  })
  const otpExpiryTime = new Date().getTime() + 2 * 60 * 1000

  function startOTPTimer() {
    const timerInterval = setInterval(() => {
      const currentTime = new Date().getTime()
      const timeRemaining = otpExpiryTime - currentTime

      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      )
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)
      setTimer(`${minutes}m ${seconds}s`)
      if (timeRemaining < 0) {
        clearInterval(timerInterval)
        console.log('OTP has expired.')
      }
    }, 1000)
  }
  // 2. Submit handler.
  const handleSignUpFormSubmit = async (
    values: z.infer<typeof signUpFormSchema>
  ) => {
    try {
      setUserPassword(values.password)
      const res = await registerUser(values)

      setUserDetails(res?._doc)
      startOTPTimer()
      setPhoneNumberRegistered(values.phone)
    } catch (e: any) {
      console.log(e)
      toast({
        description: 'Phone Number or email already exists'
      })
    }
  }

  const handleOtpSubmit = async (values: z.infer<typeof otpFormSchema>) => {
    try {
      await verifyPhoneNumber({
        phoneNumber: '+91' + phoneNumberRegistered,
        otp: values.otp
      })
      await checkUserEmailRegistered(userDetails?.email)

      await submitEmailPassword({
        email: userDetails?.email,
        password: userPassword
      })

      // Initialize User for analytics
      clevertapProvider.initializeUser({
        ...userDetails,
        phoneNumber: userDetails?.tempPhoneNumber
      })

      trackUserSignedUp({
        name: userDetails?.name,
        email: userDetails?.email,
        phoneNumber: userDetails?.tempPhoneNumber,
        deviceType: 'web',
        dateTime: new Date().toISOString()
      })

      setUserDetails({})
      setUserPassword('')

      const redirect = searchParams.get('redirect') || '/'

      router.push(redirect)

      setTimeout(() => {
        window.location.reload()
      }, 1200)
    } catch (error) {
      throw error
    }
  }
  function maskPhoneNumber(phoneNumber: any) {
    const phoneStr = phoneNumber.toString()
    const masked =
      phoneStr.slice(0, -4).replace(/\d/g, '*') + phoneStr.slice(-4)

    return masked
  }

  const SignUpForm = () => {
    return (
      <>
        <header className='mb-3 text-xl font-bold md:text-2xl'>Sign Up</header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignUpFormSubmit)}
            className='space-y-7'
          >
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
                      placeholder='Email'
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
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={passwordVisible ? 'text' : 'password'}
                        className='border-gray-200 bg-gray-100 pr-12'
                        placeholder='Password'
                        {...field}
                      />
                      <div
                        onClick={togglePasswordVisibility}
                        className='absolute right-3 top-2 cursor-pointer'
                      >
                        {passwordVisible ? (
                          <Eye size={20} className='text-gray-400' />
                        ) : (
                          <EyeOff size={20} className='text-gray-400' />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='verifyPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={confirmPasswordVisible ? 'text' : 'password'}
                        className='border-gray-200 bg-gray-100 pr-12'
                        placeholder='Verify Password'
                        {...field}
                      />
                      <div
                        onClick={toggleConfirmPasswordVisibility}
                        className='absolute right-3 top-2 cursor-pointer'
                      >
                        {confirmPasswordVisible ? (
                          <Eye size={20} className='text-gray-400' />
                        ) : (
                          <EyeOff size={20} className='text-gray-400' />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={isPending}>
              Submit
            </Button>
          </form>
        </Form>
      </>
    )
  }

  const OtpForm = () => {
    return (
      <>
        <header className='mb-3 text-xl font-bold md:text-2xl'>
          OTP Verification
        </header>
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
            className='space-y-7'
          >
            <FormField
              key={phoneNumberRegistered}
              control={otpForm.control}
              name='otp'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Enter the 5 digit OTP send to{' '}
                    {maskPhoneNumber(phoneNumberRegistered)}
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={5} {...field}>
                      <InputOTPGroup className='mr-5 h-[50px] w-[64px] bg-[#F6F7F9]'>
                        <InputOTPSlot index={0} className='h-[50px] w-[64px]' />
                      </InputOTPGroup>
                      <InputOTPGroup className='mr-5 h-[50px] w-[64px] bg-[#F6F7F9]'>
                        <InputOTPSlot index={1} className='h-[50px] w-[64px]' />
                      </InputOTPGroup>
                      <InputOTPGroup className='mr-5 h-[50px] w-[64px] bg-[#F6F7F9]'>
                        <InputOTPSlot index={2} className='h-[50px] w-[64px]' />
                      </InputOTPGroup>
                      <InputOTPGroup className='mr-5 h-[50px] w-[64px] bg-[#F6F7F9]'>
                        <InputOTPSlot index={3} className='h-[50px] w-[64px]' />
                      </InputOTPGroup>
                      <InputOTPGroup className='mr-5 h-[50px] w-[64px] bg-[#F6F7F9]'>
                        <InputOTPSlot index={4} className='h-[50px] w-[64px]' />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='mt-5 flex flex-row items-center justify-start'>
              <p className='text-sm'>OTP expires in {timer ? timer : ''}</p>
              <p
                className='ml-2 cursor-pointer text-sm text-[#0B80CC]'
                onClick={otpForm.handleSubmit(handleOtpSubmit)}
              >
                Resend
              </p>
            </div>
            <Button type='submit' className='w-full'>
              Submit
            </Button>
          </form>
        </Form>
      </>
    )
  }

  return (
    <div>
      {phoneNumberRegistered ? OtpForm() : SignUpForm()}

      <Link href={'/login'}>
        <p className='pt-3 text-center text-xs text-label underline'>Cancel</p>
      </Link>
    </div>
  )
}
