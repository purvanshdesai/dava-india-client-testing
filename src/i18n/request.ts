import { getRequestConfig } from 'next-intl/server'
import { getUserLocale } from './locale'
import { fetchLanguageMessages } from '@/utils/actions/languageActions'

export default getRequestConfig(async () => {
  const locale = await getUserLocale()

  const { messages } = await fetchLanguageMessages(locale)

  return { locale, messages }
})
