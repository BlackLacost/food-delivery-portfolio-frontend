import React from 'react'
import { FragmentType, graphql, useFragment } from '../gql'

export const Card_DishFragment = graphql(`
  fragment Card_DishFragment on Dish {
    name
    description
    price
    options {
      name
      extra
      choices {
        name
        extra
      }
    }
  }
`)

type Props = {
  dish: FragmentType<typeof Card_DishFragment>
  isCustomer?: boolean
}

export const DishCard: React.FC<Props> = ({ dish, isCustomer = false }) => {
  const { name, description, price, options } = useFragment(
    Card_DishFragment,
    dish
  )
  return (
    <article className="border py-4 px-8 transition-all hover:border-gray-800">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="mb-5">{description}</p>
      <p>{price} руб.</p>

      {isCustomer && options?.length !== 0 && (
        <div className="my-4">
          <h3 className="my-1 font-semibold">Dish options:</h3>
          {options?.map((option, index) => (
            <div className="flex items-center space-x-3" key={index}>
              <p>{option.name}</p>
              <p className="text-sm text-gray-800">{option.extra} руб.</p>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
