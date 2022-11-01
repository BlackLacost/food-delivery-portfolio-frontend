import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { OrderClientCard } from '../components/order/OrderClientCard'
import { OrderOwnerCard } from '../components/order/OrderOwnerCard'
import { graphql } from '../gql'
import { UserRole } from '../gql/graphql'
import { Me } from '../routers/LoggedInRouter'
import { notify } from '../toast'

const GetOrderRoute_Query = graphql(`
  query GetOrder_Query($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...ClientCard_OrderFragment
        ...OwnerCard_OrderFragment
      }
    }
  }
`)

const OrderUpdates_Subscription = graphql(`
  subscription OrderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...ClientCard_OrderFragment
      ...OwnerCard_OrderFragment
    }
  }
`)

type Params = {
  id: string
}

export const OrderPage = () => {
  const params = useParams<Params>()
  const orderId = Number(params.id)

  const { data: userData } = useQuery(Me)

  const { data, subscribeToMore } = useQuery(GetOrderRoute_Query, {
    variables: { input: { id: orderId } },
    onError: (error) => notify.error(error.message),
    onCompleted: ({ getOrder: { error } }) => {
      if (error) return notify.error(error)
    },
  })

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: OrderUpdates_Subscription,
        variables: { input: { id: orderId } },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const newOrder = subscriptionData.data.orderUpdates
          return {
            getOrder: { ...prev.getOrder, order: newOrder },
          }
        },
      })
    }
  }, [data, orderId, subscribeToMore])

  const order = data?.getOrder.order
  if (!order) return null

  return (
    <>
      <Helmet>
        <title>{`Order ${orderId}`} | Uber Eats</title>
      </Helmet>
      {userData?.me.role === UserRole.Client && (
        <OrderClientCard order={order} />
      )}
      {userData?.me.role === UserRole.Owner && <OrderOwnerCard order={order} />}
      {userData?.me.role === UserRole.Delivery && (
        <OrderOwnerCard order={order} />
      )}
    </>
  )
}
