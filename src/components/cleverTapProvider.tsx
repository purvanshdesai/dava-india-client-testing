'use client'

import { useEffect, useRef } from 'react'
import { initializeCleverTap } from '@/analytics/providers/clevertap'
import clevertapProvider from '@/analytics/providers/clevertap'
import { useSession } from 'next-auth/react'

export default function CleverTapProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const hasIdentifiedRef = useRef(false)
  const hasInitRef = useRef(false)

  useEffect(() => {
    if (hasInitRef.current) return

    initializeCleverTap()
    hasInitRef.current = true
  }, [])

  useEffect(() => {
    if (!session || !session.user || hasIdentifiedRef.current) return

    clevertapProvider.initializeUser(session?.user)
    hasIdentifiedRef.current = true
  }, [session])

  return <>{children}</>
}
