import { useQuery } from '@tanstack/react-query'
import { fetchDavaCoinsHistory } from '../actions/davaCoinsAction'

export const useFetchDavaCoinsHistory = () => {
  return useQuery({
    queryKey: ['fetch-user-dava-coins-history'],
    queryFn: () => fetchDavaCoinsHistory()
  })
}
