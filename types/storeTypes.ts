export interface Address {
  _id: string
  userId: string
  userName: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string | number
  country: string
  phoneNumber: string
  isDefault: boolean
  type: string
}

export type DeliveryAddressesStore = {
  defaultAddress: Address | null
  addresses: Array<Address>
  loading: boolean
  fetchAddresses: () => void
}
export type UserPatients = {
  patients: Array<Address>
  loading: boolean
  isFetched: boolean
  fetchPatients: () => void
}

export interface ProductVariation {
  title: string
  description: string
  thumbnail: string
  images: string
  variation: any
}

export interface Product {
  current: ProductVariation
  variations: ProductVariation[]
}

export type ProductViewStore = {
  product: Product | null
  variation: ProductVariation | null
  variations: ProductVariation[]
  setProductView: (product: Product) => void
  setCurrentProductVariation: (variation: ProductVariation) => void
}

export type CommonStore = {
  showAppBarSearch: boolean
  setAppBarSearchStatus: (status: boolean) => void
}

export type UserDetailsStore = {
  user: any
  hasDavaoneMembership: boolean
  davaoneMembership: any
  davaCoinsBalance: number | null
  productsBought: any[]
  fetchUserDetails: () => void
  fetchProductsBought: () => void
}
