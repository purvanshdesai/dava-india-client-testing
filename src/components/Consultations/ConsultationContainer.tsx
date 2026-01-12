'use client'

import { useGetConsultations } from '@/utils/hooks/consultationHooks'
import { StepForward } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Pagination from '../Orders/Pagination'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const consultationTypeMeaning: any = {
  doctorConsultation: 'Doctor consultation requested',
  uploadPrescription: 'Prescription Uploaded'
}

const consultationStatusMeaning: any = {
  prescription_under_review: 'Prescription Under Review',
  prescription_declined: 'Prescription Declined',
  doctor_will_call: 'Our expert team will reach out to you soon.',
  ready_for_order: 'Ready For Order'
}

export default function ConsultationContainer() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const [currentPage, setCurrentPage] = useState(page)
  const [totalPages, setTotalPages] = useState(0)
  const { data: consultationsQuery, isLoading } = useGetConsultations({
    $limit: limit,
    $skip: (currentPage - 1) * limit
  })

  useEffect(() => {
    if (consultationsQuery?.total) {
      console.log(consultationsQuery?.total)
      setTotalPages(consultationsQuery?.total)
    }
  }, [consultationsQuery])

  const consultations: any[] = consultationsQuery?.data?.filter(
    (d: any) => !d.orderPlaced
  )

  if (isLoading) {
    return null
  }
  return (
    <div>
      <div className='w-full rounded-2xl bg-white'>
        <div className='flex items-center justify-between px-5 py-5'>
          <h1 className='text-xl font-semibold'>My Consultations</h1>
        </div>
        <div className='flex items-center border-b border-t border-[#DFE4EA] bg-[#F9FAFB] px-4 py-3'>
          <h1 className='w-[70%] font-semibold'>Product details</h1>
          <h1 className='w-[20%] font-semibold'>Status</h1>
        </div>
        <div>
          {consultations.map((consultation, index) => (
            <div key={index} className='flex items-center p-5'>
              <div className='w-[70%]'>
                <div className='flex gap-2'>
                  <Image
                    width={80}
                    height={80}
                    src={
                      consultation?.ticketType == 'doctorConsultation'
                        ? '/images/DoctorConsultation.svg'
                        : '/images/prescriptionDummy.png'
                    }
                    alt=''
                  />
                  <div>
                    <p className='font-semibold'>
                      Appointment No:{' '}
                      {consultation?.appointmentId || consultation?._id}
                    </p>
                    <p>{consultationTypeMeaning[consultation?.ticketType]}</p>
                    <p className={'text-sm text-label'}>
                      {dayjs(consultation.createdAt).format(
                        process.env.DATE_TIME_FORMAT
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className='w-[30%]'>
                <div className='flex items-center justify-between'>
                  <p>{consultationStatusMeaning[consultation?.status]}</p>
                  <StepForward
                    className='cursor-pointer'
                    onClick={() =>
                      router.push(
                        `/me/consultations/${consultation?._id}?page=${currentPage}&limit=${limit}`
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center'>
        {totalPages ? (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalPages / 10)}
            onPageChange={setCurrentPage}
          />
        ) : null}
      </div>
    </div>
  )
}
