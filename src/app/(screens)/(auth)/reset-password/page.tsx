'use client'

import SetNewPassword from '@/components/ResetPassword'
import React, { Suspense } from 'react'


export default function ResetPassword() {
  return (
    <Suspense>
      <SetNewPassword />
    </Suspense>
  )
}
