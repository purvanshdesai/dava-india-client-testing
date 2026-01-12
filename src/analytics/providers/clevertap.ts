import { PROVIDER_NAMES } from '../constants/providerNames'

let clevertap: any = null
let ctInitialized = false
let ctUserInitialized = false

// Initialize CleverTap
export const initializeCleverTap = async () => {
  try {
    if (typeof window === 'undefined' || ctInitialized) return // Ensure it's only run on client

    const clevertapModule = await import('clevertap-web-sdk')
    clevertap = clevertapModule.default

    if (process.env.NODE_ENV === 'development') {
      clevertap.setLogLevel(3)
    }

    clevertap.init(
      process.env.NEXT_PUBLIC_CLEVERTAP_PROJECT_ID,
      process.env.NEXT_PUBLIC_CLEVERTAP_REGION ?? 'eu1'
    )

    ctInitialized = true

    console.log('CleverTap initialized successfully')
  } catch (error) {
    console.error('Failed to initialize CleverTap:', error)
  }
}

const clevertapProvider = {
  name: PROVIDER_NAMES.CLEVERTAP,
  initializeUser: async (user: any) => {
    try {
      if (!ctInitialized) await initializeCleverTap()

      if (
        typeof window !== 'undefined' &&
        clevertap &&
        typeof clevertap.event?.push === 'function'
      ) {
        clevertap.onUserLogin.push({
          Site: {
            Identity: user?.id,
            Name: user?.name,
            Email: user?.email,
            Phone: user?.phoneNumber
          }
        })

        ctUserInitialized = true
        console.log('[CleverTap] User initialized successfully!')

        clevertap?.notifications?.push({
          titleText: 'Would you like to receive Push Notifications?',
          bodyText: 'We promise to only send relevant updates!',
          okButtonText: 'Yes, sign me up!',
          rejectButtonText: 'No thanks',
          okButtonColor: '#F28046',
          askAgainTimeInSeconds: 5,
          serviceWorkerPath: '/clevertap_sw.js'
        })
      } else {
        console.warn('[CleverTap] SDK not available or improperly initialized')
      }
    } catch (err) {
      console.log(err)
    }
  },
  trackEvent: async (event: string, payload?: Record<string, any>) => {
    try {
      if (
        typeof window !== 'undefined' &&
        clevertap &&
        typeof clevertap.event?.push === 'function'
      ) {
        clevertap.event.push(event, payload || {})
      } else {
        console.warn('[CleverTap] SDK not available or improperly initialized')
      }
    } catch (err) {
      console.log(err)
    }
  }
}

export const isClevertapInitialized = ctInitialized
export const isClevertapUserInitialized = ctUserInitialized
export default clevertapProvider
