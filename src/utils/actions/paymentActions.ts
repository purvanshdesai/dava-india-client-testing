'use server'
import api from '@/lib/axios'
const API_URL = '/verify-payment'

export const verifyPayment = async (params: {
  paymentOrderId: string
  orderId: string
  paymentFor: string
}) => {
  try {
    const response = await api.post(`${API_URL}`, params)

    return response.data
  } catch (error) {
    throw error
  }
}
