import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { OrderOwnerCard } from '../../components/order/OrderOwnerCard'
import { graphql } from '../../gql'
import { notify } from '../../toast'

const GetOwnerOrderRoute_Query = graphql(`
  query GetOwnerOrder_Query($input: GetOrderInput!) {
    getOwnerOrder(input: $input) {
      order {
        ...OwnerCard_OrderFragment
      }
      error {
        ... on Error {
          message
        }
      }
    }
  }
`)

const OwnerOrderUpdates_Subscription = graphql(`
  subscription OwnerOrderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...OwnerCard_OrderFragment
    }
  }
`)

type Params = {
  id: string
}

export const OwnerOrderPage = () => {
  const params = useParams<Params>()
  const orderId = Number(params.id)

  const { data, subscribeToMore } = useQuery(GetOwnerOrderRoute_Query, {
    variables: { input: { id: orderId } },
    onError: (error) => notify.error(error.message),
    onCompleted: ({ getOwnerOrder: { error } }) => {
      if (error) return notify.error(error.message)
    },
  })

  const order = data?.getOwnerOrder.order

  useEffect(() => {
    if (order) {
      subscribeToMore({
        document: OwnerOrderUpdates_Subscription,
        variables: { input: { id: orderId } },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const newOrder = subscriptionData.data.orderUpdates
          return {
            getOwnerOrder: { ...prev.getOwnerOrder, order: newOrder },
          }
        },
      })
    }
  }, [order, orderId, subscribeToMore])

  if (!order) return null

  return (
    <>
      <Helmet>
        <title>{`Owner Order ${orderId}`} | Uber Eats</title>
      </Helmet>
      <OrderOwnerCard order={order} />
    </>
  )
}
