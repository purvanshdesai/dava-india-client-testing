'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
// import { EyeOff, Eye } from 'lucide-react'
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
// import { FacebookIcon, GoogleIcon } from '@/components/utils/icons'
// import { Mail, Smartphone } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp'
import {
  usePhoneNumberSubmit,
  // useUserCredentialSignIn,
  useSubmitOtp
} from '@/utils/hooks/auth'
import { signInWithOtpSchema } from '@/lib/zod'
import { useTransitionRouter } from 'next-view-transitions'
import { useSearchParams } from 'next/navigation'
import { handleVerifyProfileToken } from '@/utils/actions/authActions'
import { trackUserSignedIn } from '@/analytics/trackers/authTracker'
import dayjs from 'dayjs'
import { getSession } from 'next-auth/react'

export default function ProfileForm() {
  const { toast } = useToast()
  const router = useTransitionRouter()
  const searchParams = useSearchParams()

  // Component State

  const [submittedNumber, setSubmittedNumber] = useState(false)
  const [timer, setTimer] = useState('')
  // const [passwordVisible, setPasswordVisible] = useState(false)
  const [exist, setExist] = useState(false)
  const [identifierType, setIdentifierType] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendAttempts, setResendAttempts] = useState(0)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const otpExpiryTimeRef = useRef<number | null>(null)
  // Hooks
  const { mutateAsync: submitPhoneNumber } = usePhoneNumberSubmit()

  const { mutateAsync: submitOtp } = useSubmitOtp()

  // const {
  //   mutateAsync: submitEmailPassword
  //   // isPending: isEmailSignInLoading
  // } = useUserCredentialSignIn()

  // const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible)
  // // Forms
  // const emailSignInForm = useForm<z.infer<typeof signInSchema>>({
  //   resolver: zodResolver(signInSchema),
  //   defaultValues: {
  //     email: '',
  //     password: ''
  //   }
  // })

  const otpSignInForm = useForm<z.infer<typeof signInWithOtpSchema>>({
    resolver: zodResolver(signInWithOtpSchema),
    defaultValues: {
      contact: '',
      otp: ''
    }
  })

  // 1. Email and Password Sign In ---------------------------------------

  // const onSubmitEmailPassword = async (
  //   formData: z.infer<typeof signInSchema>
  // ) => {
  //   try {
  //     if (formData.email) {
  //       await checkUserEmailRegistered(formData.email)
  //     }
  //     await submitEmailPassword(formData)

  //     await trackUserLogin()

  //     const redirect = searchParams.get('redirect') || '/'
  //     router.push(redirect)
  //     setTimeout(() => {
  //       window.location.reload()
  //     }, 1000)
  //   } catch (error: any) {
  //     console.log('error ======== ', error)

  //     toast({ title: 'Oops!', description: error?.message })
  //   }
  // }

  // OTP Sign In ---------------------------------------

  async function onSubmitOtp(values: z.infer<typeof signInWithOtpSchema>) {
    setLoading(true)
    try {
      if (!exist) {
        // indentifier type
        const res: any = await handleVerifyProfileToken({
          phoneOtp: values?.otp,
          identifierType,
          phoneNumber:
            identifierType == 'mobile' ? '+91' + values?.contact : '',
          email: identifierType == 'email' ? values?.contact : ''
        })
        if (res?.profileToken)
          router.push(`profile-update?profileToken=${res?.profileToken}`)
      } else {
        await submitOtp({
          ...values,
          identifierType,
          phoneNumber:
            identifierType == 'mobile' ? '+91' + values?.contact : '',
          email: identifierType == 'email' ? values?.contact : '',
          isWeb: true
        })

        await trackUserLogin()

        const redirect = searchParams.get('redirect') || '/'
        router.push(redirect)
      }
    } catch (e: any) {
      console.log(e)
      toast({
        title: 'Error',
        description: 'Invalid OTP'
      })
    } finally {
      setLoading(false)
    }
  }
  function maskPhoneNumber(phoneNumber: any) {
    const phoneStr = phoneNumber.toString()
    const masked =
      phoneStr.slice(0, -4).replace(/\d/g, '*') + phoneStr.slice(-4)

    return masked
  }
  function startOTPTimer() {
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
    
    // Set new expiry time (2 minutes from now)
    otpExpiryTimeRef.current = new Date().getTime() + 2 * 60 * 1000
    
    // Start the timer
    timerIntervalRef.current = setInterval(() => {
      if (!otpExpiryTimeRef.current) return
      
      const currentTime = new Date().getTime()
      const timeRemaining = otpExpiryTimeRef.current - currentTime

      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      )
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)
      setTimer(`${minutes}m ${seconds}s`)
      if (timeRemaining < 0) {
        setTimer('')
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current)
          timerIntervalRef.current = null
        }
        console.log('OTP has expired.')
      }
    }, 1000)
  }
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])
  const handlePhoneNumberSubmit = async () => {
    // If this is a resend and max attempts reached, don't proceed
    if (submittedNumber && resendAttempts >= 3) {
      toast({
        title: 'Error',
        description: 'Maximum resend attempts reached. Please try again later.'
      })
      return
    }
    
    setLoading(true)
    try {
      const isValid = await otpSignInForm.trigger('contact')
      if (!isValid) return

      const { contact } = otpSignInForm.getValues()
      let email = ''
      let phoneNumber = ''
      let identifierType = ''

      if (/^\d{10}$/.test(contact)) {
        phoneNumber = contact
        identifierType = 'mobile'
      } else {
        email = contact
        identifierType = 'email'
      }
      const res = await submitPhoneNumber({
        identifierType,
        phoneNumber: '+91' + phoneNumber,
        email,
        isWeb: true,
        referralCode: searchParams.get('ref') || null
      })
      setIdentifierType(identifierType)
      if (res) setExist(res?.exist)
      startOTPTimer()
      toast({
        title: 'Success',
        description:
          identifierType == 'email'
            ? 'otp sent to your email'
            : `otp send to your +91 ${maskPhoneNumber(phoneNumber)} number`
      })
      setSubmittedNumber(true)
      // Increment resend attempts if this is a resend, otherwise reset
      if (submittedNumber) {
        setResendAttempts(prev => prev + 1)
      } else {
        setResendAttempts(0)
      }
    } catch (error: any) {
      console.log('errror ===== ', error.message)
      toast({
        title: 'Oops!',
        description: 'Please enter the valid email or mobile number!'
      })
    } finally {
      setLoading(false)
    }
  }

  // const resendOtp = async () => {
  //   handlePhoneNumberSubmit();
  // }

  // const CredentialsForm = () => {
  //   return (
  //     <>
  //       <Form {...emailSignInForm}>
  //         <form
  //           className='space-y-6'
  //           onSubmit={emailSignInForm.handleSubmit(onSubmitEmailPassword)}
  //         >
  //           <FormField
  //             control={emailSignInForm.control}
  //             name='email'
  //             render={({ field }) => (
  //               <FormItem>
  //                 {/* <FormLabel>Email</FormLabel> */}
  //                 <FormControl>
  //                   <Input
  //                     placeholder='Email'
  //                     {...field}
  //                     className='border-gray-200 bg-gray-100'
  //                   />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //           <div>
  //             <FormField
  //               control={emailSignInForm.control}
  //               name='password'
  //               render={({ field }) => (
  //                 <FormItem>
  //                   {/* <FormLabel>Password</FormLabel> */}
  //                   <FormControl>
  //                     <div className='relative'>
  //                       <Input
  //                         className='border-gray-200 bg-gray-100 placeholder:text-sm placeholder:font-normal'
  //                         type={passwordVisible ? 'text' : 'password'}
  //                         placeholder='Password'
  //                         autoCorrect='off'
  //                         {...field}
  //                       />
  //                       <div
  //                         onClick={togglePasswordVisibility}
  //                         className='absolute right-3 top-2 cursor-pointer'
  //                       >
  //                         {passwordVisible ? (
  //                           <Eye size={20} className='text-gray-400' />
  //                         ) : (
  //                           <EyeOff size={20} className='text-gray-400' />
  //                         )}
  //                       </div>
  //                     </div>
  //                   </FormControl>
  //                   <FormMessage />
  //                 </FormItem>
  //               )}
  //             />

  //             <div className='flex justify-end pt-3'>
  //               <Link
  //                 className='text-right text-sm font-medium text-[#0B80CC]'
  //                 href={'/forgot-password'}
  //               >
  //                 Forgot Password?
  //               </Link>
  //             </div>
  //           </div>

  //           <Button type='submit' className='w-full'>
  //             Submit
  //           </Button>
  //         </form>
  //       </Form>
  //     </>
  //   )
  // }

  const OtpForm = () => {
    return (
      <>
        <Form {...otpSignInForm}>
          <form
            className='space-y-8'
            onSubmit={otpSignInForm.handleSubmit(onSubmitOtp)}
          >
            <FormField
              key={'phoneNo'}
              control={otpSignInForm.control}
              name='contact'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        className='w-full border-gray-200 bg-gray-100'
                        placeholder='Enter email or phone number'
                        value={field.value}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submittedNumber ? (
              <div>
                <FormField
                  key={'otp'}
                  control={otpSignInForm.control}
                  name='otp'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>
                        Enter the 5 digit OTP
                      </FormLabel>
                      <FormControl>
                        <InputOTP maxLength={5} {...field}>
                          <InputOTPGroup className='mr-5 h-[50px] w-[64px] bg-[#F6F7F9]'>
                            <InputOTPSlot
                              index={0}
                              className='h-[50px] w-[64px]'
                            />
                          </InputOTPGroup>
                          <InputOTPGroup className='mr-5 h-[50px] w-[64px] bg-[#F6F7F9]'>
                            <InputOTPSlot
                              index={1}
                              className='h-[50px] w-[64px]'
                            />
                          </InputOTPGroup>
                          <InputOTPGroup className='mr-5 h-[50px] w-[64px] bg-[#F6F7F9]'>
                            <InputOTPSlot
                              index={2}
                              className='h-[50px] w-[64px]'
                            />
                          </InputOTPGroup>
                          <InputOTPGroup className='mr-5 h-[50px] w-[64px] bg-[#F6F7F9]'>
                            <InputOTPSlot
                              index={3}
                              className='h-[50px] w-[64px]'
                            />
                          </InputOTPGroup>
                          <InputOTPGroup className='mr-5 h-[50px] w-[64px] bg-[#F6F7F9]'>
                            <InputOTPSlot
                              index={4}
                              className='h-[50px] w-[64px]'
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='mt-5 flex flex-row items-center justify-start'>
                  <p className='text-sm min-w-[140px]'>OTP expires in {timer ? timer : ''}</p>
                  {timer ? (
                    ''
                  ) : resendAttempts >= 3 ? (
                    <p className='ml-2 text-sm text-gray-400 cursor-not-allowed'>
                      Resend (Max attempts reached)
                    </p>
                  ) : (
                    <p
                      className='ml-2 cursor-pointer text-sm text-[#0B80CC]'
                      onClick={handlePhoneNumberSubmit}
                    >
                      Resend
                    </p>
                  )}
                </div>
              </div>
            ) : null}
            {submittedNumber ? (
              <Button loader={loading} type='submit' className='w-full'>
                Submit
              </Button>
            ) : (
              <Button
                type='button'
                loader={loading}
                onClick={handlePhoneNumberSubmit}
                className='w-full'
              >
                Get OTP
              </Button>
            )}
          </form>
        </Form>
      </>
    )
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
        Sign Up / Sign In
      </header>

      {OtpForm()}

      {/* <div className='flex flex-col items-center justify-center gap-4 py-6 md:flex-row'>
      
        {signInWith == 'email' ? (
          <div>
            <Button
              onClick={() => setSignInWith('phone')}
              className='flex-1'
              variant='secondary'
            >
              <Smartphone className='text-label' size={20} />
            </Button>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => setSignInWith('email')}
              className='flex-1'
              variant='secondary'
            >
              <Mail className='text-label' size={20} />
            </Button>
          </div>
        )}
      </div> */}
      {/* {errorMsg && <div className={'text-md text-red-500'}>{errorMsg}</div>} */}
      {/* <div className='mt-4 text-sm' key={Math.random()}>
        Not a member yet?{' '}
        <Link className='font-medium text-[#0B80CC]' href={'/register'}>
          Sign Up
        </Link>
      </div> */}

      {/* <div className='w-full pt-6 text-sm'>
        By Registering, you agree to Davaindia <br />
        <Link className='font-medium text-[#0B80CC]' href={'/register'}>
          User Agreement
        </Link>
        <span className='px-1'>and</span>
        <Link className='font-medium text-[#0B80CC]' href={'/register'}>
          Cookies & Internet Advertising{' '}
        </Link>
      </div> */}
    </div>
  )
}
