'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useCreateRequestMedicine } from '@/utils/hooks/medicineRequestsHooks'
import RequestMedicineUpload from '@/components/GlobalSearch/MedicineRequestUpload'
import { useSession } from 'next-auth/react'

interface MedicineRequestCardProps {
  medicineName: string
}

export default function MedicineRequestCard({
  medicineName
}: MedicineRequestCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [details, setDetails] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [errorMessages, setErrorMessages] = useState({
    details: '',
    files: ''
  })

  const {
    mutateAsync: submitRequestMedicine,
    isPending: loading,
    error
  } = useCreateRequestMedicine()

  const isFormComplete = details.trim() !== '' && files.length > 0

  const handleSubmit = async () => {
    const errors = { details: '', files: '' }
    let valid = true

    if (details.trim() === '') {
      errors.details = 'Please enter medicine details.'
      valid = false
    }
    if (files.length === 0) {
      errors.files = 'Please upload at least one file.'
      valid = false
    }

    setErrorMessages(errors)

    if (!valid) return

    try {
      await submitRequestMedicine({
        medicineName,
        notes: details,
        requestedDate: new Date().toISOString(),
        files
      })

      setOpen(false)
      setSuccessOpen(true)
      setDetails('')
      setFiles([])
      setErrorMessages({ details: '', files: '' })
    } catch (err) {
      console.error('Failed to submit request:', err)
    }
  }

  const handleDialogOpen = () => {
    if (!session?.user) {
      router.push('/login')
      return
    }
    setOpen(true)
  }

  const handleSuccessOk = () => {
    setSuccessOpen(false)
    router.push('/')
  }

  return (
    <>
      <div className='flex w-[80%] items-center gap-6 rounded-md bg-white p-6 md:w-[50%]'>
        <div className='flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-gray-100'>
          <img
            src='/images/request-medicine.svg'
            alt='Medicine'
            className='h-full w-full object-contain'
          />
        </div>

        <div className='flex flex-col gap-3'>
          <h3 className='text-sm font-semibold text-gray-900'>
            {medicineName}
          </h3>
          <p className='max-w-md text-xs text-gray-600'>
            This medicine is not part of our current product catalog. 
            You may place a request for it and our team will review it.
          </p>

          <button
            onClick={() => handleDialogOpen()}
            className='mt-2 self-start rounded bg-[#E85D2A] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#d44f1f]'
          >
            Request Medicine
          </button>
        </div>
      </div>

      {/* Request Medicine Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle hidden>
          <p className='text-base font-semibold'>Request Medicine</p>
        </DialogTitle>
        <DialogContent className='rounded-2xl p-6 sm:max-w-[500px] max-h-[80vh] overflow-y-auto'>
          <div className='relative flex flex-col items-center space-y-5 min-h-[500px]'>
            <p className='text-base font-semibold'>Request Medicine</p>

            <Image
              src='/images/request-medicine.svg'
              alt='Medicine Icon'
              width={96}
              height={96}
            />

            {/* Details Field */}
            <div className='w-full space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Details of the medicine you are requesting{' '}
                <span className='text-red-500'>*</span>
              </label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder='Type here'
                className={`h-[100px] w-full resize-none rounded-md border p-2 text-sm ${
                  errorMessages.details ? 'border-red-500' : ''
                }`}
              />
              {errorMessages.details && (
                <p className='text-xs text-red-500'>{errorMessages.details}</p>
              )}
            </div>

            {/* Upload Field */}
            <div className='w-full space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Upload an image of the medicine <span className='text-red-500'>*</span>
              </label>
              <RequestMedicineUpload
                onFileUpload={(files) => setFiles(files)}
                isLoggedIn={true}
              />
              {errorMessages.files && (
                <p className='text-xs text-red-500'>{errorMessages.files}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-4 w-full rounded-md font-medium transition-colors ${
                loading
                  ? 'cursor-not-allowed bg-[#E85D2A]/50 text-white'
                  : isFormComplete
                    ? 'bg-[#E85D2A] text-white hover:bg-[#d44f1f]'
                    : 'bg-[#E85D2A]/40 text-white'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>

            {error && (
              <p className='mt-1 text-center text-xs text-red-500'>
                {error as any}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Popup */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogTitle hidden>
          <p className='text-base font-semibold'>Request Medicine</p>
        </DialogTitle>
        <DialogContent className='rounded-2xl bg-white p-8 text-center sm:max-w-[380px]'>
          <div className='mb-4 flex justify-center'>
            <div className='flex h-[80px] w-[80px] items-center justify-center rounded-full bg-gray-100'>
              <Image
                src='/images/success-icon.svg'
                alt='Success'
                width={80}
                height={80}
              />
            </div>
          </div>
          <p className='mb-6 text-sm leading-relaxed text-gray-700'>
            We appreciate you sharing your requirement and our R&D team will 
            evaluate the possibility of adding it in future.
          </p>
          <Button
            onClick={handleSuccessOk}
            className='rounded-md bg-[#E85D2A] px-8 py-2 font-medium text-white hover:bg-[#d44f1f]'
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
