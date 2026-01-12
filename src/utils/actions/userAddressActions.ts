'use server'
import api from '@/lib/axios'
const API_PATH = '/user-addresses'

export async function fetchUserAddresses() {
  try {
    const axiosRes = await api.get(API_PATH)

    return axiosRes?.data ?? []
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function createUserAddress(address: any) {
  try {
    const axiosRes = await api.post(API_PATH, address)

    return axiosRes?.data ?? []
  } catch (e) {
    throw e
  }
}

export async function fetchUserAddress(address: string) {
  try {
    const axiosRes = await api.get(`${API_PATH}/${address}`)

    return axiosRes?.data ?? []
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function patchUserAddress(addressId: string, addressData: any) {
  try {
    const axiosRes = await api.patch(`${API_PATH}/${addressId}`, addressData)

    return axiosRes?.data ?? []
  } catch (error) {
    throw error
  }
}

export async function deleteUserAddress(addressId: string) {
  try {
    const axiosRes = await api.delete(`${API_PATH}/${addressId}`)

    return axiosRes?.data ?? []
  } catch (error) {
    console.log(error)
  }
}
