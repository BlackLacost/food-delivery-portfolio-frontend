import { useQuery } from '@apollo/client'
import { Map, TrafficControl, YMaps, ZoomControl } from '@pbe/react-yandex-maps'
import { useGeolocated } from 'react-geolocated'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { OrderDriverCard } from '../../features/order/OrderDriverCard'
import { YandexRoute } from '../../features/yandex-map/YandexRoute'
import { graphql } from '../../gql'
import { OrderStatus } from '../../gql/graphql'
import { notify } from '../../toast'

const DriverOrderRoute_Query = graphql(`
  query DriverOrder_Query($input: GetOrderInput!) {
    getDriverOrder(input: $input) {
      order {
        ...DriverCard_OrderFragment
        customer {
          coords {
            latitude
            longitude
          }
        }
        restaurant {
          coords {
            latitude
            longitude
          }
        }
        status
      }
      error {
        ... on Error {
          message
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
    onError: ({ message }) => notify.error(message),
    onCompleted: ({ getDriverOrder: { error } }) => {
      if (error) notify.error(error.message)
    },
  })

  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
    })

  if (!isGeolocationAvailable) {
    return <div>Your browser does not support Geolocation</div>
  }

  if (!isGeolocationEnabled) {
    return <div>Geolocation is not enabled</div>
  }

  if (!coords?.latitude || !coords?.longitude) {
    getPosition()
    return null
  }

  const order = data?.getDriverOrder.order

  if (!order) return null

  if (
    !order.restaurant?.coords.latitude ||
    !order.restaurant?.coords.longitude ||
    !order.customer?.coords?.latitude ||
    !order.customer?.coords?.longitude
  ) {
    return null
  }

  const restaurantCoords: [number, number] = [
    order.restaurant.coords.latitude,
    order.restaurant.coords.longitude,
  ]

  const customerCoords: [number, number] = [
    order.customer.coords.latitude,
    order.customer.coords.longitude,
  ]

  return (
    <div>
      <Helmet>
        <title>{`Order ${orderId}`} | Доставка Еды</title>
      </Helmet>
      <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_KEY }}>
        <Map
          width={window.innerWidth}
          height="90vh"
          state={{
            center: [coords.latitude, coords.longitude],
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
        >
          <TrafficControl />
          <ZoomControl />

          {order.status === OrderStatus.Accepted && (
            <YandexRoute
              from={[coords.latitude, coords.longitude]}
              to={restaurantCoords}
            />
          )}
          {order.status === OrderStatus.PickedUp && (
            <YandexRoute
              from={[coords.latitude, coords.longitude]}
              to={customerCoords}
            />
          )}
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
