import { trackEvent } from '../index'
import { APP_EVENTS } from '../events'
import {
  SearchPerformedProps,
  CategoryBrowsedProps,
  DoctorConsultationProps,
  PrescriptionEnquiryProps,
  PrescriptionEnquirySearchProps
} from '../properties/appEventProperties'

export function trackSearchPerformed(payload: SearchPerformedProps) {
  trackEvent(APP_EVENTS.SEARCH_PERFORMED, payload)
}

export function trackCategoryBrowsed(payload: CategoryBrowsedProps) {
  trackEvent(APP_EVENTS.CATEGORY_BROWSED, payload)
}

export function trackDoctorConsultation(payload: DoctorConsultationProps) {
  trackEvent(APP_EVENTS.DOCTOR_CONSULTATION, payload)
}

export function trackPrescriptionEnquiry(payload: PrescriptionEnquiryProps) {
  trackEvent(APP_EVENTS.PRESCRIPTION_ENQUIRY, payload)
}

export function trackPrescriptionEnquirySearch(
  payload: PrescriptionEnquirySearchProps
) {
  trackEvent(APP_EVENTS.PRESCRIPTION_ENQUIRY_SEARCH, payload)
}
