import { ArrowLeft, DotIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const consultationStatusMeaning: any = {
  prescription_under_review: 'Prescription Under Review',
  prescription_declined: 'Prescription Declined',
  doctor_will_call: 'Our expert team will reach out to you soon.',
  ready_for_order: 'Ready For Order'
}
export default function ConsultationStatus({
  appointmentId = '',
  status = '',
  page,
  limit
}: any) {
  return (
    <div className='w-full rounded-2xl bg-white p-6'>
      <div className='flex items-center'>
        <Link
          href={`/me/consultations${page && limit ? `?page=${page}&limit=${limit}` : ''}`}
        >
          <div className='flex h-[40px] w-[40px] items-center justify-center'>
            <ArrowLeft className='cursor-pointer' />
          </div>
        </Link>
        <h1 className='text-xl font-semibold'>
          Appointment No:{appointmentId}
        </h1>
      </div>
      <div className='my-5 flex items-center gap-3'>
        <Image
          width={50}
          height={50}
          src={'/images/DoctorConsultation.svg'}
          className='rounded-lg'
          alt=''
        />
        {consultationStatusMeaning[status]
          ? consultationStatusMeaning[status]
          : ''}
      </div>
      <div>
        <p className='font-semibold'>Status</p>
        <div className='w-full rounded-lg bg-[#F9FAFB] px-3 py-3'>
          <div className='p-2'>
            <div className='flex items-center rounded-md'>
              <DotIcon size={28} className='text-green-500' />
              <p className='text-sm font-medium'>
                {consultationStatusMeaning[status]
                  ? consultationStatusMeaning[status]
                  : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
