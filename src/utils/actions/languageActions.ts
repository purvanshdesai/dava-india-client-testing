'use server'
import api from '@/lib/axios'

export async function fetchLanguageMessages(
  locale: string
): Promise<{ messages: any }> {
  try {
    const axiosRes = await api.get('/i18n-settings/translation?code=' + locale)

    const messages = axiosRes?.data ?? []

    // const messages = {
    //   NotFoundPage: {
    //     title: 'Not found from Fra from server' + locale
    //   },
    //   HomePage: {
    //     title: 'Hello world from Fra from server' + locale,
    //     about: 'Go to the about page France'
    //   }
    // }

    return { messages }
  } catch (e) {
    console.log(e)
    return { messages: {} }
  }
}
