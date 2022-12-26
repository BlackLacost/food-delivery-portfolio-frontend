import React from 'react'
import { FragmentType, graphql, useFragment } from '../../../gql'
import { DishCardContainer } from './DishCardContainer'
import { DishCardPrice } from './DishCardPrice'
import { DishCardTitle } from './DishCardTitle'

export const CardOwner_DishFragment = graphql(`
  fragment CardOwner_DishFragment on Dish {
    ...CardTitle_DishFragment
    name
    price
    photo
  }
`)

type Props = {
  dish: FragmentType<typeof CardOwner_DishFragment>
}

export const DishCardOwner: React.FC<Props> = (props) => {
  const dish = useFragment(CardOwner_DishFragment, props.dish)

  return (
    <DishCardContainer>
      <DishCardTitle dish={dish} />
      <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
        <img className="object-cover" src={dish.photo} alt={dish?.name} />
      </div>
      <DishCardPrice>{dish.price}</DishCardPrice>
    </DishCardContainer>
  )
}
