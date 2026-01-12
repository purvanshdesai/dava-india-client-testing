'use client'

import { useEffect } from 'react'
import { useTransitionRouter } from 'next-view-transitions'
import { useSession, signIn } from 'next-auth/react'
import { useDemoUserLogin } from '@/utils/hooks/auth'

export default function DemoLoginPage() {
  const router = useTransitionRouter()
  const { status } = useSession()

  const { mutateAsync: demoLogin } = useDemoUserLogin()

  useEffect(() => {
    const handleDemoAuth = async () => {
      if (status === 'unauthenticated') {
        try {
          await signIn('demo-user', { redirect: false })
          router.push('/')
        } catch (error) {
          console.error('Error during demo authentication:', error)
        }
      } else if (status === 'authenticated') {
        // Redirect to home if already logged in
        router.push('/')
      }
    }

    handleDemoAuth()
  }, [status, demoLogin])
}
