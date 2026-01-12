import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMedicineRemainder,
  fetchMedicineRemainders,
  updateMedicineRemainder,
  type MedicineRemainderData
} from '../actions/medicineRemainderActions'

export const useCreateMedicineRemainder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMedicineRemainder,
    onSuccess: () => {
      // Invalidate and refetch medicine remainders
      queryClient.invalidateQueries({ queryKey: ['medicine-remainders'] })
    }
  })
}

export const useFetchMedicineRemainders = (params?: {
  productId?: string
  status?: string
}) => {
  return useQuery({
    queryKey: ['medicine-remainders', params],
    queryFn: () => fetchMedicineRemainders(params),
    enabled: !!params?.productId
  })
}

export const useUpdateMedicineRemainder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string
      data: Partial<MedicineRemainderData>
    }) => updateMedicineRemainder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicine-remainders'] })
    }
  })
}
