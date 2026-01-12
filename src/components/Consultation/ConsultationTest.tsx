'use client'
import { useGetConsultation } from '@/utils/hooks/consultationHooks'
import React from 'react'

export default function ConsultationTest({ consultationId }: any) {
  const { data } = useGetConsultation(consultationId)

  console.log('consultation details ', data)
  return (
    <div>
      <h1>lkcms</h1>
    </div>
  )
}
