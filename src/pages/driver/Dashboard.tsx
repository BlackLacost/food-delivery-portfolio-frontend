import { useMutation, useQuery } from '@apollo/client'
import {
  FullscreenControl,
  Map,
  Placemark,
  TrafficControl,
  YMaps,
  ZoomControl,
} from '@pbe/react-yandex-maps'
import React from 'react'
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
          coords {
            latitude
            longitude
          }
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
      restaurant {
        address
        coords {
          latitude
          longitude
        }
        name
      }
      status
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
  const { data: getOrdersData, subscribeToMore: subscribeToMoreOrders } =
    useQuery(GetOrdersRoute_Query, {
      variables: { input: { status: OrderStatus.Cooked } },
    })

  React.useEffect(() => {
    if (getOrdersData?.getOrders.ok) {
      subscribeToMoreOrders({
        document: CoockedOrders_Subscription,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const newOrder = subscriptionData.data.cookedOrders
          return {
            getOrders: {
              ...prev.getOrders,
              orders: prev.getOrders.orders?.length
                ? [...prev.getOrders.orders, newOrder]
                : [newOrder],
            },
          }
        },
      })
    }
  }, [getOrdersData, subscribeToMoreOrders])

  const orders = getOrdersData?.getOrders.orders

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

          {orders?.map(({ id: orderId, restaurant }) => (
            <Placemark
              modules={['geoObject.addon.balloon']}
              key={orderId}
              geometry={[
                restaurant?.coords.latitude,
                restaurant?.coords.longitude,
              ]}
              properties={{
                item: orderId,
                balloonContentHeader: `Order #${orderId}`,
                balloonContentBody: `${restaurant?.name} ${restaurant?.address}`,
                balloonContentFooter: `
                    <input
                      class="input cursor-pointer bg-lime-600 text-white"
                      type="button"
                      onclick="window.acceptOrder(${orderId})"
                      value="Accpet Order"
                    />`,
                iconContent: restaurant?.name,
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
    </div>
  )
}
