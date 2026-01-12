import { useMutation } from '@tanstack/react-query'
import { fetchSlotsWithDate } from '../actions/slotsActions'

export const useFetchSlotsWithDate = () => {
  return useMutation({
    mutationFn: fetchSlotsWithDate
  })
}
