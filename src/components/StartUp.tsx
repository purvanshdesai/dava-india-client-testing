'use client'

import { useEffect, useRef } from 'react'
import useCheckoutStore from '@/store/useCheckoutStore'
import useDeliveryAddressStore from '@/store/useDeliveryAddressStore'
import { useSession } from 'next-auth/react'

// Init Socket
// import '../lib/socketio'

import socketNotificationListener from '@/utils/SocketNotificationListener'
import usePatientsStore from '@/store/userPatientsStore'
// import useNotificationStore from '@/store/useNotificationStore'
import useUserDetailsStore from '@/store/useUserDetailsStore'
import { storeUtmDetailsInLocal } from '@/utils/utmManager'
import { initAdjust } from '@/analytics/providers/adjust'

export default function StartUp() {
  const session = useSession() as any
  const isLoggedIn = session.status === 'authenticated'
  // const { notifications } = useNotificationStore()

  const {
    fetchCart: fetchUserCart,
    setCurrentLocationByCoords,
    setPatientId
  } = useCheckoutStore(state => state)
  const fetchAddresses = useDeliveryAddressStore(state => state.fetchAddresses)
  const { fetchPatients, patients, isFetched } = usePatientsStore(
    state => state
  )
  const { fetchUserDetails } = useUserDetailsStore(state => state)

  // Ref to ensure effect runs only once
  const hasRun = useRef(false)
  const startUpRun = useRef(false)

  useEffect(() => {
    // Ensure it runs only once when both session and isLoggedIn are available
    if (!hasRun.current && isLoggedIn && session?.data) {
      fetchUserDetails()
      fetchUserCart()
      fetchAddresses()
      fetchPatients()
      socketNotificationListener.initialize()
      socketNotificationListener.fetchNotifications()

      // Mark as executed
      hasRun.current = true
    }
  }, [isLoggedIn, session]) // Watches both isLoggedIn and session

  useEffect(() => {
    if (isFetched && patients.length > 0) {
      setPatientId(patients[0]?._id)
    }
  }, [isFetched, patients])
  // Fetch User location when page loads and find zipcode
  useEffect(() => {
    // Store utm params from partners app
    storeUtmDetailsInLocal()

    if (startUpRun.current) return

    // Fetch Default
    setCurrentLocationByCoords({ latitude: 0, longitude: 0 })

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          const locationData = { latitude, longitude }
          setCurrentLocationByCoords(locationData)
        },
        error => {
          console.log(error)
        }
      )
    }

    startUpRun.current = true
  }, [])

  useEffect(() => {
    const setupAdjust = async () => {
      await initAdjust()
    }

    setupAdjust()
  }, [])

  return <></>
}
