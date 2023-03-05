import { FragmentType, graphql, useFragment } from '../../../gql'
import { DishCardTitleFragmentDoc } from '../../../gql/graphql'

graphql(`
  fragment DishCardTitle on Dish {
    name
    description
  }
`)

type Props = {
  dish: FragmentType<typeof DishCardTitleFragmentDoc>
}

export const DishCardTitle = ({ dish }: Props) => {
  const { name } = useFragment(DishCardTitleFragmentDoc, dish)
  return (
    <h2 className="w-full text-center text-lg font-semibold text-gray-500">
      {name}
    </h2>
  )
}
