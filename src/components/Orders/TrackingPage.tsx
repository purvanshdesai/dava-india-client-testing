'use client'

import { useGetAllOrderTrackingStatus } from '@/utils/hooks/appDataHooks'
import { useFetchOrderTrackingById } from '@/utils/hooks/orderHooks'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import type { RiderLocation } from '../../../types/tracking'
import RiderInfo from './Tracking/RiderInfo'
import Timeline from './Tracking/Timeline'
import { TrackingMap } from './Tracking/TrackingMap'
import { ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DELIVERY_MODES } from '@/lib/constant'

type SocketState = 'idle' | 'connecting' | 'connected' | 'disconnected'

export function TrackingPage() {
  const { orderId }: { orderId: string } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const { data: trackingStatuses } = useGetAllOrderTrackingStatus()

  const [riderLocation, setRiderLocation] = useState<RiderLocation | any>(null)
  const [, setSocketState] = useState<SocketState>('idle')
  const socketRef = useRef<Socket | null>(null)

  const {
    data: order,
    isLoading,
    isError,
    error: orderError
  } = useFetchOrderTrackingById({
    orderId,
    orderTrackingId: searchParams.get('orderTrackingId') ?? '',
    lastOrderStatus: riderLocation?.status ?? null
  })
  const [error, setError] = useState<string | null>(orderError?.message ?? '')

  useEffect(() => {
    if (
      !order?.isTrackingEnabled ||
      !order.shipmentId ||
      order?.orderTrackingType !== 'order'
    ) {
      return
    }

    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ['websocket'],
      query: { shipmentId: order.shipmentId }
    })

    socketRef.current = socket
    queueMicrotask(() => setSocketState('connecting'))

    socket.on('connect', () => {
      setSocketState('connected')
    })

    socket.on('disconnect', () => {
      setSocketState('disconnected')
    })

    socket.on('rider:update', (payload: RiderLocation) => {
      console.log('🚀 ~ TrackingPage ~ payload:', payload)
      setRiderLocation(payload)
    })

    socket.on('tracking:error', (payload: { message?: string }) => {
      setError(payload?.message ?? 'Live tracking unavailable')
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [order?.shipmentId])

  if (isLoading) {
    return (
      <section className='flex h-[600px] flex-col items-center justify-center bg-white'>
        <div
          style={{
            position: 'relative',
            width: '160px',
            height: '160px'
          }}
        >
          <Image
            src={`/images/DeliveryTruck.gif`}
            alt={'Delivery truck'}
            fill
            priority={false}
            unoptimized
          />
        </div>
        <div>
          <p className='text-sm'>Loading your order details…</p>
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className='page-shell error'>
        <h1>Something went wrong</h1>
        <p>{error}</p>
      </section>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className='flex w-full justify-center p-4 md:px-6'>
      <div className='w-full lg:w-10/12'>
        <div
          className='flex cursor-pointer items-center pb-3 text-sm font-semibold text-primary'
          onClick={() => {
            router.back()
          }}
        >
          <ChevronLeftIcon size={18} /> <span>Back</span>
        </div>
        <div
          className={`grid grid-cols-1 gap-4 ${order?.orderTrackingType == 'order' ? 'md:grid-cols-[2fr_3fr]' : 'md:grid-cols-1'} `}
        >
          {order?.orderTrackingType == 'order' && (
            <RiderInfo
              order={order}
              trackingStatuses={trackingStatuses}
              riderInfo={riderLocation}
            />
          )}
          <div>
            {order?.deliverMode === DELIVERY_MODES.ONE_DAY &&
              order?.orderTrackingType === 'order' && (
                <TrackingMap
                  disableLiveTracking={!order?.isTrackingEnabled}
                  storeLocation={order.store.location}
                  userLocation={order.user.location}
                  riderLocation={riderLocation}
                  route={order.route}
                  deliveryMode={order.deliverMode}
                />
              )}

            {/* {order?.deliverMode === DELIVERY_MODES.STANDARD && ( */}
            <Timeline order={order} trackingStatuses={trackingStatuses} />
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  )
}
