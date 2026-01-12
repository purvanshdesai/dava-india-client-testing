'use server'
import api from '@/lib/axios'

const API_URL = '/policies-user'

export const getPolicies = async (params: { policy: string }) => {
  try {
    console.log(`${API_URL}?policy=${params.policy}`)
    const response = await api.get(`${API_URL}?policy=${params.policy}`)

    return response.data ?? ''
  } catch (error: any) {
    console.error('Error fetching policies:', error?.response)
    throw error
  }
}
