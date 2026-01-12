import { AUTH_PROPERTY_KEYS } from '../constants/propertyKeys'
import { AUTH_EVENTS } from '../events'
import { ALL } from '../constants/providerNames'

export type UserSignedUpProps = {
  [AUTH_PROPERTY_KEYS.NAME]: string
  [AUTH_PROPERTY_KEYS.EMAIL]: string
  [AUTH_PROPERTY_KEYS.PHONE_NUMBER]: string
  [AUTH_PROPERTY_KEYS.DEVICE_TYPE]: string
  [AUTH_PROPERTY_KEYS.DATE_TIME]: string
}

export type UserSignedInProps = {
  [AUTH_PROPERTY_KEYS.NAME]: string
  [AUTH_PROPERTY_KEYS.EMAIL]: string
  [AUTH_PROPERTY_KEYS.PHONE_NUMBER]: string
  [AUTH_PROPERTY_KEYS.DEVICE_TYPE]: string
  [AUTH_PROPERTY_KEYS.DATE_TIME]: string
}

export type UserLoggedOutProps = {
  [AUTH_PROPERTY_KEYS.NAME]: string
  [AUTH_PROPERTY_KEYS.EMAIL]: string
  [AUTH_PROPERTY_KEYS.DATE_TIME]: string
}

export const AUTH_EVENT_PROVIDER_PAYLOADS = {
  [AUTH_EVENTS.USER_SIGNED_UP]: {
    [ALL]: (data: UserSignedUpProps) => ({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      deviceType: data.deviceType,
      dateTime: data.dateTime
    })
  },
  [AUTH_EVENTS.USER_SIGNED_IN]: {
    [ALL]: (data: UserSignedInProps) => ({
      name: data.name,
      email: data.email,
      deviceType: data.deviceType,
      dateTime: data.dateTime
    })
  },
  [AUTH_EVENTS.USER_LOGGED_OUT]: {
    [ALL]: (data: UserLoggedOutProps) => ({
      name: data.name,
      email: data.email,
      dateTime: data.dateTime
    })
  }
}
