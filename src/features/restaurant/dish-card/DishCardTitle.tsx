import { FragmentType, graphql, useFragment } from '../../../gql'

export const CardTitle_DishFragment = graphql(`
  fragment CardTitle_DishFragment on Dish {
    name
    description
  }
`)

type Props = {
  dish: FragmentType<typeof CardTitle_DishFragment>
}

export const DishCardTitle = ({ dish }: Props) => {
  const { name } = useFragment(CardTitle_DishFragment, dish)
  return (
    <h2 className="w-full text-center text-lg font-semibold text-gray-500">
      {name}
    </h2>
  )
}
