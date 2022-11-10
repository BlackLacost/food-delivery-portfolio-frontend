import { FragmentType, graphql, useFragment } from '../../gql'
import { H1 } from '../H1'
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
        <p className="py-3 text-center text-3xl">{order.total} руб.</p>
        <table className="w-full border-collapse">
          <tbody>
            {[
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
