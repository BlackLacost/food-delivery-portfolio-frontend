import { H1 } from '../../components/H1'
import { Rub } from '../../components/Rub'
import { FragmentType, graphql, useFragment } from '../../gql'
import { OrderStatusView } from './OrderStatus'

const ClientCard_OrderFragment = graphql(`
  fragment ClientCard_OrderFragment on Order {
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
    items {
      dish {
        name
        options {
          name
        }
      }
    }
  }
`)

type Props = {
  order: FragmentType<typeof ClientCard_OrderFragment>
}

export const OrderClientCard = (props: Props) => {
  const order = useFragment(ClientCard_OrderFragment, props.order)
  return (
    <article className="border border-gray-800">
      <H1 className="bg-gray-800 py-2 text-center text-white">
        Order #{order.id}
      </H1>
      <div className="px-5">
        <p className="py-3 text-center text-3xl">
          {order.total} <Rub />
        </p>
        <table className="w-full border-collapse">
          <tbody>
            {[
              ...order.items.map(
                (item) =>
                  `Товар: ${item.dish.name} ${
                    item.dish.options && item.dish.options.length > 0
                      ? `с ${item.dish.options.map((o) => o.name).join(', ')}`
                      : ''
                  }`
              ),
              `Prepared By: ${order.restaurant?.name}`,
              `Deliver To: ${order.customer?.email}`,
              `Driver: ${order.driver?.email ?? 'Not yet.'}`,
            ].map((line, index) => (
              <tr key={index}>
                <td className="border-y border-gray-800 py-2">{line}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <OrderStatusView status={order.status} />
      </div>
    </article>
  )
}
