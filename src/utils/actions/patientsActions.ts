'use server'
import api from '@/lib/axios'
const API_PATH = '/patients'

export async function fetchUserPatients() {
  try {
    const axiosRes = await api.get(API_PATH)

    return axiosRes?.data ?? []
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function createUserPatient(patientData: any) {
  try {
    const axiosRes = await api.post(API_PATH, patientData)

    return axiosRes?.data ?? []
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function fetchUserPatient(patientId: string) {
  try {
    const axiosRes = await api.get(`${API_PATH}/${patientId}`)

    return axiosRes?.data ?? []
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function patchUserPatient(patientId: string, patientData: any) {
  try {
    const axiosRes = await api.patch(`${API_PATH}/${patientId}`, patientData)

    return axiosRes?.data ?? []
  } catch (error) {
    console.log(error)
  }
}

export async function deleteUserPatient(patientId: string) {
  try {
    const axiosRes = await api.delete(`${API_PATH}/${patientId}`)

    return axiosRes?.data ?? []
  } catch (error) {
    console.log(error)
  }
}
