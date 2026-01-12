'use server'
import api from '@/lib/axios'
const API_URL = '/membership-orders'

export const createNewOrder = async (data: any) => {
  try {
    const response = await api.post(API_URL, { ...data })

    return response.data
  } catch (error: any) {
    throw error
  }
}
