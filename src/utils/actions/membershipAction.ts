'use server'
import api from '@/lib/axios'
const API_URL = '/memberships'

export const fetchUserMembership = async () => {
  try {
    const response = await api.get(`${API_URL}`)
    return response.data
  } catch (error: any) {
    return error?.response.data
  }
}
