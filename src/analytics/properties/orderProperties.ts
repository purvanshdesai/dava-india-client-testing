import { ORDER_PROPERTY_KEYS } from '../constants/propertyKeys'
import { ORDER_EVENTS } from '../events'
import { ALL } from '../constants/providerNames'

export type OrderPlacedProps = {
  [ORDER_PROPERTY_KEYS.ORDER_ID]: string
  [ORDER_PROPERTY_KEYS.USER_ID]: string
  [ORDER_PROPERTY_KEYS.TOTAL_AMOUNT]: number
  [ORDER_PROPERTY_KEYS.PAYMENT_GATEWAY]: string
  [ORDER_PROPERTY_KEYS.PAYMENT_METHOD]: string
  [ORDER_PROPERTY_KEYS.PRODUCTS_ORDERED]: string
  [ORDER_PROPERTY_KEYS.SHIPPING_ADDRESS]: string
  [ORDER_PROPERTY_KEYS.COUPON_CODE]: string
  [ORDER_PROPERTY_KEYS.PRESCRIPTION_UPLOADED]: string
  [ORDER_PROPERTY_KEYS.DOCTOR_CONSULTATION]: string
}

export type CheckoutStartedProps = {
  [ORDER_PROPERTY_KEYS.USER_ID]: string
  [ORDER_PROPERTY_KEYS.TOTAL_AMOUNT]: number
  [ORDER_PROPERTY_KEYS.PAYMENT_GATEWAY]: string
  [ORDER_PROPERTY_KEYS.PRODUCTS_ORDERED]: string
  [ORDER_PROPERTY_KEYS.SHIPPING_ADDRESS]: string
  [ORDER_PROPERTY_KEYS.COUPON_CODE]: string
  [ORDER_PROPERTY_KEYS.PRESCRIPTION_UPLOADED]: string
  [ORDER_PROPERTY_KEYS.DOCTOR_CONSULTATION]: string
}

export type CheckoutAbandonedProps = {
  [ORDER_PROPERTY_KEYS.USER_ID]: string
  [ORDER_PROPERTY_KEYS.TOTAL_AMOUNT]: number
  [ORDER_PROPERTY_KEYS.PAYMENT_GATEWAY]: string
  [ORDER_PROPERTY_KEYS.PAYMENT_METHOD]: string
  [ORDER_PROPERTY_KEYS.PRODUCTS_ORDERED]: string
  [ORDER_PROPERTY_KEYS.STEP_AT_CHECKOUT_ABANDONED]: string
}

export type PaymentSuccessProps = {
  [ORDER_PROPERTY_KEYS.USER_ID]: string
  [ORDER_PROPERTY_KEYS.ORDER_ID]: string
  [ORDER_PROPERTY_KEYS.TOTAL_AMOUNT]: number
  [ORDER_PROPERTY_KEYS.PAYMENT_GATEWAY]: string
  [ORDER_PROPERTY_KEYS.TRANSACTION_ID]: string
}

export type PaymentFailureProps = {
  [ORDER_PROPERTY_KEYS.USER_ID]: string
  [ORDER_PROPERTY_KEYS.ORDER_ID]: string
  [ORDER_PROPERTY_KEYS.REASON_FOR_FAILURE]: string
}

export type OrderFailedProps = {
  [ORDER_PROPERTY_KEYS.USER_ID]: string
  [ORDER_PROPERTY_KEYS.PAYMENT_GATEWAY]: string
  [ORDER_PROPERTY_KEYS.REASON_FOR_FAILURE]: string
}

export type OrderCancelledProps = {
  [ORDER_PROPERTY_KEYS.ORDER_ID]: string
  [ORDER_PROPERTY_KEYS.USER_ID]: string
  [ORDER_PROPERTY_KEYS.PRODUCT_ID]: string
  [ORDER_PROPERTY_KEYS.CANCELLATION_REASON]: string
}

export type OrderReturnProps = {
  [ORDER_PROPERTY_KEYS.ORDER_ID]: string
  [ORDER_PROPERTY_KEYS.USER_ID]: string
  [ORDER_PROPERTY_KEYS.PRODUCT_ID]: string
  [ORDER_PROPERTY_KEYS.REASON_FOR_RETURN]: string
}

export const ORDER_EVENT_PROVIDER_PAYLOADS = {
  [ORDER_EVENTS.ORDER_PLACED]: {
    [ALL]: (data: OrderPlacedProps) => ({
      orderId: data.orderId,
      userId: data.userId,
      totalAmount: data.totalAmount,
      paymentGateway: data.paymentGateway,
      paymentMethod: data.paymentMethod,
      productsOrders: data.productsOrdered,
      shippingAddress: data.shippingAddress,
      couponCode: data.couponCode,
      prescriptionUploaded: data.prescriptionUploaded,
      doctorConsultation: data.doctorConsultation
    })
  },
  [ORDER_EVENTS.ORDER_FAILED]: {
    [ALL]: (data: OrderFailedProps) => ({
      userId: data.userId,
      paymentGateway: data.paymentGateway,
      reasonForFailure: data.reasonForFailure
    })
  },
  [ORDER_EVENTS.ORDER_CANCELLED]: {
    [ALL]: (data: OrderCancelledProps) => ({
      orderId: data.orderId,
      userId: data.userId,
      productId: data.productId,
      cancellationReason: data.cancellationReason
    })
  },
  [ORDER_EVENTS.RETURN_REQUESTED]: {
    [ALL]: (data: OrderReturnProps) => ({
      orderId: data.orderId,
      userId: data.userId,
      productId: data.productId,
      reasonForReturn: data.reasonForReturn
    })
  }
}

// Example for customization

// export const ORDER_EVENT_PROVIDER_PAYLOADS = {
//   [ORDER_EVENTS.ORDER_PLACED]: {
//     [ALL]: (data: OrderCompletedProps) => ({
//       order_id: data.order_id,
//       amount: data.amount,
//       items: data.items
//     }),
//     [PROVIDER_NAMES.SEGMENT]: (
//       data: OrderCompletedProps & { userId: string; currency: string }
//     ) => ({
//       userId: data.userId,
//       total: data.amount,
//       currency: data.currency,
//       itemsCount: data.items.length
//     })
//   },
//   [ORDER_EVENTS.ORDER_FAILED]: {
//     [PROVIDER_NAMES.SEGMENT]: (data: { code: string }) => ({
//       errorCode: data.code
//     })
//   }
// }
