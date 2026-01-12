'use client'
import React, { useState } from 'react'
import {
  // ArrowLeft,
  // TriangleAlert,
  LucideDot,
  UploadIcon,
  InfoIcon
  // CircleIcon,
  // CircleCheckIcon
} from 'lucide-react'
import Image from 'next/image'
// import { Link } from 'next-view-transitions'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useTransitionRouter } from 'next-view-transitions'
// import PrescriptionFileUpload from '@/components/Prescription/FileUpload'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

const PrescriptionFileUpload = dynamic(
  () => import('@/components/Prescription/FileUpload'),
  {
    ssr: false
  }
)

const guildLines = [
  'Do not crop any part of prescription',
  'Avoid blurred images',
  'Include details of doctor and patient, date of visit',
  'Supported files : PNG,JPEG,PDF',
  'File size limit : 5MB'
]

// const options = [
//   {
//     type: 'search',
//     title: 'Search & Add medicines',
//     description: 'Manually search and add medicines in the cart',
//     image: 'Basket'
//   },
//   {
//     type: 'call',
//     title: 'Get a call from Davaindia',
//     description: 'Davaindia pharmacist/doctors will call to confirm medicines',
//     image: 'Call'
//   }
// ]

export default function PrescriptionUpload() {
  const router = useTransitionRouter()
  const session = useSession()
  // const [method, setMethod] = useState<string>('search')
  const { setPrescriptionUrl, prescriptionFiles, currentLocation } =
    useCheckoutStore()
  const [showConsultationNotAvailable, setShowConsultationNotAvailable] =
    useState<boolean>(false)

  const isLoggedIn = session.status === 'authenticated'

  const handleContinue = () => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    if (!currentLocation?.isDeliverable) {
      setShowConsultationNotAvailable(true)
      return
    }
    // if (method === 'search') router.push('/prescription/product-search')
    // else
    router.push('/prescription/address')
  }

  const onFileUpload = (files: any) => {
    setPrescriptionUrl(files)
  }

  return (
    <TooltipProvider>
      <div className='flex h-full items-center justify-center'>
        <div className='m-6 w-full space-y-4 lg:w-11/12'>
          <div className='grid grid-cols-[2.5fr_1.5fr] gap-6'>
            <div className='overflow-hidden rounded-md bg-white shadow'>
              <div className='flex items-center justify-between bg-[#F9F9F9] p-4'>
                <div className='flex items-center gap-2'>
                  <p className='text-sm font-semibold'>Upload Prescription</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className='text-muted-foreground h-4 w-4 cursor-pointer transition-colors hover:text-primary' />
                    </TooltipTrigger>
                    <TooltipContent
                      className='border-border w-64 rounded-xl border bg-white/90 p-4 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 dark:bg-gray-800/90'
                      align='center'
                      side='top'
                    >
                      <div className='space-y-2'>
                        {guildLines.map((g, idx) => (
                          <div key={idx} className='flex items-start gap-2'>
                            <LucideDot
                              className='mt-0.5 text-primary'
                              size={16}
                            />
                            <p className='text-muted-foreground text-sm leading-relaxed'>
                              {g}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className='flex items-center gap-2 p-4'>
                <Image
                  src='/images/warning.svg'
                  alt='Warning'
                  width={25}
                  height={25}
                  className='flex-shrink-0'
                />

                <p className='text-xs text-red-600'>
                  Your uploaded prescription should have all the information
                  like the below model prescription
                </p>
              </div>

              <div className='grid grid-cols-[2fr_1fr] gap-1 px-4'>
                <div>
                  <Image
                    src={'/images/Prescription/SamplePrescription.png'}
                    alt='Davainda Logo'
                    width={678}
                    height={737}
                    layout='responsive'
                  />
                </div>
              </div>
            </div>

            <div className='overflow-hidden rounded-md bg-white shadow'>
              <div className='bg-[#F9F9F9] p-4'>
                <p className='text-sm font-semibold'>Attach Prescription</p>
              </div>

              <div className='px-4 pt-4'>
                <div className='space-y-4'>
                  <p className='text-xs text-label'>
                    Please upload valid prescriptions from doctor
                  </p>

                  <div>
                    <PrescriptionFileUpload
                      renderButton={(openFilePicker, isLoading) => (
                        <Button
                          onClick={() => {
                            if (currentLocation?.isDeliverable) openFilePicker()
                            else setShowConsultationNotAvailable(true)
                          }}
                          // disabled={isDisabled}
                          color='#008080'
                          className='w-full gap-3 bg-green-600 font-semibold'
                        >
                          <UploadIcon
                            className={isLoading ? 'animate-bounce' : ''}
                          />
                          {isLoading ? 'Uploading...' : 'Upload now'}
                        </Button>
                      )}
                      onFileUpload={onFileUpload}
                      isLoggedIn={isLoggedIn}
                    />
                  </div>

                  {/* <div>
                    <Button
                      color='#008080'
                      className='w-full gap-3 font-semibold text-primary-teal'
                      variant={'outline'}
                    >
                      <FileTextIcon />
                      Past Prescription
                    </Button>
                  </div> */}
                </div>

                <div className='py-6'>
                  <Separator></Separator>
                </div>

                {/* <div className='space-y-4'>
                  {options.map((o, idx) => {
                    return (
                      <div
                        className='grid cursor-pointer grid-cols-[40px_60px_1fr] items-center rounded-md border p-3'
                        key={idx}
                        onClick={() => setMethod(o.type)}
                      >
                        <div>
                          {method !== o.type ? (
                            <CircleIcon size={20} className={'text-label'} />
                          ) : (
                            <CircleCheckIcon size={20} className='text-primary' />
                          )}
                        </div>

                        <div>
                          <div
                            style={{
                              position: 'relative',
                              width: '40px',
                              height: '40px'
                            }}
                          >
                            <Image
                              src={`/images/Prescription/${method == o.type ? o.image : `${o.image}Disabled`}.svg`}
                              alt='Davainda Logo'
                              fill
                              priority={true}
                            />
                          </div>
                        </div>

                        <div className='space-y-1'>
                          <p className='text-sm font-semibold'>{o.title}</p>
                          <p className='text-xs text-label'>{o.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div> */}

                <div className='py-6'>
                  <Button
                    className='w-full gap-3 font-semibold'
                    disabled={!prescriptionFiles?.length}
                    onClick={() => handleContinue()}
                  >
                    Continue
                  </Button>
                  {!prescriptionFiles?.length && (
                    <span className='flex items-center justify-center pt-3 text-xs text-red-600'>
                      To proceed further please upload the prescription
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Dialog
            open={showConsultationNotAvailable}
            onOpenChange={setShowConsultationNotAvailable}
          >
            <DialogContent className='sm:max-w-[700px]'>
              <div className='flex w-full justify-center'>
                {/* Zip code is not deliverable */}
                <div
                  className={'flex flex-col items-center justify-between gap-3'}
                >
                  <div className='flex justify-center'>
                    <Image
                      width={222}
                      height={170}
                      alt=''
                      src={'/images/DoctorConsultation.svg'}
                    />
                  </div>
                  <div className={'pb-3 font-bold'}>
                    We're coming to your location soon. Stay tuned for updates
                  </div>
                  <div>
                    <DialogClose asChild>
                      <Button className={'flex h-12 w-48 items-center'}>
                        OK
                      </Button>
                    </DialogClose>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  )
}
