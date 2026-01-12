'use server'
import api from '@/lib/axios'
const API_URL = '/consultations'

export const getConsultation = async (id: string) => {
  try {
    const res = await api.get(`${API_URL}/${id}`)
    return res.data
  } catch (error) {
    throw error
  }
}

export const getConsultations = async (query: any) => {
  try {
    const reqQuery: any = {
      $limit: query?.$limit,
      $skip: query?.$skip
    }
    if (query?.status) {
      reqQuery.status = query?.status
    }
    const res = await api.get(API_URL, {
      params: {
        ...reqQuery
      }
    })
    return res.data
  } catch (error) {
    throw error
  }
}
