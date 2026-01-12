'use client'
import { PROVIDER_NAMES } from '../constants/providerNames'

declare global {
  interface Window {
    fbq: (...args: any[]) => void
  }
}

const facebookProvider = {
  name: PROVIDER_NAMES.FACEBOOK,
  initializeUser: () => {
    try {
    } catch (err) {
      console.log(err)
    }
  },
  trackEvent: (event: string, payload?: Record<string, any>) => {
    try {
      if (typeof window.fbq === 'function') {
        console.log('FbPixel: Tracking custom event => ', event)
        window.fbq('trackCustom', event, payload)
      }
    } catch (err) {
      console.log(err)
    }
  }
}

export default facebookProvider
