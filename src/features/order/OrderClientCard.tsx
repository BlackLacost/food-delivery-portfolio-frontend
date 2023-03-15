import { H1 } from '../../components/H1'
import { Rub } from '../../components/Rub'
import { FragmentType, graphql, useFragment } from '../../gql'
import { ClientOrderCardFragmentDoc } from '../../gql/graphql'
import { OrderStatusView } from './OrderStatus'

graphql(`
  fragment ClientOrderCard on Order {
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
  order: FragmentType<typeof ClientOrderCardFragmentDoc>
}

export const OrderClientCard = (props: Props) => {
  const order = useFragment(ClientOrderCardFragmentDoc, props.order)
  return (
    <article className="flex flex-col border border-gray-800">
      <H1 className="bg-gray-800 py-2 text-center text-white">
        Заказ № {order.id}
      </H1>
      <div className="flex flex-grow flex-col px-5">
        <p className="py-3 text-center text-3xl">
          {order.total} <Rub />
        </p>
        <table className="mb-auto w-full border-collapse">
          <tbody>
            {[
              ...order.items.map(
                (item) =>
                  `Блюдо: ${item.dish.name} ${
                    item.dish.options && item.dish.options.length > 0
                      ? `с ${item.dish.options.map((o) => o.name).join(', ')}`
                      : ''
                  }`
              ),
              `Магазин: ${order.restaurant?.name}`,
              `Водитель: ${order.driver?.email ?? 'еще нет'}`,
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
