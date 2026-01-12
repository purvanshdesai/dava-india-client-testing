import { useQuery } from '@tanstack/react-query'
import { fetchCategoryNavigation } from '../actions/navigationActions'

export const useFetchNavigation = () => {
  return useQuery({
    queryKey: ['find-navigation'],
    queryFn: () => fetchCategoryNavigation()
  })
}
