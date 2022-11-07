import { useQuery } from '@apollo/client'
import { Map, TrafficControl, YMaps, ZoomControl } from '@pbe/react-yandex-maps'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import ymaps from 'yandex-maps'
import { OrderDriverCard } from '../../components/order/OrderDriverCard'
import { YandexRoute } from '../../components/Yandex/YandexRoute'
import { graphql } from '../../gql'

const DriverOrderRoute_Query = graphql(`
  query DriverOrder_Query($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...DriverCard_OrderFragment
        restaurant {
          coords {
            latitude
            longitude
          }
        }
      }
    }
  }
`)

type Params = {
  id: string
}

export const DriverOrderPage = () => {
  const params = useParams<Params>()
  const orderId = Number(params.id)

  const { data } = useQuery(DriverOrderRoute_Query, {
    variables: { input: { id: orderId } },
  })

  const [driverCoords, setDriverCoords] = React.useState<[number, number]>([
    57, 37,
  ])

  const getGeoLocation = async (ymapsInstance: typeof ymaps) => {
    // @ts-ignore
    const result = await ymapsInstance.geolocation.get({
      provider: 'yandex',
      mapStateAutoApply: true,
    })
    const res = await ymapsInstance.geocode(result.geoObjects.position)
    // @ts-ignore
    const coords = res.geoObjects.get(0).geometry.getCoordinates()
    setDriverCoords(coords)
  }

  const order = data?.getOrder.order

  if (!order) {
    return null
  }

  if (
    !order.restaurant?.coords.latitude ||
    !order.restaurant.coords.longitude
  ) {
    return null
  }

  const restaurantCoords: [number, number] = [
    order.restaurant.coords.latitude,
    order.restaurant.coords.longitude,
  ]

  return (
    <div>
      <Helmet>
        <title>{`Order ${orderId}`} | Uber Eats</title>
      </Helmet>
      <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_KEY }}>
        <Map
          width={window.innerWidth}
          height="90vh"
          state={{
            center: driverCoords,
            zoom: 16,
          }}
          modules={[
            'control.ZoomControl',
            'control.FullscreenControl',
            'control.TrafficControl',
            'geolocation',
            'geocode',
            // 'templateLayoutFactory',
          ]}
          onLoad={(ymaps) => {
            // @ts-ignore
            getGeoLocation(ymaps)
          }}
        >
          <TrafficControl />
          <ZoomControl />

          <YandexRoute from={driverCoords} to={restaurantCoords} />
        </Map>
      </YMaps>
      {order && (
        <div className="absolute bottom-8 right-2 z-10">
          <OrderDriverCard order={order} />
        </div>
      )}
    </div>
  )
}
