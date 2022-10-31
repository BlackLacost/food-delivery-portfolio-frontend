import { OrderStatus } from '../../gql/graphql'

type Props = {
  status: OrderStatus
}

export const OrderStatusView = ({ status }: Props) => {
  return (
    <p className="py-10 text-center text-3xl  text-lime-600">
      Status: {status}
    </p>
  )
}
