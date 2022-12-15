import { OrderStatus } from '../../gql/graphql'

type Props = {
  status: OrderStatus
}

export const OrderStatusView = ({ status }: Props) => {
  return (
    <p className="py-3 text-center text-xl text-lime-600">Status: {status}</p>
  )
}
