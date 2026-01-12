'use server'

import api from '@/lib/axios'

const API_PATH = 'medicine-requests'

export async function RequestMedicine(data: {
  medicineName: string
  notes: string
  requestedDate: string
  files: any[]
}) {
  try {
    const axiosRes = await api.post(API_PATH, { ...data })
    return axiosRes?.data ?? {}
  } catch (error: any) {
    throw error
  }
}
