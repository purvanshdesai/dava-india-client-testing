'use server'
import api from '@/lib/axios'
const API_URL = '/users/account'

export const fetchUserAccount = async () => {
  try {
    const response = await api.get(`${API_URL}`)

    return response?.data
  } catch (error: any) {
    return error?.response.data
  }
}

export const fetchReferral = async (): Promise<{
  referralCode: string
}> => {
  try {
    const res = await api.get('/users/referral')
    const referralCode = res.data.referralCode
    return { referralCode }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        'Failed to fetch referral code'
    )
  }
}
