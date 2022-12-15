import {
  GeolocationControl,
  Map,
  TrafficControl,
  YMaps,
} from '@pbe/react-yandex-maps'
import { useState } from 'react'
import { PlacemarkWithTitle } from '../features/yandex-map/PlacemarkWithTitle'

type Coords = [number, number]

export const Yandex = () => {
  const [from] = useState<Coords>([55.66393931, 37.90596434])
  return (
    <div>
      <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_KEY }}>
        <Map
          width={window.innerWidth}
          height="90vh"
          state={{
            center: from,
            zoom: 14,
          }}
        >
          <GeolocationControl />
          <TrafficControl />

          <PlacemarkWithTitle coords={from} title="KFC" />
        </Map>
      </YMaps>
    </div>
  )
}
