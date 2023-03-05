import { FC } from 'react'
import { FragmentType, graphql, useFragment } from '../../../gql'
import { DishCardImageFragmentDoc } from '../../../gql/graphql'

graphql(`
  fragment DishCardImage on Dish {
    name
    photo
  }
`)

type Props = {
  dish: FragmentType<typeof DishCardImageFragmentDoc>
}

export const DishCardImage: FC<Props> = (props) => {
  const dish = useFragment(DishCardImageFragmentDoc, props.dish)

  return (
    <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
      <img className="object-cover" src={dish.photo} alt={dish?.name} />
    </div>
  )
}
