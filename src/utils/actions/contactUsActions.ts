'use server'
import api from '@/lib/axios'
const API_URL = '/contact-us'

export const sendUserQuery = async (data: any) => {
  try {
    const res = await api.post(API_URL, { ...data })
    return res.data
  } catch (error) {
    throw error
  }
}
