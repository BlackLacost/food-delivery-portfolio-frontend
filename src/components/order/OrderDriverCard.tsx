import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { FragmentType, graphql, useFragment } from '../../gql'
import { OrderStatus } from '../../gql/graphql'
import { notify } from '../../toast'
import { Button } from '../Button'

const DriverCard_OrderFragment = graphql(`
  fragment DriverCard_OrderFragment on Order {
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
      id
      address
    }
  }
`)

const EditOrder_Mutation = graphql(`
  mutation EditOrder_Mutation($input: EditOrderInput!) {
    editOrder(input: $input) {
      error {
        ... on Error {
          message
        }
      }
    }
  }
`)

type Props = {
  order: FragmentType<typeof DriverCard_OrderFragment>
}

export const OrderDriverCard = (props: Props) => {
  const navigate = useNavigate()
  const order = useFragment(DriverCard_OrderFragment, props.order)
  const [editOrder] = useMutation(EditOrder_Mutation, {
    onError: (error) => notify.error(error.message),
    onCompleted: ({ editOrder: { error } }) => {
      if (error) return notify.error(error.message)

      navigate('/')
    },
  })

  const onClick = (status: OrderStatus) => {
    editOrder({ variables: { input: { id: order.id, status } } })
  }

  return (
    <article className="mx-5 max-w-screen-sm border border-gray-800 bg-white sm:mx-auto">
      <h1 className="bg-gray-800 py-2 text-center text-white">
        Order #{order.id}
      </h1>
      <div className="px-3">
        <p className="py-2 text-center text-xl">{order.total} руб.</p>
        <table className="w-full border-collapse">
          <tbody>
            {[
              `From: ${order.restaurant?.address}`,
              `To: ${order.customer?.email}`,
              `Driver: ${order.driver?.email ?? 'Not yet.'}`,
            ].map((line, index) => (
              <tr key={index}>
                <td className="border-y border-gray-800 py-2 text-sm">
                  {line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {order.status === OrderStatus.Accepted && (
          <Button
            className="my-2 w-full py-1 text-base"
            onClick={() => onClick(OrderStatus.Delivered)}
          >
            Delivered
          </Button>
        )}
      </div>
    </article>
  )
}
