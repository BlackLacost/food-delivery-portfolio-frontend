import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import React, { Dispatch, SetStateAction, useRef } from 'react'
import ymaps from 'yandex-maps'
import { useMapState } from '../../hooks/useMapState.hook'

type ClientPosition = {
  coords?: number[]
  address?: string
}

type Props = {
  clientPosition: ClientPosition
  setClientPosition: Dispatch<SetStateAction<ClientPosition>>
}

export const GetAddress = React.memo(
  ({ clientPosition, setClientPosition }: Props) => {
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
            state={mapState}
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
        <input
          className="input mt-5 w-full"
          disabled
          value={clientPosition.address}
        />
      </>
    )
  }
)
