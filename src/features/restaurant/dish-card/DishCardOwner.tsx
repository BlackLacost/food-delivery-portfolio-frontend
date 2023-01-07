import React from 'react'
import { FragmentType, graphql, useFragment } from '../../../gql'
import { DishCardContainer } from './DishCardContainer'
import { DishCardImage } from './DishCardImage'
import { DishCardPrice } from './DishCardPrice'
import { DishCardTitle } from './DishCardTitle'

export const CardOwner_DishFragment = graphql(`
  fragment CardOwner_DishFragment on Dish {
    ...CardTitle_DishFragment
    ...CardImage_DishFragment
    price
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
      <DishCardImage dish={dish} />
      <DishCardPrice>{dish.price}</DishCardPrice>
    </DishCardContainer>
  )
}
