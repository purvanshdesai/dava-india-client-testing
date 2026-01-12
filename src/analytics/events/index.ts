export const AUTH_EVENTS = {
  USER_SIGNED_UP: 'User Signed Up', // Done
  USER_SIGNED_IN: 'User Signed In', // Done
  USER_PROFILE_UPDATED: 'User Profile Updated',
  USER_LOGGED_OUT: 'User Logged Out', // Done
  USER_DEVICES: 'User Devices'
} as const

export const ORDER_EVENTS = {
  ORDER_PLACED: 'Order Placed', // Done
  ORDER_FAILED: 'Order Failed', // Done
  ORDER_CANCELLED: 'Order Cancelled', // Done
  RETURN_REQUESTED: 'Return Requested' // Done
} as const

export const CHECKOUT_EVENTS = {
  CHECKOUT_STARTED: 'Checkout Started', // Done
  CHECKOUT_ABANDONED: 'Checkout Abandoned', // Done
  PAYMENT_SUCCESSFUL: 'Payment Successful', // Done
  PAYMENT_FAILED: 'Payment Failed' // Done
} as const

export const PRODUCT_EVENTS = {
  PRODUCT_VIEWED: 'Product Viewed', // Done
  PRODUCT_ADDED_TO_CART: 'Product Added To Cart', // Done
  PRODUCT_REMOVED_FROM_CART: 'Product Removed From Cart', // Done
  PRODUCT_ADDED_TO_WISHLIST: 'Product Added To Wishlist',
  PRODUCT_REMOVED_FROM_WISHLIST: 'Product Removed From Wishlist',
  PRODUCT_REVIEWED: 'Product Reviewed'
} as const

export const APP_EVENTS = {
  SEARCH_PERFORMED: 'Search Performed', // Done
  CATEGORY_BROWSED: 'Category Browsed', // Done
  DOCTOR_CONSULTATION: 'Doctor Consultation', // Done
  PRESCRIPTION_ENQUIRY: 'Prescription Enquiry', // Done
  PRESCRIPTION_ENQUIRY_SEARCH: 'Prescription Enquiry Search', // Done
  REPETITIVE_SEARCH: 'Repetitive Search',
  NOTIFICATION_CLICKED: 'Notification Clicked'
} as const
