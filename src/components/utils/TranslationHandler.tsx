'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'

interface Handler {
  word: string
  translations: any
  isHTML?: boolean
}

const extractPlainText = (htmlString: string) => {
  if (!htmlString) return ''
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlString
  return tempDiv.innerText
}

export default function TranslationHandler({
  word,
  translations = {},
  isHTML,
}: Handler) {
  const locale = useLocale() // Get current locale
  const [translation, setTranslation] = useState(word)

  useEffect(() => {
    (async () => {
      const rawTranslation = translations[locale] || ''
      const processedTranslation = isHTML
        ? extractPlainText(rawTranslation)
        : rawTranslation

      setTranslation(processedTranslation?.length > 0 ? processedTranslation : word)
    })()
  }, [word, locale, isHTML])

  return <>{translation}</>
}
