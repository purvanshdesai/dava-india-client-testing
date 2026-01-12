export const ORDER_PROPERTY_KEYS = {
  USER_ID: 'userId',
  ORDER_ID: 'orderId',
  PRODUCT_ID: 'productId',
  TOTAL_AMOUNT: 'totalAmount',
  PAYMENT_METHOD: 'paymentMethod',
  PAYMENT_GATEWAY: 'paymentGateway',
  PRODUCTS_ORDERED: 'productsOrdered',
  SHIPPING_ADDRESS: 'shippingAddress',
  COUPON_CODE: 'couponCode',
  PRESCRIPTION_UPLOADED: 'prescriptionUploaded',
  DOCTOR_CONSULTATION: 'doctorConsultation',
  REASON_FOR_FAILURE: 'reasonForFailure',
  CANCELLATION_REASON: 'cancellationReason',
  REASON_FOR_RETURN: 'reasonForReturn',
  STEP_AT_CHECKOUT_ABANDONED: 'stepAtCheckoutAbandoned',
  TRANSACTION_ID: 'transactionId'
} as const

export const AUTH_PROPERTY_KEYS = {
  USER_ID: 'userId',
  NAME: 'name',
  EMAIL: 'email',
  PHONE_NUMBER: 'phoneNumber',
  DEVICE_TYPE: 'deviceType',
  REFERRAL_CODE: 'referralCode',
  UPDATED_FIELDS: 'updatedFields',
  DATE_TIME: 'dateTime'
} as const

export const PRODUCT_PROPERTY_KEYS = {
  USER_ID: 'userId',
  PRODUCT_NAME: 'productName',
  PRODUCT_SKU: 'productSku',
  CATEGORY: 'category',
  PRICE: 'price',
  DEVICE_TYPE: 'deviceType',
  STOCK_STATUS: 'stockStatus',
  QUANTITY: 'quantity'
} as const

export const APP_EVENT_PROPERTY_KEYS = {
  USER_ID: 'userId',
  SEARCH_TERM: 'searchTerm',
  NUMBER_OF_RESULTS: 'noOfResults',
  FILTERS_APPLIED: 'filtersApplied',
  CATEGORY_NAME: 'categoryName',
  PINCODE: 'pincode',
  ADDRESS: 'address',
  REASON_FOR_CONSULTATION: 'reasonForConsultation',
  PRESCRIPTION_UPLOADED: 'prescriptionUploaded'
} as const
