'use server'
import { signOut } from '@/auth'
import { signIn } from 'next-auth/react'
import { CredentialsSignin } from 'next-auth'
import axios from 'axios'
import { signInSchema } from '@/lib/zod'
import { userRegisterSchema } from '@/app/(screens)/(auth)/register/page'

const handleUserRegister = async (data: userRegisterSchema) => {
  try {
    const { name, password, phone, email } = data
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
      {
        name,
        phone,
        password,
        email
      }
    )
    return res.data
  } catch (error) {
    throw error
  }
}

const handleVerifyPhoneNumber = async (data: any) => {
  try {
    const { otp, phoneNumber } = data
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/verify-phone-otp`,
      { phoneNumber, otp }
    )
    return res.data
  } catch (error) {
    throw error
  }
}

const handleSubmitPhoneNumber = async (data: any) => {
  try {
    const { phoneNumber, email, identifierType, isWeb, referralCode } = data
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/request-otp`,
      { phoneNumber, email, identifierType, isWeb, referralCode }
    )
    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? error)
  }
}

const handleLoginWithOtp = async (data: any) => {
  try {
    const { phoneNumber, email, otp, identifierType, isWeb } = data
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication`,
      {
        strategy: 'otp',
        phoneNumber,
        email,
        identifierType,
        otp,
        isWeb
      }
    )
    const { user, accessToken } = response.data

    if (user && accessToken) {
      // Return the user object and access token
      return { ...user, accessToken }
    } else return null // Authentication failed
  } catch (error) {
    throw error
  }
}

export const handleDemoUserLogin = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication`,
      {
        strategy: 'demo-user'
      }
    )
    const user = response.data.user // Extract user data
    const accessToken = response.data.accessToken // Extract access_token from Feathers

    if (user && accessToken) {
      // Return the user object and access token
      return { ...user, accessToken }
    } else return null // Authentication failed
  } catch (error) {
    throw error
  }
}

const handleServerAuthentication = async (credentials: any) => {
  try {
    const { email, password } = credentials

    if (!email || !password)
      throw new CredentialsSignin('Please provide email & password!')

    const parsedCredentials = signInSchema.safeParse({ email, password })

    if (!parsedCredentials.success) {
      console.log('Validation Error', parsedCredentials?.error?.errors)
      throw new Error('Validation Error!')
    }

    // Make a request to the FeathersJS authentication endpoint
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication`,
      {
        strategy: 'credentials-consumer', // FeathersJS uses 'local' strategy for username/password auth
        email: credentials?.email,
        password: credentials?.password
      }
    )

    const user = response.data.user // Extract user data
    const accessToken = response.data.accessToken // Extract access_token from Feathers

    if (user && accessToken) {
      // Return the user object and access token
      return { ...user, accessToken }
    } else return null // Authentication failed
  } catch (e: any) {
    if (e?.code === 'ECONNREFUSED') return { code: e?.code }

    const error = e?.response?.data
    return error
  }
}

async function handleGoogleSignIn() {
  await signIn('google', { redirectTo: '/' })
}

const handleSignOut = async () => {
  await signOut({ redirect: false })
}

const register = async () => { }

export const consumerForgotPassword = async ({ email }: { email: string }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password`,
      { email }
    )
    return res.data
  } catch (error) {
    throw error
  }
}

export const consumerResetPassword = async ({
  token,
  newPassword
}: {
  token: string
  newPassword: string
}) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/reset-password/${token}`,
      {
        newPassword
      }
    )
    return res.data
  } catch (error) {
    throw error
  }
}

export const checkTokenValidity = async (token: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/reset-password/${token}`
    )
    return res.data
  } catch (error) {
    throw error
  }
}

export const checkUserEmailRegistered = async (email: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/check-registered?email=${email}`,
    { params: { email } }
  )
  return res.data
}

export const checkUserPhoneNoRegistered = async (phoneNo: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/check-registered`,
    { params: { phoneNo } }
  )
  return res.data
}

const handleGetUserDetails = async (id: any) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/register/${id}`
    )
    return res.data
  } catch (error) {
    throw error
  }
}

export const patchUserDetails = async ({
  id,
  data
}: {
  id: any
  data: any
}) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/register/${id}`,
      data
    )
    return res.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const handleVerifyProfileToken = async (data: any) => {
  try {
    const { phoneOtp, phoneNumber, email, identifierType } = data
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/verifyToken`,
      { phoneNumber, email, phoneOtp, identifierType }
    )

    return res.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}
const handleGetUserDetailsByProfileToken = async (profileToken: any) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/get-user`,
      { profileToken }
    )
    return res.data
  } catch (error) {
    throw error
  }
}

const handleLoginWithProfileToken = async (data: any) => {
  try {
    const { profileToken } = data
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication`,
      {
        strategy: 'profile-complete',
        profileToken
      }
    )
    const { user, accessToken } = response.data

    if (user && accessToken) {
      // Return the user object and access token
      return { ...user, accessToken }
    } else return null // Authentication failed
  } catch (error) {
    throw error
  }
}

export {
  handleServerAuthentication,
  handleGoogleSignIn,
  register,
  handleUserRegister,
  handleVerifyPhoneNumber,
  handleSubmitPhoneNumber,
  handleLoginWithOtp,
  handleSignOut,
  handleGetUserDetails,
  handleGetUserDetailsByProfileToken,
  handleLoginWithProfileToken
}
