export type LatLng = {
  lat: number
  lng: number
}

export type OrderResponse = {
  _id: string
  orderId: string
  deliverMode: string
  shipmentId: string
  status: string
  etaMinutes: number
  store: {
    name: string
    location: {
      lat: number
      lng: number
    }
  }
  user: {
    name: string
    phone: string
    location: {
      lat: number
      lng: number
    }
  }
  route?: {
    lat: number
    lng: number
  }[]
  timeline: any[]
  createdAt: string
  address: any
  isTrackingEnabled?: boolean
  orderTrackingType: string
  lastActivityDateTime?: string
}

export type RiderLocation = {
  name?: string
  phone?: string
  lat?: number
  lng?: number
  status?: string
  courier?: string
}

export type OrderDetails = OrderResponse
