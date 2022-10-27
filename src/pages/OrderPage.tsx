import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { graphql } from '../gql'

const GetOrderRoute_Query = graphql(`
  query GetOrder_Query($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        id
        total
        status
        driver {
          email
        }
        customer {
          email
        }
        restaurant {
          name
        }
      }
    }
  }
`)

type Params = {
  id: string
}

export const OrderPage = () => {
  const params = useParams<Params>()
  const orderId = Number(params.id)
  const { data } = useQuery(GetOrderRoute_Query, {
    variables: { input: { id: orderId } },
  })

  return (
    <div>
      <h1>OrderPage</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
