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
        ...OwnerCard_OrderFragment
      }
    }
  }
`)

const OwnerOrderUpdates_Subscription = graphql(`
  subscription OwnerOrderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      id
      ...OwnerCard_OrderFragment
    }
  }
`)

const NewRestaurantOrder_Subscription = graphql(`
  subscription NewRestaurantOrder {
    pendingOrders {
      id
      ...OwnerCard_OrderFragment
    }
  }
`)

export const OwnerOrdersPage = () => {
  const params = useParams<{ id: string }>()
  const restaurantId = Number(params.id)

  const { data: getOrdersData, subscribeToMore: subscribeToMoreOrders } =
    useQuery(GetRestaurantOrdersRoute_Query, {
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

  useEffect(() => {
    if (getOrdersData?.getRestaurantOrders) {
      subscribeToMoreOrders({
        document: NewRestaurantOrder_Subscription,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const newOrder = subscriptionData.data.pendingOrders
          return {
            getRestaurantOrders: {
              ...prev.getRestaurantOrders,
              orders: prev.getRestaurantOrders.orders.length
                ? [...prev.getRestaurantOrders.orders, newOrder]
                : [newOrder],
            },
          }
        },
      })
    }
  }, [getOrdersData, subscribeToMoreOrders])

  useEffect(() => {
    getOrdersData?.getRestaurantOrders.orders?.forEach((order) => {
      subscribeToMoreOrders({
        document: OwnerOrderUpdates_Subscription,
        variables: { input: { id: order.id } },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const updatedOrder = subscriptionData.data.orderUpdates
          return {
            getRestaurantOrders: {
              ...prev.getRestaurantOrders,
              orders: prev.getRestaurantOrders.orders.map((order) => {
                return order.id === updatedOrder.id ? updatedOrder : order
              }),
            },
          }
        },
      })
    })
  }, [getOrdersData, subscribeToMoreOrders])

  const orders = getOrdersData?.getRestaurantOrders.orders

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
