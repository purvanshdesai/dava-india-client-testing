'use client'
import { trackEvent } from '../index'
import { PRODUCT_EVENTS } from '../events'
import {
  ProductViewedProps,
  ProductAddedToCartProps,
  ProductRemovedFromCartProps
} from '../properties/productProperties'

export function trackProductViewed(payload: ProductViewedProps) {
  trackEvent(PRODUCT_EVENTS.PRODUCT_VIEWED, payload)
}

export function trackProductAddedToCart(payload: ProductAddedToCartProps) {
  trackEvent(PRODUCT_EVENTS.PRODUCT_ADDED_TO_CART, payload)
}

export function trackProductRemovedFromCart(
  payload: ProductRemovedFromCartProps
) {
  trackEvent(PRODUCT_EVENTS.PRODUCT_REMOVED_FROM_CART, payload)
}
