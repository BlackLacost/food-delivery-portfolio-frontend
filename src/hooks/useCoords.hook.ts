import { useGeolocated } from 'react-geolocated'

export const useCoords = () => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      watchPosition: true,
      // userDecisionTimeout: 5000,
    })

  if (!isGeolocationAvailable) {
    return { error: 'Your browser does not support Geolocation' }
  }

  if (!isGeolocationEnabled) {
    return { error: 'Geolocation is not enabled' }
  }

  if (!coords?.latitude || !coords.longitude) {
    getPosition()
    return {}
  }

  return { coords }
}
