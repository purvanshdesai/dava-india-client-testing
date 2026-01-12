export {}

declare global {
  interface Window {
    Razorpay: any
    razorpay: any
    $zoho: {
      salesiq?: {
        widgetcode?: string
        values?: Record<string, any>
        ready?: () => void
        [key: string]: any // Allow additional dynamic keys
      }
    }
  }
}
