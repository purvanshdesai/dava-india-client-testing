import axios from 'axios'
import { auth, signOut } from '@/auth'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// 🔐 Add auth token on every request
api.interceptors.request.use(async config => {
  try {
    const session = await auth()
    // only set header if we have a token
    if (session?.accessToken) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${session.accessToken}`
    } else {
      // ensure header isn't a weird value like "Bearer undefined"
      if (config.headers?.Authorization) delete config.headers.Authorization
    }
  } catch (e) {
    // auth() can throw if session retrieval fails — ignore and continue without token
    if (config.headers?.Authorization) delete config.headers.Authorization
  }

  return config
})

// ⚠️ Add error logging and JWT handling
api.interceptors.response.use(
  response => response,
  async error => {
    // Log request details
    const method = error.config?.method?.toUpperCase()
    const url = `${error.config?.baseURL || ''}${error.config?.url || ''}`

    console.error('❌ Axios Error:')
    console.error(`➡️ Path: [${method}] ${url}`)

    if (error.response) {
      console.error(`📡 Status: ${error.response.status}`)
      console.error('📦 Response data:', error.response.data)
    } else if (error.request) {
      console.error('📭 No response received from server.')
    } else {
      console.error('⚙️ Error setting up request:', error.message)
    }

    // === Authentication-related handling ===
    const status = error.response?.status
    const respData = error.response?.data
    const message = (respData?.message || respData?.error || '')
      .toString()
      .toLowerCase()
    const name = (respData?.name || '').toString().toLowerCase()

    const isJwtExpired =
      message.includes('jwt expired') || message.includes('token expired')
    const isJwtMalformed =
      message.includes('jwt malformed') ||
      name.includes('jsonwebtokenerror') ||
      name.includes('jwt malformed') ||
      message.includes('jwt malformed')
    const isUnauthorized = status === 401

    if (isJwtExpired || isJwtMalformed || isUnauthorized) {
      try {
        // signOut will clear NextAuth session server-side / client-side
        // you can pass callbackUrl to redirect after signOut
        await signOut({ redirectTo: '/login' })
      } catch (err) {
        // If signOut fails for any reason, force client redirect as fallback
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
      // stop further handling by rejecting with the same error
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default api
