'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { shareApp } from '@/utils/actions/shareApp'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'

export default function AppShare() {
  const [contactMethod, setContactMethod] = useState('email')
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const shareapp = useTranslations('ShareApp')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleContactChange = (value: string) => {
    setContactMethod(value)
    setInputValue('')
    setError('')
  }

  const validateInput = () => {
    if (contactMethod === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(inputValue)) {
        setError('Please enter a valid email address.')
        return false
      }
    } else {
      const phoneRegex = /^(\+91[\s-]?|91[\s-]?|0)?[6-9]\d{9}$/

      if (!phoneRegex.test(inputValue)) {
        setError('Please enter a valid 10-digit phone number.')
        return false
      }
    }
    setError('')
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    if (!inputValue) {
      setError(`Please enter your ${contactMethod}.`)
      setLoading(false)
      return
    }

    setError('')
    if (validateInput()) {
      // alert(inputValue)
      try {
        await shareApp({
          sharingMedium: contactMethod,
          shareWith: inputValue
        })
        toast({
          title: 'Success',
          description: 'Link sent successfully!'
        })

        setInputValue('')
      } catch (e: any) {
        toast({
          title: 'Error',
          description: e.message
        })
      }
    }
    setLoading(false)
  }

  return (
    <div className='m-5 flex flex-row justify-evenly rounded-xl bg-white p-4'>
      <div style={{ position: 'relative', width: '668px', height: '514px' }}>
        <Image
          src={'/images/AppShare.svg'}
          alt='App share Image'
          className='cursor-pointer'
          fill
          priority={true}
        />
      </div>

      <div className='items-left flex flex-col space-y-4 p-8'>
        <h1 className='text-3xl font-bold'>{shareapp('download_our_app')}</h1>
        <p>{shareapp('download_desc')}</p>

        <div style={{ position: 'relative', width: '128px', height: '128px' }}>
          <Image
            src={'/images/DavaindiaAppQRCode.png'}
            alt='QR Code'
            className='cursor-pointer'
            fill
            priority={true}
          />
        </div>
        <div className='mt-4 text-center'>
          <p>{shareapp('download_desc_2')}</p>
        </div>

        <div className='mt-4'>
          <RadioGroup
            value={contactMethod}
            onValueChange={handleContactChange}
            className='flex flex-row space-x-4'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='email' id='email' />
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='phone' id='phone' />
              <label htmlFor='phone' className='text-sm font-medium'>
                Phone
              </label>
            </div>
          </RadioGroup>
        </div>

        <div className='mt-4 flex flex-col lg:flex-row lg:space-x-4'>
          <div className='relative flex w-full max-w-sm flex-row items-center rounded-md border border-gray-300 lg:w-1/2'>
            <Input
              type={contactMethod === 'email' ? 'email' : 'tel'}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={
                contactMethod === 'email' ? 'Enter email' : 'Enter phone number'
              }
              className={`border-none ${contactMethod === 'phone' ? 'pl-16' : ''}`}
            />
            {contactMethod === 'phone' && (
              <div className='absolute left-2 top-2 flex items-center gap-2 px-1 text-label'>
                +&#8201;91
                <span className='text-label'>|</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className='mt-4 w-1/2 rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 lg:mt-0 lg:w-auto'
          >
            {loading ? 'Loading...' : shareapp('share_app_button')}
          </Button>
        </div>

        {error && <p className='text-sm text-red-500'>{error}</p>}
        <div className='mt-6'>
          <p>{shareapp('download_from_the_app')}</p>
          <div className='mt-2 flex space-x-4'>
            <Link
              href={
                'https://apps.apple.com/in/app/davaindia-generic-pharmacy/id6741474883'
              }
              rel='noopener noreferrer'
              target='_blank'
            >
              <div
                style={{ position: 'relative', width: '180px', height: '60px' }}
              >
                <Image
                  src={'/images/AppStoreButton.svg'}
                  alt='App store button'
                  className='cursor-pointer'
                  fill
                  priority={true}
                />
              </div>
            </Link>
            <Link
              rel='noopener noreferrer'
              target='_blank'
              href={
                'https://play.google.com/store/apps/details?id=com.davaindia'
              }
            >
              <div
                style={{ position: 'relative', width: '180px', height: '60px' }}
              >
                <Image
                  src={'/images/PlayStoreButton.svg'}
                  alt='Play store button'
                  className='cursor-pointer'
                  fill
                  priority={true}
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
