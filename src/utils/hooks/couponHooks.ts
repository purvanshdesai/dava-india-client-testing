import { useMutation } from '@tanstack/react-query'
import { fetchAllCoupons, fetchCoupon } from '../actions/couponActions'

export const useFetchCoupon = () => {
  return useMutation({
    mutationFn: fetchCoupon
  })
}

export const useFetchAllCoupons = () => {
  return useMutation({
    mutationFn: fetchAllCoupons
  })
}
