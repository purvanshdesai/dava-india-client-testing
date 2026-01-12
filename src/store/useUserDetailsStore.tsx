import { create } from 'zustand'
import { UserDetailsStore } from '../../types/storeTypes'
import { fetchUserAccount } from '@/utils/actions/userAction'
import { fetchConsumerBuyedProducts } from '@/utils/actions/sponsoredActions'

const useUserDetailsStore = create<UserDetailsStore>((set, get) => ({
  user: null,
  hasDavaoneMembership: false,
  davaoneMembership: null,
  davaCoinsBalance: 0,
  productsBought: [],
  fetchUserDetails: async () => {
    try {
      const res = await fetchUserAccount()
      set({
        user: res?.user ?? null,
        hasDavaoneMembership: res?.hasDavaoneMembership,
        davaoneMembership: res?.davaoneMembership ?? null,
        davaCoinsBalance: res?.davaCoinsBalance ?? 0
      })
    } catch (error) {
      console.log(error)
    } finally {
    }
  },
  fetchProductsBought: async () => {
    try {
      const store = get()
      if (store.productsBought?.length > 0) return

      const res = await fetchConsumerBuyedProducts()

      set({ productsBought: res })
    } catch (error) {
      console.log(error)
    }
  }
}))

export default useUserDetailsStore
