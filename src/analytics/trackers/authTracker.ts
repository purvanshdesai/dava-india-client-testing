'use client'
import { trackEvent } from '../index'
import { AUTH_EVENTS } from '../events'
import {
  UserLoggedOutProps,
  UserSignedUpProps,
  UserSignedInProps
} from '../properties/authProperties'

export function trackUserSignedUp(payload: UserSignedUpProps) {
  trackEvent(AUTH_EVENTS.USER_SIGNED_UP, payload)
}

export function trackUserSignedIn(payload: UserSignedInProps) {
  trackEvent(AUTH_EVENTS.USER_SIGNED_IN, payload)
}

export function trackUserLoggedOut(payload: UserLoggedOutProps) {
  trackEvent(AUTH_EVENTS.USER_LOGGED_OUT, payload)
}
