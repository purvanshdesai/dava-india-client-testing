'use server'
import api from '@/lib/axios'
const API_URL = '/analytics-tracker-history'

export const saveAnalyticsTrackerEvent = async (cart: any) => {
  try {
    const response = await api.post(API_URL, cart)
    return response.data
  } catch (error) {
    // console.log(error)
    throw error
  }
}
