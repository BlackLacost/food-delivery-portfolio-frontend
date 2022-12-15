import { useQuery } from '@apollo/client'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { OrderClientCard } from '../../features/order/OrderClientCard'
import { graphql } from '../../gql'
import { OrderStatus } from '../../gql/graphql'
import { notify } from '../../toast'

export const GetClientOrdersRoute_Query = graphql(`
  query GetClientOrders_Query($input: GetOrdersInput!) {
    getOrders(input: $input) {
      orders {
        id
        status
        ...ClientCard_OrderFragment
      }
    }
  }
`)

const ClientOrderUpdates_Subscription = graphql(`
  subscription ClientOrderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      id
      status
      ...ClientCard_OrderFragment
    }
  }
`)

export const ClientOrdersPage = () => {
  const { data, subscribeToMore } = useQuery(GetClientOrdersRoute_Query, {
    variables: {
      input: {
        statuses: [
          OrderStatus.Pending,
          OrderStatus.Cooking,
          OrderStatus.Cooked,
          OrderStatus.Accepted,
          OrderStatus.PickedUp,
        ],
      },
    },
    onError: (error) => notify.error(error.message),
  })

  const notDeliveredOrders = data?.getOrders.orders

  React.useEffect(() => {
    notDeliveredOrders?.forEach((order) => {
      subscribeToMore({
        document: ClientOrderUpdates_Subscription,
        variables: { input: { id: order.id } },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const orderUpdates = subscriptionData.data.orderUpdates

          // Delete Delivered order
          if (orderUpdates.status === OrderStatus.Delivered) {
            return {
              getOrders: {
                ...prev.getOrders,
                orders: prev.getOrders.orders.filter((order) => {
                  return order.id !== orderUpdates.id
                }),
              },
            }
          }

          return {
            getOrders: {
              ...prev.getOrders,
              orders: prev.getOrders.orders.map((order) => {
                return order.id === orderUpdates.id ? orderUpdates : order
              }),
            },
          }
        },
      })
    })
  }, [notDeliveredOrders, subscribeToMore])

  return (
    <>
      <Helmet>
        <title>Client Orders | Доставка Еды</title>
      </Helmet>
      <div className="container">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {notDeliveredOrders?.map((order) => (
            <OrderClientCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </>
  )
}
