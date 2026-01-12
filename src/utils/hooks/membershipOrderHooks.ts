import { useMutation } from '@tanstack/react-query'
import { createNewOrder } from '../actions/membershipOrderAction'

export const useCreateMembershipOrder = () => {
  return useMutation({
    mutationFn: createNewOrder
  })
}
