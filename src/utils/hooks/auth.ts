import { useMutation, useQuery } from '@tanstack/react-query'
import {
  checkTokenValidity,
  consumerForgotPassword,
  consumerResetPassword,
  handleGetUserDetails,
  handleGetUserDetailsByProfileToken,
  handleSubmitPhoneNumber,
  handleUserRegister,
  handleVerifyPhoneNumber,
  patchUserDetails
} from '../actions/authActions'
import { signIn } from 'next-auth/react'

interface EmailPassword {
  email: string
  password: string
}

interface OtpForm {
  phoneNumber?: string
  email?: string
  otp: string
  identifierType: string
  isWeb?: boolean
}

export const useUserRegister = () => {
  return useMutation({
    mutationFn: handleUserRegister
  })
}

export const useVerifyPhonNumber = () => {
  return useMutation({
    mutationFn: handleVerifyPhoneNumber
  })
}

export const usePhoneNumberSubmit = () => {
  return useMutation({
    mutationFn: handleSubmitPhoneNumber
  })
}

export const useSubmitOtp = () => {
  const handleSignIn = async (data: OtpForm) => {
    const { phoneNumber, email, otp, identifierType, isWeb } = data

    const res = await signIn('otp', {
      phoneNumber,
      email,
      identifierType,
      otp,
      isWeb,
      redirect: false
    })

    if (!res?.error) return

    throw new Error('Invalid otp')
    //
    // switch (res?.error) {
    //   case 'CredentialsSignin':
    //     throw new Error('Invalid email or password')
    //
    //   case 'Configuration':
    //     throw new Error('Connection refused. Please try again later.')
    //
    //   default:
    //     throw new Error('Something went wrong')
    // }
  }

  return useMutation({
    mutationFn: handleSignIn
  })
}

export const useDemoUserLogin = () => {
  const handleSignIn = async () => {
    const res: any = await signIn('demo-user')

    if (!res?.error) return

    throw new Error('Invalid otp')
  }

  return useMutation({
    mutationFn: handleSignIn
  })
}

export const useUserCredentialSignIn = () => {
  const handleSignIn = async (credentials: EmailPassword) => {
    const { email, password } = credentials

    const res = await signIn('emailPassword', {
      email,
      password,
      redirect: false
    })

    if (!res?.error) return

    switch (res?.error) {
      case 'CredentialsSignin':
        throw new Error('Invalid email or password')

      case 'Configuration':
        throw new Error('Connection refused. Please try again later.')

      default:
        throw new Error('Something went wrong')
    }
  }

  return useMutation({
    mutationFn: handleSignIn
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: consumerForgotPassword
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: consumerResetPassword
  })
}
export const useGetUser = (userId: any) => {
  return useQuery({
    queryKey: ['find-user', userId],
    queryFn: () => handleGetUserDetails(userId)
  })
}

export const usePatchUserDetails = () => {
  return useMutation({
    mutationFn: patchUserDetails
  })
}

export const useConsumerCheckTokenValidity = (token: string) => {
  return useQuery({
    queryFn: () => checkTokenValidity(token),
    queryKey: ['get-user-token-validity', token],
    enabled: !!token
  })
}
export const useGetUserDetailsByProfileToken = (profileToken: any) => {
  return useQuery({
    queryKey: ['find-user-details', profileToken],
    queryFn: () => handleGetUserDetailsByProfileToken(profileToken)
  })
}

export const useSubmitProfileToken = () => {
  const handleSignIn = async (profileToken: string) => {
    const res = await signIn('profile-complete', {
      profileToken,
      redirect: false
    })

    if (!res?.error) return

    throw new Error('Auth failed')
  }

  return useMutation({
    mutationFn: handleSignIn
  })
}
