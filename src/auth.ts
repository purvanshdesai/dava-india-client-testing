import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

import {
  handleDemoUserLogin,
  handleLoginWithOtp,
  handleLoginWithProfileToken,
  handleServerAuthentication
} from './utils/actions/authActions'

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google,
    Credentials({
      id: 'emailPassword',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async credentials => {
        const res = await handleServerAuthentication(credentials)

        if (res?.code === 'ECONNREFUSED') throw new Error(res?.code)
        if (res?.code === 401) return null

        return res
      }
    }),
    Credentials({
      id: 'otp',
      name: 'otp',
      credentials: {
        phoneNumber: { label: 'Phone Number', type: 'phoneNumber' },
        email: { label: 'Email', type: 'email' },
        identifierType: { label: 'Identifier Type', type: 'identifierType' },
        otp: { label: 'Otp', type: 'otp' },
        isWeb: { label: 'IsWeb', type: 'isWeb' }
      },
      authorize: async credentials => {
        try {
          const res = await handleLoginWithOtp(credentials)
          if (res && res.code === 401) return null
          return res
        } catch (error) {
          throw error
        }
      }
    }),
    Credentials({
      id: 'profile-complete',
      name: 'profile-complete',
      credentials: {
        profileToken: { label: 'Profile Token', type: 'profileToken' }
      },
      authorize: async credentials => {
        try {
          const res = await handleLoginWithProfileToken(credentials)
          if (res && res.code === 401) return null
          return res
        } catch (error) {
          throw error
        }
      }
    }),
    Credentials({
      id: 'demo-user',
      name: 'demo-user',
      credentials: {},
      authorize: async () => {
        try {
          const res = await handleDemoUserLogin()
          if (res && res.code === 401) return null
          return res
        } catch (error) {
          throw error
        }
      }
    })
  ],
  trustHost: true,
  pages: {
    signIn: '/login',
    newUser: '/register'
  },
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user

      const { pathname } = nextUrl

      // if (pathname.startsWith('/login') && isLoggedIn) {
      //   return Response.redirect('/')
      // }
      if (pathname.startsWith('/demo')) {
        return true
      }

      if (!isLoggedIn && !pathname.startsWith('/me'))
        return Response.redirect(
          new URL(
            `/login?callbackUrl=${encodeURIComponent(nextUrl?.pathname)}`,
            nextUrl
          )
        )

      return !!auth
    },
    async session({ session, token }) {
      if (token?._id) session.user.id = token._id

      // Pass the access token from the JWT to the session object
      if (token?.accessToken) session.accessToken = token.accessToken

      const user: any = session.user
      if (token?.phoneNumber) user.phoneNumber = token.phoneNumber
      if (token?.hasDavaoneMembership) {
        user.davaoneMembership = token.davaoneMembership
        user.hasDavaoneMembership = true
      }
      if (token?.davaCoinsBalance)
        user.davaCoinsBalance = token.davaCoinsBalance
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id as string
        token.accessToken = user.accessToken as string
        token.phoneNumber = (user as any)?.phoneNumber as string
        token.hasDavaoneMembership = user?.hasDavaoneMembership
        token.davaoneMembership = user?.davaoneMembership
        token.davaCoinsBalance = user?.davaCoinsBalance
      }

      return token
    }
  }
})

export const BASE_PATH = process.env.NEXT_PUBLIC_APP_URL
