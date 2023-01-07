import { FC } from 'react'
import { FragmentType, graphql, useFragment } from '../../../gql'

export const CardImage_DishFragment = graphql(`
  fragment CardImage_DishFragment on Dish {
    name
    photo
  }
`)

type Props = {
  dish: FragmentType<typeof CardImage_DishFragment>
}

export const DishCardImage: FC<Props> = (props) => {
  const dish = useFragment(CardImage_DishFragment, props.dish)

  return (
    <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
      <img className="object-cover" src={dish.photo} alt={dish?.name} />
    </div>
  )
}
