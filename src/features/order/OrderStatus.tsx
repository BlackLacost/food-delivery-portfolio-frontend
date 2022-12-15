import { OrderStatus } from '../../gql/graphql'

type Props = {
  status: OrderStatus
}

export const OrderStatusView = ({ status }: Props) => {
  return (
    <p className="py-3 text-center text-xl text-primary-600">
      Status: {status}
    </p>
  )
}
