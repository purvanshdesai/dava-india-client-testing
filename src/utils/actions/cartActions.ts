'use server'
import api from '@/lib/axios'
const API_URL = '/carts'

export const syncCart = async (cart: any) => {
  try {
    const response = await api.post(API_URL, cart)

    // console.log('Synced ----', response?.data)

    return response.data
  } catch (error) {
    // console.log(error)
    throw error
  }
}

export const verifyProductStock = async (data: any) => {
  try {
    const response = await api.post(`${API_URL}/verify-product`, data)

    return { data: response.data }
  } catch (error: any) {
    // console.log('error ====------ ', error.response.data)
    return { error: true, message: error?.response?.data?.message }
  }
}

export const fetchCart = async () => {
  try {
    const response = await api.get(API_URL)
    // console.log('fetched ----', response?.data)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const checkOneDayDelivery = async (data: { addressId: string }) => {
  try {
    const response = await api.post(`${API_URL}/check-one-day-delivery`, data)
    return response.data
  } catch (error: any) {
    console.log('One day delivery check error:', error?.response?.data)
    return {
      error: true,
      message:
        error?.response?.data?.message || 'Failed to check one day delivery'
    }
  }
}
