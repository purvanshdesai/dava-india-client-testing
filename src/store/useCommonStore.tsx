import { create } from 'zustand'
import { CommonStore } from '../../types/storeTypes'

const useCommonStore = create<CommonStore>(set => ({
  showAppBarSearch: false,
  setAppBarSearchStatus: (status: boolean) => {
    set({ showAppBarSearch: status })
  }
}))

export default useCommonStore
