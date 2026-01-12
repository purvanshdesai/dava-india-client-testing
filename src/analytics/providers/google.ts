'use client'
import { sendGAEvent } from '@next/third-parties/google'
import { PROVIDER_NAMES } from '../constants/providerNames'

const googleProvider = {
  name: PROVIDER_NAMES.GOOGLE_ANALYTICS,
  initializeUser: () => {
    try {
    } catch (err) {
      console.log(err)
    }
  },
  trackEvent: (event: string, payload?: Record<string, any>) => {
    try {
      if (typeof window === 'undefined' || !window?.gtag) {
        console.log('GoogleAnalytics not loaded.')
      }

      sendGAEvent('event', event, { ...payload })
    } catch (err) {
      console.log(err)
    }
  }
}

export default googleProvider
