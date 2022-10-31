import { useMutation } from '@apollo/client'
import { FragmentType, graphql, useFragment } from '../../gql'
import { OrderStatus } from '../../gql/graphql'
import { notify } from '../../toast'
import { Button } from '../Button'
import { H1 } from '../H1'
import { OrderStatusView } from './OrderStatus'

const OwnerCard_OrderFragment = graphql(`
  fragment OwnerCard_OrderFragment on Order {
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
    }
  }
`)

const EditOrder_Mutation = graphql(`
  mutation EditOrder_Mutation($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`)

type Props = {
  order: FragmentType<typeof OwnerCard_OrderFragment>
}

export const OrderOwnerCard = (props: Props) => {
  const order = useFragment(OwnerCard_OrderFragment, props.order)
  const [editOrder] = useMutation(EditOrder_Mutation, {
    onError: (error) => notify.error(error.message),
    onCompleted: ({ editOrder: { error } }) => {
      if (error) return notify.error(error)
    },
  })

  const onClick = (status: OrderStatus) => {
    editOrder({ variables: { input: { id: order.id, status } } })
  }

  return (
    <article className="mx-5 my-10 max-w-screen-sm border border-gray-800 sm:mx-auto">
      <H1 className="bg-gray-800 py-4 text-center text-white">
        Order #{order.id}
      </H1>
      <div className="px-5">
        <p className="py-10 text-center text-3xl">{order.total} руб.</p>
        <table className="w-full border-collapse">
          <tbody>
            {[
              `Deliver To: ${order.customer?.email}`,
              `Driver: ${order.driver?.email ?? 'Not yet.'}`,
            ].map((line, index) => (
              <tr key={index}>
                <td className="border-y border-gray-800 py-4 text-xl">
                  {line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {order.status === OrderStatus.Pending && (
          <Button
            className="my-4 w-full py-4"
            onClick={() => onClick(OrderStatus.Cooking)}
          >
            Accept Order
          </Button>
        )}
        {order.status === OrderStatus.Cooking && (
          <Button
            className="my-4 w-full py-4"
            onClick={() => onClick(OrderStatus.Cooked)}
          >
            Order Cooked
          </Button>
        )}
        {order.status === OrderStatus.Cooked && (
          <OrderStatusView status={order.status} />
        )}
      </div>
    </article>
  )
}
