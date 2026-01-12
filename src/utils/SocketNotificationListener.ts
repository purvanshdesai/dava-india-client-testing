import useNotificationStore from '@/store/useNotificationStore'
import { getSession } from 'next-auth/react'
import { io } from 'socket.io-client'
import { playNotificationSound } from '@/lib/notificationAlert'

class SocketNotificationListener {
  socket: any
  fetchPageCallback: () => number
  setNotificationsCallback: (notifications: any) => void
  isInitialized: boolean
  namespace: string
  constructor({
    namespace = 'userNotifications',
    fetchPageCallback,
    setNotificationsCallback
  }: any) {
    this.socket = null
    this.namespace = namespace
    this.fetchPageCallback = fetchPageCallback // Callback to get the current page from Redux
    this.setNotificationsCallback = setNotificationsCallback // Callback to set all notifications together
    this.isInitialized = false
  }

  async initSocket() {
    const session = await getSession()
    // console.log('session 1', session)
    if (session?.accessToken) {
      const socket = io(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/${this.namespace}`,
        {
          transports: ['websocket'],
          query: {
            token: session.accessToken
          }
        }
      )
      this.socket = socket
    } else {
      throw new Error('User not auth')
    }
  }

  async initialize() {
    try {
      if (this.isInitialized) return
      const session = await getSession()
      // console.log('session 1', session)
      if (session?.accessToken) {
        // console.log('connect socket', 1)
        // console.log('socket namespace', this.namespace)
        const socket = io(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}/userNotifications`,
          {
            path: process.env.NEXT_PUBLIC_SOCKET_PATH,
            transports: ['websocket'],
            auth: {
              token: session.accessToken
            },
            forceNew: true
          }
        )
        // console.log(socket)
        this.socket = socket
        this.isInitialized = true
        this.socket.on('connect', () => {
          console.log('socket connected userNotifications')

          this.socket.on('new_notification', (notification: any) => {
            // console.log(notification)
            this.handleNewNotification(notification)
            playNotificationSound()
          })
        })

        // Handle socket connection errors
        this.socket.on('error', (error: any) => {
          console.log('Socket connection error:', error)
        })
      } else {
        throw new Error('User not auth')
      }
    } catch (error) {
      console.log(error)
    }
  }

  disconnect() {
    if (this.isInitialized) {
      this.socket.disconnect()
      this.isInitialized = false
    }
  }

  async fetchNotifications() {
    try {
      useNotificationStore.getState().fetchInitialNotifications()
    } catch (error) {
      console.log('Error fetching notifications:', error)
    }
  }

  handleNewNotification(notification: any) {
    // Use the callback to handle the new notification
    // console.log('handleNewNotification')
    // console.log('csdcds ', this.setNotificationsCallback)
    if (this.setNotificationsCallback) {
      this.setNotificationsCallback(notification)
    }
  }
}

export default new SocketNotificationListener({
  namespace: 'userNotifications',
  setNotificationsCallback: (notification: any) => {
    // console.log('setNotificationsCallback c')
    const setNotification = useNotificationStore.getState().notificationsReducer
    setNotification({
      type: 'ADD_NOTIFICATION',
      payload: notification
    })
  }
})
