import { PRODUCT_PROPERTY_KEYS } from '../constants/propertyKeys'
import { PRODUCT_EVENTS } from '../events'
import { ALL } from '../constants/providerNames'

export type ProductViewedProps = {
  [PRODUCT_PROPERTY_KEYS.USER_ID]: string
  [PRODUCT_PROPERTY_KEYS.PRODUCT_NAME]: string
  [PRODUCT_PROPERTY_KEYS.PRODUCT_SKU]: string
  [PRODUCT_PROPERTY_KEYS.CATEGORY]: string
  [PRODUCT_PROPERTY_KEYS.PRICE]: string
  [PRODUCT_PROPERTY_KEYS.STOCK_STATUS]: string
  [PRODUCT_PROPERTY_KEYS.DEVICE_TYPE]: string
}

export type ProductAddedToCartProps = {
  [PRODUCT_PROPERTY_KEYS.USER_ID]: string
  [PRODUCT_PROPERTY_KEYS.PRODUCT_NAME]: string
  [PRODUCT_PROPERTY_KEYS.PRODUCT_SKU]: string
  [PRODUCT_PROPERTY_KEYS.CATEGORY]: string
  [PRODUCT_PROPERTY_KEYS.PRICE]: string
  [PRODUCT_PROPERTY_KEYS.QUANTITY]: number
}

export type ProductRemovedFromCartProps = {
  [PRODUCT_PROPERTY_KEYS.USER_ID]: string
  [PRODUCT_PROPERTY_KEYS.PRODUCT_NAME]: string
  [PRODUCT_PROPERTY_KEYS.PRODUCT_SKU]: string
  [PRODUCT_PROPERTY_KEYS.CATEGORY]: string
  [PRODUCT_PROPERTY_KEYS.QUANTITY]: number
}

export const PRODUCT_EVENT_PROVIDER_PAYLOADS = {
  [PRODUCT_EVENTS.PRODUCT_VIEWED]: {
    [ALL]: (data: ProductViewedProps) => ({
      userId: data?.userId,
      productName: data.productName,
      productSku: data.productSku,
      category: data?.category,
      price: data?.price,
      stockStatus: data?.stockStatus,
      deviceType: data?.deviceType
    })
  },
  [PRODUCT_EVENTS.PRODUCT_ADDED_TO_CART]: {
    [ALL]: (data: ProductAddedToCartProps) => ({
      userId: data?.userId,
      productName: data.productName,
      productSku: data.productSku,
      category: data?.category,
      quantity: data?.quantity,
      price: data?.price
    })
  },
  [PRODUCT_EVENTS.PRODUCT_REMOVED_FROM_CART]: {
    [ALL]: (data: ProductRemovedFromCartProps) => ({
      userId: data?.userId,
      productName: data.productName,
      productSku: data.productSku,
      quantity: data?.quantity,
      category: data?.category
    })
  }
}
