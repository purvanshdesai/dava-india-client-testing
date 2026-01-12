'use server'
import api from '@/lib/axios'
const API_URL = '/global-search'

const emptyState = { products: [], compositions: [] }

export const getSearchSuggestions = async (searchText: string) => {
  try {
    if (!searchText) return emptyState

    const response = await api.get(
      `${API_URL}/suggestions?search=${searchText}`
    )

    return response.data ?? emptyState
  } catch (error) {
    throw error
  }
}

export const getSearchResults = async (searchText: string) => {
  try {
    if (!searchText) return emptyState

    const response = await api.get(`${API_URL}?search=${searchText}`)

    return response.data ?? emptyState
  } catch (error) {
    throw error
  }
}
