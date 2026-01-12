'use server'
import api from '@/lib/axios'
const API_URL = '/dava-coins-history'

export const fetchDavaCoinsHistory = async () => {
  try {
    const response = await api.get(`${API_URL}`)
    return response.data
  } catch (error: any) {
    return error?.response.data
  }
}
