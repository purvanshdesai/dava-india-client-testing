import { useQuery } from '@tanstack/react-query'
import { fetchSponsoredSettings } from '../actions/sponsoredActions'
import { fetchConsumerBuyedProducts } from '../actions/sponsoredActions' 

// Hook for sponsored settings
export const useFetchSponsoredSettings = () => {
  return useQuery({
    queryKey: ['fetch-sponsored-settings'],
    queryFn: () => fetchSponsoredSettings(),
  })
}

// Hook for consumer buyed products
export const useFetchConsumerBuyedProducts = () => {
  return useQuery({
    queryKey: ['fetch-consumer-buyed-products'],
    queryFn: () => fetchConsumerBuyedProducts(),
  })
}
