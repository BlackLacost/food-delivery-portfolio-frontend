import { useQuery } from '@apollo/client'
import { Map, TrafficControl, YMaps, ZoomControl } from '@pbe/react-yandex-maps'
import { useGeolocated } from 'react-geolocated'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { OrderDriverCard } from '../../components/order/OrderDriverCard'
import { graphql } from '../../gql'

const DriverOrderRoute_Query = graphql(`
  query DriverOrder_Query($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...DriverCard_OrderFragment
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
  const order = data?.getOrder.order

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

  if (!coords?.latitude || !coords.longitude) {
    getPosition()
    return null
  }

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
            center: [coords.latitude, coords.longitude],
            zoom: 16,
          }}
          modules={[
            'control.ZoomControl',
            'control.FullscreenControl',
            'control.TrafficControl',
            // 'templateLayoutFactory',
          ]}
        >
          <TrafficControl />
          <ZoomControl />

          {/* {order && driverCoords && (
            <RoutePanel
              options={{ float: 'right' }}
              instanceRef={(ref) => {
                if (ref) {
                  ref.routePanel.state.set({
                    fromEnabled: false,
                    toEnabled: false,
                    from: driverCoords,
                    to: restaurantsCoords[0],
                    type: 'auto',
                  })
                }
              }}
            />
          )} */}
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
