'use client'
import useNotificationStore from '@/store/useNotificationStore'
import React, { useState } from 'react'
import Notification from './Notification'
import { useMarkAllAsRead } from '@/utils/hooks/notificaationHooks'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

//const notificationTypes = [notif('all'), notif('unread'), notif('read')]
//const notificationTypes = ['all', 'unread', 'read']
const notificationTypes = [
  {
    value: 'all',
    i18nKey: 'all'
  },
  {
    value: 'unread',
    i18nKey: 'unread'
  },
  {
    value: 'read',
    i18nKey: 'read'
  },
]

export default function NotificationContainer() {
  let { notifications } = useNotificationStore()
  const { loadMoreNotification, markAllAsRead } = useNotificationStore()
  const [notificationType, setNotificationType] = useState('all')
  const markAllAsReadMutation = useMarkAllAsRead()
  const notif = useTranslations('Notification')  


  if (notificationType == 'unread') {
    notifications = notifications.filter(
      (notification: any) => !notification.isRead
    )
  }
  if (notificationType == 'read') {
    notifications = notifications.filter(
      (notification: any) => notification.isRead
    )
  }

  const handleScroll = (e: any) => {
    const element = e.target // Get the target of the scroll event
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 1) {
      loadMoreNotification()
    }
  }
  const handleMarkAllRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync()
      markAllAsRead()
    } catch (error) {
      throw error
    }
  }
  return (
    <div className='rounded-2xl bg-white'>
      <h1 className='p-[30px] text-xl font-semibold'>{notif('notification')}</h1>
      <div className='px-8'>
        <div className='flex justify-between'>
          <div className='flex gap-7'>
            {notificationTypes.map(type => (
              <div
                key={type.value}
                onClick={() => setNotificationType(type.value)}
                className={`cursor-pointer font-medium capitalize ${notificationType == type.value ? 'border-b-2 border-primary text-primary' : 'text-[#697386]'}`}
              >
                {notif(type.i18nKey)}
              </div>
            ))}
          </div>
          <div
            className='cursor-pointer font-semibold text-primary'
            onClick={handleMarkAllRead}
          >
            {notif('mark_all_as_read')}
          </div>
        </div>
        <div className='border border-[#DFE4EA]'></div>
        <div className='max-h-[65vh] overflow-auto' onScroll={handleScroll}>
          {notifications.map((notification: any) => (
            <Notification key={notification?._id} notification={notification} />
          ))}
          {!notifications.length ? (
            <div className='flex flex-col items-center py-9'>
              <Image
                src={'/images/no_notification.svg'}
                width={200}
                height={200}
                alt=''
              />
              <h1>{notif('no_notification_found')}</h1>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
