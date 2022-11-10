import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { FragmentType, graphql, useFragment } from '../../gql'
import { DriverOrderStatus, OrderStatus } from '../../gql/graphql'
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

const SetDriverOrderStatus_Mutation = graphql(`
  mutation SetDriverOrderStatus_Mutation($input: SetDriverOrderStatusInput!) {
    setDriverOrderStatus(input: $input) {
      order {
        status
      }
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
  const [setDriverOrderStatus] = useMutation(SetDriverOrderStatus_Mutation, {
    onError: (error) => notify.error(error.message),
    onCompleted: ({ setDriverOrderStatus: { order, error } }) => {
      if (error) return notify.error(error.message)
      if (order?.status === OrderStatus.Delivered) {
        navigate('/')
      }
    },
    refetchQueries: 'active',
  })

  const onClick = (status: DriverOrderStatus) => {
    setDriverOrderStatus({ variables: { input: { id: order.id, status } } })
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
            onClick={() => onClick(DriverOrderStatus.PickedUp)}
          >
            Забрал
          </Button>
        )}
        {order.status === OrderStatus.PickedUp && (
          <Button
            className="my-2 w-full py-1 text-base"
            onClick={() => onClick(DriverOrderStatus.Delivered)}
          >
            Доствален
          </Button>
        )}
      </div>
    </article>
  )
}
