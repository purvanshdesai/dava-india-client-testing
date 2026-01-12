'use server'
import api from '@/lib/axios'
const API_URL = '/general/app-download'

interface AppShareParams {
  sharingMedium: string
  shareWith: string
}
export const shareApp = async (params: AppShareParams) => {
  try {
    const response = await api.post(API_URL, {
      sharingMedium: params.sharingMedium,
      shareWith: params.shareWith
    })

    return response.data
  } catch (error: any) {
    return error?.response.data
  }
}