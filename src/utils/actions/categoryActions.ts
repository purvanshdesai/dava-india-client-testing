'use server'
import api from '@/lib/axios'
const API_URL = '/consumer/categories'

export const fetchCategories = async () => {
  try {
    const response = await api.get(`${API_URL}`)
    return response.data
  } catch (error: any) {
    return error?.response.data
  }
}

export async function fetchCategory(categoryId: string) {
  try {
    const axiosRes = await api.get(`${API_URL}/${categoryId}`)

    return axiosRes?.data ?? []
  } catch (e) {
    console.log(e)
    throw e
  }
}
