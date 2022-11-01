import { useMutation, useQuery, useSubscription } from '@apollo/client'
import {
  FullscreenControl,
  Map,
  Placemark,
  TrafficControl,
  YMaps,
  ZoomControl,
} from '@pbe/react-yandex-maps'
import { useState } from 'react'
import { useGeolocated } from 'react-geolocated'
import { useNavigate } from 'react-router-dom'
import { graphql } from '../../gql'
import { OrderStatus } from '../../gql/graphql'
import { notify } from '../../toast'

const GetOrdersRoute_Query = graphql(`
  query GetOrders_Query($input: GetOrdersInput!) {
    getOrders(input: $input) {
      ok
      error
      orders {
        id
        restaurant {
          address
          name
        }
        status
      }
    }
  }
`)

const TakeOrder_Mutation = graphql(`
  mutation TakeOrder_Mutation($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
      order {
        id
      }
    }
  }
`)

const CoockedOrders_Subscription = graphql(`
  subscription CookedOrders_Subscription {
    cookedOrders {
      id
    }
  }
`)

export const Dashboard = () => {
  const navigate = useNavigate()

  const [takeOrderMutation] = useMutation(TakeOrder_Mutation, {
    onError: (error) => notify.error(error.message),
    onCompleted: ({ takeOrder: { error, ok, order } }) => {
      if (error) return notify.error(error)
      if (ok && order) {
        navigate(`/order/${order.id}`)
      }
    },
  })
  window.acceptOrder = (orderId) => {
    takeOrderMutation({ variables: { input: { id: orderId } } })
  }
  const { data: getOrdersData } = useQuery(GetOrdersRoute_Query, {
    variables: { input: { status: OrderStatus.Cooked } },
  })
  const orders = getOrdersData?.getOrders.orders
  const [restaurantsCoords, setRestaurantsCoords] = useState<
    [number, number][]
  >([
    [55.701574, 37.59],
    [55.711574, 37.603856],
    [55.701574, 37.62],
  ])
  const { data: coockedOrdersData } = useSubscription(
    CoockedOrders_Subscription
  )

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

  return (
    <div>
      <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_KEY }}>
        <Map
          width={window.innerWidth}
          height="90vh"
          state={{
            center: [coords.latitude, coords.longitude],
            zoom: 14,
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
          <FullscreenControl />

          {orders &&
            orders.slice(0, 3).map((order, index) => (
              <Placemark
                modules={['geoObject.addon.balloon']}
                key={order.id}
                geometry={restaurantsCoords[index]}
                properties={{
                  item: order.id,
                  balloonContentHeader: `Order #${order.id}`,
                  balloonContentBody: `${order.restaurant?.name} ${order.restaurant?.address}`,
                  balloonContentFooter: `
                    <input
                      class="input cursor-pointer bg-lime-600 text-white"
                      type="button"
                      onclick="window.acceptOrder(${order.id})"
                      value="Accpet Order"
                    />`,
                  iconContent: order.restaurant?.name,
                }}
                options={{
                  preset: 'islands#blueStretchyIcon',
                  balloonPanelMaxMapArea: Infinity,
                }}
              />
            ))}

          {/* {coockedOrdersData?.cookedOrders && (
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
      {/* <div className="relative mx-auto -my-60 max-w-screen-sm space-y-5 bg-white p-10 shadow-lg">
        {coockedOrdersData?.cookedOrders ? (
          <>
            <h1 className="text-center text-2xl">New Coocked Order</h1>
            <p>{JSON.stringify(coockedOrdersData.cookedOrders, null, 2)}</p>
            <Button className="w-full">Accept Order &rarr;</Button>
          </>
        ) : (
          <h1 className="text-center text-2xl">No Orders Yet...</h1>
        )}
      </div> */}
    </div>
  )
}
