import React from 'react'
import { FragmentType, graphql, useFragment } from '../../../gql'
import { DishCardOwner } from './DishCardOwner'

export const DishCards_QueryFragment = graphql(`
  fragment DishCards_QueryFragment on Query {
    myRestaurant(input: $input) {
      restaurant {
        menu {
          id
          ...CardOwner_DishFragment
        }
      }
      error {
        ... on Error {
          message
        }
      }
    }
  }
`)

type Props = {
  query: FragmentType<typeof DishCards_QueryFragment>
}

export const DishCards: React.FC<Props> = ({ query }) => {
  const menu = useFragment(DishCards_QueryFragment, query).myRestaurant
    .restaurant?.menu

  if (menu?.length === 0) {
    return (
      <section>
        <p className="mb-5 text-xl">No dishes here. Please add a dish!</p>
      </section>
    )
  }

  return (
    <section className="grid grid-cols-2 gap-4">
      {menu?.map((dish) => (
        <DishCardOwner key={dish.id} dish={dish} />
      ))}
    </section>
  )
}
