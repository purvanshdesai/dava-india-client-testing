'use client'

import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import ZohoChat from '@/components/ChatBot/ZohoBot'
import { useSession } from 'next-auth/react'

export default function NeedHelp() {
  const settingsmanager = useTranslations('SettingsManager')
  const session = useSession() as any

  return (
    <div className={'h-full'}>
      <div className='h-full rounded-2xl bg-white'>
        <h1 className='p-[30px] text-xl font-semibold'>Need Help?</h1>
        <div className='flex h-2/3 items-center justify-center px-8'>
          <div className={'flex flex-col items-center'}>
            <Image
              src={'/images/chat.svg'}
              alt={'chat-icon'}
              height={100}
              width={100}
            />
            <div className={'py-4 font-semibold'}>
              {settingsmanager('start_chatting_with_customer_care')}
            </div>
            <div className={'py-2'}>
              <ZohoChat
                label={settingsmanager('start_chatting')}
                variant={'profile'}
                user={{
                  name: session?.data?.user.name,
                  email: session?.data?.user.email
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
