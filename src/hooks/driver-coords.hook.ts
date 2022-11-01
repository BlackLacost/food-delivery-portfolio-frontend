import { useEffect, useState } from 'react'

type Coords = {
  latitude?: number
  longitude?: number
}

export const useDriverCoords = () => {
  const [driverCoords, setDriverCoords] = useState<Coords | null>()

  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ latitude, longitude })
  }

  const onError = (error: GeolocationPositionError) => {
    console.log(error)
  }

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    })
  }, [])

  return driverCoords ? (Object.values(driverCoords) as [number, number]) : null
}
