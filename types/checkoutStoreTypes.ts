export interface Product {
  _id: number | string
  name: string
  unitPrice: number
  maximumRetailPrice: number
  finalPrice: number
  discount: number
  quantity: number
  total: number
  taxAmount: number
  storeId?: string
  deliveryTime?: string
  timeDurationType?: string
  deliveryCharges?: number
  addressId?: string
  isSelected: boolean
  isNotDeliverable: boolean
  isOutOfStock: boolean
  prescriptionReq?: boolean
  isConsultationItem?: boolean
  consultationId?: any
  isBuyNowItem?: boolean
  minOrderQuantity?: number
  maxOrderQuantity?: number
  batchNo?: string
  expiryDate?: Date
  note?: string
  collections?: any[]
  discountAmount?: number
}

export interface Discount {
  _id: number
  type: string // e.g., 'percentage', 'flat'
  discountValue: number // e.g., 10% discount or $5 flat discount
  couponCode: string
  description: string // e.g., '10% off on all electronics'
}

export interface Charge {
  _id: number
  type: string // e.g., 'delivery', 'tax'
  amount: number
  description: string // e.g., 'Delivery charge', 'Tax'
}

export interface Address {
  _id: string
  userId: string
  userName: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber: string
  isDefault: boolean
  coordinates: any
  fullAddress?: string
}

export interface Location {
  _id: string
  zipCode: string
  area: string
  district: number
  state: string
  location: { coordinates: { latitude: string; longitude: string } }
  isDeliverable: boolean
}

interface ConfirmedOrder {
  _id: string
  orderId: string
  createdAt: string
}
export interface CheckoutStore {
  products: Product[]
  productToBuy: Product | null
  isBuyNow: boolean
  isConsultationOrder: boolean
  consultDoctorForPrescription: boolean
  consultationId: string
  totalProducts: number
  totalQuantity: number
  subTotal: number
  discounts: Discount[]
  discountAmount: number
  couponCode: string | null
  appliedCouponData: null | any
  deliveryCharge: number
  taxAmount: number
  additionalCharges: Charge[]
  totalAmount: number
  previousTotal: number
  handlingCharge: number
  handlingChargeApplicable: boolean
  packagingCharge: number
  packagingChargeApplicable: boolean
  platformFee: number
  platformFeeApplicable: boolean
  deliveryChargeWaiver: number
  freeMinOrderValue: number
  selectedAddress: Address | null
  paymentGateway: string
  isPaymentInitiated: boolean
  paymentStatus: string
  currentLocation: Location | null
  deliveryPolicy: any
  isOrderConfirmed: boolean
  confirmedOrder: ConfirmedOrder | null
  checkoutCopy: any
  prescriptionFiles: string[]
  deliveryMode: string
  availableDeliveryModes: any[]
  isDavaCoinsApplied: boolean
  davaCoinsUsed: number
  davaOneMembershipAmount?: number
  isDavaOneMembershipAdded?: boolean
  addOrUpdateProduct: (
    product: Product,
    skipAvailabilityCheck?: boolean
  ) => void
  removeProduct: (productId: number | string) => void
  applyCoupon: (coupon: Discount) => void
  removeCoupon: () => void
  setDeliveryCharge: (charge: number) => void
  setTaxAmount: (tax: number) => void
  setPaymentGateway: (method: string) => void
  setAddress: (address: Address | undefined) => void
  setPaymentInitiateStatus: (status: boolean) => void
  fetchCart: () => void
  syncCartToServer: (addressId?: string) => void
  refreshCalculations: () => void
  setCartEmpty: () => void
  setPaymentStatus: (status: string) => void
  buyNow: (product: Product) => void
  resetBuyNow: () => void
  resetConsultationOrder: () => void
  changeAddress: (address: Address) => void
  setCurrentLocationByCoords: (coords: {
    latitude: number
    longitude: number
  }) => void
  setCurrentLocation: ({
    location,
    deliveryPolicy
  }: {
    location: Location
    deliveryPolicy: any
  }) => void
  setProductSelectionOnCart: (products: Product[]) => void
  updateSuccessOrderStatus: (order: ConfirmedOrder) => any
  resetOrderConfirmation: () => void
  loading: boolean
  isCartFetched: boolean
  removeBuyNowProduct: () => void
  createConsultationOrder: (
    consultationId: string,
    items: any,
    prescriptionUrl?: string
  ) => void
  removeConsultationProducts: () => void
  setPrescriptionUrl: (urls: any) => void
  setConsultDoctorForPrescription: (isRequired: boolean) => void
  isProceedWithItemsWithoutPrescription: boolean
  setProceedWithItemsWithoutPrescription: (withoutPrescription: boolean) => void
  setDeliveryMode: (mode: string) => void
  patientId: String
  setPatientId: (patientId: string) => void
  phoneNumber: String
  dateOfConsult: String
  timeOfConsult: String
  setPhoneNumber: (phoneNumber: string) => void
  setDateOfConsult: (dateOfConsult: string) => void
  setTimeOfConsult: (timeOfConsult: string) => void
  toggleApplyDavaCoins: (status: boolean, coins: number) => void
  toggleApplyDavaOneMembership: (status: boolean, amount: number) => void
}
