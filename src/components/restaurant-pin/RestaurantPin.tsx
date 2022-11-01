import { Placemark, useYMaps } from '@pbe/react-yandex-maps'
import React from 'react'

type Props = {
  restaurantCoords: [number, number]
  // mapInstanceRef: YMapsApi | null
}

export const RestaurantPin: React.FC<Props> = React.memo(
  ({ restaurantCoords }) => {
    // if (!mapInstanceRef) return null
    const ymaps = useYMaps()
    if (!ymaps) return null

    console.log(ymaps)
    const layout = ymaps.templateLayoutFactory.createClass('<div>qwe</div>', {
      build: function () {
        // @ts-ignore
        layout.superclass.build.call(this)
      },
    })

    return (
      <Placemark geometry={restaurantCoords} options={{ iconLayout: layout }} />
    )
  }
)

// export const RestaurantPin: React.FC<Props> = () => {
// 	return (

// 	)
// }
