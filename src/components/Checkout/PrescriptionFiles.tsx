'use client'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import useCheckoutStore from '@/store/useCheckoutStore'
import Image from 'next/image'
import { useEffect } from 'react'

export default function PrescriptionFiles() {
  const { prescriptionFiles, setPrescriptionUrl } = useCheckoutStore()

  useEffect(() => {
    return () => {
      setPrescriptionUrl([])
    }
  }, [setPrescriptionUrl])
  return (
    <div>
      <Card className='dark:bg-gray-900'>
        <CardHeader className='rounded-t-lg bg-gray-50 p-3 dark:bg-gray-700'>
          <CardTitle className='flex items-center justify-between text-sm font-semibold'>
            Prescription Files
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3 pt-3'>
          {prescriptionFiles.map((file: any, idx: number) => {
            return (
              <div
                className='relative h-52 w-48 overflow-hidden rounded-md'
                key={idx}
              >
                <Image
                  src={file}
                  alt='Image File preview'
                  fill
                  objectFit='fill'
                />
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
