'use server'
import api from '@/lib/axios'
const API_PATH = '/consumer/zip-codes'

interface Coords {
  latitude: number
  longitude: number
}

export async function fetchLocationByCoords({ latitude, longitude }: Coords) {
  try {
    // const lat = 11.463914542093733,
    //   lng = 76.68173022599315

    const axiosRes = await api.get(
      API_PATH + `?lat=${latitude}&lng=${longitude}`
    )

    return axiosRes?.data ?? []
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function fetchLocationByZipCode(zipCode: string) {
  try {
    const axiosRes = await api.get(API_PATH + `?zipCode=${zipCode}`)

    return axiosRes?.data ?? []
  } catch (e) {
    console.log(e)
    throw e
  }
}
