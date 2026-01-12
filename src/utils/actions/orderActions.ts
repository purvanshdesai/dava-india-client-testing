'use server'
import api from '@/lib/axios'
import { OrderDetails } from '../../../types/tracking'
const API_URL = '/order'

export const createNewOrder = async (cart: any) => {
  const resp: any = {}
  try {
    const response = await api.post(API_URL, cart)

    // return response.data
    resp.data = response.data
  } catch (error: any) {
    console.log('from axio----', error.response.data)
    // throw error
    resp.error = error.response.data
  }
  return resp
}

export const fetchOrders = async (params?: {
  page?: number
  limit?: number
  dateFilter?: string
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.dateFilter && params.dateFilter !== 'all') {
      queryParams.append('dateFilter', params.dateFilter)
    }

    const url = queryParams.toString()
      ? `${API_URL}?${queryParams.toString()}`
      : API_URL
    const response = await api.get(url)

    return response.data
  } catch (error: any) {
    console.log(error?.response)
    throw error
  }
}

export const fetchOrderById = async (orderId: string) => {
  try {
    const response = await api.get(`${API_URL}/${orderId}`)

    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const fetchOrderTracking = async ({
  orderId,
  orderTrackingId
}: {
  orderId: string
  orderTrackingId: string
}): Promise<OrderDetails> => {
  try {
    const response = await api.get(`${API_URL}/${orderId}/track`, {
      params: {
        orderId,
        orderTrackingId
      }
    })

    return response?.data ?? null
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const consultationOrder = async (data: any) => {
  try {
    const res = await api.post(`/tickets`, { ...data })
    return res.data
  } catch (error) {
    throw error
  }
}

export const cancelProduct = async ({
  orderId,
  productId,
  reason,
  note,
  cancelQuantity
}: {
  orderId: string
  productId: string
  reason: string
  note?: string
  cancelQuantity: number
}) => {
  try {
    const res = await api.post(`order/${orderId}/cancel`, {
      orderId,
      productId,
      reason,
      note,
      cancelQuantity
    })
    return res.data
  } catch (error) {
    throw error
  }
}

export const returnProduct = async ({
  orderId,
  productId,
  reason,
  note,
  images,
  returnQuantity
}: {
  orderId: string
  productId: string
  reason: string
  note?: string
  images: any[]
  returnQuantity: number | string
}) => {
  try {
    const res = await api.post(`order/${orderId}/return`, {
      orderId,
      productId,
      reason,
      note,
      images,
      returnQuantity
    })
    return res.data
  } catch (error: any) {
    const message =
      error.response.data?.message || 'Error while processing return order!'
    throw new Error(message)
  }
}
