import { useQuery } from '@tanstack/react-query'
import { fetchReferral } from '../actions/userAction'

export const useFetchReferAndEarn = () => {
  return useQuery({
    queryKey: ['refer-and-earn'],
    queryFn: () => fetchReferral()
  })
}
