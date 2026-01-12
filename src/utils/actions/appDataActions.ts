'use server'
import api from '@/lib/axios'
const API_URL = '/app-data'

export const handleGetAllOrderTrackingStatus = async () => {
  try {
    const res = await api.get(API_URL, {
      params: { type: 'order-tracking-status' }
    })

    return res.data.filter((s: any) => s.visibility.includes('consumer'))
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getAllReturnOrderReasons = async () => {
  const res = await api.get(API_URL, {
    params: { type: 'item-return-reason' }
  })

  return res.data
}

export const getAllCancelOrderReasons = async () => {
  const res = await api.get(API_URL, {
    params: { type: 'item-cancel-reason' }
  })

  return res.data
}
