import { create } from 'zustand'
import { DeliveryAddressesStore, Address } from '../../types/storeTypes'
import { fetchUserAddresses } from '../utils/actions/userAddressActions'
import useCheckoutStore, { setDefaultDeliveryAddress } from './useCheckoutStore'
import { setCurrentLocationByZipCode } from './useCheckoutStore'

const useDeliveryAddressStore = create<DeliveryAddressesStore>(set => ({
  defaultAddress: null,
  addresses: [],
  loading: false,
  fetchAddresses: async () => {
    set({ loading: true })
    try {
      let lastUsedZipcode: string = ''
      let defaultAddress: Address | any

      if (window) {
        lastUsedZipcode = localStorage.getItem('userZipcode') ?? ''
      }

      const addresses = await fetchUserAddresses()

      if (!lastUsedZipcode) {
        defaultAddress = addresses.find((a: Address) => a.isDefault === true)
      } else {
        defaultAddress = addresses.find(
          (a: Address) => a.postalCode === lastUsedZipcode
        )
      }

      if (!defaultAddress && addresses?.length) defaultAddress = addresses[0]

      set({ addresses, defaultAddress })
      setDefaultDeliveryAddress(defaultAddress)

      const selectedAddress = useCheckoutStore.getState().selectedAddress
      const newSelectedAddress = addresses?.find(
        (item: any) => item?._id == selectedAddress?._id
      )
      if (!lastUsedZipcode && newSelectedAddress) {
        useCheckoutStore.getState().changeAddress(newSelectedAddress)
        setCurrentLocationByZipCode(`${newSelectedAddress?.postalCode}`)
      } else if (defaultAddress)
        setCurrentLocationByZipCode(`${defaultAddress?.postalCode}`)
    } catch (error) {
      console.log(error)
    } finally {
      set({ loading: false })
    }
  }
}))

export default useDeliveryAddressStore
