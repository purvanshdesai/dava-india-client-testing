import { create } from 'zustand'
import { UserPatients } from '../../types/storeTypes'
import { fetchUserPatients } from '@/utils/actions/patientsActions'

const usePatientsStore = create<UserPatients>(set => ({
  patients: [],
  loading: false,
  isFetched: false,
  fetchPatients: async () => {
    set({ loading: true })
    try {
      const patients = await fetchUserPatients()

      set({ patients })
      set({ isFetched: true })
    } catch (error) {
      console.log(error)
    } finally {
      set({ loading: false })
    }
  }
}))

export default usePatientsStore
