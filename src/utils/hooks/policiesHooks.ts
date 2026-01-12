import { useQuery } from '@tanstack/react-query'
import { getPolicies } from '../actions/policiesActions'

export const useFetchPolicies = (params: { policy: string }) => {
    const { policy } = params
    return useQuery({
        queryKey: ['fetch-policies', policy],
        queryFn: () => getPolicies(params),
    })
}
