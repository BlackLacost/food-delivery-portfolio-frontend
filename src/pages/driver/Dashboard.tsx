import { useMutation, useQuery } from '@apollo/client'
import {
  Clusterer,
  FullscreenControl,
  Map,
  Placemark,
  TrafficControl,
  YMaps,
  ZoomControl,
} from '@pbe/react-yandex-maps'
import React from 'react'
import { useGeolocated } from 'react-geolocated'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { graphql } from '../../gql'
import { OrderStatus } from '../../gql/graphql'
import { notify } from '../../toast'

const GetOrdersRoute_Query = graphql(`
  query GetOrders_Query($input: GetOrdersInput!) {
    getOrders(input: $input) {
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

const AcceptOrder_Mutation = graphql(`
  mutation AcceptOrder_Mutation($input: AcceptOrderInput!) {
    acceptOrder(input: $input) {
      order {
        id
      }
      error {
        ... on Error {
          message
        }
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

  const [acceptOrderMutation] = useMutation(AcceptOrder_Mutation, {
    onError: (error) => notify.error(error.message),
    onCompleted: ({ acceptOrder: { error, order } }) => {
      if (error) return notify.error(error.message)
      navigate(`/order/${order?.id}`)
    },
  })
  window.acceptOrder = (orderId) => {
    acceptOrderMutation({ variables: { input: { id: orderId } } })
  }
  const { data: getOrdersData, subscribeToMore: subscribeToMoreOrders } =
    useQuery(GetOrdersRoute_Query, {
      variables: { input: { statuses: [OrderStatus.Cooked] } },
    })

  React.useEffect(() => {
    subscribeToMoreOrders({
      document: CoockedOrders_Subscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newOrder = subscriptionData.data.cookedOrders
        return {
          getOrders: {
            ...prev.getOrders,
            orders: prev.getOrders.orders.length
              ? [...prev.getOrders.orders, newOrder]
              : [newOrder],
          },
        }
      },
    })
  }, [subscribeToMoreOrders])

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
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
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
            'clusterer.addon.balloon',
            // 'templateLayoutFactory',
          ]}
        >
          <TrafficControl />
          <ZoomControl />
          <FullscreenControl />

          <Clusterer
            options={{
              balloonPanelMaxMapArea: Infinity,
              clusterDisableClickZoom: true,
            }}
          >
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
                  // balloonContentHeader: `Order #${orderId}`,
                  balloonContentHeader: `${restaurant?.name}`,
                  balloonContentBody: `
                    <p class='font-bold select-none mb-2'>Order #${orderId}</p>
                    <p>Address: ${restaurant?.address}</p>
                  `,
                  balloonContentFooter: `
                    <input
                      class="input cursor-pointer bg-primary-600 text-white"
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
          </Clusterer>
        </Map>
      </YMaps>
    </div>
  )
}
