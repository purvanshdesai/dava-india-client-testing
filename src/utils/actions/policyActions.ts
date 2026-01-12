'use server'
import api from '@/lib/axios'

export async function fetchPolicyContent(policyName: string) {
  try {
    const response = await api.get(`/policies-user?policy=${policyName}`)
    return response?.data || ''
  } catch (error) {
    console.error('Error fetching policy content:', error)
    return ''
  }
}

export async function fetchAllPolicies() {
  try {
    const response = await api.get('/policies')
    return response?.data || []
  } catch (error) {
    console.error('Error fetching policies:', error)
    return []
  }
}
