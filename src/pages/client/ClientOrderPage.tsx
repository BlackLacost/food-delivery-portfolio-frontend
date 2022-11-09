import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { OrderClientCard } from '../../components/order/OrderClientCard'
import { graphql } from '../../gql'
import { notify } from '../../toast'

const GetClientOrderRoute_Query = graphql(`
  query GetClientOrder_Query($input: GetOrderInput!) {
    getClientOrder(input: $input) {
      order {
        ...ClientCard_OrderFragment
      }
      error {
        ... on Error {
          message
        }
      }
    }
  }
`)

const ClientOrderUpdates_Subscription = graphql(`
  subscription ClientOrderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...ClientCard_OrderFragment
    }
  }
`)

type Params = {
  id: string
}

export const ClientOrderPage = () => {
  const params = useParams<Params>()
  const orderId = Number(params.id)

  const { data, subscribeToMore } = useQuery(GetClientOrderRoute_Query, {
    variables: { input: { id: orderId } },
    onError: (error) => notify.error(error.message),
    onCompleted: ({ getClientOrder: { error } }) => {
      if (error) return notify.error(error.message)
    },
  })

  const order = data?.getClientOrder.order

  useEffect(() => {
    if (order) {
      subscribeToMore({
        document: ClientOrderUpdates_Subscription,
        variables: { input: { id: orderId } },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const newOrder = subscriptionData.data.orderUpdates
          return {
            getClientOrder: { ...prev.getClientOrder, order: newOrder },
          }
        },
      })
    }
  }, [order, orderId, subscribeToMore])

  if (!order) return null

  return (
    <>
      <Helmet>
        <title>{`Client Order ${orderId}`} | Uber Eats</title>
      </Helmet>
      <OrderClientCard order={order} />
    </>
  )
}
