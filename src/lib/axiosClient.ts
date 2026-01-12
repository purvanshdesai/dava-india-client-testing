'use client'
import axios from 'axios'
import { getSession } from 'next-auth/react'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

apiClient.interceptors.request.use(async config => {
  const session = await getSession()

  config.headers.Authorization = `Bearer ${session?.accessToken}`

  return config
})

// ⚠️ Add error logging
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Log request details
    const method = error.config?.method?.toUpperCase()
    const url = `${error.config?.baseURL || ''}${error.config?.url || ''}`

    console.error('❌ Axios Error:')
    console.error(`➡️ Path: [${method}] ${url}`)

    // Log response details if available
    if (error.response) {
      console.error(`📡 Status: ${error.response.status}`)
      console.error('📦 Response data:', error.response.data)
    } else if (error.request) {
      console.error('📭 No response received from server.')
    } else {
      console.error('⚙️ Error setting up request:', error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
