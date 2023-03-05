import React from 'react'
import { FragmentType, graphql, useFragment } from '../../../gql'
import { DishCardOwnerFragmentDoc } from '../../../gql/graphql'
import { DishCardContainer } from './DishCardContainer'
import { DishCardImage } from './DishCardImage'
import { DishCardPrice } from './DishCardPrice'
import { DishCardTitle } from './DishCardTitle'

graphql(`
  fragment DishCardOwner on Dish {
    ...DishCardTitle
    ...DishCardImage
    price
  }
`)

type Props = {
  dish: FragmentType<typeof DishCardOwnerFragmentDoc>
}

export const DishCardOwner: React.FC<Props> = (props) => {
  const dish = useFragment(DishCardOwnerFragmentDoc, props.dish)

  return (
    <DishCardContainer>
      <DishCardTitle dish={dish} />
      <DishCardImage dish={dish} />
      <DishCardPrice>{dish.price}</DishCardPrice>
    </DishCardContainer>
  )
}
