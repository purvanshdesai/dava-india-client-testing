'use client'

import { useParams } from 'next/navigation'
import { useFetchPolicies } from '@/utils/hooks/policiesHooks'

export default function PoliciesPage() {
  const params = useParams() as any

  // Map slugs (from URL) to real DB policy names
  const policyMap: Record<string, string> = {
    privacy_policy: 'privacy_policy',
    terms_conditions: 'terms_and_conditions',
    grievance_redressal: 'grevience_readdressal',
    shipping_delivery: 'shipping_and_delivery_policy',
    return_refund: 'return_refund',
    ip_policy: 'ip_policy'
  }

  const policyName = policyMap[params?.policy] ?? ''

  const {
    data: policyData,
    isLoading,
    error
  } = useFetchPolicies({
    policy: policyName
  })

  if (isLoading) {
    return <p className='text-muted-foreground p-6'>Loading policy...</p>
  }

  if (error) {
    return (
      <div className='p-6 text-red-500'>
        Failed to load policy. Please try again later.
      </div>
    )
  }

  if (!policyData) {
    return <div className='text-muted-foreground p-6'>No policy found.</div>
  }

  return (
    <div className='p-4'>
      {/* Render the latest policy HTML content */}
      <div
        className='prose max-w-none rounded-md bg-white p-4'
        dangerouslySetInnerHTML={{ __html: policyData }}
      />
    </div>
  )
}
