'use client'
import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '500px'
}

const defaultCenter = {
  lat: 12.922587522363676, // Default latitude (San Francisco)
  lng: 77.6232147620559 // Default longitude
}

const MapViewer = ({
  coordinates,
  onPlaceSelected
  // addressId
}: {
  coordinates?: any
  onPlaceSelected?: (coords: any) => void
  addressId?: any
}) => {
  const [markerPosition, setMarkerPosition] = useState(defaultCenter)

  useEffect(() => {
    if (coordinates?.lat && coordinates?.lng) {
      setMarkerPosition(coordinates)
    } else if ('geolocation' in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords
        setMarkerPosition({ lat: latitude, lng: longitude } as any)
      })
    }
  }, [coordinates])

  const handleMarkerDragEnd = (event: any) => {
    const coords = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    setMarkerPosition(coords)
    if (onPlaceSelected) onPlaceSelected(coords)
  }

  return (
    <LoadScriptNext
      googleMapsApiKey={
        process.env.NEXT_PUBLIC_GOOGLE_MAP_API as unknown as string
      }
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition ?? defaultCenter}
        zoom={13}
      >
        <Marker
          position={markerPosition ?? defaultCenter}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
    </LoadScriptNext>
  )
}

export default MapViewer
