import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useFetchInvoiceDownloadURL = (query: any) => {
  return useQuery({
    queryKey: ['invoice-download', query],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/downloads/invoice/${query.invoiceId}`
      )
      return res.data
    }
  })
}
