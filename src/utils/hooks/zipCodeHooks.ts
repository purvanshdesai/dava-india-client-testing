import { useQuery } from '@tanstack/react-query'
import { fetchLocationByZipCode } from '../actions/zipCodeActions'

export const useFetchLocationByZipCode = (
  zipCode: string,
  enabled?: boolean
) => {
  return useQuery({
    queryKey: ['fetch-location-by-zip-code'],
    queryFn: () => fetchLocationByZipCode(zipCode),
    enabled: enabled ?? true
  })
}
