'use server'
import api from '@/lib/axios'

const API_PATH = '/medicine-remainder'

export interface MedicineRemainderData {
  pincode: string
  productId: string
}

export const createMedicineRemainder = async (data: MedicineRemainderData) => {
  try {
    const response = await api.post(API_PATH, data)
    return response.data
  } catch (error: any) {
    console.error('Error creating medicine remainder:', error)
    return {
      error: true,
      message:
        error?.response?.data?.message || 'Failed to check one day delivery'
    }
  }
}

export const fetchMedicineRemainders = async (params?: {
  productId?: string
  status?: string
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.productId) queryParams.append('productId', params.productId)
    if (params?.status) queryParams.append('status', params.status)

    const url = queryParams.toString()
      ? `${API_PATH}?${queryParams.toString()}`
      : API_PATH
    const response = await api.get(url)
    return response.data
  } catch (error: any) {
    console.error('Error fetching medicine remainders:', error)
    throw error
  }
}

export const updateMedicineRemainder = async (
  id: string,
  data: Partial<MedicineRemainderData>
) => {
  try {
    const response = await api.patch(`${API_PATH}/${id}`, data)
    return response.data
  } catch (error: any) {
    console.error('Error updating medicine remainder:', error)
    throw error
  }
}
