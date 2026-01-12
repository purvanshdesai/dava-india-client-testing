import { PROVIDER_NAMES } from '../constants/providerNames'

let sdkReady: Promise<typeof window.Adjust | null> | null = null

// adjustEvents.ts
type AdjustEnv = 'production' | 'sandbox'

export const ADJUST_EVENTS = {
  AUTH: {
    'User Signed Up': 'A1B2C3',
    'User Signed In': 'D4E5F6',
    'User Profile Updated': 'G7H8I9',
    'User Logged Out': 'J1K2L3',
    'User Devices': 'M4N5O6'
  },
  ORDER: {
    'Order Placed': 'P7Q8R9',
    'Order Failed': 'S1T2U3',
    'Order Cancelled': 'V4W5X6',
    'Return Requested': 'Y7Z8A9'
  },
  CHECKOUT: {
    'Checkout Started': 'B2C3D4',
    'Checkout Abandoned': 'E5F6G7',
    'Payment Successful': 'H8I9J1',
    'Payment Failed': 'K2L3M4'
  },
  PRODUCT: {
    'Product Viewed': 'hwr5g1',
    'Product Added To Cart': 'Q8R9S1',
    'Product Removed From Cart': 'T2U3V4',
    'Product Added To Wishlist': 'W5X6Y7',
    'Product Removed From Wishlist': 'Z8A9B1',
    'Product Reviewed': 'C2D3E4'
  },
  APP: {
    'Search Performed': 'F5G6H7',
    'Category Browsed': 'a8kvwv',
    'Doctor Consultation': 'L2M3N4',
    'Prescription Enquiry': 'O5P6Q7',
    'Prescription Enquiry Search': 'R8S9T1',
    'Repetitive Search': 'U2V3W4',
    'Notification Clicked': 'X5Y6Z7'
  }
} as const

// this flattens all nested groups into a single object
const ALL_EVENTS = Object.freeze(
  Object.fromEntries(
    Object.entries(ADJUST_EVENTS).flatMap(([, items]) =>
      Object.entries(items).map(([key, token]) => [key, token])
    )
  )
)

export async function initAdjust() {
  if (typeof window === 'undefined') return Promise.resolve(null)

  if (sdkReady) {
    return sdkReady
  }

  sdkReady = (async () => {
    // dynamic import avoids SSR issues
    // the npm package registers window.Adjust via its loader
    const Adjust = (await import('@adjustcom/adjust-web-sdk')).default

    // window.Adjust is provided by the library (or adjust global)
    // guard for TypeScript
    if (!Adjust || !Adjust.initSdk) {
      console.warn('Adjust SDK not available')
      return null
    }

    Adjust.initSdk({
      appToken: process.env.NEXT_PUBLIC_ADJUST_APP_TOKEN ?? '',
      environment: process.env.NEXT_PUBLIC_ADJUST_ENVIRONMENT as AdjustEnv,
      logLevel: 'verbose'
    })

    window.Adjust = Adjust

    return Adjust
  })()

  return await sdkReady
}

const adjustProvider = {
  name: PROVIDER_NAMES.ADJUST,
  initializeUser: () => {
    try {
    } catch (err) {
      console.log(err)
    }
  },
  trackEvent: async (event: string, payload?: Record<string, any>) => {
    const Adjust = (await initAdjust()) as any

    if (!Adjust) return

    const eventToken = ALL_EVENTS[event]

    if (!eventToken) {
      console.warn(`Adjust: Event token not found for "${event}"`)
      return
    }

    if (!Adjust) {
      console.warn(`Adjust SDK not loaded yet`)
      return
    }
    Adjust.waitForWebUUID().then((uuid: any) => console.log('web_uuid:', uuid))

    Adjust.trackEvent({
      eventToken,
      callbackParameters: payload ?? {}
    })

    console.log(`✅ Adjust Event Fired: ${event}`, { eventToken, payload })
  }
}

export default adjustProvider
