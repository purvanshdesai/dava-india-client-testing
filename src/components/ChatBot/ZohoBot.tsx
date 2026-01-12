'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

// Define the type for the props
type ZohoChatProps = {
  label: string
  variant: 'profile' | 'order'
  user: any
}

const ZohoChat = ({ label, variant, user }: ZohoChatProps) => {
  useEffect(() => {}, [])

  const openChat = () => {
    if (window.$zoho && window.$zoho.salesiq) {
      window.$zoho.salesiq.visitor.email(user.email)
      window.$zoho.salesiq.visitor.name(user.name)
      window.$zoho.salesiq.chatwindow.visible('show')
    } else {
      console.error('Zoho SalesIQ is not initialized')
    }
  }

  return (
    <>
      {variant === 'profile' ? (
        <Button onClick={openChat}>{label}</Button>
      ) : null}
      {variant === 'order' ? (
        <Button
          onClick={openChat}
          variant={'outline'}
          className={'border-[#008080] text-[#008080]'}
        >
          <Image
            src={'/images/chat-small.svg'}
            alt={'chat-icon'}
            height={20}
            width={20}
          />
          <div className={'px-2'}>{label}</div>
        </Button>
      ) : null}
    </>
  )
}

export default ZohoChat
