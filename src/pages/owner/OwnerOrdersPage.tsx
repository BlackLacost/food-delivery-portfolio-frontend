import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { OrderOwnerCard } from '../../components/order/OrderOwnerCard'
import { graphql } from '../../gql'
import { OrderStatus } from '../../gql/graphql'
import { notify } from '../../toast'

const GetRestaurantOrdersRoute_Query = graphql(`
  query GetRestaurantOrders_Query($input: GetRestaurantOrdersInput!) {
    getRestaurantOrders(input: $input) {
      orders {
        id
        status
        ...OwnerCard_OrderFragment
      }
    }
  }
`)

const OwnerOrderUpdates_Subscription = graphql(`
  subscription OwnerOrderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      id
      status
      ...OwnerCard_OrderFragment
    }
  }
`)

export const OwnerOrdersPage = () => {
  const params = useParams<{ id: string }>()
  const restaurantId = Number(params.id)

  const { data, subscribeToMore } = useQuery(GetRestaurantOrdersRoute_Query, {
    variables: {
      input: {
        restaurantId,
        statuses: [
          OrderStatus.Pending,
          OrderStatus.Cooking,
          OrderStatus.Cooked,
        ],
      },
    },
    onError: (error) => notify.error(error.message),
  })

  const orders = data?.getRestaurantOrders.orders

  useEffect(() => {
    orders?.forEach((order) => {
      subscribeToMore({
        document: OwnerOrderUpdates_Subscription,
        variables: { input: { id: order.id } },
        updateQuery: (prev, { subscriptionData }) => {
          console.log({ prev, subscriptionData })
          if (!subscriptionData.data) return prev
          const newOrder = subscriptionData.data.orderUpdates
          return {
            getRestaurantOrders: {
              ...prev.getRestaurantOrders,
              orders: prev.getRestaurantOrders.orders.map((order) => {
                return order.id === newOrder.id ? newOrder : order
              }),
            },
          }
        },
      })
    })
  }, [orders, subscribeToMore])
  // React.useEffect(() => {
  //   notDeliveredOrders?.forEach((order) => {
  //     subscribeToMore({
  //       document: ClientOrderUpdates_Subscription,
  //       variables: { input: { id: order.id } },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData.data) return prev
  //         const newOrder = subscriptionData.data.orderUpdates
  //         return {
  //           getOrders: {
  //             ...prev.getOrders,
  //             orders: prev.getOrders.orders.map((order) => {
  //               return order.id === newOrder.id ? newOrder : order
  //             }),
  //           },
  //         }
  //       },
  //     })
  //   })
  // }, [notDeliveredOrders, subscribeToMore])

  // useEffect(() => {
  //   if (order) {
  //     subscribeToMore({
  //       document: OwnerOrderUpdates_Subscription,
  //       variables: { input: { id: orderId } },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData.data) return prev
  //         const newOrder = subscriptionData.data.orderUpdates
  //         return {
  //           getOwnerOrder: { ...prev.getOwnerOrder, order: newOrder },
  //         }
  //       },
  //     })
  //   }
  // }, [order, orderId, subscribeToMore])

  // if (!order) return null

  return (
    <>
      <Helmet>
        <title>Restaurant Orders | Uber Eats</title>
      </Helmet>
      {orders?.map((order) => (
        <OrderOwnerCard key={order.id} order={order} />
      ))}
    </>
  )
}
