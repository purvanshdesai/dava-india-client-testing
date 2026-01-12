'use client'
import { io } from 'socket.io-client'

export default (namespace: string) => {
  console.log('reach here')
  const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/${namespace}`, {
    // autoConnect: fals
  })
  socket.on('connect', () => {
    console.log('socket connected1')
  })
  return socket
}
