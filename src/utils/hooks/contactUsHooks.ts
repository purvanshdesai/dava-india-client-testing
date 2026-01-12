import { useMutation } from '@tanstack/react-query'
import { sendUserQuery } from '../actions/contactUsActions'

export const useSendUserQuery = () => {
  return useMutation({
    mutationFn: sendUserQuery
  })
}
