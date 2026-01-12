'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useFetchInvoiceDownloadURL } from '@/utils/hooks/invoiceDownload'

export default function DownloadInvoice() {
  const params = useParams<{ invoiceId: string }>()
  const { data, isPending, isError } = useFetchInvoiceDownloadURL({
    invoiceId: params.invoiceId
  })

  const downloadPDF = () => {
    if (!data?.invoiceUrl) return
    fetch(data?.invoiceUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.blob()
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `invoice_${data.invoiceNo}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      })
      .catch(error => {
        console.error('There was an error downloading the PDF:', error)
      })
  }

  useEffect(() => {
    downloadPDF()
  }, [data])

  if (isError) return <p>Something went wrong</p>

  if (isPending) return <p>Loading invoice...</p>

  return <div>Downloading invoice ....</div>
}
