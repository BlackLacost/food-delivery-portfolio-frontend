import React from 'react'
import { Rub } from '../../../components/Rub'
import { FragmentType, graphql, useFragment } from '../../../gql'
import { DishCardContainer } from './DishCardContainer'
import { DishCardTitle } from './DishCardTitle'

export const CardOwner_DishFragment = graphql(`
  fragment CardOwner_DishFragment on Dish {
    ...CardTitle_DishFragment
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
      <p>
        {dish.price} <Rub />
      </p>
    </DishCardContainer>
  )
}
