'use server'

import { Client } from '@googlemaps/google-maps-services-js'

const client = new Client()

export const autoCompleteMapSearch = async (input: string) => {
  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!
      }
    })

    return response.data.predictions
  } catch (e) {}
}

export const getGMapPlaceDetails = async (place_id: string) => {
  try {
    const detailsResponse = await client.placeDetails({
      params: {
        place_id: place_id,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!,
        fields: ['geometry', 'formatted_address', 'name', 'address_component'] // Request only necessary fields
      }
    })

    const addressComponents: any =
      detailsResponse.data.result.address_components
    const extractedDetails = extractAddressDetails(addressComponents)

    return { ...detailsResponse.data.result, ...extractedDetails }
  } catch (e) {}
}

const extractAddressDetails = (addressComponents: any[]) => {
  let city = ''
  let state = ''
  let country = ''
  let postalCode = ''

  addressComponents.forEach(component => {
    if (component.types.includes('locality')) {
      city = component.long_name // City
    }
    if (component.types.includes('administrative_area_level_1')) {
      state = component.long_name // State
    }
    if (component.types.includes('country')) {
      country = component.long_name // Country
    }
    if (component.types.includes('postal_code')) {
      postalCode = component.long_name // Pincode
    }
  })

  return { city, state, country, postalCode }
}
