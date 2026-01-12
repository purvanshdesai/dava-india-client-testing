export const PROVIDER_NAMES = {
  CLEVERTAP: 'clevertap',
  SEGMENT: 'segment',
  FIREBASE: 'firebase',
  GOOGLE_ANALYTICS: 'google-analytics',
  FACEBOOK: 'facebook',
  ADJUST: 'adjust'
} as const

export type ProviderName = (typeof PROVIDER_NAMES)[keyof typeof PROVIDER_NAMES]

export const ALL_PROVIDERS: ProviderName[] = Object.values(PROVIDER_NAMES)
export const ALL = 'ALL' as const
export type ProviderList = ProviderName[] | typeof ALL
