import { useQuery, useMutation } from '@tanstack/react-query'
import { syncCart, fetchCart } from '../actions/cartActions'

export const useSyncCart = () => {
  return useMutation({
    mutationFn: syncCart
  })
}

export const useFetchCart = () => {
  return useQuery({
    queryKey: ['fetch-cart'],
    queryFn: () => fetchCart
  })
}
