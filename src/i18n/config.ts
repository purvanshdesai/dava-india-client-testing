export type Locale = (typeof supportedLocales)[number]

export const supportedLocales = ['en', 'fr', 'es', 'hi', 'bn'] as const
export const defaultLocale: Locale = 'en'
