import { create } from 'zustand'

import { Address, CheckoutStore, Product } from '../../types/checkoutStoreTypes'
import {
  syncCart,
  fetchCart,
  verifyProductStock
} from '../utils/actions/cartActions'
import {
  fetchLocationByCoords,
  fetchLocationByZipCode
} from '@/utils/actions/zipCodeActions'
import { getSession } from 'next-auth/react'

const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  products: [],
  productToBuy: null,
  isBuyNow: false,
  isConsultationOrder: false,
  consultDoctorForPrescription: false,
  consultationId: '',
  totalProducts: 0,
  totalQuantity: 0,
  subTotal: 0,
  discounts: [],
  discountAmount: 0,
  couponCode: null,
  appliedCouponData: null,
  deliveryCharge: 0,
  taxAmount: 0,
  additionalCharges: [],
  totalAmount: 0,
  previousTotal: 0,
  handlingCharge: 0,
  handlingChargeApplicable: false,
  packagingCharge: 0,
  packagingChargeApplicable: false,
  platformFee: 0,
  platformFeeApplicable: false,
  deliveryChargeWaiver: 0,
  freeMinOrderValue: 0,
  selectedAddress: null,
  paymentGateway: 'payu',
  isPaymentInitiated: false,
  paymentStatus: '',
  currentLocation: null,
  deliveryPolicy: null,
  isOrderConfirmed: false,
  confirmedOrder: null,
  checkoutCopy: null,
  loading: false,
  isCartFetched: false,
  prescriptionFiles: [],
  isProceedWithItemsWithoutPrescription: false,
  deliveryMode: 'standard',
  availableDeliveryModes: [],
  patientId: '',
  dateOfConsult: '',
  timeOfConsult: '',
  phoneNumber: '',
  isDavaCoinsApplied: false,
  davaCoinsUsed: 0,
  isDavaOneMembershipAdded: false,
  davaOneMembershipAmount: 0,
  fetchCart: async () => {
    set({ loading: true, isCartFetched: false })
    try {
      const cart = await fetchCart()

      const {
        totalQuantity: tProducts,
        totalQuantity: tQty,
        items,
        deliveryCharges = 0,
        deliveryChargeWaiver = 0,
        discountAmount = 0,
        couponCode,
        appliedCouponData,
        taxAmount,
        freeMinOrderValue,
        handlingChargeApplicable,
        handlingCharge,
        packagingChargeApplicable,
        packagingCharge,
        platformFeeApplicable,
        platformFee,
        availableDeliveryModes = [],
        deliveryMode,
        isDavaCoinsApplied,
        davaCoinsUsed,
        isDavaOneMembershipAdded = false,
        davaOneMembershipAmount = 0
      } = cart

      set(() => ({
        totalProducts: tProducts ?? 0,
        totalQuantity: tQty ?? 0,
        products: items ?? [],
        deliveryCharge: deliveryCharges,
        deliveryChargeWaiver,
        discountAmount,
        couponCode,
        appliedCouponData,
        taxAmount,
        isCartFetched: true,
        freeMinOrderValue,
        handlingChargeApplicable,
        handlingCharge,
        packagingChargeApplicable,
        packagingCharge,
        platformFeeApplicable,
        platformFee,
        deliveryMode,
        availableDeliveryModes,
        isDavaCoinsApplied,
        davaCoinsUsed,
        davaOneMembershipAmount,
        isDavaOneMembershipAdded
      }))

      get().refreshCalculations()
    } catch (e) {
    } finally {
      set({ loading: false })
    }
  },

  syncCartToServer: async () => {
    try {
      const store = get()
      const isSignedIn = await isUserSignedIn()

      if (!isSignedIn) return

      const cartProducts: Array<Product> = JSON.parse(
        JSON.stringify([...store?.products])
      )

      const payload: any = {
        totalProducts: store.totalProducts,
        totalQuantity: store.totalQuantity,
        items: cartProducts.map((p: Product) => {
          return {
            productId: `${p._id}`,
            quantity: p.quantity,
            isSelected: p.isSelected,
            consultationId: p?.consultationId ? p.consultationId : undefined,
            isConsultationItem: p.isConsultationItem,
            isBuyNowItem: p.isBuyNowItem,
            prescriptionReq: p.prescriptionReq,
            batchNo: p.batchNo,
            expiryDate: p.expiryDate,
            storeId: p.storeId,
            collections: p.collections
          }
        }),
        zipCode: store?.currentLocation?.zipCode,
        addressId: store?.selectedAddress?._id,
        couponCode: store?.couponCode,
        deliveryMode: store?.deliveryMode,
        isDavaCoinsApplied: store?.isDavaCoinsApplied,
        davaCoinsUsed: store?.davaCoinsUsed,
        davaOneMembershipAmount: store?.davaOneMembershipAmount,
        isDavaOneMembershipAdded: store?.isDavaOneMembershipAdded
      }
      if (store?.patientId) payload.patientId = store.patientId
      if (store?.dateOfConsult) payload.dateOfConsult = store.dateOfConsult
      if (store?.timeOfConsult) payload.timeOfConsult = store.timeOfConsult
      if (store?.phoneNumber) payload.phoneNumber = store.phoneNumber

      const cart: CheckoutStore | any = await syncCart(payload)

      const products = [...store.products]

      for (const product of products) {
        const item = cart?.items?.find(
          (cartItem: any) => cartItem?.productId == product._id
        )
        if (item) {
          product.quantity = item?.quantity
          product.storeId = item?.storeId
          product.deliveryTime = item?.deliveryTime
          product.timeDurationType = item?.timeDurationType
          product.isNotDeliverable = item?.isNotDeliverable
          product.isOutOfStock = item?.isOutOfStock
          product.taxAmount = item?.taxAmount ?? 0
          product.batchNo = item.batchNo
          product.expiryDate = item.expiryDate
          product.note = item?.note
          product.isSelected = item?.isSelected
          product.discountAmount = item?.discountAmount
        }
      }

      await set(state => {
        const serverDiscountAmount = cart?.discountAmount ?? 0
        const serverCouponCode = cart?.couponCode

        // Preserve appliedCouponData if:
        // 1. Server has discountAmount > 0 AND couponCode matches, OR
        // 2. Server has appliedCouponData, OR
        // 3. State has appliedCouponData and server has matching couponCode
        let finalAppliedCouponData = null
        if (serverDiscountAmount > 0) {
          if (cart?.appliedCouponData) {
            // Server returned full coupon data
            finalAppliedCouponData = cart.appliedCouponData
          } else if (state.appliedCouponData && serverCouponCode) {
            // Server has coupon code but no data - preserve state data if codes match
            if (state.appliedCouponData.couponCode === serverCouponCode) {
              finalAppliedCouponData = state.appliedCouponData
            }
          }
        }

        return {
          products: [...products],
          deliveryCharge: cart?.deliveryCharges,
          deliveryChargeWaiver: cart?.deliveryChargeWaiver,
          freeMinOrderValue: cart?.freeMinOrderValue,
          discountAmount: serverDiscountAmount,
          appliedCouponData: finalAppliedCouponData,
          taxAmount: cart?.taxAmount ?? 0,
          handlingChargeApplicable: cart?.handlingChargeApplicable,
          handlingCharge: cart?.handlingCharge,
          packagingChargeApplicable: cart?.packagingChargeApplicable,
          packagingCharge: cart?.packagingCharge,
          platformFeeApplicable: cart?.platformFeeApplicable,
          platformFee: cart?.platformFee,
          availableDeliveryModes: cart?.availableDeliveryModes ?? [],
          couponCode: serverCouponCode,
          isDavaCoinsApplied: cart?.isDavaCoinsApplied,
          davaCoinsUsed: cart?.davaCoinsUsed,
          davaOneMembershipAmount: cart?.davaOneMembershipAmount,
          isDavaOneMembershipAdded: cart?.isDavaOneMembershipAdded
        }
      })

      setTimeout(() => {
        get().refreshCalculations()
      })
    } catch (e) {
      console.log(e)
    }
  },

  addOrUpdateProduct: async (product, skipAvailabilityCheck = false) => {
    // Handle only on Add quantity
    if (product?.quantity > 0) {
      // Verify Product Quantity
      const quantityVerified = verifyProductQuantityLimit(product?._id)

      if (!quantityVerified) return { qtyLimitReached: true }
    }

    const { currentLocation } = get()

    const store = get()
    const existingProduct = store.products.find(p => p._id === product._id)
    if (!skipAvailabilityCheck) {
      const stock = await verifyProductStock({
        productId: product?._id,
        zipCode: currentLocation?.zipCode,
        quantity: existingProduct
          ? existingProduct.quantity + product.quantity
          : product.quantity
      })

      if (stock.error) {
        if (stock.message === 'NO_ENOUGH_QUANTITY') {
          return { noEnoughQuantity: true }
        } else if (stock.message === 'OUT_OF_STOCK') {
          return { outOfStock: true }
        } else return { notAvailable: true }
      }
    }

    set(state => {
      const existingProductIndex = state.products.findIndex(
        p => p._id === product._id
      )

      let updatedProducts
      let updatedTotalQuantity = state.totalQuantity
      let updatedSubTotal = state.subTotal

      if (existingProductIndex > -1) {
        // Product already exists, update quantity and price
        updatedProducts = state.products.map((p, index) => {
          if (index === existingProductIndex) {
            // Update the existing product's quantity and price
            const updatedProduct = {
              ...p,
              quantity: p.quantity + product.quantity, // Add the new quantity to the existing one
              total: (p.quantity + product.quantity) * p.finalPrice
            }
            if (product.batchNo) updatedProduct.batchNo = product.batchNo
            if (product.expiryDate)
              updatedProduct.expiryDate = product.expiryDate
            if (product.storeId) updatedProduct.storeId = product.storeId

            updatedTotalQuantity += product.quantity
            updatedSubTotal += product.finalPrice * product.quantity
            return updatedProduct
          }
          return p
        })
      } else {
        // Product doesn't exist, add it to the products array

        updatedProducts = [
          ...state.products,
          {
            ...product,
            quantity: product?.quantity ?? 1,
            total: product.finalPrice,
            isSelected: true
          }
        ]
        updatedTotalQuantity += product.quantity ?? 1
        updatedSubTotal += product.finalPrice * (product.quantity ?? 1)
      }

      const otherCharges = calculateOtherCharges()
      const totalAmount =
        updatedSubTotal -
        state.discountAmount -
        state.davaCoinsUsed +
        state.deliveryCharge +
        (state.davaOneMembershipAmount ?? 0) +
        otherCharges

      return {
        products: updatedProducts,
        totalProducts: updatedProducts.length,
        totalQuantity: updatedTotalQuantity,
        subTotal: Math.round(updatedSubTotal * 100) / 100,
        previousTotal: Math.round(updatedSubTotal * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100
      }
    })

    await get().syncCartToServer()
  },

  removeProduct: async productId => {
    set(state => {
      const updatedProducts = state.products.filter(p => p._id !== productId)
      const updatedTotalQuantity = updatedProducts.reduce(
        (acc, p) => acc + p.quantity,
        0
      )
      const updatedSubTotal = updatedProducts.reduce(
        (acc, p) => acc + p.finalPrice * p.quantity,
        0
      )
      const otherCharges = calculateOtherCharges()

      return {
        products: updatedProducts,
        totalProducts: updatedProducts.length,
        totalQuantity: updatedTotalQuantity,
        subTotal: updatedSubTotal,
        previousTotal: updatedSubTotal,
        totalAmount:
          updatedSubTotal -
          state.discountAmount -
          state.davaCoinsUsed +
          (state.davaOneMembershipAmount ?? 0) +
          state.deliveryCharge +
          otherCharges
        // + state.taxAmount
      }
    })

    await get().syncCartToServer()
  },

  changeAddress: async (address: Address) => {
    const store = get()

    set(() => ({
      selectedAddress: address,
      products: store?.products.map(p => ({ ...p, isSelected: true }))
    }))

    if (window) {
      localStorage.setItem('userZipcode', address?.postalCode)
    }

    await setCurrentLocationByZipCode(address?.postalCode)
    await get().syncCartToServer()
  },

  buyNow: async product => {
    const res: any = await get().addOrUpdateProduct({
      ...product,
      isBuyNowItem: true
    })

    if (res) return res
    get().resetOrderConfirmation()
    set(() => ({
      productToBuy: product,
      isBuyNow: true,
      isConsultationOrder: false,
      consultDoctorForPrescription: false,
      consultationId: '',
      isProceedWithItemsWithoutPrescription: false
    }))
    get().refreshCalculations()
  },
  createConsultationOrder: async (
    consultationId: string,
    items: any,
    prescriptionUrl?: string
  ) => {
    try {
      const {
        addOrUpdateProduct,
        resetOrderConfirmation,
        refreshCalculations,
        removeProduct
      } = get()

      // Todo - What if the product is not available or out of stock
      const store = get()
      for (const item of items) {
        const existingProduct = store.products.find(p => p._id === item._id)
        if (existingProduct) await removeProduct(existingProduct._id)
        await addOrUpdateProduct(item, true)
      }

      resetOrderConfirmation()

      set(state => {
        const URLS = prescriptionUrl
          ? [...state.prescriptionFiles, prescriptionUrl]
          : state.prescriptionFiles

        return {
          isConsultationOrder: true,
          consultDoctorForPrescription: false,
          isBuyNow: false,
          consultationId,
          isProceedWithItemsWithoutPrescription: false,
          prescriptionFiles: (URLS ?? [])
            .flat()
            .reduce((acc: string[], f: string) => {
              if (!acc.includes(f)) acc.push(f)
              return acc
            }, [])
        }
      })
      refreshCalculations()
    } catch (error) {
      throw error
    }
  },
  resetBuyNow: () => {
    const { isBuyNow } = get()

    if (!isBuyNow) return

    set(() => {
      return { productToBuy: null, isBuyNow: false }
    })
    get().refreshCalculations()
  },
  resetConsultationOrder: () => {
    set(() => {
      return {
        isConsultationOrder: false,
        consultationId: '',
        dateOfConsult: '',
        timeOfConsult: ''
      }
    })
    get().refreshCalculations()
  },

  removeBuyNowProduct: async () => {
    set(state => {
      const { isBuyNow, productToBuy } = state

      return {
        products: isBuyNow
          ? state.products.filter(p => p._id != productToBuy?._id)
          : state.products
      }
    })
    await get().syncCartToServer()
  },
  removeConsultationProducts: async () => {
    set(state => {
      const { isConsultationOrder } = state

      return {
        products: isConsultationOrder
          ? state.products.filter(p => !p.isConsultationItem)
          : state.products
      }
    })

    await get().syncCartToServer()
  },

  applyCoupon: async coupon => {
    set(state => {
      // Handle both discountAmount and discountValue from API response
      const couponData = coupon as any

      // If discountAmount exists in API response, use it directly (it's the final calculated discount)
      // Otherwise, calculate from discountValue
      let totalDiscount = 0
      if (
        typeof couponData?.discountAmount === 'number' &&
        couponData.discountAmount > 0
      ) {
        // API returned the final calculated discount amount
        totalDiscount = couponData.discountAmount
      } else {
        // Calculate discount from discountValue
        const discountValue = Number(couponData?.discountValue) || 0
        const currentDiscountAmount = Number(state.discountAmount) || 0
        totalDiscount = currentDiscountAmount + discountValue
      }

      const subTotal = Number(state.subTotal) || 0
      const deliveryCharge = Number(state.deliveryCharge) || 0
      const davaCoinsUsed = state.davaCoinsUsed || 0
      const davaOneMembershipAmount = state.davaOneMembershipAmount || 0

      const otherCharges = calculateOtherCharges()

      return {
        discounts: [...state.discounts, coupon],
        discountAmount: totalDiscount,
        totalAmount:
          subTotal -
          totalDiscount -
          davaCoinsUsed +
          davaOneMembershipAmount +
          deliveryCharge +
          otherCharges, // + taxAmount,
        couponCode: coupon.couponCode ? coupon.couponCode : state.couponCode,
        appliedCouponData: coupon
      }
    })

    get().syncCartToServer()
  },
  removeCoupon: async () => {
    set(() => ({
      couponCode: null,
      appliedCouponData: null
    }))

    get().syncCartToServer()
  },
  setDeliveryCharge: charge => {
    const otherCharges = calculateOtherCharges()
    set(state => ({
      deliveryCharge: charge,
      totalAmount: state.subTotal - state.discountAmount + charge + otherCharges // + state.taxAmount
    }))
  },

  setTaxAmount: tax => {
    const otherCharges = calculateOtherCharges()
    set(state => ({
      taxAmount: tax,
      totalAmount:
        state.subTotal -
        state.discountAmount +
        state.deliveryCharge +
        tax +
        otherCharges
    }))
  },
  refreshCalculations: () => {
    set(state => {
      const {
        products,
        isBuyNow,
        productToBuy,
        isConsultationOrder,
        isProceedWithItemsWithoutPrescription
      } = state

      const filteredProducts = isBuyNow
        ? products.filter(p => p._id === productToBuy?._id)
        : isConsultationOrder
          ? products.filter(
              p =>
                p.isConsultationItem && !p.isNotDeliverable && !p.isOutOfStock
            )
          : isProceedWithItemsWithoutPrescription
            ? products.filter(
                p =>
                  !p.prescriptionReq &&
                  p.isSelected &&
                  !p.isNotDeliverable &&
                  !p.isOutOfStock
              )
            : products.filter(
                p => p.isSelected && !p.isNotDeliverable && !p.isOutOfStock
              )

      const updatedTotalQuantity = filteredProducts.reduce(
        (acc, p) => acc + p.quantity,
        0
      )

      const updatedSubTotal = filteredProducts.reduce(
        (acc, p) => acc + p.finalPrice * p.quantity,
        0
      )

      const deliveryCharge = updatedSubTotal > 0 ? state.deliveryCharge : 0
      const taxAmount = updatedSubTotal > 0 ? state.taxAmount : 0
      const discountAmount = updatedSubTotal > 0 ? state.discountAmount : 0
      const davaCoinsUsed =
        state.isDavaCoinsApplied && updatedSubTotal >= 199
          ? state.davaCoinsUsed
          : 0
      const isDavaCoinsApplied =
        state.isDavaCoinsApplied && updatedSubTotal >= 199 ? true : false

      const davaOneMembershipAmount = state.davaOneMembershipAmount ?? 0

      const otherCharges = filteredProducts.length ? calculateOtherCharges() : 0

      return {
        products: products,
        totalProducts: products.length,
        totalQuantity: updatedTotalQuantity,
        subTotal: updatedSubTotal,
        previousTotal: updatedSubTotal,
        deliveryCharge,
        taxAmount,
        discountAmount,
        isDavaCoinsApplied,
        davaCoinsUsed,
        totalAmount:
          updatedSubTotal -
          discountAmount -
          davaCoinsUsed +
          deliveryCharge +
          otherCharges + // + taxAmount
          davaOneMembershipAmount
      }
    })
  },

  setPaymentGateway: method => set({ paymentGateway: method }),

  setAddress: address => set({ selectedAddress: address }),

  setPaymentInitiateStatus: (status = false) =>
    set({ isPaymentInitiated: status }),

  setPaymentStatus: (status: string) =>
    set(() => {
      return { paymentStatus: status }
    }),

  setCartEmpty: () => {
    set(() => {
      return {
        products: [],
        totalProducts: 0,
        totalQuantity: 0,
        subTotal: 0,
        discounts: [],
        discountAmount: 0,
        couponCode: null,
        deliveryCharge: 0,
        taxAmount: 0,
        additionalCharges: [],
        totalAmount: 0,
        previousTotal: 0,
        selectedAddress: null,
        paymentMethod: '',
        isPaymentInitiated: false,
        productToBuy: null,
        isBuyNow: false,
        isDavaCoinsApplied: false,
        davaCoinsUsed: 0,
        isDavaOneMembershipAdded: false,
        davaOneMembershipAmount: 0
      }
    })

    get().syncCartToServer()
  },

  setCurrentLocationByCoords: async coords => {
    const { selectedAddress } = get()

    if (selectedAddress) return

    let lastUsedZipcode

    if (window) {
      lastUsedZipcode = localStorage.getItem('userZipcode')
    }

    try {
      if (lastUsedZipcode) {
        await setCurrentLocationByZipCode(lastUsedZipcode)
      } else {
        const { location, deliveryPolicy } = await fetchLocationByCoords(
          coords as any
        )

        set({ currentLocation: location, deliveryPolicy })
      }
    } catch (e) {
      console.log(e)
    }
  },
  setCurrentLocation: async details => {
    const { location, deliveryPolicy } = details
    if (location) {
      await set({ currentLocation: location, deliveryPolicy })
      if (await isUserSignedIn()) await get().syncCartToServer()
      get().refreshCalculations()
    }
  },
  setProductSelectionOnCart: async (modifiedProducts: Product[]) => {
    const { products } = get()

    const updatedProducts = products?.map(p => {
      const prod = modifiedProducts.find(mp => mp._id === p._id)
      if (prod) p.isSelected = prod.isSelected

      return p
    })

    await set({
      products: updatedProducts,
      isProceedWithItemsWithoutPrescription: false
    })
    await get().syncCartToServer()
    get().refreshCalculations()
  },
  updateSuccessOrderStatus: async order => {
    return new Promise(resolve => {
      const { isOrderConfirmed, ...stateRest } = get()

      if (isOrderConfirmed) return

      set(() => {
        return {
          isOrderConfirmed: true,
          confirmedOrder: order,
          checkoutCopy: stateRest
        }
      })

      setTimeout(() => resolve({}), 1000)
    })
  },
  resetOrderConfirmation: () => {
    set(() => {
      return {
        isOrderConfirmed: false,
        confirmedOrder: null,
        checkoutCopy: null
      }
    })
  },
  setPrescriptionUrl: urls => {
    set({
      prescriptionFiles: urls
    })
  },
  setConsultDoctorForPrescription: async isRequired => {
    set({
      consultDoctorForPrescription: isRequired
    })
    if (isRequired == false) {
      set({ consultationId: '', dateOfConsult: '', timeOfConsult: '' })
    }
  },
  setProceedWithItemsWithoutPrescription: withoutPrescription => {
    const state = get()
    const updatedProducts = state.products.map(p => {
      if (withoutPrescription && p.prescriptionReq) {
        return { ...p, isSelected: false }
      }
      return p
    })

    set({
      isProceedWithItemsWithoutPrescription: withoutPrescription,
      products: updatedProducts
    })
  },
  setDeliveryMode: async (mode: string) => {
    set({ deliveryMode: mode })

    await get().syncCartToServer()
  },
  setPatientId: async (patientId: string) => {
    set({ patientId: patientId })
    await get().syncCartToServer()
  },
  setPhoneNumber: async (phoneNumber: string) => {
    set({ phoneNumber: phoneNumber })
    await get().syncCartToServer()
  },
  setDateOfConsult: async (dateOfConsult: string) => {
    set({ dateOfConsult: dateOfConsult })
    await get().syncCartToServer()
  },
  setTimeOfConsult: async (timeOfConsult: string) => {
    set({ timeOfConsult: timeOfConsult })
    await get().syncCartToServer()
  },
  toggleApplyDavaCoins: async (status: boolean, amount: number) => {
    set({ isDavaCoinsApplied: status, davaCoinsUsed: amount })
    await get().syncCartToServer()
  },
  toggleApplyDavaOneMembership: async (status: boolean, amount: number) => {
    set({ isDavaOneMembershipAdded: status, davaOneMembershipAmount: amount })
    await get().syncCartToServer()
  }
}))

export default useCheckoutStore

export const setDefaultDeliveryAddress = (address: any) => {
  const { selectedAddress } = useCheckoutStore.getState()
  if (!selectedAddress) useCheckoutStore.setState({ selectedAddress: address })
}

const isUserSignedIn = async () => {
  const { user, accessToken } = (await getSession()) as any
  return user && accessToken ? true : false
}

export const getCheckoutProducts = () => {
  const {
    isBuyNow,
    productToBuy,
    products,
    checkoutCopy,
    isOrderConfirmed,
    isConsultationOrder,
    isProceedWithItemsWithoutPrescription
  } = useCheckoutStore.getState()

  const items: Product[] = isOrderConfirmed ? checkoutCopy?.products : products

  // Cart items - normal flow
  if (
    !isProceedWithItemsWithoutPrescription &&
    !isBuyNow &&
    !isConsultationOrder
  )
    return items.filter(p => p.isSelected)

  // Consultation items only
  if (isConsultationOrder) return items.filter(p => p.isConsultationItem)

  // Prescription required but proceed with items without prescription
  if (isProceedWithItemsWithoutPrescription)
    return items.filter(p => !p.prescriptionReq)

  // Buy now items, i.e - a single item
  return items.filter(p => p._id === productToBuy?._id)
}

export const isPrescriptionStepRequired = () => {
  const { products } = useCheckoutStore.getState()

  return products?.some(p => p.prescriptionReq)
}

export const isCouponApplied = () => {
  const { couponCode, appliedCouponData } = useCheckoutStore.getState()
  return couponCode && appliedCouponData
}

export const setCurrentLocationByZipCode = async (zipCode: string) => {
  const { location, deliveryPolicy } = await fetchLocationByZipCode(zipCode)
  useCheckoutStore.setState({ currentLocation: location, deliveryPolicy })
}

export const verifyProductQuantityLimit = (productId: string | number) => {
  const { products } = useCheckoutStore.getState()
  const product = products?.find(p => p._id === productId)

  if (!product) return true

  return product.quantity < (product?.maxOrderQuantity ?? 10)
}

export const calculateOtherCharges = () => {
  const state = useCheckoutStore.getState()

  let otherCharges = 0
  if (state.handlingChargeApplicable) otherCharges += state.handlingCharge || 0
  if (state.packagingChargeApplicable)
    otherCharges += state.packagingCharge || 0
  if (state.platformFeeApplicable) otherCharges += state.platformFee || 0

  return otherCharges
}
