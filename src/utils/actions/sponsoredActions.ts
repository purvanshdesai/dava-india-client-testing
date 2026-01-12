'use server'
import api from '@/lib/axios'

const SPONSORED_API_PATH = '/sponsored-layout/consumer'
const CONSUMER_API_PATH = '/order/products'

export async function fetchSponsoredSettings() {
  try {
    const axiosRes = await api.get(SPONSORED_API_PATH)
    return axiosRes?.data ?? []
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function fetchConsumerBuyedProducts() {
  try {
    const axiosRes = await api.get(CONSUMER_API_PATH)
    return axiosRes?.data ?? []
  } catch (e) {
    console.error('Error fetching consumer buyed products:', e)
    throw e
  }
}
