export const storeUtmDetailsInLocal = () => {
  // Get query string from current URL
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)

  // Prepare utm object
  const utmData: any = {}

  // List of known UTM parameters
  const utmKeys = [
    'utm_source',
    'utm_medium',
    'utm_term',
    'utm_campaign',
    'click_id'
  ]

  // Iterate and store relevant params
  utmKeys.forEach(key => {
    const value = urlParams.get(key)
    if (value) {
      utmData[key] = value
    }
  })

  // Store in localStorage if any UTM data is found
  if (Object.keys(utmData).length > 0) {
    localStorage.setItem('utm', JSON.stringify(utmData))
  }
}

export const removeUtmDetailsInLocal = () => {
  // Clear existing utm data
  localStorage.removeItem('utm')
}

export const getUtmParamsFromLocal = () => {
  const utm = localStorage.getItem('utm') ?? null
  return utm ? JSON.parse(utm) : null
}
