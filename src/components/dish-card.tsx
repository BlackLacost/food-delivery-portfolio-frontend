import React from 'react'
import { FragmentType, graphql, useFragment } from '../gql'

export const Card_DishFragment = graphql(`
  fragment Card_DishFragment on Dish {
    name
    description
    price
  }
`)

type Props = {
  dish: FragmentType<typeof Card_DishFragment>
}

export const DishCard: React.FC<Props> = ({ dish }) => {
  const { name, description, price } = useFragment(Card_DishFragment, dish)
  return (
    <article className="border py-4 px-8 transition-all hover:border-gray-800">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="mb-5">{description}</p>
      <p>{price} руб.</p>
    </article>
  )
}
