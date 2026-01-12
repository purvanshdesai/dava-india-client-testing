import { useQuery } from '@tanstack/react-query'
import { fetchUserMembership } from '../actions/membershipAction'

export const useFetchMembership = () => {
  return useQuery({
    queryKey: ['fetch-user-membership'],
    queryFn: () => fetchUserMembership()
  })
}
