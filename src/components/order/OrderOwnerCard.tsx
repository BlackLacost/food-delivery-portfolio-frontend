import { FragmentType, graphql, useFragment } from '../../gql'
import { OrderStatus } from '../../gql/graphql'
import { Button } from '../Button'
import { H1 } from '../H1'

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
  }
`)

type Props = {
  order: FragmentType<typeof OwnerCard_OrderFragment>
}

export const OrderOwnerCard = (props: Props) => {
  const order = useFragment(OwnerCard_OrderFragment, props.order)
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
          <Button className="my-4 w-full py-4">Accept Order</Button>
        )}
        {order.status === OrderStatus.Cooking && (
          <Button className="my-4 w-full py-4">Order Cooked</Button>
        )}
      </div>
    </article>
  )
}
