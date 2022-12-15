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
  const { name, description } = useFragment(CardTitle_DishFragment, dish)
  return (
    <div>
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="mb-5">{description}</p>
    </div>
  )
}
