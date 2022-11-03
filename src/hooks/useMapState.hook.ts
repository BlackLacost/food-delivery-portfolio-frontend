import { useEffect, useState } from 'react'
import { IMapState } from 'yandex-maps'
import { notify } from '../toast'
import { useCoords } from './useCoords.hook'

interface MapState extends IMapState {
  center: number[]
}

export const useMapState = (options?: IMapState) => {
  const { coords, error } = useCoords()
  if (error) {
    notify.error(error)
  }

  const [mapState, setMapState] = useState<MapState>({
    center: [coords?.latitude ?? 55.755826, coords?.longitude ?? 37.6173],
    zoom: 14,
    ...options,
  })

  useEffect(() => {
    if (coords?.latitude && coords.longitude) {
      setMapState((curr) => ({
        ...curr,
        center: [coords.latitude, coords.longitude],
      }))
    }
  }, [coords])

  return mapState
}
