import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import React, { Dispatch, SetStateAction, useRef } from 'react'
import ymaps from 'yandex-maps'
import { useMapState } from '../../hooks/useMapState.hook'

export type Position = {
  coords?: number[]
  address?: string
}

type Props = {
  position: Position
  setPosition: Dispatch<SetStateAction<Position>>
}

export const GetAddress = React.memo(
  ({ position: clientPosition, setPosition: setClientPosition }: Props) => {
    const mapState = useMapState()
    const ymapsRef = useRef<typeof ymaps>(null)

    const getCoords = (e: any) => e.get('coords')
    const getAddress = async (coords: any) => {
      if (!ymapsRef.current) return null
      const res = await ymapsRef.current.geocode(coords)
      const firstGeoObject: any = res.geoObjects.get(0)
      const newAddress = firstGeoObject.getAddressLine()
      return newAddress
    }

    const onLoad = async () => {
      const coords = clientPosition.coords ?? mapState.center
      const address = await getAddress(coords)
      setClientPosition({ coords, address })
    }
    return (
      <>
        <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_KEY }}>
          <Map
            modules={['geocode', 'geolocation']}
            width={'100%'}
            height="400px"
            defaultState={mapState}
            onLoad={(ymapsInstance) => {
              if (ymapsInstance) {
                // @ts-ignore
                ymapsRef.current = ymapsInstance
                onLoad()
              }
            }}
            onClick={async (e: string) => {
              const coords = getCoords(e)
              const address = await getAddress(coords)
              setClientPosition({ coords, address })
            }}
          >
            <Placemark
              instanceRef={(ref) => {
                if (ref) {
                  ref.events.add('dragend', async () => {
                    const coords = ref.geometry.getCoordinates()
                    const address = await getAddress(coords)
                    setClientPosition({ coords, address })
                  })
                }
              }}
              geometry={clientPosition.coords ?? mapState.center}
              options={{
                draggable: true,
              }}
            />
          </Map>
        </YMaps>
        <div className="input mt-5 w-full cursor-not-allowed bg-gray-100">
          {clientPosition.address}
        </div>
      </>
    )
  }
)
