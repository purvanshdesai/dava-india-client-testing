'use server'
import api from '@/lib/axios'
const API_URL = '/apply-coupon'

interface CouponParams {
  couponCode: string
  totalAmount: number
  items: any
}
export const fetchCoupon = async (params: CouponParams) => {
  try {
    const channel = 'webApp'
    // Use POST request with items in body to avoid 414 URI Too Long error
    const response = await api.post(API_URL, {
      couponCode: params.couponCode,
      channel,
      totalAmount: params.totalAmount,
      items: params.items || []
    })

    return response.data
  } catch (error: any) {
    return error?.response.data
  }
}

export const fetchAllCoupons = async (params?: any) => {
  console.log(params, 'params')
  try {
    const channel = 'webApp'

    const response = await api.get(
      `/consumer/coupons?channel=${channel}&totalAmount=${params?.total}&email=${params?.email}&phoneNumber=${params?.phoneNumber}&isNewCode=${params?.isNewCode}`
    )
    return response.data
  } catch (error) {
    console.log(error)
  }
}
