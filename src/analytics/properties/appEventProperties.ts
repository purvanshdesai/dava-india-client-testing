import { APP_EVENT_PROPERTY_KEYS } from '../constants/propertyKeys'
import { APP_EVENTS } from '../events'
import { ALL } from '../constants/providerNames'

export type SearchPerformedProps = {
  [APP_EVENT_PROPERTY_KEYS.USER_ID]: string
  [APP_EVENT_PROPERTY_KEYS.SEARCH_TERM]: string
  [APP_EVENT_PROPERTY_KEYS.NUMBER_OF_RESULTS]: string
  [APP_EVENT_PROPERTY_KEYS.FILTERS_APPLIED]?: string
}

export type CategoryBrowsedProps = {
  [APP_EVENT_PROPERTY_KEYS.USER_ID]: string
  [APP_EVENT_PROPERTY_KEYS.CATEGORY_NAME]: string
}

export type DoctorConsultationProps = {
  [APP_EVENT_PROPERTY_KEYS.USER_ID]: string
  [APP_EVENT_PROPERTY_KEYS.PINCODE]: string | number
  [APP_EVENT_PROPERTY_KEYS.ADDRESS]: string
  [APP_EVENT_PROPERTY_KEYS.REASON_FOR_CONSULTATION]: string
}

export type PrescriptionEnquiryProps = {
  [APP_EVENT_PROPERTY_KEYS.USER_ID]: string
  [APP_EVENT_PROPERTY_KEYS.PINCODE]: string | number
  [APP_EVENT_PROPERTY_KEYS.ADDRESS]: string
  [APP_EVENT_PROPERTY_KEYS.PRESCRIPTION_UPLOADED]: string
}

export type PrescriptionEnquirySearchProps = {
  [APP_EVENT_PROPERTY_KEYS.USER_ID]: string
  [APP_EVENT_PROPERTY_KEYS.NUMBER_OF_RESULTS]: string
  [APP_EVENT_PROPERTY_KEYS.SEARCH_TERM]: string
  [APP_EVENT_PROPERTY_KEYS.PRESCRIPTION_UPLOADED]: string
}

export const AUTH_EVENT_PROVIDER_PAYLOADS = {
  [APP_EVENTS.SEARCH_PERFORMED]: {
    [ALL]: (data: SearchPerformedProps) => ({
      userId: data.userId,
      searchTerm: data.searchTerm,
      noOfResults: data.noOfResults,
      filtersApplied: data.filtersApplied
    })
  },
  [APP_EVENTS.CATEGORY_BROWSED]: {
    [ALL]: (data: CategoryBrowsedProps) => ({
      userId: data.userId,
      categoryName: data.categoryName
    })
  },
  [APP_EVENTS.DOCTOR_CONSULTATION]: {
    [ALL]: (data: DoctorConsultationProps) => ({
      userId: data.userId,
      pincode: data.pincode,
      address: data.address,
      reasonForConsultation: data.reasonForConsultation
    })
  },
  [APP_EVENTS.PRESCRIPTION_ENQUIRY]: {
    [ALL]: (data: PrescriptionEnquiryProps) => ({
      userId: data.userId,
      pincode: data.pincode,
      address: data.address,
      prescriptionUploaded: data.prescriptionUploaded
    })
  },
  [APP_EVENTS.PRESCRIPTION_ENQUIRY_SEARCH]: {
    [ALL]: (data: PrescriptionEnquirySearchProps) => ({
      userId: data.userId,
      prescriptionUploaded: data.prescriptionUploaded,
      searchTerm: data.searchTerm,
      noOfResults: data.noOfResults
    })
  }
}
