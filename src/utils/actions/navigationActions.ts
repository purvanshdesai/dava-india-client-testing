'use server'
import api from '@/lib/axios'
const API_URL = '/consumer/navigations'
const COLLECTION_API_URL = '/consumer/collection/navigations'

export const fetchCategoryNavigation = async () => {
  try {
    const response = await api.get(`${API_URL}`)
    return response.data
  } catch (error: any) {
    return error?.response.data
  }
}

export const fetchCollectionNavigationPath = async (collectionId: string) => {
  try {
    const response = await api.get(
      `${COLLECTION_API_URL}?collectionId=${collectionId}`
    )
    return response.data
  } catch (error: any) {
    return error?.response.data
  }
}
