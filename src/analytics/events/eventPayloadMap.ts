import { ORDER_EVENT_PROVIDER_PAYLOADS } from '../properties/orderProperties'
import { AUTH_EVENT_PROVIDER_PAYLOADS } from '../properties/authProperties'
import { PRODUCT_EVENT_PROVIDER_PAYLOADS } from '../properties/productProperties'

export const ALL_EVENT_PROVIDER_PAYLOADS: Record<
  string,
  Record<string, (payload: any) => any>
> = {
  ...ORDER_EVENT_PROVIDER_PAYLOADS,
  ...AUTH_EVENT_PROVIDER_PAYLOADS,
  ...PRODUCT_EVENT_PROVIDER_PAYLOADS
}
