import { useMutation } from '@tanstack/react-query'
import { verifyPayment } from '../actions/paymentActions'

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: verifyPayment
  })
}
