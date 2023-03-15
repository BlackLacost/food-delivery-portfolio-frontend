import { useMutation } from '@apollo/client'
import { H1 } from '../../components/H1'
import { Rub } from '../../components/Rub'
import { FragmentType, graphql, useFragment } from '../../gql'
import { OrderStatus, RestaurantOrderStatus } from '../../gql/graphql'
import { notify } from '../../toast'
import { OrderButton } from './OrderButton'
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
    items {
      options {
        name
      }
      dish {
        name
      }
    }
  }
`)

const SetRestaurantOrderStatus_Mutation = graphql(`
  mutation SetRestaurantOrderStatus_Mutation(
    $input: SetRestaurantOrderStatusInput!
  ) {
    setRestaurantOrderStatus(input: $input) {
      error {
        ... on Error {
          message
        }
      }
    }
  }
`)

type Props = {
  order: FragmentType<typeof OwnerCard_OrderFragment>
}

export const OrderOwnerCard = (props: Props) => {
  const order = useFragment(OwnerCard_OrderFragment, props.order)
  const [setRestaurantOrderStatus] = useMutation(
    SetRestaurantOrderStatus_Mutation,
    {
      onError: (error) => notify.error(error.message),
      onCompleted: ({ setRestaurantOrderStatus: { error } }) => {
        if (error) return notify.error(error.message)
      },
    }
  )

  const onClick = (status: RestaurantOrderStatus) => {
    setRestaurantOrderStatus({ variables: { input: { id: order.id, status } } })
  }

  return (
    <article className="my-10 mx-auto flex max-w-screen-sm flex-col border border-gray-800">
      <H1 className="bg-gray-800 py-4 text-center text-white">
        Заказ № {order.id}
      </H1>
      <div className="flex flex-grow flex-col px-5">
        <p className="py-10 text-center text-3xl">
          {order.total} <Rub />
        </p>
        <table className="mb-auto w-full border-collapse">
          <tbody>
            {[
              ...order.items.map((item) => {
                return `Блюдо: ${item.dish.name} ${
                  item.options && item.options.length > 0
                    ? `с ${item.options.map((o) => o.name).join(', ')}`
                    : ''
                }`
              }),
              `Почта клиента: ${order.customer?.email}`,
              `Почта водителя: ${
                order.driver?.email ?? 'Водитель еще не принял заказ.'
              }`,
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
          <OrderButton onClick={() => onClick(RestaurantOrderStatus.Cooking)}>
            Принять заказ
          </OrderButton>
        )}
        {order.status === OrderStatus.Cooking && (
          <OrderButton onClick={() => onClick(RestaurantOrderStatus.Cooked)}>
            Заказ приготовлен
          </OrderButton>
        )}
        {(order.status === OrderStatus.Cooked ||
          order.status === OrderStatus.Accepted) && (
          <OrderStatusView status={order.status} />
        )}
      </div>
    </article>
  )
}
