'use client'

export const isFeatureFlagEnabled = (feature: string) => {
  if (typeof window == 'undefined') return false

  const FeatureFlag = localStorage.getItem('feature-flag') ?? ''
  return FeatureFlag.split(',').includes(feature)
}
