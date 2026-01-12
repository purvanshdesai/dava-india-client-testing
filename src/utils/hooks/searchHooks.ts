import { useQuery } from '@tanstack/react-query'
import { getSearchSuggestions, getSearchResults } from '../actions/searchAction'

export const useFetchSearchSuggestions = (searchKey: string) => {
  return useQuery({
    queryKey: ['fetch-search-suggestions', searchKey],
    queryFn: () => getSearchSuggestions(searchKey)
  })
}

export const useFetchGlobalSearch = (searchKey: string) => {
  return useQuery({
    queryKey: ['fetch-global-search', searchKey],
    queryFn: () => getSearchResults(searchKey)
  })
}
