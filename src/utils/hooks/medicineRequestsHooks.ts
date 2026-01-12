import { useMutation } from '@tanstack/react-query'
import { RequestMedicine } from '@/utils/actions/medicineRequestsAction'

export const useCreateRequestMedicine = () => {
  return useMutation({
    mutationFn: RequestMedicine
  })
}
