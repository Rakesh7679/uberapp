import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const LiveMap = ({ pickup, destination, currentLocation, requireCurrentLocation = false }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const routeLayerRef = useRef(null)
  const currentMarkerRef = useRef(null)

  const geocode = async (query) => {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY
    if (!query) return null

    if (apiKey) {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?limit=1&key=${apiKey}`
      )
      if (response.ok) {
        const data = await response.json()
        const coordinates = data.features?.[0]?.geometry?.coordinates
        if (coordinates) return coordinates
      }
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`
    )
    const data = await response.json()
    const location = data[0]
    return location ? [Number(location.lon), Number(location.lat)] : null
  }

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      touchZoom: true,
      dragging: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
    }).setView([22.5726, 88.3639], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)
    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !currentLocation) return

    const position = [currentLocation.lat, currentLocation.lng]
    mapInstanceRef.current.setView(position, 16, { animate: true })
    currentMarkerRef.current?.remove()
    currentMarkerRef.current = L.circleMarker(position, {
      radius: 9,
      color: '#ffffff',
      weight: 3,
      fillColor: '#2563eb',
      fillOpacity: 1,
    }).addTo(mapInstanceRef.current)
  }, [currentLocation])

  useEffect(() => {
    if (!mapInstanceRef.current || (!pickup && !currentLocation) || !destination) return
    if (requireCurrentLocation && !currentLocation) return

    const drawRoute = async () => {
      const originPromise = currentLocation
        ? Promise.resolve([currentLocation.lng, currentLocation.lat])
        : geocode(pickup)
      const [origin, target] = await Promise.all([originPromise, geocode(destination)])
      if (!origin || !target) return

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${origin[0]},${origin[1]};${target[0]},${target[1]}?overview=full&geometries=geojson`
      )
      const data = await response.json()
      const route = data.routes?.[0]?.geometry
      if (!route) return

      routeLayerRef.current?.remove()
      routeLayerRef.current = L.geoJSON(route, { style: { color: '#111827', weight: 5 } }).addTo(mapInstanceRef.current)
      mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [30, 30] })
    }

    drawRoute().catch((error) => console.error('Map route failed:', error))
  }, [pickup, destination, currentLocation, requireCurrentLocation])

  return (
    <div
      ref={mapRef}
      className='w-full h-full'
      style={{ minHeight: '400px', zIndex: 0 }}
    />
  )
}

export default LiveMap
