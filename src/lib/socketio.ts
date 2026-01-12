'use client'
import { io } from 'socket.io-client'
import useCheckoutStore from '@/store/useCheckoutStore'

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  path: process.env.NEXT_PUBLIC_SOCKET_PATH,
  transports: ['websocket']
})

socket.on('connect', () => {
  console.log('socket connected')

  socket.on('payment-status', data => {
    useCheckoutStore.getState().setPaymentStatus(data?.status)
  })
})
