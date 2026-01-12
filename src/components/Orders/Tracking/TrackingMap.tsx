'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
  useLoadScript
} from '@react-google-maps/api'
import { DELIVERY_MODES } from '@/lib/constant'

type LatLng = { lat: number; lng: number }
type RiderLocation = {
  lat: number
  lng: number
  name?: string | null
  status?: string | null
  phone?: string | null
}

function buildIconFromSvg(svgString: string, size = 48) {
  const svgWithXmlns = svgString.includes('xmlns')
    ? svgString
    : svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')

  const uri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    svgWithXmlns
  )}`

  return {
    url: uri,
    size: { width: size, height: size },
    scaledSize: { width: size, height: size },
    anchor: { x: Math.round(size / 2), y: size - 2 }
  } as any
}

/** Minimal lucide-style SVGs (replace paths with exact lucide path if you prefer) */
const storeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 489.435"><path fill="#EF4147" d="M266.131 425.009c-3.121 2.276-7.359 2.59-10.837.357-37.51-23.86-69.044-52.541-93.797-83.672-34.164-42.861-55.708-90.406-63.066-136.169-7.493-46.427-.492-91.073 22.612-127.381 9.098-14.36 20.739-27.428 34.923-38.714C188.57 13.428 225.81-.263 262.875.004c35.726.268 70.96 13.601 101.422 41.39 10.707 9.723 19.715 20.872 27.075 32.96 24.843 40.898 30.195 93.083 19.269 145.981-17.047 82.829-71.772 160.521-144.51 204.674zM255.789 37.251c69.041 0 125.006 55.965 125.006 125.005 0 69.041-55.965 125.006-125.006 125.006-69.04 0-125.005-55.965-125.005-125.006 0-69.04 55.965-125.005 125.005-125.005z"/><path fill="#1A1A1A" d="M174.034 140.343c-6.725 8.361.323 17.964 10.174 13.043l71.873-55.963 69.787 55.438c9.644 7.169 19.507-3.852 11.214-12.78l-81.523-64.569-81.525 64.831zm-64.51 176.841c6.788 0 12.29 5.502 12.29 12.29 0 6.788-5.502 12.291-12.29 12.291H71.37L33.265 464.853h444.623l-41.373-123.088H407.93c-6.788 0-12.291-5.503-12.291-12.291s5.503-12.29 12.291-12.29h46.171L512 489.435H0l53.325-172.251h56.199zm146.693-205.721l62.522 48.228v68.895H192.08V159.9l64.137-48.437zm-5.627 37.766h9.64c2.286 0 4.153 1.896 4.153 4.154v16.779h16.782c2.284 0 4.151 1.916 4.151 4.152v9.635c0 2.26-1.896 4.154-4.151 4.154h-16.782v16.782c0 2.255-1.897 4.153-4.153 4.153h-9.64c-2.256 0-4.154-1.87-4.154-4.153v-16.782h-16.783c-2.256 0-4.151-1.867-4.151-4.154v-9.635a4.162 4.162 0 014.151-4.152h16.783v-16.779a4.163 4.163 0 014.154-4.154z"/></svg>`

const userSvg = `
<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 489.435"><path fill="#1A1A1A" fill-rule="nonzero" d="M109.524 317.184c6.788 0 12.29 5.502 12.29 12.29 0 6.788-5.502 12.291-12.29 12.291H71.37L33.265 464.854h444.623l-41.373-123.089H407.93c-6.788 0-12.291-5.503-12.291-12.291s5.503-12.29 12.291-12.29h46.171L512 489.435H0l53.325-172.251h56.199zM255.789 82.697l-77.168 75.583 18.821 9.873 57.852-60.725 58.843 60.725 18.822-9.873-77.17-75.583zm-54.219 90.344l54.319-54.319 54.154 54.319v53.295l-39.558-.001v-37.643h-29.687v37.644H201.57v-53.295z"/><path fill="#EF4147" d="M266.131 425.009c-3.121 2.276-7.359 2.59-10.837.357-37.51-23.86-69.044-52.541-93.797-83.672-34.164-42.861-55.708-90.406-63.066-136.169-7.493-46.427-.492-91.073 22.612-127.381 9.098-14.36 20.739-27.428 34.923-38.714C188.57 13.428 225.81-.263 262.875.004c35.726.268 70.96 13.601 101.422 41.39 10.707 9.723 19.715 20.872 27.075 32.96 24.843 40.898 30.195 93.083 19.269 145.981-17.047 82.829-71.772 160.521-144.51 204.674zM255.789 37.251c69.041 0 125.006 55.965 125.006 125.005 0 69.041-55.965 125.006-125.006 125.006-69.04 0-125.005-55.965-125.005-125.006 0-69.04 55.965-125.005 125.005-125.005z"/></svg>
`

const riderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 255 512.535"><path fill="#fff" d="M74.536 51.121c1.664-22.082 14.931-40.574 33.015-47.82 10.628-4.256 25.758-4.184 36.354.022 18.149 7.2 31.707 25.638 33.146 47.785 1.232 18.962-15.705 40.489-32.177 47.454-11.25 4.753-26.891 4.761-38.157-.001-17.49-7.394-32.841-26.761-32.181-47.44z"/><path fill="#313131" d="M50.943 217.292H77.87a15.801 15.801 0 00-1.889 7.503v4.475H50.862c-.571 4.067-4.085 7.222-8.302 7.222H8.383c-4.611 0-8.383-3.772-8.383-8.383v-11.312c0-4.611 3.772-8.383 8.383-8.383H42.56c4.61 0 8.383 3.772 8.383 8.383v.495z"/><path fill="#3A3B3F" d="M116.212 316.392h18.895c5.845 0 10.627 4.782 10.627 10.628v165.44c0 11.041-9.033 20.075-20.075 20.075-11.041 0-20.075-9.034-20.075-20.075V327.02c0-5.846 4.782-10.628 10.628-10.628z"/><path fill="#5C5C5C" d="M116.212 316.392h18.895c5.846 0 10.627 4.782 10.627 10.628v145.025c0 11.042-9.033 20.075-20.074 20.075h-.001c-11.042 0-20.075-9.033-20.075-20.075V327.02c0-5.846 4.783-10.628 10.628-10.628z"/><path fill="#4B5E71" d="M76.119 233.84l-29.784 44.031c-4.366 6.049-4.623 12.669-4.623 21.608v90.493c-.183 10.025 1.875 14.247 11.271 14.933h22.683v-91.136c-.206-4.445.431-8.143 1.798-11.195 1.314-2.937 3.305-5.277 5.87-7.108-4.337-2.858-7.215-7.77-7.215-13.323V233.84zM175.381 233.84l29.783 44.031c4.367 6.049 4.624 12.669 4.624 21.608v90.493c.183 10.025-1.876 14.247-11.271 14.933h-22.683v-91.136c.206-4.445-.431-8.143-1.798-11.195-1.315-2.937-3.305-5.277-5.87-7.108 4.337-2.858 7.215-7.77 7.215-13.323V233.84z"/><path fill="#DB684A" d="M86.55 113.634c5.609 6.449 21.602 14.909 38.555 14.909 16.952 0 33.728-7.386 39.076-14.925l10.301 38.545.008.004v67.011c-2.284-6.019-8.12-10.327-14.915-10.327h-67.65c-6.795 0-12.63 4.308-14.915 10.327v-67.082l9.54-38.462z"/><path fill="#313131" d="M164.181 113.617l10.301 38.546c13.871 6.008 17.541 22.411 25.115 36.41 2.355 4.354 4.72 12.513 10.204 12.513h31.813l-25.339-51.251c-11.039-19.774-27.923-32.86-52.094-36.218zm-77.631.015l-9.551 38.51c-13.841 6.045-17.531 22.448-25.097 36.431-2.354 4.354-4.719 12.513-10.203 12.513H9.885l25.34-51.251c11.039-19.774 27.154-32.845 51.325-36.203z"/><path fill="#323840" d="M167.351 413.025h36.943c8.51 0 8.523 12.857 0 12.876l-49.981.125v-98.631c0-10.687-8.744-19.43-19.43-19.43h-18.741c-10.687 0-19.43 8.744-19.43 19.43v98.506c0 .233-45.604 0-49.886 0-8.518 0-8.516-12.876 0-12.876h36.848V309.628c0-6.403 5.239-11.642 11.642-11.642h60.393c6.404 0 11.642 5.239 11.642 11.642v103.397z"/><path fill="#313131" d="M169.249 85.185c-1.395 9.107-5.714 17.283-11.958 23.528-7.678 7.678-19.466 12.445-31.125 12.445-11.659 0-23.445-4.767-31.123-12.445-5.835-5.835-9.987-13.354-11.645-21.745-5.321-8.376-8.589-18.449-8.998-29.335 16.132-4.004 34.182-5.868 50.849-5.868 17.538 0 35.989 2.07 51.911 5.887-.383 10.117-3.236 19.532-7.911 27.533zM110.788 45.359c-12.176.719-24.371 2.445-36.254 5.277 1.763-23.2 16.532-42.327 36.254-48.518v43.241zm31.533-42.728c18.948 6.689 32.996 25.428 34.705 48.026-11.097-2.563-22.775-4.309-34.705-5.136V2.631zM125.779 0c2.671 0 6.996.279 9.792.81l-.046 44.34a246.88 246.88 0 00-16.752-.088L118.675.551A43.504 43.504 0 01125.779 0z"/><path fill="#FFDBCE" d="M170.103 68.462c-1.967-.433-3.64-.698-5.851-.096v13.246l.432.095c2.917-3.757 4.453-8.332 5.419-13.245zm-89.322 0c1.967-.433 3.64-.698 5.851-.096v13.246l-.431.095c-2.917-3.757-4.454-8.332-5.42-13.245zm45.315-6.233c-10.72-.105-22.625 1.3-33.335 4.472v12.078c0 8.845 3.623 16.892 9.458 22.727 5.836 5.836 15.071 9.459 23.917 9.459 8.846 0 18.083-3.623 23.918-9.459 5.836-5.836 9.459-13.882 9.459-22.727V66.831c-10.771-2.876-22.706-4.496-33.417-4.602z"/><path fill="#F3BCAC" fill-rule="nonzero" d="M119.403 88.064a2.41 2.41 0 011.682-4.515c1.643.609 3.306.819 4.98.771 1.731-.05 3.531-.389 5.361-.857a2.418 2.418 0 011.19 4.686c-2.096.535-4.224.926-6.419.989-2.25.065-4.514-.228-6.794-1.074z"/><path fill="#EAC6B9" d="M126.096 62.229c-10.72-.105-22.625 1.3-33.335 4.472v1.808c22.251-2.833 44.501-2.793 66.752 0v-1.678c-10.771-2.876-22.706-4.496-33.417-4.602z"/><path fill="#2C2C2C" fill-rule="nonzero" d="M139.426 132.027h109.402c3.393 0 6.172 2.784 6.172 6.172v18.931a3.61 3.61 0 01-2.869 3.533v62.199a3.61 3.61 0 01-3.609 3.609H139.731a3.61 3.61 0 01-3.609-3.609v-62.199a3.612 3.612 0 01-2.868-3.533v-18.931a6.18 6.18 0 016.172-6.172z"/><path fill="#F9B25F" d="M248.522 160.739v62.123H139.731v-62.123z"/><path fill="#FDB45F" d="M139.426 135.635h109.402c1.41 0 2.563 1.16 2.563 2.564v18.932H136.863v-18.932a2.57 2.57 0 012.563-2.564z"/><path fill="#BE7F40" d="M139.729 160.74h108.796v10.189H139.729z"/><path fill="#313131" d="M201.244 217.292H173.63a15.801 15.801 0 011.889 7.503v4.475h25.807c.57 4.067 4.084 7.222 8.301 7.222h34.177c4.611 0 8.383-3.772 8.383-8.383v-11.312c0-4.611-3.772-8.383-8.383-8.383h-34.177c-4.61 0-8.383 3.772-8.383 8.383v.495z"/><path fill="#fff" d="M91.925 208.851h67.65c8.769 0 15.944 7.174 15.944 15.944v57.348c0 8.769-7.175 15.943-15.944 15.943h-67.65c-8.769 0-15.944-7.174-15.944-15.943v-57.348c0-8.77 7.175-15.944 15.944-15.944z"/><rect fill="#323840" x="84.376" y="216.434" width="83.307" height="73.612" rx="8.866" ry="8.917"/><circle fill="#FB9C78" cx="126.03" cy="253.24" r="22.907"/></svg>
`

const storeIcon = buildIconFromSvg(storeSvg, 38)
const userIcon = buildIconFromSvg(userSvg, 38)
const riderIcon = buildIconFromSvg(riderSvg, 38)

function toLatLngLiteral(p: LatLng) {
  return { lat: p.lat, lng: p.lng }
}

export function TrackingMap({
  storeLocation,
  userLocation,
  riderLocation,
  route,
  disableLiveTracking,
  deliveryMode
}: {
  storeLocation: LatLng
  userLocation: LatLng
  riderLocation?: RiderLocation | null
  route?: LatLng[]
  disableLiveTracking: boolean
  deliveryMode: string
}) {
  const mapRef = useRef<google.maps.Map | null>(null)
  const [selectedRider, setSelectedRider] = useState<RiderLocation | null>(null)

  // -- CHANGED: separate state for directions vs fallback --
  // decoded path returned by DirectionsService (only when real route is found)
  const [directionsPath, setDirectionsPath] = useState<LatLng[] | null>(null)
  // fallback straight path to show when directions fail
  const [fallbackPath, setFallbackPath] = useState<LatLng[] | null>(null)

  const [routeInfo, setRouteInfo] = useState<{
    distance?: string
    duration?: string
  } | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || '',
    libraries: ['geometry']
  })

  // decide which path to render:
  // - prefer directionsPath if it exists and has points
  // - otherwise use fallbackPath (straight line)
  const polylinePath = useMemo(() => {
    if (directionsPath && directionsPath.length > 0)
      return directionsPath.map(toLatLngLiteral)
    if (fallbackPath && fallbackPath.length > 0)
      return fallbackPath.map(toLatLngLiteral)
    // final fallback (shouldn't be needed but safe)
    // const waypoints = route ?? [];
    // const points = [storeLocation, ...waypoints, userLocation];
    // return points.map(toLatLngLiteral);
  }, [storeLocation, route, userLocation, directionsPath, fallbackPath])

  const center = useMemo(() => {
    if (riderLocation?.lat && riderLocation?.lng) {
      return { lat: riderLocation.lat, lng: riderLocation.lng }
    }
    return {
      lat: (storeLocation.lat + userLocation.lat) / 2,
      lng: (storeLocation.lng + userLocation.lng) / 2
    }
  }, [riderLocation, storeLocation, userLocation])

  const fitBoundsToMap = useCallback(
    (map: google.maps.Map, extra?: LatLng[]) => {
      const bounds = new google.maps.LatLngBounds()
      bounds.extend(toLatLngLiteral(storeLocation))
      bounds.extend(toLatLngLiteral(userLocation))
      ;(route ?? []).forEach(p => bounds.extend(toLatLngLiteral(p)))
      if (riderLocation?.lat && riderLocation?.lng)
        bounds.extend({ lat: riderLocation.lat, lng: riderLocation.lng })
      ;(extra ?? []).forEach(p => bounds.extend(toLatLngLiteral(p)))
      try {
        // you had fitBounds commented — use if you want:
        // map.fitBounds(bounds, { top: 60, right: 60, bottom: 120, left: 60 });
      } catch {
        // map.setCenter(center);
        // map.setZoom(DEFAULT_ZOOM);
      }
    },
    [storeLocation, userLocation, route, riderLocation, center]
  )

  const fallbackDirectionPath = () => {
    const fallback = [storeLocation, ...(route ?? []), userLocation]
    setDirectionsPath(null) // ensure we do NOT render direction polyline
    setFallbackPath(fallback)
    setRouteInfo(null)
    if (mapRef.current) fitBoundsToMap(mapRef.current, fallback)
  }

  // Call DirectionsService when store or user change
  useEffect(() => {
    if (!isLoaded) return
    if (!storeLocation || !userLocation) return

    if (disableLiveTracking) {
      fallbackDirectionPath()
      return
    }

    // const directionsService = new google.maps.DirectionsService()
    // const origin = toLatLngLiteral(storeLocation)
    // const destination = toLatLngLiteral(userLocation)

    // const request: google.maps.DirectionsRequest = {
    //   origin,
    //   destination,
    //   travelMode: google.maps.TravelMode.DRIVING
    // }

    // directionsService.route(request, (result, status) => {
    //   // console.log('Directions result:', status, result)

    //   if (
    //     status === 'OK' &&
    //     result &&
    //     result.routes &&
    //     result.routes.length > 0
    //   ) {
    //     const route0 = result.routes[0]
    //     let decoded: LatLng[] = []

    //     try {
    //       const encoded: string | undefined =
    //         typeof route0.overview_polyline === 'string'
    //           ? route0.overview_polyline
    //           : (route0.overview_polyline as any)?.points

    //       if (
    //         encoded &&
    //         google.maps.geometry &&
    //         google.maps.geometry.encoding
    //       ) {
    //         const path = google.maps.geometry.encoding.decodePath(encoded)
    //         decoded = path.map(p => ({ lat: p.lat(), lng: p.lng() }))
    //       } else if (route0.overview_path && route0.overview_path.length > 0) {
    //         decoded = route0.overview_path.map(p => ({
    //           lat: p.lat(),
    //           lng: p.lng()
    //         }))
    //       }
    //     } catch (err) {
    //       decoded = []
    //     }

    //     if (decoded.length > 0) {
    //       // WE HAVE A REAL ROUTE — set directionsPath and clear fallback
    //       setDirectionsPath(decoded)
    //       setFallbackPath(null)

    //       const legs = route0.legs ?? []
    //       if (legs.length > 0) {
    //         try {
    //           const totalMeters = legs.reduce(
    //             (acc, leg) => acc + (leg.distance?.value ?? 0),
    //             0
    //           )
    //           const totalSeconds = legs.reduce(
    //             (acc, leg) => acc + (leg.duration?.value ?? 0),
    //             0
    //           )
    //           const distanceText =
    //             legs[0].distance?.text ?? `${Math.round(totalMeters / 1000)} km`
    //           const durationText =
    //             legs[0].duration?.text ?? `${Math.round(totalSeconds / 60)} min`
    //           setRouteInfo({ distance: distanceText, duration: durationText })
    //         } catch (e) {
    //           setRouteInfo(null)
    //         }
    //       } else {
    //         setRouteInfo(null)
    //       }

    //       if (mapRef.current) fitBoundsToMap(mapRef.current, decoded)
    //       return
    //     }
    //   }

    //   // If we reach here, directions failed or decoding failed:
    //   console.warn('Directions request failed or no decoded path:', status)
    //   fallbackDirectionPath()
    // })
    fallbackDirectionPath()
  }, [isLoaded, storeLocation, userLocation, route, fitBoundsToMap])

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map
      fitBoundsToMap(map, directionsPath ?? fallbackPath ?? [])
    },
    [fitBoundsToMap, directionsPath, fallbackPath]
  )

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return
    if (directionsPath && directionsPath.length > 0) {
      fitBoundsToMap(mapRef.current, directionsPath)
    } else if (fallbackPath && fallbackPath.length > 0) {
      fitBoundsToMap(mapRef.current, fallbackPath)
    }
  }, [isLoaded, directionsPath, fallbackPath, fitBoundsToMap])

  if (loadError)
    return <div className='text-red-600'>Failed to load Google Maps</div>
  if (!isLoaded) return <div className='map-loading'>Loading map…</div>

  const lineSymbol: google.maps.Symbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 4
  }

  return (
    <div
      style={{
        height: 'calc(100vh - 240px)',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={deliveryMode === DELIVERY_MODES.ONE_DAY ? 13 : 13}
        onLoad={onMapLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          clickableIcons: false
        }}
      >
        {/* Glow polyline (use the currently selected path only) */}
        {/* <Polyline
          path={polylinePath}
          options={{
            strokeColor: "#FF8A00",
            strokeOpacity: 0.18,
            strokeWeight: 8,
            clickable: false,
            zIndex: 1,
          }}
        /> */}

        {/* Main dashed polyline */}
        <Polyline
          path={polylinePath}
          options={{
            strokeColor: '#FF8A00',
            strokeOpacity: 10,
            strokeWeight: 5,
            clickable: false,
            zIndex: 2,
            icons: [
              {
                icon: lineSymbol,
                offset: '0',
                repeat: '14px'
              }
            ]
          }}
        />

        {/* Markers */}
        <Marker
          position={toLatLngLiteral(storeLocation)}
          icon={storeIcon as any}
          title='Store'
        />
        <Marker
          position={toLatLngLiteral(userLocation)}
          icon={userIcon as any}
          title='Customer'
        />

        {riderLocation?.lat && riderLocation?.lng ? (
          <Marker
            position={{ lat: riderLocation.lat, lng: riderLocation.lng }}
            icon={riderIcon as any}
            title={riderLocation.name ?? 'Rider'}
            onClick={() => setSelectedRider(riderLocation)}
          />
        ) : null}

        {selectedRider ? (
          <InfoWindow
            position={{ lat: selectedRider.lat, lng: selectedRider.lng }}
            onCloseClick={() => setSelectedRider(null)}
          >
            <div className='text-sm'>
              <strong>{selectedRider.name ?? 'Rider'}</strong>
              <div>Status: {selectedRider.status ?? 'Unknown'}</div>
              {selectedRider.phone ? (
                <div>Phone: {selectedRider.phone}</div>
              ) : null}
            </div>
          </InfoWindow>
        ) : null}

        {routeInfo ? (
          <div style={{ position: 'absolute', left: 16, top: 16, zIndex: 999 }}>
            <div className='rounded bg-white p-2 text-xs shadow'>
              <div>Distance: {routeInfo.distance}</div>
              <div>ETA: {routeInfo.duration}</div>
            </div>
          </div>
        ) : null}
      </GoogleMap>
    </div>
  )
}
