import { trackEvent } from '../index'
import { ORDER_EVENTS, CHECKOUT_EVENTS } from '../events'
import {
  OrderPlacedProps,
  OrderCancelledProps,
  OrderFailedProps,
  OrderReturnProps,
  CheckoutAbandonedProps,
  CheckoutStartedProps,
  PaymentFailureProps,
  PaymentSuccessProps
} from '../properties/orderProperties'

export function trackOrderPlaced(payload: OrderPlacedProps) {
  trackEvent(ORDER_EVENTS.ORDER_PLACED, payload)
}

export function trackOrderFailed(payload: OrderFailedProps) {
  trackEvent(ORDER_EVENTS.ORDER_FAILED, payload)
}

export function trackOrderCancelled(payload: OrderCancelledProps) {
  trackEvent(ORDER_EVENTS.ORDER_CANCELLED, payload)
}

export function trackOrderReturnRequest(payload: OrderReturnProps) {
  trackEvent(ORDER_EVENTS.RETURN_REQUESTED, payload)
}

export function trackCheckoutStarted(payload: CheckoutStartedProps) {
  trackEvent(CHECKOUT_EVENTS.CHECKOUT_STARTED, payload)
}

export function trackCheckoutAbandoned(payload: CheckoutAbandonedProps) {
  trackEvent(CHECKOUT_EVENTS.CHECKOUT_ABANDONED, payload)
}

export function trackPaymentSuccess(payload: PaymentSuccessProps) {
  trackEvent(CHECKOUT_EVENTS.PAYMENT_SUCCESSFUL, payload)
}

export function trackPaymentFailure(payload: PaymentFailureProps) {
  trackEvent(CHECKOUT_EVENTS.PAYMENT_FAILED, payload)
}
